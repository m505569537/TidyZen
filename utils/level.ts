// 等级与称号工具
// 用户等级 + 称号从扫描次数派生（之前在 profile.tsx 内部，现抽出来给 settings 复用）

/** 等级公式：每 5 次扫描升 1 级，最少 Lv.1，最多 Lv.99 */
export function deriveLevel(scans: number): number {
  if (scans <= 0) return 1;
  return Math.max(1, Math.min(99, Math.floor(scans / 5) + 1));
}

/** 当前等级内的进度：0-1 之间的小数，0 表示本级刚升，1 表示快升下一级 */
export function deriveLevelProgress(scans: number): number {
  if (scans <= 0) return 0;
  return (scans % 5) / 5;
}

/** 等级对应的中文称号 */
export function deriveTitle(scans: number): string {
  const level = deriveLevel(scans);
  if (level >= 20) return '极简主义大师';
  if (level >= 10) return '空间规划师';
  if (level >= 5) return '极简主义新星';
  if (level >= 3) return '整理达人';
  if (level >= 2) return '整洁爱好者';
  return '整洁新手';
}

/** 等级 + 称号组合标签，用于 settings 页头部 */
export function deriveLevelTag(scans: number): string {
  return `☆ Lv.${deriveLevel(scans)} ${deriveTitle(scans)}`;
}
