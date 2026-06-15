import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';

export default function VideoScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>视频教程</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.videoContainer}>
        <View style={styles.videoPlaceholder}>
          <MaterialIcons name="play-circle" size={64} color={colors.paperWhite} />
          <Text style={styles.videoHint}>15秒短视频教程</Text>
          <Text style={styles.videoSubHint}>离线可播放</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>椅子急救法 - 演示视频</Text>
        <Text style={styles.infoDesc}>跟着视频一步步操作，3分钟内让椅子恢复整洁。</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.pageMargin, paddingVertical: spacing.md },
  title: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.headlineMd.fontSize, color: colors.onSurface },
  videoContainer: { width: '100%', aspectRatio: 9 / 16, maxHeight: 400, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center', borderRadius: radius.lg, overflow: 'hidden', marginHorizontal: spacing.pageMargin },
  videoPlaceholder: { alignItems: 'center', gap: spacing.sm },
  videoHint: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyLg.fontSize, color: colors.paperWhite },
  videoSubHint: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.outlineVariant },
  info: { padding: spacing.pageMargin, gap: spacing.xs },
  infoTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.headlineMd.fontSize, color: colors.onSurface },
  infoDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant, lineHeight: 24 },
});
