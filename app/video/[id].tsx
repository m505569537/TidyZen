import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors, typography, spacing, radius } from '../../constants/theme';

export default function VideoScreen() {
  const { width } = useWindowDimensions();
  const videoHeight = width * 0.6;
  const [progress, setProgress] = useState(0.35); // demo: 35% played

  return (
    <View style={styles.container}>
      {/* 视频区域 - 占屏幕上半部分 */}
      <View style={[styles.videoContainer, { height: videoHeight }]}>
        {/* 左上角关闭按钮 */}
        <SafeAreaView edges={['top']}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <MaterialIcons name="close" size={20} color={colors.paperWhite} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* 播放按钮 */}
        <View style={styles.playButton}>
          <View style={styles.playButtonInner}>
            <MaterialIcons name="play-arrow" size={36} color={colors.paperWhite} />
          </View>
        </View>
      </View>

      {/* 信息区 */}
      <View style={styles.infoSection}>
        {/* 标签行 */}
        <View style={styles.tagRow}>
          <View style={[styles.tag, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.tagText}>15s Demo</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: '#9E9E9E' }]}>
            <Text style={styles.tagText}>Must Do</Text>
          </View>
        </View>

        {/* 标题 */}
        <Text style={styles.title}>椅子急救法</Text>
        <Text style={styles.subtitle}>15秒快速折叠演示</Text>

        {/* 描述 */}
        <Text style={styles.description}>
          穿过的衣服全部挂进衣柜，干净衣服叠成方块竖放。
        </Text>

        {/* 进度条 */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        {/* 底部控制 */}
        <View style={styles.controls}>
          {/* 暂停按钮 */}
          <TouchableOpacity style={styles.pauseButton} activeOpacity={0.7}>
            <MaterialIcons name="pause" size={22} color={colors.paperWhite} />
          </TouchableOpacity>

          {/* 我已学会按钮 */}
          <TouchableOpacity
            style={styles.learnedButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <MaterialIcons name="check" size={20} color={colors.paperWhite} />
            <Text style={styles.learnedText}>我已学会</Text>
          </TouchableOpacity>
        </View>
      </View>
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

  // 信息区
  infoSection: {
    flex: 1,
    padding: spacing.pageMargin,
    justifyContent: 'center',
    gap: spacing.sm,
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

  // 进度条
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },

  // 底部控制
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  pauseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#616161',
    alignItems: 'center',
    justifyContent: 'center',
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
