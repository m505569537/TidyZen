import { create } from 'zustand';
import type { AnalysisResult, ClutterItem, Suggestion, ScenarioId } from '../types/analysis';

interface AnalysisState {
  // 流程状态
  step: 'idle' | 'captured' | 'analyzing' | 'result' | 'correcting';

  // 照片
  photoUri: string | null;
  photoBase64: string | null;

  // 分析结果
  result: AnalysisResult | null;

  // 本次分析耗时（毫秒）。在 result.tsx 上展示"耗时约 X 秒/分钟"。
  elapsedMs: number | null;

  // 用户纠错选择的场景
  selectedScenarios: ScenarioId[];

  // 用户在「精准扫描」入口预先选择的场景（拍照前由用户指定）。
  // 传入 AI 提示词，用来让模型重点关注该场景相关的杂物类型。
  // null 表示未指定（兼容普通拍照/相册流程）。
  selectedScene: string | null;

  // 操作
  setPhoto: (uri: string, base64: string) => void;
  setAnalyzing: () => void;
  setResult: (result: AnalysisResult, elapsedMs?: number) => void;
  setCorrecting: () => void;
  setSelectedScenarios: (scenarios: ScenarioId[]) => void;
  setSelectedScene: (scene: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  step: 'idle',
  photoUri: null,
  photoBase64: null,
  result: null,
  elapsedMs: null,
  selectedScenarios: [],
  selectedScene: null,

  setPhoto: (uri, base64) =>
    set({ photoUri: uri, photoBase64: base64, step: 'captured' }),

  setAnalyzing: () => set({ step: 'analyzing' }),

  setResult: (result, elapsedMs) =>
    set({ result, elapsedMs: elapsedMs ?? null, step: 'result' }),

  setCorrecting: () => set({ step: 'correcting', selectedScenarios: [] }),

  setSelectedScenarios: (scenarios) => set({ selectedScenarios: scenarios }),

  setSelectedScene: (scene) => set({ selectedScene: scene }),

  reset: () =>
    set({
      step: 'idle',
      photoUri: null,
      photoBase64: null,
      result: null,
      elapsedMs: null,
      selectedScenarios: [],
      selectedScene: null,
    }),
}));
