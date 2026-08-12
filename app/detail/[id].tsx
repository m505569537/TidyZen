import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Button } from '../../components';
import { BoundingBox } from '../../components/BoundingBox';
import { useAnalysisStore } from '../../stores/analysis';
import { analytics } from '../../services/analytics';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const photoUri = useAnalysisStore((s) => s.photoUri);
  const result = useAnalysisStore((s) => s.result);
  const [photoSize, setPhotoSize] = useState({ width: 0, height: 0 });

  // 从分析结果里查找当前建议；如果丢失（比如冷启动直接进详情页）
  // 给一个回退提示并允许返回。
  const suggestion = result?.suggestions.find((s) => s.id === id);

  if (!suggestion) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>分析详情</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="search-off" size={48} color={colors.outlineVariant} />
          <Text style={styles.emptyTitle}>未找到该建议</Text>
          <Text style={styles.emptyDesc}>请重新拍照分析后再查看详情。</Text>
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => {
              useAnalysisStore.getState().reset();
              router.replace('/(tabs)/scan');
            }}
            activeOpacity={0.8}
          >
            <MaterialIcons name="refresh" size={20} color={colors.onPrimary} />
            <Text style={styles.rescanText}>重新扫描</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const steps = suggestion.content.split('\n').filter(Boolean);
  const clutterItems = result?.clutterItems ?? [];

  // bbox 颜色：高置信度绿色，低置信度琥珀色——与 result 页保持一致
  const getBoxColor = (confidence: number) =>
    confidence >= 0.8 ? colors.healingGreen : colors.warmAmber;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>分析详情</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => Alert.alert('功能开发中', '「info」功能正在开发中，预计 v1.1 上线。') }>
          <MaterialIcons name="info-outline" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 实景结果展示区 */}
        <View style={styles.photoCard}>
          <View
            style={styles.photoContainer}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setPhotoSize({ width, height });
            }}
          >
            {photoUri ? (
              <>
                <Image source={{ uri: photoUri }} style={styles.photoImage} />
                {/* 用真实的 clutterItems 叠加标注框（等容器拿到尺寸后再渲染，否则比例会错） */}
                {photoSize.width > 0 &&
                  clutterItems.map((item, i) => (
                    <BoundingBox
                      key={i}
                      bbox={item.bbox}
                      label={item.display_name}
                      containerWidth={photoSize.width}
                      containerHeight={photoSize.height}
                      color={getBoxColor(item.confidence)}
                    />
                  ))}
              </>
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialIcons name="image" size={48} color={colors.outlineVariant} />
                <Text style={styles.photoPlaceholderText}>暂无实景照片</Text>
              </View>
            )}
          </View>

          {/* 统计提示条 */}
          <View style={styles.statsBar}>
            <Text style={styles.statsText}>
              发现 {clutterItems.length} 处可优化区域
            </Text>
            <Text style={styles.statsDivider}>·</Text>
            <Text style={styles.statsText}>
              耗时约 {suggestion.time_cost}
            </Text>
          </View>
        </View>

        {/* 当前建议标题（替换原来的硬编码 "椅子急救法"） */}
        <Text style={styles.sectionTitle}>{suggestion.title}</Text>

        {/* 优化任务列表：每一步对应一张卡片 */}
        {steps.map((step, index) => (
          <View key={index} style={styles.taskCard}>
            {/* 左侧图标 */}
            <View style={[
              styles.taskIconWrap,
              { backgroundColor: index === 0 ? colors.primaryContainer + '40' : '#FFF3E0' },
            ]}>
              <MaterialIcons
                name={index === 0 ? 'checkroom' : 'inventory-2'}
                size={22}
                color={index === 0 ? colors.primary : colors.warmAmber}
              />
            </View>

            {/* 中间内容：展示真实的步骤文本 */}
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle} numberOfLines={2}>
                {step}
              </Text>
              <View style={styles.taskTags}>
                <View style={[
                  styles.taskTag,
                  { backgroundColor: suggestion.type === 'must_do' ? '#FFE0E0' : '#E8F5E9' },
                ]}>
                  <Text style={[
                    styles.taskTagText,
                    { color: suggestion.type === 'must_do' ? '#D32F2F' : '#388E3C' },
                  ]}>
                    {suggestion.type === 'must_do' ? '必做' : '备选'}
                  </Text>
                </View>
                <View style={[styles.taskTag, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.taskTagText, { color: '#388E3C' }]}>
                    {suggestion.difficulty === 'easy' ? '简单' : '中等'}
                  </Text>
                </View>
                <MaterialIcons name="star" size={14} color={colors.warmAmber} />
              </View>
            </View>

            {/* 右侧箭头 */}
            <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
          </View>
        ))}

        {/* 验收标准 */}
        {suggestion.acceptance_criteria && (
          <View style={styles.ambianceCard}>
            <View style={styles.ambianceIconWrap}>
              <MaterialIcons name="check-circle" size={22} color={colors.primary} />
            </View>
            <View style={styles.ambianceContent}>
              <Text style={styles.ambianceTitle}>完成标准</Text>
              <Text style={styles.ambianceDesc}>{suggestion.acceptance_criteria}</Text>
            </View>
          </View>
        )}

        {/* 视频教程入口 */}
        {suggestion.video_id && (
          <Button
            title="查看视频教程（15秒）"
            onPress={() => router.push(`/video/${suggestion.video_id}`)}
            variant="outline"
            icon={<MaterialIcons name="play-circle" size={22} color={colors.primary} />}
          />
        )}

        {/* 标记已完成按钮（suggestion_executed 埋点 UI 入口） */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            analytics.suggestionExecuted(suggestion.scenario_id);
            Alert.alert('已记录，继续保持！');
          }}
          activeOpacity={0.8}
        >
          <MaterialIcons name="check-circle" size={20} color={colors.primaryDark} />
          <Text style={styles.doneText}>标记已完成</Text>
        </TouchableOpacity>

        {/* 重新扫描按钮 */}
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => {
            analytics.retakePhoto({});
            useAnalysisStore.getState().reset();
            router.replace('/camera');
          }}
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

  // 顶部导航
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.pageMargin,
    paddingVertical: spacing.md,
    backgroundColor: colors.paperWhite,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },

  scrollContent: {
    padding: spacing.pageMargin,
    paddingBottom: 60,
    gap: spacing.md,
  },

  // 实景照片卡片
  photoCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  photoContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  photoPlaceholderText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainer,
    gap: spacing.sm,
  },
  statsText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },
  statsDivider: {
    color: colors.outlineVariant,
  },

  // 优化清单标题
  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },

  // 优化任务列表
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.card,
  },
  taskIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
    gap: spacing.xs,
  },
  taskTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  taskTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  taskTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  taskTagText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 10,
  },

  // 氛围提示卡片
  ambianceCard: {
    flexDirection: 'row',
    backgroundColor: '#E6F7F0',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  ambianceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A9D6E5' + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambianceContent: {
    flex: 1,
    gap: 2,
  },
  ambianceTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  ambianceDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },

  // 重新扫描按钮
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  rescanText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onPrimary,
  },

  // 标记已完成按钮（outline 风格，与重新扫描按钮区分主次）
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paperWhite,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    borderRadius: radius.full,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  doneText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.primaryDark,
  },

  // 找不到 suggestion 时的空状态
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.pageMargin,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  emptyDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
