/**
 * 埋点服务（Analytics）
 *
 * 当前阶段：MVP 收尾期，先用 console.log 打本地日志，不依赖任何外部服务。
 * 后续切换 PostHog / Sentry / Firebase 只需改这个文件的实现，调用点不动。
 *
 * 事件来源：PRD/RRD.md §8.1 核心埋点
 * 落地状态：MVP_ACCEPTANCE.md §4（5/6 事件已埋，suggestion_executed 缺 UI 入口）
 *
 * 设计原则：
 * - 纯函数接口，调用方不感知实现
 * - 失败/异常不影响主流程（catch 后只 console.error）
 * - 单测可 mock console.log 验证调用
 */

import type { ClutterLabel, Lighting, SceneLabel } from '../types/analysis';

export type AnalyticsEventName =
  | 'photo_taken'
  | 'analysis_complete'
  | 'suggestion_viewed'
  | 'suggestion_executed'
  | 'error_reported'
  | 'retake_photo';

export type AnalyticsPayload = Record<string, unknown>;

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  ts: string; // ISO timestamp
  payload?: AnalyticsPayload;
}

/**
 * 发送埋点（MVP 阶段 = console.log）
 * 异步导出，避免主流程被埋点阻塞。
 */
export async function track(
  name: AnalyticsEventName,
  payload?: AnalyticsPayload,
): Promise<void> {
  const event: AnalyticsEvent = {
    name,
    ts: new Date().toISOString(),
    payload,
  };
  try {
    // MVP: 仅本地日志。后续替换为 fetch('/api/track', ...) 等。
    console.log('[analytics]', JSON.stringify(event));
  } catch (e) {
    // 埋点失败必须不影响业务
    console.error('[analytics] track failed:', e);
  }
}

// ────────────────────────── 便捷封装 ──────────────────────────
// 减少调用方拼 payload 的心智负担，同时保证字段名稳定。

export const analytics = {
  /** 用户拍照/上传图片 */
  photoTaken: (source: 'camera' | 'gallery', extra?: AnalyticsPayload) =>
    track('photo_taken', { source, ...extra }),

  /** 分析返回结果 */
  analysisComplete: (params: {
    score: number;
    scene: SceneLabel | 'unknown';
    clutterLabels: ClutterLabel[];
    maxConfidence: number;
    latencyMs: number;
  }) =>
    track('analysis_complete', {
      score: params.score,
      scene: params.scene,
      clutter_labels: params.clutterLabels,
      max_confidence: params.maxConfidence,
      latency_ms: params.latencyMs,
    }),

  /** 用户查看建议（进入详情页）。type 对齐 services/suggestions.ts 实际值 `must_do`/`optional` */
  suggestionViewed: (scenarioId: string, type: 'must_do' | 'optional') =>
    track('suggestion_viewed', { scenario_id: scenarioId, suggestion_type: type }),

  /** 用户标记"已完成"（当前 UI 无此按钮，见 MVP_ACCEPTANCE.md §4.1.4） */
  suggestionExecuted: (scenarioId: string, durationMs?: number) =>
    track('suggestion_executed', {
      scenario_id: scenarioId,
      duration_ms: durationMs,
    }),

  /** 用户点击"不准"（纠错流程入口） */
  errorReported: (params: {
    originalScene: SceneLabel | 'unknown';
    selectedScene?: SceneLabel; // 用户选择的正确场景（提交后才有）
  }) =>
    track('error_reported', {
      original_scene: params.originalScene,
      selected_scene: params.selectedScene,
    }),

  /** 用户二次拍照（建议执行后） */
  retakePhoto: (params: { prevScore?: number; newScore?: number }) =>
    track('retake_photo', {
      prev_score: params.prevScore,
      new_score: params.newScore,
    }),
};

export default analytics;
