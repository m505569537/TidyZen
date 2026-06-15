import { create } from 'zustand';
import type { HistoryRecord } from '../types/analysis';

interface HistoryState {
  records: HistoryRecord[];
  filter: 'all' | 'week' | 'month';

  setRecords: (records: HistoryRecord[]) => void;
  addRecord: (record: HistoryRecord) => void;
  setFilter: (filter: 'all' | 'week' | 'month') => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  records: [],
  filter: 'all',

  setRecords: (records) => set({ records }),

  addRecord: (record) =>
    set((state) => ({ records: [record, ...state.records] })),

  setFilter: (filter) => set({ filter }),
}));
