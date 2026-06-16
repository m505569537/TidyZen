import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, radius, spacing, shadows } from '../constants/theme';
import type { HistoryRecord } from '../types/analysis';

interface RecordCardProps {
  record: HistoryRecord;
  onPress: () => void;
}

export function RecordCard({ record, onPress }: RecordCardProps) {
  // 分数变化 pill 样式
  const isPositive = record.scoreChange != null && record.scoreChange > 0;
  const isNegative = record.scoreChange != null && record.scoreChange < 0;
  const isFirstTime = record.scoreChange == null;

  const pillBg = isPositive ? colors.primaryContainer
    : isNegative ? colors.errorContainer
    : colors.surfaceContainer;

  const pillText = isPositive ? colors.primaryDark
    : isNegative ? colors.error
    : colors.onSurfaceVariant;

  const changeText = isPositive ? `↑+${record.scoreChange}`
    : isNegative ? `↓${record.scoreChange}`
    : '首次分析';

  const visibleTags = record.clutterTags.slice(0, 3);
  const overflow = record.clutterTags.length - 3;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* 左：100x80 圆角缩略图 */}
      <View style={styles.thumbnail}>
        <MaterialIcons name="photo" size={28} color={colors.outlineVariant} />
      </View>

      {/* 中：信息区 */}
      <View style={styles.info}>
        {/* 分数行：大号绿色分数 + 变化 pill */}
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{record.score}</Text>
          <Text style={styles.scoreUnit}>分</Text>
          <View style={[styles.changePill, { backgroundColor: pillBg }]}>
            <Text style={[styles.changePillText, { color: pillText }]}>{changeText}</Text>
          </View>
        </View>

        {/* 日期 */}
        <Text style={styles.date}>{record.createdAt}</Text>

        {/* 灰色圆角标签 */}
        <View style={styles.tags}>
          {visibleTags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {overflow > 0 && (
            <View style={styles.tagChip}>
              <Text style={styles.tagText}>+{overflow}</Text>
            </View>
          )}
        </View>
      </View>

      {/* 右：chevron 箭头 */}
      <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
    ...shadows.card,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  score: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: 24,
    lineHeight: 28,
    color: colors.healingGreen,
  },
  scoreUnit: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.healingGreen,
  },
  changePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginLeft: spacing.xs,
  },
  changePillText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
  },
  date: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 2,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
  },
  tagText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },
});
