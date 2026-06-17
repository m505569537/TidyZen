import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { useHistoryStore } from '../../stores/history';
import { getHistoryRecords } from '../../services/storage';

// ── 环形进度条（纯 RN，无 SVG 依赖）──
function CircularProgress({
  percentage,
  size = 200,
  strokeWidth = 24,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const circleRadius = size / 2;
  const half = size / 2;
  const innerSize = size - strokeWidth * 2;

  const rightDeg = percentage <= 50 ? (percentage / 50) * 180 : 180;
  const leftDeg = percentage > 50 ? ((percentage - 50) / 50) * 180 : 0;

  return (
    <View style={{ width: size, height: size }}>
      {/* 灰色背景环 */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: circleRadius,
          borderWidth: strokeWidth,
          borderColor: colors.outlineVariant,
        }}
      />

      {/* 右半环进度 */}
      <View
        style={{
          position: 'absolute',
          width: half,
          height: size,
          left: half,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: size,
            height: size,
            borderRadius: circleRadius,
            borderWidth: strokeWidth,
            borderColor: colors.primary,
            position: 'absolute',
            left: -half,
            transform: [{ rotate: `${rightDeg}deg` }],
          }}
        />
      </View>

      {/* 左半环进度（仅 > 50% 可见） */}
      {percentage > 50 && (
        <View
          style={{
            position: 'absolute',
            width: half,
            height: size,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: size,
              height: size,
              borderRadius: circleRadius,
              borderWidth: strokeWidth,
              borderColor: colors.primary,
              position: 'absolute',
              transform: [{ rotate: `${leftDeg}deg` }],
            }}
          />
        </View>
      )}

      {/* 环形内芯白底 */}
      <View
        style={{
          position: 'absolute',
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: colors.paperWhite,
          top: strokeWidth,
          left: strokeWidth,
        }}
      />
    </View>
  );
}

// ── 垂直渐变（纯 RN 实现：从下到上，银灰冷调 → 白）──
function VerticalGradient({
  bottomColor,
  topColor,
  height,
  children,
}: {
  bottomColor: string;
  topColor: string;
  height: number;
  children?: React.ReactNode;
}) {
  return (
    <View style={{ height, position: 'relative', overflow: 'hidden' }}>
      <View style={{ ...StyleSheet.absoluteFill, backgroundColor: bottomColor }} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '50%',
          backgroundColor: topColor,
        }}
      />
      <View
        style={{
          ...StyleSheet.absoluteFill,
          backgroundColor: topColor,
          opacity: 0.2,
        }}
      />
      {children}
    </View>
  );
}

// ── 功能卡片数据 ──
const FEATURE_CARDS = [
  {
    title: '椅子急救法',
    desc: '将椅子上的衣物分类，常穿的挂起，待洗的放入脏衣篓。',
    time: '3分钟完成',
    tag: '必做',
    tagColor: colors.warmAmber,
    tagTextColor: colors.onPrimary,
    buttonLabel: '开始整理',
    buttonVariant: 'primary' as const,
  },
  {
    title: '桌面清空术',
    desc: '将桌面上所有物品归位，杂物扔掉，只保留每天必需的 3 件物品。',
    time: '5分钟完成',
    tag: '备选',
    tagColor: colors.outline,
    tagTextColor: colors.onPrimary,
    buttonLabel: '查看',
    buttonVariant: 'outline' as const,
  },
];

