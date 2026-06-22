import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { getHistoryRecords } from '../services/storage';
import type { HistoryRecord } from '../types/analysis';

// ── 设计稿色板（严格对齐 docs/designs/medals_design.md）──
const DESIGN = {
  background: '#FFFFFF',
  primary: '#2D6B5B',          // 治愈深绿（主色）
  primaryLight: '#3A8F7A',     // 卡片渐变终止色
  greenBgLight: '#A8E6CF',     // 已解锁勋章浅绿背景
  greenBgFaint: '#E8F5E9',     // 底部 Tab 选中背景
  yellowBg: '#FFE082',         // 已解锁勋章黄色背景
  greyBg: '#F5F5F5',           // 未选中标签背景
  divider: '#E0E0E0',          // 分隔/进度条底/未解锁勋章背景
  textPrimary: '#333333',      // 主文字
  textSecondary: '#666666',    // 次要文字
  textTertiary: '#BDBDBD',     // 未解锁勋章文字
  iconLocked: '#9E9E9E',       // 未解锁图标灰
  whiteAlpha20: 'rgba(255,255,255,0.2)',
  whiteAlpha80: 'rgba(255,255,255,0.8)',
} as const;

// ── 勋章数据类型 ──
interface Medal {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  unlocked: boolean;
  /** 已解锁勋章的圆形背景色（绿/黄 二选一） */
  bgVariant?: 'green' | 'yellow';
  /** 所属分类：basic=全部成就/进阶之路 共有；advance=进阶；challenge=限时 */
  category: 'advance' | 'challenge';
}

/** 勋章定义（不含 unlocked，运行时根据历史记录计算） */
interface MedalDef {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  bgVariant: 'green' | 'yellow';
  category: 'advance' | 'challenge';
  /** 根据历史记录判定是否解锁 */
  check: (ctx: MedalCtx) => boolean;
}

/** 计算勋章状态用的上下文 */
interface MedalCtx {
  records: HistoryRecord[];
  count: number;
  maxScore: number;
  maxStreak: number;
  uniqueScenes: number;
}

/** 计算最长连续扫描天数（按 createdAt 当地日期归并） */
function calcMaxStreak(records: HistoryRecord[]): number {
  if (records.length === 0) return 0;
  // 抽取 YYYY-MM-DD 日期串去重并排序
  const days = Array.from(
    new Set(
      records.map((r) => {
        const d = new Date(r.createdAt);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      })
    )
  ).sort();

  let best = 1;
  let cur = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const next = new Date(days[i]);
    const diffDays = Math.round((next.getTime() - prev.getTime()) / 86_400_000);
    if (diffDays === 1) {
      cur += 1;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
}

/** 用 clutterTags 的首个标签近似"场景"——HistoryRecord 不持久化 scene 字段 */
function calcUniqueScenes(records: HistoryRecord[]): number {
  const set = new Set<string>();
  for (const r of records) {
    const primary = r.clutterTags?.[0];
    if (primary) set.add(primary);
  }
  return set.size;
}

const MEDAL_DEFS: MedalDef[] = [
  // ── 进阶之路 ──
  { id: 'first-scan',     label: '首次扫描',    icon: 'broom',                 bgVariant: 'green',  category: 'advance',
    check: (c) => c.count >= 1 },
  { id: 'tidy-pro',       label: '整理达人',    icon: 'star-outline',          bgVariant: 'yellow', category: 'advance',
    check: (c) => c.count >= 10 },
  { id: 'tidy-master',    label: '整理大师',    icon: 'crown-outline',         bgVariant: 'green',  category: 'advance',
    check: (c) => c.count >= 50 },
  { id: 'first-perfect',  label: '首次满分',    icon: 'trophy-outline',        bgVariant: 'yellow', category: 'advance',
    check: (c) => c.maxScore >= 100 },
  { id: 'streak-3',       label: '连续扫描',    icon: 'fire',                  bgVariant: 'yellow', category: 'advance',
    check: (c) => c.maxStreak >= 3 },
  { id: 'multi-scene',    label: '多场景探索',  icon: 'view-grid-outline',     bgVariant: 'green',  category: 'advance',
    check: (c) => c.uniqueScenes >= 3 },

  // ── 限时挑战（保留占位，暂不接业务）──
  { id: 'monthly-king',   label: '月度之星',    icon: 'medal-outline',         bgVariant: 'green',  category: 'challenge',
    check: () => false },
  { id: 'photo-100',      label: '百张照片',    icon: 'camera-outline',        bgVariant: 'yellow', category: 'challenge',
    check: (c) => c.count >= 100 },
  { id: 'spring-clean',   label: '春日大扫除',  icon: 'flower-outline',        bgVariant: 'green',  category: 'challenge',
    check: () => false },
];

// ── 分类标签 ──
type CategoryKey = 'all' | 'advance' | 'challenge';
const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all',       label: '全部成就' },
  { key: 'advance',   label: '进阶之路' },
  { key: 'challenge', label: '限时挑战' },
];

