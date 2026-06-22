// AI 分析 API 服务
// 对接 mimo-v2.5-pro 云端视觉模型（OpenAI 兼容接口）

import type { AnalysisRawResponse, AnalysisResult, ClutterLabel } from '../types/analysis';
import { CLUTTER_WEIGHTS } from '../types/analysis';
import { matchSuggestions } from './suggestions';

const API_ENDPOINT = process.env.EXPO_PUBLIC_AI_API_URL ?? '';
const API_KEY = process.env.EXPO_PUBLIC_AI_API_KEY ?? '';

// 启动时打一次配置状态日志，方便排查 .env 是否被 Expo SDK 56 正确注入。
// EXPO_PUBLIC_* 变量在打包/启动 Metro 时被内联到 JS bundle 中——
// 修改 .env 后需要重启 dev server（带 --clear），否则旧值会留在缓存里。
if (!API_ENDPOINT || !API_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    '[AI] 配置缺失: EXPO_PUBLIC_AI_API_URL / EXPO_PUBLIC_AI_API_KEY 未注入。',
    '请确认项目根目录有 .env 文件，并使用 `npx expo start --clear` 重启。'
  );
} else {
  // eslint-disable-next-line no-console
  console.log('[AI] 配置已加载, endpoint=', API_ENDPOINT, 'key prefix=', API_KEY.slice(0, 6));
}

/** 视觉分析提示词：要求模型严格返回 JSON */
const BUILD_ANALYSIS_PROMPT = `你是一个专业的室内整洁度分析师。请仔细观察这张室内照片，识别画面中所有可见的杂物，并以严格 JSON 格式返回分析结果。

返回的 JSON 必须包含以下字段（不要包含任何额外的解释文本，不要使用 markdown 代码块）：

{
  "scene": "场景类型，必须是以下之一: bedroom | living_room | bathroom | desk_area | floor | unknown（如果照片不是室内房间场景，如风景、植物、人物等，必须填 unknown）",
  "clutter_items": [
    {
      "label": "杂物类别，必须是以下之一: clothing | cardboard_box | cable | book | bottle | food_container | shoe | pillow_blanket | trash | other_clutter",
      "display_name": "中文显示名，例如：衣物、纸箱、电线、书籍、瓶罐、外卖盒、鞋子、被褥、垃圾、其他杂物",
      "count": "该类别的物品数量（整数）",
      "bbox": [x, y, w, h],
      "area_ratio": "该类别杂物在整张图中占据的面积比例（0-1 浮点数）",
      "confidence": "识别置信度（0-1 浮点数）"
    }
  ],
  "lighting": "光线条件，必须是以下之一: bright | normal | dim",
  "overall_notes": "用一两句中文描述整体观感，指出主要杂物分布位置和整洁度问题"
}

bbox 说明：[x, y, w, h] 为该类别杂物的整体外接矩形，所有值均归一化到 0-1（x、y 为左上角坐标，w、h 为宽高）。bbox 必须精确覆盖该物品本体，不要把周围的桌面/墙面/地面区域也圈进去。

扫描方法（必须严格执行）：
按以下顺序逐一检查每个区域，不要遗漏：
1. 地面 — 散落的衣物、垃圾、快递盒、鞋子、杂物
2. 桌面/台面 — 堆积的物品、外卖盒、空瓶、散乱杂物
3. 椅子/沙发 — 堆放的衣物、包包、杂物
4. 床铺 — 散乱的衣物、杂物（被子枕头不算）
5. 角落/边缘 — 堆积的杂物、垃圾袋、纸箱
6. 其他可见表面 — 窗台、柜子顶部等

要求：
1. 只识别真实可见的杂物，不要凭空捏造。
2. **宁可多报也不要漏报。** 如果你 50% 以上把握认为某物是杂物，就应该报告。用户需要你帮他发现他忽略的问题。只有完全无法辨认的模糊色块才应该跳过。
3. 不要把家具(床、桌、椅、柜)、书架、墙上的画/海报、装饰品当成杂物。
4. **bbox 必须严格贴合物品的真实轮廓**，不能用整个房间或大片背景充数；如果一个类别的物品分散在多处，给出包含主要物品的最小外接矩形即可。
5. **场景判断**：如果画面里出现笔记本电脑/台式机/显示器/键盘/办公椅+桌面，scene 必须填 desk_area。在 desk_area 场景下，只识别桌面上真正堆积的物理杂物（散乱衣物、垃圾、外卖盒、纠缠的电线、空瓶子等），**不要把屏幕里显示的内容、桌面上正常使用中的电脑/键盘/鼠标/显示器当成杂物**。
6. 如果画面非常整洁，clutter_items 可以为空数组——这是合法且常见的结果。
7. confidence 要诚实反映识别把握。清晰可见的物品给 0.7-0.95，有遮挡或不太确定的给 0.4-0.7，完全模糊的给 < 0.4。不要全部填 0.95。
8. area_ratio 要符合视觉感受，不要超过 1。
9. 严格按 JSON 输出，不要任何前后缀。
10. 如果 scene 是 unknown，overall_notes 必须说明为什么这不是室内房间照片。`;

/** 生成唯一 ID */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** 计算整洁度评分 */
function calculateScore(
  items: { label: ClutterLabel; area_ratio: number }[],
  lighting: string
): number {
  const clutterScore = items.reduce((sum, item) => {
    const weight = CLUTTER_WEIGHTS[item.label] ?? 1.0;
    return sum + item.area_ratio * weight * 100;
  }, 0);

  const lightingPenalty = lighting === 'dim' ? 5 : 0;
  const score = Math.max(5, Math.min(100, 100 - clutterScore - lightingPenalty));
  return Math.round(score);
}

