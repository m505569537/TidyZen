// AI 分析 API 服务
// 对接 mimo-v2.5-pro 云端视觉模型（OpenAI 兼容接口）

import type { AnalysisRawResponse, AnalysisResult, ClutterLabel } from '../types/analysis';
import { CLUTTER_WEIGHTS } from '../types/analysis';
import { matchSuggestions } from './suggestions';

const API_ENDPOINT = process.env.EXPO_PUBLIC_AI_API_URL ?? '';
const API_KEY = process.env.EXPO_PUBLIC_AI_API_KEY ?? '';

/** 视觉分析提示词：要求模型严格返回 JSON */
const BUILD_ANALYSIS_PROMPT = `你是一个专业的室内整洁度分析师。请仔细观察这张室内照片，识别画面中所有可见的杂物，并以严格 JSON 格式返回分析结果。

返回的 JSON 必须包含以下字段（不要包含任何额外的解释文本，不要使用 markdown 代码块）：

{
  "scene": "场景类型，必须是以下之一: bedroom | living_room | bathroom | desk_area | floor",
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

bbox 说明：[x, y, w, h] 为该类别杂物的整体外接矩形，所有值均归一化到 0-1（x、y 为左上角坐标，w、h 为宽高）。

要求：
1. 只识别真实可见的杂物，不要凭空捏造。
2. 如果画面非常整洁，clutter_items 可以为空数组。
3. confidence 要诚实反映识别把握，不要全部填 0.95。
4. area_ratio 要符合视觉感受，不要超过 1。
5. 严格按 JSON 输出，不要任何前后缀。`;

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
  _userCorrection?: string // 用户手动选择的场景 ID（纠错模式下传入，预留）
): Promise<AnalysisResult> {
  if (!API_ENDPOINT || !API_KEY) {
    throw new Error('AI API 未配置：请检查 EXPO_PUBLIC_AI_API_URL 和 EXPO_PUBLIC_AI_API_KEY');
  }

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mimo-v2.5-pro',
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
              text: BUILD_ANALYSIS_PROMPT,
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`AI API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const content: string = data?.choices?.[0]?.message?.content ?? '';
  if (!content) {
    throw new Error('AI API 返回内容为空');
  }

  let raw: AnalysisRawResponse;
  try {
    raw = JSON.parse(content);
  } catch (e) {
    throw new Error(`AI API 返回非法 JSON: ${content.slice(0, 200)}`);
  }

  // 后处理
  const filteredItems = (raw.clutter_items ?? []).filter((item) => item.confidence >= 0.6);
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
    needsCorrection: maxConfidence < 0.6,
    createdAt: new Date().toISOString(),
    photoUri: '',
    thumbnailUri: undefined,
  };
}
