import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';
import { useAnalysisStore } from '../stores/analysis';
import { analyzeImage } from '../services/ai';

export default function AnalyzingScreen() {
  const { photoBase64, setResult } = useAnalysisStore();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [percentage, setPercentage] = useState(0);

  // Progress animation: 0% -> 100% over ~3 seconds, looping
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 100,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]),
    );
    anim.start();

    // Update percentage display
    const listener = progressAnim.addListener(({ value }) => {
      setPercentage(Math.round(value));
    });

    return () => {
      anim.stop();
      progressAnim.removeListener(listener);
    };
  }, [progressAnim]);

  // Actual AI analysis
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

  // Interpolate ring rotation for the dashed/dotted progress effect
  const ringRotation = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* 品牌标识 */}
      <View style={styles.brandRow}>
        <Text style={styles.brandText}>TidyZen AI</Text>
      </View>

      {/* 主体内容居中 */}
      <View style={styles.content}>
        {/* 圆形进度面板 */}
        <View style={styles.progressPanel}>
          {/* 轨道环 - 薄荷淡绿实心 */}
          <View style={styles.trackRing} />

          {/* 进度环 - 虚线圆环效果 */}
          <Animated.View
            style={[
              styles.progressRing,
              { transform: [{ rotate: ringRotation }] },
            ]}
          />

          {/* 百分比数字 */}
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
        </View>

        {/* 状态文字 */}
        <Text style={styles.mainText}>AI 正在分析你的房间...</Text>
        <Text style={styles.subText}>预计还需 3-5 秒</Text>
      </View>

      {/* 底部隐私提示 */}
      <View style={styles.privacyFooter}>
        <MaterialIcons name="verified-user" size={16} color={colors.onSurfaceVariant} />
        <Text style={styles.privacyText}>所有数据均端到端加密</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8DDD5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 品牌
  brandRow: {
    position: 'absolute',
    top: 60,
    left: spacing.pageMargin,
  },
  brandText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurface,
    opacity: 0.7,
  },

  // 主体内容
  content: {
    alignItems: 'center',
    gap: spacing.lg,
  },

  // 进度面板
  progressPanel: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.paperWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  trackRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: '#b1f0ce',
  },
  progressRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: colors.primaryDark,
    borderRightColor: colors.primary,
  },
  percentageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: 40,
    color: colors.primaryDark,
    lineHeight: 48,
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
    opacity: 0.7,
  },

  // 底部隐私提示
  privacyFooter: {
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  privacyText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    opacity: 0.7,
  },
});
