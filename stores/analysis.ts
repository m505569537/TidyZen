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

  // 操作
  setPhoto: (uri: string, base64: string) => void;
  setAnalyzing: () => void;
  setResult: (result: AnalysisResult, elapsedMs?: number) => void;
  setCorrecting: () => void;
  setSelectedScenarios: (scenarios: ScenarioId[]) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  step: 'idle',
  photoUri: null,
  photoBase64: null,
  result: null,
  elapsedMs: null,
  selectedScenarios: [],

  setPhoto: (uri, base64) =>
    set({ photoUri: uri, photoBase64: base64, step: 'captured' }),

  setAnalyzing: () => set({ step: 'analyzing' }),

  setResult: (result, elapsedMs) =>
    set({ result, elapsedMs: elapsedMs ?? null, step: 'result' }),

  setCorrecting: () => set({ step: 'correcting', selectedScenarios: [] }),

  setSelectedScenarios: (scenarios) => set({ selectedScenarios: scenarios }),

  reset: () =>
    set({
      step: 'idle',
      photoUri: null,
      photoBase64: null,
      result: null,
      elapsedMs: null,
      selectedScenarios: [],
    }),
}));
