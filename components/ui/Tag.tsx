import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../../constants/theme';

interface TagProps {
  label: string;
  color?: string;
  bgColor?: string;
}

export function Tag({ label, color = colors.onSurfaceVariant, bgColor = colors.outlineVariant }: TagProps) {
  return (
    <View style={[styles.tag, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  text: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
  },
});
