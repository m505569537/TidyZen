import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';
import { useAnalysisStore } from '../stores/analysis';
import { analyzeImage } from '../services/ai';

export default function AnalyzingScreen() {
  const { photoBase64, setResult } = useAnalysisStore();
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, [spinAnim]);

  useEffect(() => {
    if (!photoBase64) {
      router.replace('/camera');
      return;
    }

    const runAnalysis = async () => {
      try {
        const result = await analyzeImage(photoBase64);
        result.photoUri = useAnalysisStore.getState().photoUri ?? '';
        setResult(result);
        router.replace('/result');
      } catch {
        router.replace('/camera');
      }
    };

    const timer = setTimeout(runAnalysis, 2000);
    return () => clearTimeout(timer);
  }, [photoBase64, setResult]);

  const rotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 旋转加载环 */}
        <View style={styles.ringOuter}>
          <Animated.View style={[styles.ringSpinner, { transform: [{ rotate: rotation }] }]} />
          <View style={styles.ringInner}>
            <MaterialIcons name="auto-awesome" size={32} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.mainText}>AI 正在分析你的房间</Text>
        <Text style={styles.subText}>识别杂物类型与整洁度...</Text>

        {/* 分析步骤提示 */}
        <View style={styles.stepsRow}>
          <View style={styles.stepItem}>
            <MaterialIcons name="check-circle" size={16} color={colors.healingGreen} />
            <Text style={styles.stepText}>照片已接收</Text>
          </View>
          <View style={styles.stepDot} />
          <View style={styles.stepItem}>
            <MaterialIcons name="radio-button-checked" size={16} color={colors.primary} />
            <Text style={[styles.stepText, { color: colors.primary }]}>AI 分析中</Text>
          </View>
          <View style={styles.stepDot} />
          <View style={styles.stepItem}>
            <MaterialIcons name="radio-button-unchecked" size={16} color={colors.outlineVariant} />
            <Text style={styles.stepText}>生成建议</Text>
          </View>
        </View>
      </View>

      {/* 底部隐私提示 */}
      <View style={styles.privacyFooter}>
        <MaterialIcons name="verified-user" size={16} color={colors.onSurfaceVariant} />
        <Text style={styles.privacyText}>照片分析后不会保存在云端</Text>
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

  // 加载环
  ringOuter: {
    width: 120, height: 120, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  ringSpinner: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: radius.full,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: colors.primaryContainer,
  },
  ringInner: {
    width: 88, height: 88, borderRadius: radius.full,
    backgroundColor: colors.primaryContainer + '30',
    alignItems: 'center', justifyContent: 'center',
  },

  // 文字
  mainText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
    marginTop: spacing.md,
  },
  subText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },

  // 步骤
  stepsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: spacing.lg, gap: spacing.sm,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },
  stepDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: colors.outlineVariant,
  },

  // 隐私
  privacyFooter: {
    position: 'absolute', bottom: 48,
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
  },
  privacyText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },
});