export default function MedalsScreen() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [medals, setMedals] = useState<Medal[]>(() =>
    MEDAL_DEFS.map((d) => ({ ...d, unlocked: false }))
  );

  // 页面聚焦时刷新勋章解锁状态
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const records = await getHistoryRecords();
        const ctx: MedalCtx = {
          records,
          count: records.length,
          maxScore: records.reduce((m, r) => Math.max(m, r.score), 0),
          maxStreak: calcMaxStreak(records),
          uniqueScenes: calcUniqueScenes(records),
        };
        if (cancelled) return;
        setMedals(
          MEDAL_DEFS.map((d) => ({
            id: d.id,
            label: d.label,
            icon: d.icon,
            bgVariant: d.bgVariant,
            category: d.category,
            unlocked: d.check(ctx),
          }))
        );
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const visibleMedals =
    activeCategory === 'all' ? medals : medals.filter((m) => m.category === activeCategory);

  // 进度条按实际解锁勋章数 / 总勋章数计算
  const currentMedals = medals.filter((m) => m.unlocked).length;
  const targetMedals = medals.length;
  const remainingToLevelUp = Math.max(0, targetMedals - currentMedals);
  const progressPercent = targetMedals > 0 ? (currentMedals / targetMedals) * 100 : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── 顶部导航栏 ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
          style={styles.backBtn}
          activeOpacity={0.6}
          hitSlop={12}
        >
          <MaterialIcons name="arrow-back" size={24} color={DESIGN.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的勋章墙</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 用户信息卡片 ── */}
        {/* 设计稿要求 #2D6B5B → #3A8F7A 渐变；项目未安装 expo-linear-gradient，
            使用主色 + 右侧浅色叠加色块近似渐变效果 */}
        <View style={styles.userCard}>
          <View style={styles.userCardGradientOverlay} pointerEvents="none" />
          <View style={styles.userCardLeft}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={28} color={DESIGN.primary} />
            </View>
            <View>
              <Text style={styles.userName}>清月</Text>
              <View style={styles.levelTag}>
                <Text style={styles.levelText}>Lv.5 整洁达人</Text>
              </View>
            </View>
          </View>
          <View style={styles.userCardRight}>
            <Text style={styles.scoreNumber}>85</Text>
            <Text style={styles.scoreLabel}>整洁得分</Text>
          </View>
        </View>

        {/* ── 成就分类标签栏 ── */}
        <View style={styles.tabsRow}>
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() => setActiveCategory(cat.key)}
                style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
              >
                <Text style={active ? styles.tabTextActive : styles.tabTextInactive}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── 勋章网格 ── */}
        <View style={styles.medalGrid}>
          {visibleMedals.map((m) => (
            <MedalCard key={m.id} medal={m} />
          ))}
        </View>

        {/* ── 升级进度区 ── */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>距下一等级</Text>
            <Text style={styles.progressCount}>
              {currentMedals}/{targetMedals}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressHint}>
            再收集 {remainingToLevelUp} 枚勋章即可升级
          </Text>
        </View>
      </ScrollView>

      {/* ── 底部 Tab 导航栏 ── */}
      <View style={styles.bottomNav}>
        <BottomTabItem
          icon="home-outline"
          label="首页"
          active={false}
          onPress={() => router.replace('/(tabs)')}
        />
        <BottomTabItem
          icon="scan-helper"
          label="扫描"
          active={false}
          onPress={() => router.replace('/(tabs)/scan')}
        />
        <BottomTabItem
          icon="clock-outline"
          label="记录"
          active={true}
          onPress={() => router.replace('/(tabs)/history')}
        />
        <BottomTabItem
          icon="cog-outline"
          label="设置"
          active={false}
          onPress={() => router.replace('/(tabs)/settings')}
        />
      </View>
    </SafeAreaView>
  );
}