/** 调用云端视觉模型分析图片 */
export async function analyzeImage(
  imageBase64: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userCorrection?: string, // 用户手动选择的场景 ID（纠错模式下传入，预留）
  selectedScene?: string, // 「精准扫描」入口用户预先指定的场景 ID（bedroom / living_room / desk_area / bathroom）
): Promise<AnalysisResult> {
  if (!API_ENDPOINT || !API_KEY) {
    throw new Error('AI API 未配置：请检查 EXPO_PUBLIC_AI_API_URL 和 EXPO_PUBLIC_AI_API_KEY');
  }

  // 「精准扫描」模式下，在通用提示词前面加一句场景指引，提升识别精准度。
  const promptText = selectedScene
    ? `用户认为这是【${selectedScene}】场景，请重点关注该场景相关的杂物类型。\n\n${BUILD_ANALYSIS_PROMPT}`
    : BUILD_ANALYSIS_PROMPT;

  console.log('[AI] Endpoint:', API_ENDPOINT);
  console.log('[AI] Key prefix:', API_KEY.slice(0, 8) + '...');
  console.log('[AI] base64 length:', imageBase64.length, '(~', Math.round(imageBase64.length * 0.75 / 1024), 'KB)');
  if (selectedScene) {
    console.log('[AI] selectedScene:', selectedScene);
  }

  let response: Response;
  try {
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        // 必须用 mimo-v2-omni（多模态/视觉模型）。
        // mimo-v2.5 / mimo-v2.5-pro 是纯文本模型，传图片会返回
        // 404 "No endpoints found that support image input"。
        model: 'mimo-v2.5',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
              {
                type: 'text',
                text: promptText,
              },
            ],
          },
        ],
      }),
    });
  } catch (fetchErr: any) {
    // 网络层错误：超时、DNS 失败、SSL 等
    console.error('[AI] fetch threw:', fetchErr);
    throw new Error(`网络请求失败: ${fetchErr?.message ?? String(fetchErr)}`);
  }

  console.log('[AI] response status:', response.status, response.statusText);

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    console.error('[AI] non-OK response body:', errText.slice(0, 500));
    throw new Error(`AI API error: ${response.status} ${errText.slice(0, 200)}`);
  }

  let data: any;
  try {
    data = await response.json();
  } catch (jsonErr: any) {
    console.error('[AI] response.json() failed:', jsonErr);
    throw new Error(`API 响应不是有效 JSON: ${jsonErr?.message ?? String(jsonErr)}`);
  }
  console.log('[AI] response keys:', Object.keys(data ?? {}));
  // mimo-v2-omni 是推理模型：正常情况下 message.content 包含 JSON 答案，
  // reasoning_content 包含思考链。但极少数情况下模型可能把答案错放在
  // reasoning_content 里 —— 因此 content 为空时降级使用 reasoning_content。
  const message = data?.choices?.[0]?.message ?? {};
  const rawContent: string = (message.content ?? '').trim();
  const reasoningContent: string = (message.reasoning_content ?? '').trim();
  let content = rawContent;
  if (!content && reasoningContent) {
    console.warn('[AI] content 为空，降级使用 reasoning_content');
    content = reasoningContent;
  }
  if (!content) {
    console.error('[AI] message keys:', Object.keys(message));
    throw new Error('AI API 返回内容为空（content 与 reasoning_content 均无内容）');
  }

  // reasoning_content 里有时会夹带思考过程文字，需要从中抽取出第一个 JSON 对象。
  if (content !== rawContent || !content.startsWith('{')) {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) content = match[0];
  }

  // Strip markdown code blocks if present (mimo sometimes wraps JSON in ```json ... ```)
  let cleanContent = content.trim();
  if (cleanContent.startsWith('```')) {
    cleanContent = cleanContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  let raw: AnalysisRawResponse;
  try {
    console.log('[AI] Raw API content:', cleanContent.slice(0, 500));
    raw = JSON.parse(cleanContent);
    console.log('[AI] Parsed:', JSON.stringify(raw).slice(0, 300));
  } catch (e) {
    throw new Error(`AI API 返回非法 JSON: ${content.slice(0, 200)}`);
  }

  // 场景校验：如果不是室内房间，提示用户重新拍照
  const VALID_SCENES = ['bedroom', 'living_room', 'bathroom', 'desk_area', 'floor'];
  if (!VALID_SCENES.includes(raw.scene)) {
    throw new Error('NOT_ROOM');
  }

  // 后处理：过滤掉极低置信度（< 0.4）的识别项，保留中等置信度的让用户看到
  const filteredItems = (raw.clutter_items ?? []).filter((item) => item.confidence >= 0.4);
  const score = calculateScore(filteredItems, raw.lighting);
  const maxConfidence = filteredItems.length > 0
    ? Math.max(...filteredItems.map((i) => i.confidence))
    : 0;
  const suggestions = matchSuggestions(filteredItems, raw.scene, raw.lighting);

  return {
    id: generateId(),
    score,
    scene: raw.scene as AnalysisResult['scene'],
    lighting: raw.lighting,
    clutterItems: filteredItems,
    overallNotes: raw.overall_notes,
    suggestions,
    maxConfidence,
    needsCorrection: maxConfidence < 0.7,
    createdAt: new Date().toISOString(),
    photoUri: '',
    thumbnailUri: undefined,
  };
}
