import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';
import { useAnalysisStore } from '../stores/analysis';
import { analyzeImage } from '../services/ai';

export default function AnalyzingScreen() {
  const { photoBase64, setResult } = useAnalysisStore();

  useEffect(() => {
    if (!photoBase64) {
      router.replace('/camera');
      return;
    }

    const runAnalysis = async () => {
      try {
        const result = await analyzeImage(photoBase64);
        // 把照片 URI 附到结果上
        result.photoUri = useAnalysisStore.getState().photoUri ?? '';
        setResult(result);
        router.replace('/result');
      } catch {
        // 分析失败，返回拍照页重试
        router.replace('/camera');
      }
    };

    const timer = setTimeout(runAnalysis, 1500);
    return () => clearTimeout(timer);
  }, [photoBase64, setResult]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 进度环 */}
        <View style={styles.ringOuter}>
          <View style={styles.ringInner}>
            <Text style={styles.percentText}>...</Text>
          </View>
        </View>

        <Text style={styles.mainText}>AI 正在分析你的房间...</Text>
        <Text style={styles.subText}>预计还需 3-5 秒</Text>
      </View>

      {/* 底部隐私提示 */}
      <View style={styles.privacyFooter}>
        <MaterialIcons name="verified-user" size={16} color={colors.onSurfaceVariant} />
        <Text style={styles.privacyText}>隐私保护：照片分析后不会保存在云端</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  content: { alignItems: 'center', gap: spacing.lg },
  ringOuter: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 4, borderColor: colors.outlineVariant,
    alignItems: 'center', justifyContent: 'center',
  },
  ringInner: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 4, borderColor: colors.primary,
    borderTopColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
  },
  percentText: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: typography.headlineLg.fontSize,
    color: colors.primary,
  },
  mainText: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface, marginTop: spacing.md,
  },
  subText: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  privacyFooter: {
    position: 'absolute', bottom: 40,
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
  },
  privacyText: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },
});
