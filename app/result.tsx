import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';
import { useAnalysisStore } from '../stores/analysis';
import { ScoreGauge } from '../components';

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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 关闭按钮 */}
        <TouchableOpacity style={styles.closeButton} onPress={() => { reset(); router.replace('/'); }}>
          <MaterialIcons name="close" size={24} color={colors.onSurface} />
        </TouchableOpacity>

        {/* 评分区域 */}
        <View style={styles.scoreSection}>
          <ScoreGauge score={result.score} size="large" />
          <Text style={[styles.scoreSub, { color: getScoreColor(result.score) }]}>
            发现 {result.clutterItems.length} 处可优化区域
          </Text>
        </View>

        {/* 纠错按钮 */}
        {result.needsCorrection && (
          <TouchableOpacity
            style={styles.correctionButton}
            onPress={() => { setCorrecting(); router.push('/correction'); }}
            activeOpacity={0.8}
          >
            <MaterialIcons name="touch-app" size={20} color={colors.onSurface} />
            <Text style={styles.correctionText}>识别不准？手动选择场景</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}

        {/* 杂物列表 */}
        <Text style={styles.sectionTitle}>识别结果</Text>
        {result.clutterItems.map((item, index) => {
          const conf = getConfidenceInfo(item.confidence);
          return (
            <View key={index} style={styles.clutterCard}>
              <View style={styles.clutterLeft}>
                <View style={[styles.clutterIconWrap, { backgroundColor: conf.color + '20' }]}>
                  <MaterialIcons name="inventory-2" size={18} color={conf.color} />
                </View>
                <View>
                  <Text style={styles.clutterName}>{item.display_name}</Text>
                  <Text style={styles.clutterMeta}>
                    数量 {item.count} · 占比 {Math.round(item.area_ratio * 100)}%
                  </Text>
                </View>
              </View>
              <View style={[styles.confBadge, { backgroundColor: conf.color + '15' }]}>
                <MaterialIcons name={conf.icon} size={14} color={conf.color} />
                <Text style={[styles.confText, { color: conf.color }]}>{conf.text}</Text>
              </View>
            </View>
          );
        })}

        {/* 建议 */}
        <Text style={styles.sectionTitle}>整理建议</Text>
        {result.suggestions.map((suggestion) => (
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
            <Text style={styles.suggestionContent} numberOfLines={2}>{suggestion.content}</Text>
            <View style={styles.suggestionMeta}>
              <View style={styles.metaItem}>
                <MaterialIcons name="timer" size={14} color={colors.onSurfaceVariant} />
                <Text style={styles.metaText}>{suggestion.time_cost}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialIcons name="star" size={14} color={colors.warmAmber} />
                <Text style={styles.metaText}>
                  {suggestion.difficulty === 'easy' ? '简单' : '中等'}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialIcons name="inventory-2" size={14} color={colors.onSurfaceVariant} />
                <Text style={styles.metaText}>
                  {suggestion.items_needed.length === 0 ? '零成本' : suggestion.items_needed.join(', ')}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.outline} style={{ marginLeft: 'auto' }} />
            </View>
          </TouchableOpacity>
        ))}

        {/* 氛围提示 */}
        {result.lighting === 'dim' && (
          <View style={styles.ambianceTip}>
            <MaterialIcons name="lightbulb" size={18} color={colors.warmAmber} />
            <Text style={styles.ambianceText}>拉开窗帘，打开主灯，房间会显得更宽敞</Text>
          </View>
        )}

        {/* 重新扫描 */}
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => { reset(); router.replace('/camera'); }}
          activeOpacity={0.8}
        >
          <MaterialIcons name="refresh" size={20} color={colors.onPrimary} />
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

  // 评分
  scoreSection: { alignItems: 'center', marginBottom: spacing.lg },
  scoreSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    marginTop: spacing.md,
  },

  // 纠错
  correctionButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.warmAmber + '18',
    borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1, borderColor: colors.warmAmber + '40',
  },
  correctionText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface, flex: 1,
  },

  // 区块标题
  sectionTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },

  // 杂物卡片
  clutterCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.paperWhite, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm,
    ...shadows.card,
  },
  clutterLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  clutterIconWrap: {
    width: 36, height: 36, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
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
  confBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: radius.full,
  },
  confText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.labelCaps.fontSize },

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
    color: colors.onSurface, flex: 1,
  },
  suggestionContent: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    lineHeight: 22, marginBottom: spacing.sm,
  },
  suggestionMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },

  // 氛围
  ambianceTip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.warmAmber + '12',
    borderRadius: radius.lg, padding: spacing.md,
    gap: spacing.sm, marginBottom: spacing.md,
  },
  ambianceText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant, flex: 1,
  },

  // 重新扫描
  rescanButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, borderRadius: radius.full,
    padding: spacing.md, marginTop: spacing.md, gap: spacing.sm,
  },
  rescanText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onPrimary,
  },
});
