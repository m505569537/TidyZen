import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../constants/theme';

interface BoundingBoxProps {
  // Normalized coordinates [x, y, width, height] (0-1)
  bbox: [number, number, number, number];
  label: string;
  containerWidth: number;
  containerHeight: number;
}

export function BoundingBox({ bbox, label, containerWidth, containerHeight }: BoundingBoxProps) {
  const [x, y, w, h] = bbox;
  const left = x * containerWidth;
  const top = y * containerHeight;
  const width = w * containerWidth;
  const height = h * containerHeight;

  return (
    <View
      style={[
        styles.box,
        {
          left,
          top,
          width,
          height,
        },
      ]}
    >
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.softBlue,
    backgroundColor: colors.softBlue + '26', // 15% opacity
    borderRadius: radius.sm,
  },
  labelContainer: {
    position: 'absolute',
    top: -20,
    left: -2,
    backgroundColor: colors.softBlue,
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
