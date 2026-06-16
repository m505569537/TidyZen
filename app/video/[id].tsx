import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';

export default function VideoScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>视频教程</Text>
        <View style={styles.backBtn} />
      </View>

      {/* 视频播放器 */}
      <View style={styles.videoContainer}>
        <View style={styles.videoPlaceholder}>
          <View style={styles.playButton}>
            <MaterialIcons name="play-arrow" size={40} color={colors.paperWhite} />
          </View>
          <Text style={styles.videoHint}>15秒短视频教程</Text>
          <Text style={styles.videoSubHint}>离线可播放</Text>
        </View>
      </View>

      {/* 视频信息 */}
      <View style={styles.info}>
        <Text style={styles.infoTitle}>椅子急救法 - 演示视频</Text>
        <Text style={styles.infoDesc}>跟着视频一步步操作，3分钟内让椅子恢复整洁。</Text>
        <View style={styles.infoMeta}>
          <View style={styles.metaChip}>
            <MaterialIcons name="timer" size={14} color={colors.onSurfaceVariant} />
            <Text style={styles.metaText}>15秒</Text>
          </View>
          <View style={styles.metaChip}>
            <MaterialIcons name="download" size={14} color={colors.onSurfaceVariant} />
            <Text style={styles.metaText}>可离线</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.pageMargin, paddingVertical: spacing.md,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },

  // 视频播放器
  videoContainer: {
    marginHorizontal: spacing.pageMargin,
    aspectRatio: 16 / 9,
    maxHeight: 360,
    backgroundColor: '#1a1a1a',
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    ...shadows.card,
  },
  videoPlaceholder: { alignItems: 'center', gap: spacing.sm },
  playButton: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  videoHint: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.paperWhite,
  },
  videoSubHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.outlineVariant,
  },

  // 信息
  info: { padding: spacing.pageMargin, gap: spacing.sm },
  infoTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },
  infoDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },
  infoMeta: {
    flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm,
  },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: spacing.sm + 4, paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  metaText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },
});
