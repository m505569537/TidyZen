import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 整洁得分卡片 */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>整洁得分</Text>
          <Text style={styles.scoreValue}>--</Text>
          <Text style={styles.scoreHint}>拍张照片，看看房间有多整洁</Text>
        </View>

        {/* 核心功能区 */}
        <Text style={styles.sectionTitle}>核心功能区</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/camera')}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconContainer}>
            <MaterialIcons name="camera-alt" size={28} color={colors.onPrimary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>开始整理</Text>
            <Text style={styles.actionDesc}>拍照分析房间，获取即时整理建议</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
        </TouchableOpacity>

        {/* 底部提示 */}
        <View style={styles.tipCard}>
          <MaterialIcons name="lightbulb" size={20} color={colors.warmAmber} />
          <Text style={styles.tipText}>
            每次整理只需 5 分钟，零成本、立竿见影
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 100 },
  scoreCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  scoreLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.primaryContainer,
    marginBottom: spacing.sm,
  },
  scoreValue: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: typography.scoreDisplay.fontSize,
    lineHeight: typography.scoreDisplay.lineHeight,
    color: colors.onPrimary,
  },
  scoreHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.primaryContainer,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionContent: { flex: 1 },
  actionTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurface,
  },
  actionDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  tipText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
});
