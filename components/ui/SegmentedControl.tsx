import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing } from '../../constants/theme';

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, selected, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.segment, selected === option && styles.selected]}
          onPress={() => onChange(option)}
          activeOpacity={0.7}
        >
          <Text style={[styles.text, selected === option && styles.selectedText]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    borderRadius: 24,
    padding: 4,
    height: 44,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm - 2,
    borderRadius: 20,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  text: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  selectedText: {
    color: colors.onPrimary,
  },
});
