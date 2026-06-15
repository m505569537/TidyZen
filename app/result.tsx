import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';
import { useAnalysisStore } from '../stores/analysis';

export default function ResultScreen() {
  const { result, setCorrecting, reset } = useAnalysisStore();

  if (!result) {
    router.replace('/camera');
    return null;
  }

  const getConfidenceInfo = (confidence: number) => {
    if (confidence >= 0.8) return { icon: 'check-circle' as const, color: colors.healingGreen, text: '高置信' };
    return { icon: 'warning' as const, color: colors.warmAmber, text: '可能不太准' };
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return colors.healingGreen;
    if (score >= 40) return colors.warmAmber;
    return colors.error;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 顶部导航 */}
        <TouchableOpacity style={styles.closeButton} onPress={() => { reset(); router.replace('/'); }}>
          <MaterialIcons name="close" size={24} color={colors.onSurface} />
        </TouchableOpacity>

        {/* 评分 */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>整洁得分</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor(result.score) }]}>
            {result.score}
          </Text>
          <Text style={styles.scoreSub}>发现 {result.clutterItems.length} 处可优化区域</Text>
        </View>

        {/* 纠错按钮 */}
        <TouchableOpacity
          style={styles.correctionButton}
          onPress={() => { setCorrecting(); router.push('/correction'); }}
          activeOpacity={0.8}
        >
          <MaterialIcons name="touch-app" size={20} color={colors.onSurface} />
          <Text style={styles.correctionText}>识别不准？点这里手动选择场景</Text>
        </TouchableOpacity>

        {/* 杂物列表 */}
        {result.clutterItems.map((item, index) => {
          const conf = getConfidenceInfo(item.confidence);
          return (
            <View key={index} style={styles.clutterCard}>
              <View style={styles.clutterHeader}>
                <MaterialIcons name="inventory-2" size={20} color={colors.primary} />
                <Text style={styles.clutterName}>{item.display_name}</Text>
                <View style={[styles.confBadge, { backgroundColor: conf.color + '20' }]}>
                  <MaterialIcons name={conf.icon} size={14} color={conf.color} />
                  <Text style={[styles.confText, { color: conf.color }]}>{conf.text}</Text>
                </View>
              </View>
              <Text style={styles.clutterMeta}>
                数量: {item.count} · 占比: {Math.round(item.area_ratio * 100)}%
              </Text>
            </View>
          );
        })}

        {/* 建议 */}
        {result.suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={suggestion.id}
            style={styles.suggestionCard}
            onPress={() => router.push(`/detail/${suggestion.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.suggestionHeader}>
              <View style={[
                styles.suggestionBadge,
                { backgroundColor: suggestion.type === 'must_do' ? colors.primary : colors.outlineVariant }
              ]}>
                <Text style={[
                  styles.suggestionBadgeText,
                  { color: suggestion.type === 'must_do' ? colors.onPrimary : colors.onSurfaceVariant }
                ]}>
                  {suggestion.type === 'must_do' ? '必做' : '备选'}
                </Text>
              </View>
              <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
            </View>
            <Text style={styles.suggestionContent} numberOfLines={3}>{suggestion.content}</Text>
            <View style={styles.suggestionMeta}>
              <MaterialIcons name="timer" size={14} color={colors.onSurfaceVariant} />
              <Text style={styles.metaText}>{suggestion.time_cost} · {suggestion.items_needed.length === 0 ? '零成本' : suggestion.items_needed.join(', ')}</Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.outline} style={{ marginLeft: 'auto' }} />
            </View>
          </TouchableOpacity>
        ))}

        {/* 氛围提示 */}
        {result.lighting === 'dim' && (
          <View style={styles.ambianceTip}>
            <MaterialIcons name="lightbulb" size={18} color={colors.warmAmber} />
            <Text style={styles.ambianceText}>氛围提示：拉开窗帘，打开主灯，房间会显得更宽敞。</Text>
          </View>
        )}

        {/* 重新扫描 */}
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => { reset(); router.replace('/camera'); }}
          activeOpacity={0.8}
        >
          <MaterialIcons name="verified" size={20} color={colors.onPrimary} />
          <Text style={styles.rescanText}>我已完成整理，重新扫描</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 40 },
  closeButton: { alignSelf: 'flex-end', padding: spacing.xs, marginBottom: spacing.sm },
  scoreSection: { alignItems: 'center', marginBottom: spacing.lg },
  scoreLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant },
  scoreValue: { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: typography.scoreDisplay.fontSize, lineHeight: typography.scoreDisplay.lineHeight },
  scoreSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant, marginTop: spacing.xs },
  correctionButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.warmAmber + '20', borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.lg, gap: spacing.sm,
    borderWidth: 1, borderColor: colors.warmAmber,
  },
  correctionText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyMd.fontSize, color: colors.onSurface },
  clutterCard: {
    backgroundColor: colors.paperWhite, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, ...shadows.card,
  },
  clutterHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  clutterName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyMd.fontSize, color: colors.onSurface, flex: 1 },
  confBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full },
  confText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.labelCaps.fontSize },
  clutterMeta: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.labelCaps.fontSize, color: colors.onSurfaceVariant, marginLeft: 28 },
  suggestionCard: {
    backgroundColor: colors.paperWhite, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, ...shadows.card,
  },
  suggestionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  suggestionBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: radius.full },
  suggestionBadgeText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: typography.labelCaps.fontSize },
  suggestionTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyLg.fontSize, color: colors.onSurface, flex: 1 },
  suggestionContent: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant, lineHeight: 22, marginBottom: spacing.sm },
  suggestionMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.labelCaps.fontSize, color: colors.onSurfaceVariant },
  ambianceTip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.warmAmber + '10',
    borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, marginBottom: spacing.md,
  },
  ambianceText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant, flex: 1 },
  rescanButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, borderRadius: radius.full,
    padding: spacing.md, marginTop: spacing.md, gap: spacing.sm,
  },
  rescanText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyLg.fontSize, color: colors.onPrimary },
});
