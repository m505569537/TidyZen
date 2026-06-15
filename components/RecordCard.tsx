import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, radius, spacing } from '../constants/theme';
import { Tag } from './ui/Tag';
import type { HistoryRecord } from '../types/analysis';

interface RecordCardProps {
  record: HistoryRecord;
  onPress: () => void;
}

export function RecordCard({ record, onPress }: RecordCardProps) {
  const scoreColor = record.score >= 70 ? colors.healingGreen
    : record.score >= 40 ? colors.warmAmber : colors.error;

  const changeColor = record.scoreChange != null
    ? record.scoreChange > 0 ? colors.healingGreen : colors.error
    : undefined;

  const changeText = record.scoreChange != null
    ? record.scoreChange > 0 ? `↑+${record.scoreChange}`
    : `↓${record.scoreChange}`
    : '首次分析';

  const visibleTags = record.clutterTags.slice(0, 3);
  const overflow = record.clutterTags.length - 3;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* 缩略图 */}
      <View style={styles.thumbnail}>
        <MaterialIcons name="photo" size={32} color={colors.outlineVariant} />
      </View>

      {/* 信息区 */}
      <View style={styles.info}>
        <View style={styles.scoreRow}>
          <Text style={[styles.score, { color: scoreColor }]}>{record.score}分</Text>
          {changeColor && (
            <Text style={[styles.change, { color: changeColor }]}>{changeText}</Text>
          )}
          {!changeColor && (
            <Text style={styles.firstTime}>{changeText}</Text>
          )}
        </View>
        <Text style={styles.date}>{record.createdAt}</Text>
        <View style={styles.tags}>
          {visibleTags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
          {overflow > 0 && <Tag label={`+${overflow}`} />}
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 3 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  score: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineLg.fontSize,
  },
  change: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
  },
  firstTime: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
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
});
