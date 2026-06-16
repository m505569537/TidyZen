import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Button } from '../../components';
import { BoundingBox } from '../../components/BoundingBox';
import { useAnalysisStore } from '../../stores/analysis';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const photoUri = useAnalysisStore((s) => s.photoUri);
  const result = useAnalysisStore((s) => s.result);

  const suggestion = {
    title: '椅子急救法',
    type: 'must_do' as const,
    difficulty: 'easy' as const,
    time_cost: '3分钟',
    items_needed: [] as string[],
    expected_effect: '视觉整洁度+40%',
    content: '1. 穿过的衣服全部挂进衣柜（哪怕只是挂着）\n2. 干净衣服叠成方块竖放（像摆书一样）\n3. 脏衣服直接踢进洗衣篮',
    acceptance_criteria: '椅子和床单露出 80% 原色',
    video_id: id,
  };

  const steps = suggestion.content.split('\n').filter(Boolean);

  // Demo bounding boxes for the photo overlay
  const demoBoxes: Array<{ bbox: [number, number, number, number]; label: string; color: string }> = [
    { bbox: [0.12, 0.28, 0.25, 0.2], label: '衣物', color: '#A5D6A7' },
    { bbox: [0.5, 0.22, 0.22, 0.22], label: '纸箱', color: '#90CAF9' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>分析详情</Text>
        <TouchableOpacity style={styles.backBtn}>
          <MaterialIcons name="info-outline" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 实景结果展示区 */}
        <View style={styles.photoCard}>
          <View style={styles.photoContainer}>
            {photoUri ? (
              <>
                <Image source={{ uri: photoUri }} style={styles.photoImage} />
                {/* 叠加彩色标注框 */}
                {demoBoxes.map((box, i) => (
                  <BoundingBox
                    key={i}
                    bbox={box.bbox}
                    label={box.label}
                    containerWidth={300}
                    containerHeight={220}
                    color={box.color}
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
              发现 {result?.clutterItems.length ?? 2} 处可优化区域
            </Text>
            <Text style={styles.statsDivider}>·</Text>
            <Text style={styles.statsText}>
              耗时约 {suggestion.time_cost}
            </Text>
          </View>
        </View>

        {/* 优化清单标题 */}
        <Text style={styles.sectionTitle}>优化清单</Text>

        {/* 优化任务列表 */}
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

            {/* 中间内容 */}
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>
                {index === 0 ? '衣物归类' : '纸箱处理'}
              </Text>
              <View style={styles.taskTags}>
                <View style={[styles.taskTag, { backgroundColor: '#FFE0E0' }]}>
                  <Text style={[styles.taskTagText, { color: '#D32F2F' }]}>必做</Text>
                </View>
                <View style={[styles.taskTag, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.taskTagText, { color: '#388E3C' }]}>整理贴士</Text>
                </View>
                <MaterialIcons name="star" size={14} color={colors.warmAmber} />
              </View>
            </View>

            {/* 右侧箭头 */}
            <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
          </View>
        ))}

        {/* 氛围提示卡片 */}
        <View style={styles.ambianceCard}>
          <View style={styles.ambianceIconWrap}>
            <MaterialIcons name="lightbulb" size={22} color={colors.softBlue} />
          </View>
          <View style={styles.ambianceContent}>
            <Text style={styles.ambianceTitle}>氛围提示</Text>
            <Text style={styles.ambianceDesc}>
              拉开窗帘，打开主灯，房间会显得更宽敞明亮
            </Text>
          </View>
        </View>

        {/* 视频教程入口 */}
        {suggestion.video_id && (
          <Button
            title="查看视频教程（15秒）"
            onPress={() => router.push(`/video/${suggestion.video_id}`)}
            variant="outline"
            icon={<MaterialIcons name="play-circle" size={22} color={colors.primary} />}
          />
        )}

        {/* 重新扫描按钮 */}
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => {
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
});