// ── 功能卡片组件 ──
function FeatureCard({
  title,
  desc,
  time,
  tag,
  tagColor,
  tagTextColor,
  buttonLabel,
  buttonVariant,
}: {
  title: string;
  desc: string;
  time: string;
  tag: string;
  tagColor: string;
  tagTextColor: string;
  buttonLabel: string;
  buttonVariant: 'primary' | 'outline';
}) {
  return (
    <View style={styles.featureCard}>
      {/* 顶部渐变区 */}
      <VerticalGradient bottomColor="#A0A4A8" topColor="#FAFBFC" height={80}>
        <View style={styles.cardTags}>
          <View style={[styles.tag, styles.tagTime]}>
            <MaterialIcons name="access-time" size={12} color={colors.primary} />
            <Text style={[styles.tagText, styles.tagTimeText]}>{time}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: tagColor }]}>
            <Text style={[styles.tagText, { color: tagTextColor }]}>{tag}</Text>
          </View>
        </View>
      </VerticalGradient>

      {/* 卡片正文 */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>

      {/* 操作按钮 */}
      <TouchableOpacity
        style={[
          styles.cardButton,
          buttonVariant === 'outline' && styles.cardButtonOutline,
        ]}
        activeOpacity={0.8}
      >
        {buttonVariant === 'primary' && (
          <MaterialIcons name="play-arrow" size={16} color={colors.onPrimary} />
        )}
        <Text
          style={[
            styles.cardButtonText,
            buttonVariant === 'outline' && styles.cardButtonTextOutline,
          ]}
        >
          {buttonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── 首页组件 ──
export default function HomeScreen() {
  const { records, setRecords } = useHistoryStore();

  // 从持久化存储加载历史记录到 store
  useEffect(() => {
    getHistoryRecords().then(setRecords);
  }, [setRecords]);

  // 使用最新一条记录的得分；无记录时回退到 85
  const latestScore = records[0]?.score ?? 85;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 一、顶部导航栏 ── */}
        <View style={styles.topBar}>
          <MaterialIcons name="bar-chart" size={24} color={colors.primary} />
          <Text style={styles.topBarTitle}>整洁得分：{latestScore}</Text>
          <View style={styles.avatarCircle}>
            <MaterialIcons name="person" size={18} color={colors.onSurfaceVariant} />
          </View>
        </View>

        {/* ── 二、整洁得分展示区（环形进度条 + 中心文字）── */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreSection}>
            <View style={styles.ringWrapper}>
              <CircularProgress percentage={latestScore} />
              <View style={styles.ringCenter}>
                <Text style={styles.ringScoreText}>{latestScore}</Text>
                <Text style={styles.ringScoreLabel}>当前得分</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── 三、杂乱提示区 ── */}
        <View style={styles.clutterAlert}>
          <MaterialIcons name="warning" size={16} color={colors.error} />
          <Text style={styles.clutterText}>检测到3处杂乱</Text>
        </View>

        {/* ── 四、核心功能区（横向滚动多卡片）── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>核心功能区</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>查看全部</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScroll}
          snapToInterval={260 + spacing.md}
          decelerationRate="fast"
        >
          {FEATURE_CARDS.map((card, i) => (
            <FeatureCard key={i} {...card} />
          ))}
        </ScrollView>

        {/* ── 五、最近对比区 ── */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>最近对比</Text>
        <View style={styles.comparisonCard}>
          <View style={styles.comparisonLeft}>
            <View style={styles.comparisonBox}>
              <View style={[styles.comparisonLabel, styles.beforeLabel]}>
                <Text style={styles.comparisonLabelText}>Before</Text>
              </View>
            </View>
            <View style={styles.comparisonBox}>
              <View style={[styles.comparisonLabel, styles.afterLabel]}>
                <Text style={styles.comparisonLabelText}>After</Text>
              </View>
            </View>
          </View>

          <View style={styles.comparisonRight}>
            <MaterialIcons name="trending-up" size={24} color={colors.primary} />
            <Text style={styles.comparisonScore}>+15分</Text>
          </View>
        </View>

        {/* 底部留白 */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── 样式 ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paperWhite,
  },
  scrollContent: {
    paddingHorizontal: spacing.pageMargin,
  },

  /* ── 顶部导航栏 ── */
  topBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarTitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── 整洁得分展示区 ── */
  scoreCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  scoreSection: {
    alignItems: 'center',
  },
  ringWrapper: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringScoreText: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: typography.scoreDisplay.fontSize,
    lineHeight: typography.scoreDisplay.lineHeight,
    color: colors.primary,
  },
  ringScoreLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    marginTop: 2,
  },

  /* ── 杂乱提示区 ── */
  clutterAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.errorContainer,
    borderRadius: 20,
    height: 36,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  clutterText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },

  /* ── 核心功能区标题 ── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineLgMobile.fontSize,
    color: colors.onSurface,
  },
  viewAll: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.primary,
  },

  /* ── 横向滚动容器 ── */
  cardsScroll: {
    paddingRight: spacing.pageMargin,
    gap: spacing.md,
  },

  /* ── 功能卡片 ── */
  featureCard: {
    width: 260,
    backgroundColor: colors.paperWhite,
    borderRadius: radius.md,
    shadowColor: colors.surface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  cardTags: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  tagTime: {
    backgroundColor: '#D1FAE5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagTimeText: {
    color: colors.primary,
  },
  tagText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onPrimary,
  },
  cardBody: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  cardTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    lineHeight: 21,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    height: 44,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  cardButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  cardButtonText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onPrimary,
  },
  cardButtonTextOutline: {
    color: colors.primary,
  },

  /* ── 最近对比区 ── */
  comparisonCard: {
    flexDirection: 'row',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.md,
    height: 120,
    padding: spacing.md,
    shadowColor: colors.surface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    marginTop: spacing.md,
  },
  comparisonLeft: {
    flex: 7,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  comparisonBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.sm,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  comparisonLabel: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
  },
  beforeLabel: {
    backgroundColor: colors.outline,
  },
  afterLabel: {
    backgroundColor: colors.primary,
  },
  comparisonLabelText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onPrimary,
  },
  comparisonRight: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonScore: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.primary,
    marginTop: 4,
  },
});
