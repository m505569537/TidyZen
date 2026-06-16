import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../constants/theme';

interface ScoreGaugeProps {
  score: number; // 0-100
  size?: 'normal' | 'large';
}

export function ScoreGauge({ score, size = 'normal' }: ScoreGaugeProps) {
  const getScoreColor = (s: number) => {
    if (s >= 70) return colors.healingGreen;
    if (s >= 40) return colors.warmAmber;
    return colors.error;
  };

  const isLarge = size === 'large';
  const diameter = isLarge ? 160 : 100;
  const strokeWidth = isLarge ? 10 : 6;
  const gapAngle = 60; // 底部缺口角度
  const scoreColor = getScoreColor(score);

  // 使用多个扇形片段模拟进度环
  const segments = 24;
  const filledCount = Math.round((score / 100) * segments);

  return (
    <View style={styles.container}>
      <View style={[styles.ringContainer, { width: diameter, height: diameter }]}>
        {/* 背景环 - 用圆环模拟 */}
        <View style={[
          styles.bgRing,
          {
            width: diameter, height: diameter,
            borderRadius: diameter / 2,
            borderWidth: strokeWidth,
            borderColor: colors.outlineVariant + '40',
          },
        ]} />

        {/* 进度环 - 用边框模拟 */}
        <View style={[
          styles.progressRing,
          {
            width: diameter, height: diameter,
            borderRadius: diameter / 2,
            borderWidth: strokeWidth,
            borderColor: scoreColor,
            borderTopColor: score >= 25 ? scoreColor : 'transparent',
            borderRightColor: score >= 50 ? scoreColor : 'transparent',
            borderBottomColor: score >= 75 ? scoreColor : 'transparent',
            borderLeftColor: score >= 100 ? scoreColor : 'transparent',
            transform: [{ rotate: '-45deg' }],
          },
        ]} />

        {/* 分数 */}
        <View style={styles.scoreInner}>
          <Text style={[
            styles.scoreText,
            { color: scoreColor, fontSize: isLarge ? 56 : 36 },
          ]}>
            {score}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  ringContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  bgRing: { position: 'absolute' },
  progressRing: { position: 'absolute' },
  scoreInner: { alignItems: 'center', justifyContent: 'center' },
  scoreText: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },
});
