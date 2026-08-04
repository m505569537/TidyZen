import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { useAnalysisStore } from '../../stores/analysis';

// 视频资源映射（预留，待接入真实视频文件）
const VIDEO_MAP: Record<string, { title: string; subtitle: string; description: string }> = {
  'S01-A01': { title: '椅子急救法', subtitle: '15秒快速折叠演示', description: '穿过的衣服全部挂进衣柜，干净衣服叠成方块竖放。' },
  'S01-A02': { title: '临时衣架墙', subtitle: '门后挂钩妙用', description: '在门后贴两个挂钩，常穿外套挂上去。' },
  'S02-A01': { title: '压扁隐身法', subtitle: '纸箱快速处理', description: '撕掉胶带，踩扁箱子，塞进沙发底/床底。' },
  'S02-A02': { title: '抽屉分割器', subtitle: '纸板变收纳格', description: '剪开侧面纸板，折成"田字格"放入抽屉。' },
  'S03-A01': { title: '托盘归集法', subtitle: '零碎物品归集', description: '找一个大托盘，把所有零碎全堆在上面。' },
  'S03-A02': { title: '书本护栏法', subtitle: '桌面分区技巧', description: '用厚字典将桌面物品隔在墙边。' },
  'S04-A01': { title: '踢角法', subtitle: '地面快速清理', description: '地上东西全部踢到房间最不起眼的角落。' },
  'S04-A02': { title: '鞋尖朝外', subtitle: '鞋子排列技巧', description: '门口鞋子统一鞋尖朝外，排成一列。' },
  'S05-A01': { title: '豆腐块平铺法', subtitle: '床铺整理技巧', description: '抓起被子抖一下，三边对齐床沿铺平。' },
  'S05-A02': { title: '遮丑大法', subtitle: '快速铺床技巧', description: '找大浴巾/床单盖住乱堆被褥，拉平四角。' },
  'S06-A01': { title: '长尾夹理线', subtitle: '桌面理线技巧', description: '找废旧长尾夹，夹在桌子边缘，多余电线卷起穿过。' },
  'S06-A02': { title: '纸巾盒收纳', subtitle: '插线板隐藏术', description: '插线板放进空纸巾盒，只露插头。' },
  'S07-A01': { title: '靠墙排队法', subtitle: '瓶子排列技巧', description: '瓶子全部拧好盖子，统一靠墙排直线。' },
  'S07-A02': { title: '牙刷入杯', subtitle: '洗漱台整理', description: '牙刷头朝上入杯，杯底擦干。' },
  'S08-A01': { title: '打包带走法', subtitle: '垃圾快速清理', description: '垃圾塞进最大袋子，系紧袋口，放到门口。' },
  'S08-A02': { title: '清空桌面', subtitle: '油渍清理技巧', description: '用湿纸巾擦一遍桌面油渍，外卖盒全部扔掉。' },
  'S09-A01': { title: '书脊朝外', subtitle: '书籍排列技巧', description: '书全部立起来，书脊朝外，最高放两边。' },
  'S09-A02': { title: '杂志筐替代', subtitle: '纸箱变书架', description: '快递纸箱立着放书，挡住书脊，变废为宝。' },
  'S10-A01': { title: '黄金比例法', subtitle: '光线优化技巧', description: '窗帘拉开到窗户宽度的 2/3，打开主灯。' },
  'S10-A02': { title: '床铺采光', subtitle: '自然光利用', description: '枕头移到靠窗侧，让阳光照床。' },
};

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const videoHeight = width * 0.6;

  // 从分析结果里查找当前建议
  const result = useAnalysisStore((s) => s.result);
  const suggestion = result?.suggestions.find((s) => s.video_id === id);

  // 获取视频信息（优先从 VIDEO_MAP，其次从 suggestion）
  const videoInfo = VIDEO_MAP[id ?? ''] || (suggestion ? {
    title: suggestion.title,
    subtitle: '视频教程',
    description: suggestion.content.split('\n')[0] || '',
  } : null);

  // 视频是否已接入（目前都是占位符，未接入真实视频）
  const hasVideo = false; // TODO: 接入真实视频后改为 true

  return (
    <View style={styles.container}>
      {/* 视频区域 - 占屏幕上半部分 */}
      <View style={[styles.videoContainer, { height: videoHeight }]}>
        {/* 左上角关闭按钮 */}
        <SafeAreaView edges={['top']}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="close" size={20} color={colors.paperWhite} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* 视频占位符或播放按钮 */}
        {hasVideo ? (
          <View style={styles.playButton}>
            <View style={styles.playButtonInner}>
              <MaterialIcons name="play-arrow" size={36} color={colors.paperWhite} />
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <MaterialCommunityIcons name="video-outline" size={48} color="rgba(255,255,255,0.5)" />
            <Text style={styles.placeholderText}>视频即将上线</Text>
            <Text style={styles.placeholderSubtext}>文字步骤已展示在下方</Text>
          </View>
        )}
      </View>

      {/* 信息区 - 改为可滚动 */}
      <ScrollView
        style={styles.infoSection}
        contentContainerStyle={styles.infoContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 标签行 */}
        <View style={styles.tagRow}>
          <View style={[styles.tag, { backgroundColor: hasVideo ? '#4CAF50' : '#FF9800' }]}>
            <Text style={styles.tagText}>{hasVideo ? '15s Demo' : '图文步骤'}</Text>
          </View>
          {suggestion && (
            <View style={[styles.tag, { backgroundColor: suggestion.type === 'must_do' ? '#F44336' : '#9E9E9E' }]}>
              <Text style={styles.tagText}>{suggestion.type === 'must_do' ? '必做' : '备选'}</Text>
            </View>
          )}
        </View>

        {/* 标题 */}
        <Text style={styles.title}>{videoInfo?.title || '视频教程'}</Text>
        <Text style={styles.subtitle}>{videoInfo?.subtitle || '整理技巧演示'}</Text>

        {/* 描述 */}
        <Text style={styles.description}>
          {videoInfo?.description || '视频正在录制中，完成后将自动上线。'}
        </Text>

        {/* 操作步骤 - S5 升级：把"视频占位"补上文字步骤 */}
        {suggestion && (() => {
          const steps = suggestion.content.split('\n').filter(Boolean);
          if (steps.length === 0) return null;
          return (
            <View style={styles.stepsCard}>
              <View style={styles.stepsHeader}>
                <MaterialIcons name="format-list-numbered" size={20} color={colors.primary} />
                <Text style={styles.stepsTitle}>操作步骤</Text>
                <Text style={styles.stepsCount}>{steps.length} 步</Text>
              </View>
              {steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          );
        })()}

        {/* 验收标准 - 复用 suggestion.acceptance_criteria */}
        {suggestion?.acceptance_criteria && (
          <View style={styles.criteriaCard}>
            <View style={styles.criteriaIconWrap}>
              <MaterialIcons name="check-circle" size={20} color={colors.primary} />
            </View>
            <View style={styles.criteriaContent}>
              <Text style={styles.criteriaTitle}>完成标准</Text>
              <Text style={styles.criteriaDesc}>{suggestion.acceptance_criteria}</Text>
            </View>
          </View>
        )}

        {/* 提示信息 */}
        {!hasVideo && (
          <View style={styles.noticeCard}>
            <MaterialIcons name="info-outline" size={18} color={colors.primary} />
            <Text style={styles.noticeText}>
              视频教程正在录制中，您可按上方文字步骤操作，效果一致。
            </Text>
          </View>
        )}

        {/* 底部控制 */}
        <View style={styles.controls}>
          {/* 返回按钮 */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="arrow-back" size={20} color={colors.paperWhite} />
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>

          {/* 我已学会按钮 */}
          <TouchableOpacity
            style={styles.learnedButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="check" size={20} color={colors.paperWhite} />
            <Text style={styles.learnedText}>我已学会</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // 视频区
  videoContainer: {
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  placeholderText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
  },
  placeholderSubtext: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },

  // 信息区
  infoSection: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  infoContent: {
    padding: spacing.pageMargin,
    paddingBottom: 40,
    gap: spacing.md,
  },

  // 标签
  tagRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  tagText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 13,
    color: colors.paperWhite,
  },

  // 标题区
  title: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 24,
    color: colors.onSurface,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 16,
    color: colors.onSurface,
  },
  description: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },

  // 提示卡片
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  noticeText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },

  // 操作步骤卡片（S5 新增）
  stepsCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '40',
  },
  stepsTitle: {
    flex: 1,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 16,
    color: colors.onSurface,
  },
  stepsCount: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryContainer + '60',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 13,
    color: colors.primary,
  },
  stepText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: colors.onSurface,
    lineHeight: 22,
  },

  // 验收标准卡片（S5 新增）
  criteriaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E6F7F0',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  criteriaIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryContainer + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  criteriaContent: {
    flex: 1,
    gap: 2,
  },
  criteriaTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 14,
    color: colors.onSurface,
  },
  criteriaDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },

  // 底部控制
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#616161',
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  backText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.paperWhite,
  },
  learnedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  learnedText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.paperWhite,
  },
});
