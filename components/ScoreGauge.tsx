import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../constants/theme';

interface ScoreGaugeProps {
  score: number; // 0-100
  size?: 'normal' | 'large';
  /** 动画时长，毫秒。0 表示禁用动画 */
  duration?: number;
}

// 让 react-native-svg 的 Circle 接受 Animated 驱动的 strokeDashoffset
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** 根据分数返回环色：>80 绿、60-80 黄、<60 红 */
function getScoreColor(s: number): string {
  if (s > 80) return colors.healingGreen;
  if (s >= 60) return colors.warmAmber;
  return colors.error;
}

export function ScoreGauge({ score, size = 'normal', duration = 900 }: ScoreGaugeProps) {
  const isLarge = size === 'large';
  const diameter = isLarge ? 160 : 100;
  const strokeWidth = isLarge ? 10 : 6;
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const clamped = Math.max(0, Math.min(100, score));
  const scoreColor = getScoreColor(clamped);

  // 进度动画：0 → clamped/100
  const progress = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (duration <= 0) {
      progress.setValue(clamped / 100);
      setDisplayScore(clamped);
      return;
    }
    const anim = Animated.timing(progress, {
      toValue: clamped / 100,
      duration,
      easing: Easing.out(Easing.cubic),
      // strokeDashoffset 是 SVG prop，不在 native driver 支持列表
      useNativeDriver: false,
    });
    // 同步驱动中间数字：监听 progress 反算分数
    const listenerId = progress.addListener(({ value }) => {
      setDisplayScore(Math.round(value * 100));
    });
    anim.start();
    return () => {
      anim.stop();
      progress.removeListener(listenerId);
    };
  }, [clamped, duration, progress]);

  // strokeDashoffset = circumference * (1 - progress)
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { width: diameter, height: diameter }]}>
      <Svg width={diameter} height={diameter}>
        {/* 背景环 */}
        <Circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={colors.outlineVariant + '40'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 前景动画环：旋转 -90° 让起点位于顶部 */}
        <AnimatedCircle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          rotation={-90}
          originX={diameter / 2}
          originY={diameter / 2}
        />
      </Svg>

      {/* 中间分数 */}
      <View style={styles.scoreInner} pointerEvents="none">
        <Text
          style={[
            styles.scoreText,
            { color: scoreColor, fontSize: isLarge ? 56 : 36 },
          ]}
        >
          {displayScore}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreInner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },
});
