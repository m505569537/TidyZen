import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, radius } from '../constants/theme';

interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const isHigh = confidence >= 0.7;
  const isMedium = confidence >= 0.4;
  const icon = isHigh ? 'check-circle' as const : (isMedium ? 'info' as const : 'warning' as const);
  const label = isHigh ? '高置信' : (isMedium ? '参考' : '不太确定');
  const tint = isHigh ? colors.healingGreen : (isMedium ? colors.warmAmber : '#999');

  return (
    <View style={[styles.badge, { backgroundColor: tint + '20' }]}>
      <MaterialIcons name={icon} size={14} color={tint} />
      <Text style={[styles.text, { color: tint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  text: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
  },
});
