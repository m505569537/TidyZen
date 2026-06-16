import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';
import { useAnalysisStore } from '../stores/analysis';
import { BoundingBox, ConfidenceBadge } from '../components';

export default function ResultScreen() {
  const { result, setCorrecting, reset } = useAnalysisStore();
  const [photoSize, setPhotoSize] = useState({ width: 0, height: 0 });

  if (!result) {
    router.replace('/camera');
    return null;
  }

  const getBboxColor = (confidence: number) =>
    confidence >= 0.8 ? colors.healingGreen : colors.warmAmber;

  const getBboxLabel = (confidence: number) =>
    confidence >= 0.8 ? '高置信 ✓' : '可能不太准 ⚠';

  const getScoreColor = (score: number) => {
    if (score >= 70) return colors.healingGreen;
    if (score >= 40) return colors.warmAmber;
    return colors.error;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── 顶部导航栏：返回箭头 + 得分 + 信息图标 ── */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => { reset(); router.replace('/'); }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.scoreLabel}>
            <Text style={styles.scoreLabelPrefix}>整洁得分：</Text>
            <Text style={[styles.scoreLabelValue, { color: getScoreColor(result.score) }]}>
              {result.score}
            </Text>
          </View>
          <TouchableOpacity style={styles.infoBtn}>
            <MaterialIcons name="info-outline" size={22} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* ── 照片 + 边界框叠加 ── */}
        <View
          style={styles.photoWrap}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setPhotoSize({ width, height });
          }}
        >
          <Image source={{ uri: result.photoUri }} style={styles.photo} resizeMode="cover" />
          {photoSize.width > 0 &&
            result.clutterItems.map((item, i) => (
              <BoundingBox
                key={i}
                bbox={item.bbox}
                label={getBboxLabel(item.confidence)}
                containerWidth={photoSize.width}
                containerHeight={photoSize.height}
                color={getBboxColor(item.confidence)}
              />
            ))}
        </View>

        {/* ── 纠错按钮 ── */}
        {result.needsCorrection && (
          <TouchableOpacity
            style={styles.correctionBtn}
            onPress={() => { setCorrecting(); router.push('/correction'); }}
            activeOpacity={0.8}
          >
            <MaterialIcons name="touch-app" size={20} color={colors.onSurface} />
            <Text style={styles.correctionText}>识别不准？手动选择场景</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}

        {/* ── 摘要栏：灰色背景 ── */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <MaterialIcons name="search" size={16} color={colors.onSurfaceVariant} />
            <Text style={styles.summaryText}>
              发现 {result.clutterItems.length} 处可优化区域
            </Text>
          </View>
          <View style={styles.summaryPill}>
            <MaterialIcons name="timer" size={14} color={colors.onSurfaceVariant} />
            <Text style={styles.summaryPillText}>耗时约 5 分钟</Text>
          </View>
        </View>

        {/* ── 优化清单 ── */}
        <Text style={styles.sectionTitle}>优化清单</Text>
        {result.suggestions.map((suggestion, index) => {
          const isLast = index === result.suggestions.length - 1;
          return (
            <TouchableOpacity
              key={suggestion.id}
              style={[
                styles.optimizationCard,
                isLast && result.lighting === 'dim' && styles.ambianceCard,
              ]}
              onPress={() => router.push(`/detail/${suggestion.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.optRow}>
                {/* 左侧图标 */}
                <View style={[styles.optIcon, { backgroundColor: suggestion.type === 'must_do' ? colors.primary + '18' : colors.outlineVariant + '40' }]}>
                  <MaterialIcons
                    name={suggestion.type === 'must_do' ? 'priority-high' : 'checklist'}
                    size={20}
                    color={suggestion.type === 'must_do' ? colors.primary : colors.onSurfaceVariant}
                  />
                </View>

                {/* 标题 + 标签行 */}
                <View style={styles.optInfo}>
                  <Text style={styles.optTitle}>{suggestion.title}</Text>
                  <View style={styles.optTags}>
                    {/* 必做/备选 pill */}
                    <View style={[
                      styles.typePill,
                      { backgroundColor: suggestion.type === 'must_do' ? colors.primary : colors.surfaceContainer },
                    ]}>
                      <Text style={[
                        styles.typePillText,
                        { color: suggestion.type === 'must_do' ? colors.onPrimary : colors.onSurfaceVariant },
                      ]}>
                        {suggestion.type === 'must_do' ? '必做' : '备选'}
                      </Text>
                    </View>
                    {/* 难度 star */}
                    <View style={styles.tagItem}>
                      <MaterialIcons name="star" size={14} color={colors.warmAmber} />
                      <Text style={styles.tagText}>
                        {suggestion.difficulty === 'easy' ? '简单' : '中等'}
                      </Text>
                    </View>
                    {/* 预估时间 */}
                    <View style={styles.tagItem}>
                      <MaterialIcons name="timer" size={14} color={colors.onSurfaceVariant} />
                      <Text style={styles.tagText}>{suggestion.time_cost}</Text>
                    </View>
                  </View>
                </View>

                <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* ── 氛围提示：独立卡片（浅蓝色背景） ── */}
        {result.lighting === 'dim' && (
          <View style={styles.ambianceCard}>
            <View style={styles.ambianceRow}>
              <MaterialIcons name="lightbulb" size={20} color={colors.warmAmber} />
              <Text style={styles.ambianceText}>拉开窗帘，打开主灯，房间会显得更宽敞</Text>
            </View>
          </View>
        )}

        {/* ── 底部按钮：绿色胶囊 ── */}
        <TouchableOpacity
          style={styles.rescanBtn}
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
  scrollContent: { paddingHorizontal: spacing.pageMargin, paddingBottom: 40 },

  // ── 顶部导航栏 ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  scoreLabel: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreLabelPrefix: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurface,
  },
  scoreLabelValue: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: 28,
    lineHeight: 36,
  },
  infoBtn: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── 照片 ──
  photoWrap: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
    marginBottom: spacing.md,
  },
  photo: {
    width: '100%',
    height: '100%',
  },

  // ── 纠错按钮 ──
  correctionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warmAmber + '18',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warmAmber + '40',
  },
  correctionText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    flex: 1,
  },

  // ── 摘要栏 ──
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.xl,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.paperWhite,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  summaryPillText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },

  // ── 优化清单 ──
  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  optimizationCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  optRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  optIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optInfo: {
    flex: 1,
    gap: 6,
  },
  optTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurface,
  },
  optTags: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  typePillText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.labelCaps.fontSize,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  tagText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },

  // ── 氛围提示（浅蓝色独立卡片） ──
  ambianceCard: {
    backgroundColor: colors.softBlue + '30',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  ambianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ambianceText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    flex: 1,
  },

  // ── 底部按钮 ──
  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  rescanText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onPrimary,
  },
});
