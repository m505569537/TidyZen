// 本地存储服务
// MVP 阶段使用 AsyncStorage，后续迁移到 expo-sqlite

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryRecord } from '../types/analysis';

const HISTORY_KEY = '@tidyzen/history';
const SETTINGS_KEY = '@tidyzen/settings';
const LAST_SCAN_KEY = '@tidyzen/lastScan';
const PROFILE_KEY = '@tidyzen/profile';

/** 用户资料（昵称 / 性别 / 头像） */
export interface UserProfile {
  nickname: string;
  gender: 'male' | 'female' | 'secret';
  avatarUri?: string | null;
}

const DEFAULT_PROFILE: UserProfile = {
  nickname: '整洁爱好者',
  gender: 'secret',
  avatarUri: null,
};

/** 读用户资料（缺字段时回退默认） */
export async function getProfile(): Promise<UserProfile> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) return { ...DEFAULT_PROFILE };
  try {
    const parsed = JSON.parse(raw);
    return {
      nickname: typeof parsed.nickname === 'string' && parsed.nickname.trim() ? parsed.nickname : DEFAULT_PROFILE.nickname,
      gender: ['male', 'female', 'secret'].includes(parsed.gender) ? parsed.gender : DEFAULT_PROFILE.gender,
      avatarUri: parsed.avatarUri ?? null,
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

/** 写用户资料（merge，未提供字段保留旧值） */
export async function saveProfile(partial: Partial<UserProfile>): Promise<UserProfile> {
  const current = await getProfile();
  const next: UserProfile = {
    ...current,
    ...partial,
    nickname: partial.nickname !== undefined ? partial.nickname.trim() || current.nickname : current.nickname,
  };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  return next;
}

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

/** 清除所有本地数据（历史 + 设置 + 上次扫描 + 资料），用于退出登录 */
export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([HISTORY_KEY, SETTINGS_KEY, LAST_SCAN_KEY, PROFILE_KEY]);
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

/** 保存上次扫描的照片和分数（用于 Before/After 对比） */
export async function saveLastScan(photoUri: string, score: number): Promise<void> {
  await AsyncStorage.setItem(LAST_SCAN_KEY, JSON.stringify({ photoUri, score }));
}

/** 读取上次扫描记录；首次扫描返回 null */
export async function getLastScan(): Promise<{ photoUri: string; score: number } | null> {
  const raw = await AsyncStorage.getItem(LAST_SCAN_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.photoUri === 'string' && typeof parsed?.score === 'number') {
      return { photoUri: parsed.photoUri, score: parsed.score };
    }
    return null;
  } catch {
    return null;
  }
}
