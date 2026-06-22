// 本地存储服务
// MVP 阶段使用 AsyncStorage，后续迁移到 expo-sqlite

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryRecord } from '../types/analysis';

const HISTORY_KEY = '@tidyzen/history';
const SETTINGS_KEY = '@tidyzen/settings';

/** 保存历史记录 */
export async function saveHistoryRecord(record: HistoryRecord): Promise<void> {
  const existing = await getHistoryRecords();
  existing.unshift(record);
  // 最多保留 100 条
  const trimmed = existing.slice(0, 100);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

/** 获取所有历史记录 */
export async function getHistoryRecords(): Promise<HistoryRecord[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

/** 删除单条历史记录 */
export async function deleteHistoryRecord(id: string): Promise<void> {
  const records = await getHistoryRecords();
  const filtered = records.filter((r) => r.id !== id);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

/** 清空所有历史记录 */
export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

/** 清除所有本地数据（历史 + 设置），用于退出登录 */
export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([HISTORY_KEY, SETTINGS_KEY]);
}

/** 保存设置 */
export async function saveSetting(key: string, value: string): Promise<void> {
  const settings = await getSettings();
  settings[key] = value;
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/** 获取所有设置 */
export async function getSettings(): Promise<Record<string, string>> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  return raw ? JSON.parse(raw) : {};
}
