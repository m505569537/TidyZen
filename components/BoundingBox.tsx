import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../constants/theme';

interface BoundingBoxProps {
  // Normalized coordinates [x, y, width, height] (0-1)
  bbox: [number, number, number, number];
  label: string;
  containerWidth: number;
  containerHeight: number;
  /** Optional color override for border/fill/label. Defaults to softBlue. */
  color?: string;
}

export function BoundingBox({ bbox, label, containerWidth, containerHeight, color }: BoundingBoxProps) {
  const [x, y, w, h] = bbox;
  const left = x * containerWidth;
  const top = y * containerHeight;
  const width = w * containerWidth;
  const height = h * containerHeight;

  const boxColor = color ?? colors.softBlue;

  return (
    <View
      style={[
        styles.box,
        {
          left,
          top,
          width,
          height,
          borderColor: boxColor,
          backgroundColor: boxColor + '1A', // ~10% opacity
        },
      ]}
    >
      <View style={[styles.labelContainer, { backgroundColor: boxColor }]}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: radius.sm,
  },
  labelContainer: {
    position: 'absolute',
    top: -20,
    left: -2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  label: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurface,
  },
});
