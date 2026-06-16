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

          {/* 图片底部信息条：半透明白色 */}
          <View style={styles.photoInfoBar}>
            <View style={styles.photoInfoLeft}>
              <MaterialIcons name="search" size={16} color={colors.onSurfaceVariant} />
              <Text style={styles.photoInfoText}>
                发现 {result.clutterItems.length} 处可优化区域
              </Text>
            </View>
            <View style={styles.photoInfoPill}>
              <MaterialIcons name="timer" size={14} color={colors.onSurfaceVariant} />
              <Text style={styles.photoInfoPillText}>耗时约 5 分钟</Text>
            </View>
          </View>
        </View>

        {/* ── 纠错按钮：金色背景 (#FFC940) ── */}
        {result.needsCorrection && (
          <TouchableOpacity
            style={styles.correctionBtn}
            onPress={() => { setCorrecting(); router.push('/correction'); }}
            activeOpacity={0.8}
          >
            <MaterialIcons name="touch-app" size={20} color={colors.onSurface} />
            <Text style={styles.correctionText}>识别不准？点这里手动选择场景</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.onSurface} />
          </TouchableOpacity>
        )}

        {/* ── 优化清单 ── */}
        <Text style={styles.sectionTitle}>优化清单</Text>
        {result.suggestions.map((suggestion, index) => {
          const isHighConfidence = index === 0 || (result.clutterItems[0]?.confidence ?? 0) >= 0.8;
          return (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.optimizationCard}
              onPress={() => router.push(`/detail/${suggestion.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.optRow}>
                {/* 左侧图标：圆形 40x40 */}
                <View style={[
                  styles.optIcon,
                  {
                    backgroundColor: suggestion.type === 'must_do'
                      ? '#E8F5E9'
                      : '#FFF3E0',
                  },
                ]}>
                  <MaterialIcons
                    name={suggestion.type === 'must_do' ? 'priority-high' : 'checklist'}
                    size={20}
                    color={suggestion.type === 'must_do' ? colors.primary : colors.warmAmber}
                  />
                </View>

                {/* 标题 + 标签行 */}
                <View style={styles.optInfo}>
                  <Text style={styles.optTitle}>{suggestion.title}</Text>
                  <View style={styles.optTags}>
                    {/* 必做/备选 pill */}
                    <View style={[
                      styles.typePill,
                      {
                        backgroundColor: suggestion.type === 'must_do'
                          ? '#FFEBEE'
                          : colors.surfaceContainer,
                      },
                    ]}>
                      <Text style={[
                        styles.typePillText,
                        {
                          color: suggestion.type === 'must_do'
                            ? '#D32F2F'
                            : colors.onSurfaceVariant,
                        },
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
                    {/* 置信度标签 */}
                    <ConfidenceBadge confidence={isHighConfidence ? 0.92 : 0.65} />
                  </View>
                </View>

                <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* ── 氛围提示：独立卡片（浅蓝色背景） + 标题 ── */}
        {result.lighting === 'dim' && (
          <View style={styles.ambianceCard}>
            <Text style={styles.ambianceTitle}>氛围提示：黄金比例法</Text>
            <View style={styles.ambianceRow}>
              <View style={styles.ambianceIconWrap}>
                <MaterialIcons name="lightbulb" size={20} color={colors.warmAmber} />
              </View>
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
  // 图片底部信息条
  photoInfoBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  photoInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  photoInfoText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  photoInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  photoInfoPillText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },

  // ── 纠错按钮（金色 #FFC940） ──
  correctionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC940',
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  correctionText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    flex: 1,
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
    marginBottom: spacing.sm + 4,
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
    borderRadius: 20,
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
    paddingVertical: 3,
    borderRadius: 6,
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

  // ── 氛围提示（浅蓝色独立卡片 + 标题） ──
  ambianceCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  ambianceTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  ambianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ambianceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambianceText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 22,
  },

  // ── 底部按钮 ──
  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
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