// ── 单个勋章卡片 ──
function MedalCard({ medal }: { medal: Medal }) {
  const { unlocked, bgVariant, label, icon } = medal;

  const circleBg = unlocked
    ? bgVariant === 'yellow'
      ? DESIGN.yellowBg
      : DESIGN.greenBgLight
    : DESIGN.divider;

  const iconColor = unlocked ? DESIGN.primary : DESIGN.iconLocked;
  const labelColor = unlocked ? DESIGN.textPrimary : DESIGN.textTertiary;
  const badgeBg = unlocked ? DESIGN.primary : DESIGN.iconLocked;

  return (
    <View style={medalStyles.card}>
      <View style={[medalStyles.circle, { backgroundColor: circleBg }]}>
        <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
        {/* 右下角徽章：对勾 / 锁 */}
        <View style={[medalStyles.cornerBadge, { backgroundColor: badgeBg }]}>
          <MaterialCommunityIcons
            name={unlocked ? 'check' : 'lock'}
            size={11}
            color="#FFFFFF"
          />
        </View>
      </View>
      <Text style={[medalStyles.label, { color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

// ── 底部 Tab 单项 ──
interface BottomTabItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  active: boolean;
  onPress?: () => void;
}

function BottomTabItem({ icon, label, active, onPress }: BottomTabItemProps) {
  return (
    <TouchableOpacity
      style={tabBarStyles.item}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={active}
    >
      <View style={[tabBarStyles.itemInner, active && tabBarStyles.itemActive]}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={active ? DESIGN.primary : DESIGN.textSecondary}
        />
        <Text
          style={[
            tabBarStyles.itemLabel,
            { color: active ? DESIGN.primary : DESIGN.textSecondary },
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ── 样式 ───────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.background,
  },

  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: DESIGN.background,
  },
  backBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 18,
    color: DESIGN.textPrimary,
  },
  headerRightSpacer: {
    width: 24,
    height: 24,
  },

  // 滚动容器
  scrollContent: {
    paddingBottom: 24,
  },

  // 用户信息卡片
  userCard: {
    marginTop: 16,
    marginHorizontal: 16,
    height: 120,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: DESIGN.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  // 用浅色斜向遮罩近似渐变效果
  userCardGradientOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '60%',
    backgroundColor: DESIGN.primaryLight,
    opacity: 0.5,
  },
  userCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DESIGN.greenBgLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  levelTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: DESIGN.whiteAlpha20,
  },
  levelText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
  },
  userCardRight: {
    alignItems: 'flex-end',
  },
  scoreNumber: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 36,
    color: '#FFFFFF',
    lineHeight: 40,
  },
  scoreLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: DESIGN.whiteAlpha80,
    marginTop: 2,
  },

  // 分类标签栏
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: DESIGN.primary,
  },
  tabInactive: {
    backgroundColor: DESIGN.greyBg,
  },
  tabTextActive: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  tabTextInactive: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: DESIGN.textSecondary,
  },

  // 勋章网格
  medalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 16,
    rowGap: 20,
    columnGap: 12,
  },

  // 升级进度卡片
  progressCard: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 14,
    color: DESIGN.textPrimary,
  },
  progressCount: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 14,
    color: DESIGN.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: DESIGN.divider,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: DESIGN.primary,
    borderRadius: 4,
  },
  progressHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: DESIGN.textSecondary,
    marginTop: 8,
  },

  // 底部导航栏
  bottomNav: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: DESIGN.divider,
  },
});

const medalStyles = StyleSheet.create({
  card: {
    // 3 列：每列宽 = (屏幕 - 16*2 边距 - 12*2 列间距) / 3 ≈ 调整为 flex 计算
    // 这里用基于百分比的固定列宽：父容器有 32px 内边距 + 24px 列间距，剩余宽度 / 3
    width: '31%',
    alignItems: 'center',
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cornerBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  label: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

const tabBarStyles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemActive: {
    backgroundColor: DESIGN.greenBgFaint,
  },
  itemLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 10,
  },
});
