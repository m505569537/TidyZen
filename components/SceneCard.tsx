import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, radius, spacing } from '../constants/theme';
import type { SceneInfo } from '../constants/scenes';

interface SceneCardProps {
  scene: SceneInfo;
  selected: boolean;
  onPress: () => void;
}

export function SceneCard({ scene, selected, onPress }: SceneCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons
        name={scene.icon as any}
        size={28}
        color={selected ? colors.primary : colors.onSurfaceVariant}
      />
      <Text style={[styles.name, selected && styles.nameSelected]}>{scene.name}</Text>
      <Text style={styles.desc}>{scene.description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: spacing.sm,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryContainer + '4D',
  },
  name: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  nameSelected: { color: colors.primary },
  desc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
