// AI 分析 API 服务
// 对接 mimo-v2.5-pro 云端视觉模型

import type { AnalysisRawResponse, AnalysisResult, ClutterLabel } from '../types/analysis';
import { CLUTTER_WEIGHTS } from '../types/analysis';
import { matchSuggestions } from './suggestions';

const API_ENDPOINT = process.env.EXPO_PUBLIC_AI_API_URL ?? '';
const API_KEY = process.env.EXPO_PUBLIC_AI_API_KEY ?? '';

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
  userCorrection?: string // 用户手动选择的场景 ID（纠错模式下传入）
): Promise<AnalysisResult> {
  // TODO: 实际对接 mimo-v2.5-pro API
  // 当前为 mock 实现，后续替换为真实 API 调用

  /*
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
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const raw: AnalysisRawResponse = JSON.parse(data.choices[0].message.content);
  */

  // Mock 数据
  const mockRaw: AnalysisRawResponse = {
    scene: 'bedroom',
    clutter_items: [
      {
        label: 'clothing',
        display_name: '衣物',
        count: 5,
        bbox: [0.1, 0.15, 0.35, 0.4],
        area_ratio: 0.18,
        confidence: 0.92,
      },
      {
        label: 'cardboard_box',
        display_name: '纸箱',
        count: 2,
        bbox: [0.55, 0.6, 0.3, 0.25],
        area_ratio: 0.12,
        confidence: 0.85,
      },
    ],
    lighting: 'normal',
    overall_notes: '房间整体较为整洁，主要问题是椅子和床上有散落衣物，地面有2个快递纸箱。',
  };

  // 后处理
  const filteredItems = mockRaw.clutter_items.filter((item) => item.confidence >= 0.6);
  const score = calculateScore(filteredItems, mockRaw.lighting);
  const maxConfidence = filteredItems.length > 0
    ? Math.max(...filteredItems.map((i) => i.confidence))
    : 0;
  const suggestions = matchSuggestions(filteredItems, mockRaw.scene, mockRaw.lighting);

  return {
    id: generateId(),
    score,
    scene: mockRaw.scene as AnalysisResult['scene'],
    lighting: mockRaw.lighting,
    clutterItems: filteredItems,
    overallNotes: mockRaw.overall_notes,
    suggestions,
    maxConfidence,
    needsCorrection: maxConfidence < 0.6,
    createdAt: new Date().toISOString(),
    photoUri: '',
    thumbnailUri: undefined,
  };
}
