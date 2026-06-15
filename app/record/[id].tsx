import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} onPress={() => router.back()} />
          <Text style={styles.headerTitle}>整理记录详情</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>整洁得分</Text>
          <Text style={styles.scoreValue}>{record.score}</Text>
          <Text style={styles.scoreDate}>{record.date}</Text>
        </View>

        <View style={styles.noteCard}>
          <MaterialIcons name="psychology" size={18} color={colors.primary} />
          <Text style={styles.noteText}>{record.overallNotes}</Text>
        </View>

        <Text style={styles.sectionTitle}>识别到的杂物</Text>
        {record.clutterItems.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <MaterialIcons name="inventory-2" size={18} color={colors.primary} />
            <Text style={styles.itemName}>{item.display_name}</Text>
            <Text style={styles.itemMeta}>×{item.count} · {Math.round(item.area_ratio * 100)}%画面</Text>
            <Tag label={item.confidence >= 0.8 ? '高置信' : '可能不太准'} color={item.confidence >= 0.8 ? colors.healingGreen : colors.warmAmber} bgColor={(item.confidence >= 0.8 ? colors.healingGreen : colors.warmAmber) + '20'} />
          </View>
        ))}

        <Text style={styles.sectionTitle}>执行的建议</Text>
        {record.suggestions.map((s, i) => (
          <View key={i} style={styles.suggestionCard}>
            <View style={[styles.suggestionBadge, { backgroundColor: s.type === 'must_do' ? colors.primary : colors.outlineVariant }]}>
              <Text style={[styles.suggestionBadgeText, { color: s.type === 'must_do' ? colors.onPrimary : colors.onSurfaceVariant }]}>{s.type === 'must_do' ? '必做' : '备选'}</Text>
            </View>
            <Text style={styles.suggestionTitle}>{s.title}</Text>
            <Text style={styles.suggestionTime}>⏱ {s.time_cost}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  headerTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.headlineMd.fontSize, color: colors.onSurface },
  scoreCard: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg, ...shadows.card },
  scoreLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.primaryContainer },
  scoreValue: { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: typography.scoreDisplay.fontSize, lineHeight: typography.scoreDisplay.lineHeight, color: colors.onPrimary },
  scoreDate: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.primaryContainer, marginTop: spacing.xs },
  noteCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, gap: spacing.sm, ...shadows.card },
  noteText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurface, flex: 1, lineHeight: 24 },
  sectionTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.headlineMd.fontSize, color: colors.onSurface, marginBottom: spacing.md },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm, ...shadows.card },
  itemName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyMd.fontSize, color: colors.onSurface, flex: 1 },
  itemMeta: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.labelCaps.fontSize, color: colors.onSurfaceVariant },
  suggestionCard: { backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.xs, ...shadows.card },
  suggestionBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 2, borderRadius: radius.full },
  suggestionBadgeText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: typography.labelCaps.fontSize },
  suggestionTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyLg.fontSize, color: colors.onSurface },
  suggestionTime: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant },
});
