import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../constants/theme';

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
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / 100, 1);
  const dashOffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={[styles.ringContainer, { width: diameter, height: diameter }]}>
        {/* Background circle */}
        <View
          style={[
            styles.circle,
            {
              width: diameter,
              height: diameter,
              borderRadius: diameter / 2,
              borderWidth: strokeWidth,
              borderColor: colors.outlineVariant,
            },
          ]}
        />
        {/* Progress arc - simplified as a colored inner circle for MVP */}
        <View
          style={[
            styles.circle,
            {
              width: diameter,
              height: diameter,
              borderRadius: diameter / 2,
              borderWidth: strokeWidth,
              borderColor: getScoreColor(score),
              // For MVP, use a simple approach: rotate and clip
            },
          ]}
        />
        <View style={styles.scoreInner}>
          <Text
            style={[
              styles.scoreText,
              { color: getScoreColor(score), fontSize: isLarge ? 56 : 36 },
            ]}
          >
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
  circle: { position: 'absolute' },
  scoreInner: { alignItems: 'center', justifyContent: 'center' },
  scoreText: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },
});
