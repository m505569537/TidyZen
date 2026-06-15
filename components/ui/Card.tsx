import { View, StyleSheet } from 'react-native';
import { colors, radius, shadows } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: object;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paperWhite,
    borderRadius: radius.md,
    padding: 16,
    ...shadows.card,
  },
});
