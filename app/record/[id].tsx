import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Tag, ConfidenceBadge } from '../../components';

// ── 执行清单项数据 ──
const CHECKLIST_ITEMS = [
  { id: '1', name: '将椅子上的衣物分类挂起', done: true, icon: 'checkroom' as const },
  { id: '2', name: '拆开纸箱并折叠收纳', done: true, icon: 'inventory-2' as const },
  { id: '3', name: '整理床头柜杂物', done: false, icon: 'bed' as const },
  { id: '4', name: '地面清洁与吸尘', done: false, icon: 'cleaning-services' as const },
];

// ── 成就徽章数据 ──
const ACHIEVEMENTS = [
  { id: '1', label: '首次清理', icon: 'emoji-events' as const, unlocked: true },
  { id: '2', label: '快速完成', icon: 'bolt' as const, unlocked: true },
  { id: '3', label: '完美整洁', icon: 'star' as const, unlocked: false },
];

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const record = {
    score: 85,
    date: '2026年6月15日 14:30',
    scene: '卧室',
    lighting: 'normal' as const,
    scoreChange: 25,
    scoreDate: '10月24日',
    scoreTime: '18:30',
    clutterItems: [
      { display_name: '衣物', count: 5, area_ratio: 0.18, confidence: 0.92 },
      { display_name: '纸箱', count: 2, area_ratio: 0.12, confidence: 0.85 },
    ],
    suggestions: [
      { title: '椅子急救法', type: 'must_do' as const, time_cost: '3分钟' },
      { title: '压扁隐身法', type: 'optional' as const, time_cost: '2分钟' },
    ],
    overallNotes: '房间整体较为整洁，主要问题是椅子和床上有散落衣物，地面有2个快递纸箱。建议优先处理衣物堆积，再清理纸箱。',
    motivationalQuote: '房间看起来宽敞多了！',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── 顶部导航栏 ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{record.scene}清理详情</Text>
        <View style={styles.headerScore}>
          <MaterialIcons name="scoreboard" size={18} color={colors.healingGreen} />
          <Text style={styles.headerScoreLabel}>整洁得分:</Text>
          <Text style={styles.headerScoreValue}>{record.score}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── 1. Before/After 对比图组 ── */}
        <View style={styles.comparisonRow}>
          {/* Before */}
          <View style={styles.comparisonBox}>
            <View style={styles.beforeLabelWrap}>
              <Text style={styles.beforeLabelText}>BEFORE</Text>
            </View>
            <View style={styles.comparisonPlaceholder}>
              <MaterialIcons name="photo" size={32} color={colors.outlineVariant} />
            </View>
          </View>

          {/* After */}
          <View style={styles.comparisonBox}>
            <View style={styles.afterLabelWrap}>
              <Text style={styles.afterLabelText}>After</Text>
            </View>
            <View style={styles.comparisonPlaceholder}>
              <MaterialIcons name="photo" size={32} color={colors.outlineVariant} />
            </View>
          </View>
        </View>

        {/* ── 2. 评分提升卡片 ── */}
        <View style={styles.scoreImproveCard}>
          <View style={styles.scoreImproveLeft}>
            <Text style={styles.scoreImproveLabel}>本次提升</Text>
            <Text style={styles.scoreImproveValue}>+{record.scoreChange} 分</Text>
          </View>
          <View style={styles.scoreImproveRight}>
            <MaterialIcons name="calendar-today" size={16} color={colors.healingGreen} />
            <Text style={styles.scoreImproveDate}>
              {record.scoreDate} {record.scoreTime}
            </Text>
          </View>
        </View>

        {/* ── 3. AI 分析笔记 ── */}
        <View style={styles.noteCard}>
          <View style={styles.noteIconWrap}>
            <MaterialIcons name="psychology" size={18} color={colors.primary} />
          </View>
          <Text style={styles.noteText}>{record.overallNotes}</Text>
        </View>

        {/* ── 4. 执行清单 ── */}
        <Text style={styles.sectionTitle}>执行清单</Text>
        {CHECKLIST_ITEMS.map((item) => (
          <View key={item.id} style={styles.checklistItem}>
            <View style={styles.checklistLeft}>
              <View style={[
                styles.checklistIconWrap,
                { backgroundColor: item.done ? '#D6F3E6' : colors.surfaceContainer },
              ]}>
                <MaterialIcons
                  name={item.icon}
                  size={18}
                  color={item.done ? colors.healingGreen : colors.onSurfaceVariant}
                />
              </View>
              <Text style={styles.checklistName}>{item.name}</Text>
            </View>
            <View style={[
              styles.checkbox,
              { backgroundColor: item.done ? colors.healingGreen : colors.surfaceContainer },
            ]}>
              {item.done && (
                <MaterialIcons name="check" size={16} color={colors.onPrimary} />
              )}
            </View>
          </View>
        ))}

        {/* ── 5. 识别到的杂物 ── */}
        <Text style={styles.sectionTitle}>识别到的杂物</Text>
        {record.clutterItems.map((item, i) => {
          const isHigh = item.confidence >= 0.8;
          return (
            <View key={i} style={styles.clutterRow}>
              <View style={styles.clutterLeft}>
                <MaterialIcons name="inventory-2" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.clutterName}>{item.display_name}</Text>
                  <Text style={styles.clutterMeta}>
                    ×{item.count} · {Math.round(item.area_ratio * 100)}%画面
                  </Text>
                </View>
              </View>
              <ConfidenceBadge confidence={item.confidence} />
            </View>
          );
        })}

        {/* ── 6. 执行的建议 ── */}
        <Text style={styles.sectionTitle}>执行的建议</Text>
        {record.suggestions.map((s, i) => (
          <View key={i} style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <View style={[
                styles.suggestionBadge,
                { backgroundColor: s.type === 'must_do' ? colors.primary : colors.surfaceContainer },
              ]}>
                <Text style={[
                  styles.suggestionBadgeText,
                  { color: s.type === 'must_do' ? colors.onPrimary : colors.onSurfaceVariant },
                ]}>
                  {s.type === 'must_do' ? '必做' : '备选'}
                </Text>
              </View>
              <Text style={styles.suggestionTitle}>{s.title}</Text>
            </View>
            <View style={styles.suggestionMeta}>
              <MaterialIcons name="timer" size={14} color={colors.onSurfaceVariant} />
              <Text style={styles.suggestionTime}>{s.time_cost}</Text>
            </View>
          </View>
        ))}

        {/* ── 7. 激励语句卡片 ── */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteMark}>"</Text>
          <Text style={styles.quoteText}>{record.motivationalQuote}</Text>
        </View>

        {/* ── 8. 成就徽章 ── */}
        <Text style={styles.sectionTitle}>成就徽章</Text>
        <View style={styles.badgesRow}>
          {ACHIEVEMENTS.map((badge) => (
            <View key={badge.id} style={styles.badgeItem}>
              <View style={[
                styles.badgeCircle,
                {
                  borderColor: badge.unlocked ? colors.healingGreen : colors.outlineVariant,
                  backgroundColor: badge.unlocked ? colors.primaryContainer + '40' : colors.surfaceContainer,
                },
              ]}>
                <MaterialIcons
                  name={badge.icon}
                  size={28}
                  color={badge.unlocked ? colors.primary : colors.outlineVariant}
                />
              </View>
              <Text style={[
                styles.badgeLabel,
                { color: badge.unlocked ? colors.onSurface : colors.outlineVariant },
              ]}>
                {badge.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── 9. 底部分享按钮 ── */}
        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8}>
          <MaterialIcons name="share" size={20} color={colors.onPrimary} />
          <Text style={styles.shareText}>分享清理成果</Text>
        </TouchableOpacity>

        {/* 底部留白 */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { paddingHorizontal: spacing.pageMargin, paddingBottom: 60 },

  // ── 顶部导航栏 ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.pageMargin,
    paddingVertical: spacing.sm + 4,
    backgroundColor: colors.paperWhite,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },
  headerScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerScoreLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },
  headerScoreValue: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.healingGreen,
  },

  // ── Before/After 对比图 ──
  comparisonRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  comparisonBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  comparisonPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beforeLabelWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomRightRadius: radius.md,
    borderTopLeftRadius: radius.lg,
  },
  beforeLabelText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onPrimary,
  },
  afterLabelWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: colors.healingGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: radius.md,
    borderTopRightRadius: radius.lg,
  },
  afterLabelText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onPrimary,
  },

  // ── 评分提升卡片 ──
  scoreImproveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  scoreImproveLeft: {
    gap: 2,
  },
  scoreImproveLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  scoreImproveValue: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineLgMobile.fontSize,
    color: colors.healingGreen,
  },
  scoreImproveRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  scoreImproveDate: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.healingGreen,
  },

  // ── AI 分析笔记 ──
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  noteIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    flex: 1,
    lineHeight: 24,
  },

  // ── 区块标题 ──
  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },

  // ── 执行清单 ──
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  checklistLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checklistIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── 识别到的杂物 ──
  clutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  clutterLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  clutterName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  clutterMeta: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },

  // ── 执行的建议 ──
  suggestionCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  suggestionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  suggestionBadgeText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.labelCaps.fontSize,
  },
  suggestionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurface,
  },
  suggestionMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 4 },
  suggestionTime: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },

  // ── 激励语句卡片 ──
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0EBE5',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  quoteMark: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: 48,
    lineHeight: 52,
    color: colors.outline,
    marginTop: -8,
  },
  quoteText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 15,
    color: colors.onSurface,
    flex: 1,
    lineHeight: 24,
    marginTop: spacing.sm,
  },

  // ── 成就徽章 ──
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: spacing.lg,
  },
  badgeItem: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  badgeCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
  },

  // ── 底部分享按钮 ──
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  shareText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onPrimary,
  },
});
