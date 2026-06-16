import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Tag } from '../../components';

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const record = {
    score: 85,
    date: '2026年6月15日 14:30',
    scene: '卧室',
    lighting: 'normal' as const,
    clutterItems: [
      { display_name: '衣物', count: 5, area_ratio: 0.18, confidence: 0.92 },
      { display_name: '纸箱', count: 2, area_ratio: 0.12, confidence: 0.85 },
    ],
    suggestions: [
      { title: '椅子急救法', type: 'must_do' as const, time_cost: '3分钟' },
      { title: '压扁隐身法', type: 'optional' as const, time_cost: '2分钟' },
    ],
    overallNotes: '房间整体较为整洁，主要问题是椅子和床上有散落衣物，地面有2个快递纸箱。',
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return colors.healingGreen;
    if (score >= 40) return colors.warmAmber;
    return colors.error;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>整理记录详情</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 得分卡片 */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>整洁得分</Text>
          <Text style={styles.scoreValue}>{record.score}</Text>
          <Text style={styles.scoreDate}>{record.date}</Text>
        </View>

        {/* AI 分析笔记 */}
        <View style={styles.noteCard}>
          <View style={styles.noteIconWrap}>
            <MaterialIcons name="psychology" size={18} color={colors.primary} />
          </View>
          <Text style={styles.noteText}>{record.overallNotes}</Text>
        </View>

        {/* 识别到的杂物 */}
        <Text style={styles.sectionTitle}>识别到的杂物</Text>
        {record.clutterItems.map((item, i) => {
          const isHigh = item.confidence >= 0.8;
          const tagColor = isHigh ? colors.healingGreen : colors.warmAmber;
          return (
            <View key={i} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <MaterialIcons name="inventory-2" size={18} color={colors.primary} />
                <View>
                  <Text style={styles.itemName}>{item.display_name}</Text>
                  <Text style={styles.itemMeta}>×{item.count} · {Math.round(item.area_ratio * 100)}%画面</Text>
                </View>
              </View>
              <Tag
                label={isHigh ? '高置信' : '可能不太准'}
                color={tagColor}
                bgColor={tagColor + '20'}
              />
            </View>
          );
        })}

        {/* 执行的建议 */}
        <Text style={styles.sectionTitle}>执行的建议</Text>
        {record.suggestions.map((s, i) => (
          <View key={i} style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <View style={[styles.suggestionBadge, {
                backgroundColor: s.type === 'must_do' ? colors.primary : colors.outlineVariant
              }]}>
                <Text style={[styles.suggestionBadgeText, {
                  color: s.type === 'must_do' ? colors.onPrimary : colors.onSurfaceVariant
                }]}>{s.type === 'must_do' ? '必做' : '备选'}</Text>
              </View>
              <Text style={styles.suggestionTitle}>{s.title}</Text>
            </View>
            <View style={styles.suggestionMeta}>
              <MaterialIcons name="timer" size={14} color={colors.onSurfaceVariant} />
              <Text style={styles.suggestionTime}>{s.time_cost}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 60 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.pageMargin, paddingVertical: spacing.md,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },

  // 得分卡片
  scoreCard: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    padding: spacing.xl, alignItems: 'center',
    marginBottom: spacing.lg, ...shadows.card,
  },
  scoreLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onPrimaryContainer,
  },
  scoreValue: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: typography.scoreDisplay.fontSize,
    lineHeight: typography.scoreDisplay.lineHeight,
    color: colors.onPrimary,
  },
  scoreDate: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onPrimaryContainer,
    marginTop: spacing.xs,
  },

  // AI 笔记
  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.paperWhite, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.lg,
    gap: spacing.sm, ...shadows.card,
  },
  noteIconWrap: {
    width: 32, height: 32, borderRadius: radius.md,
    backgroundColor: colors.primaryContainer + '30',
    alignItems: 'center', justifyContent: 'center',
  },
  noteText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface, flex: 1, lineHeight: 24,
  },

  // 区块标题
  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },

  // 杂物行
  itemRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.paperWhite, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm,
    ...shadows.card,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  itemName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  itemMeta: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },

  // 建议卡片
  suggestionCard: {
    backgroundColor: colors.paperWhite, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm,
    ...shadows.card,
  },
  suggestionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  suggestionBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
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
  suggestionMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  suggestionTime: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
});
