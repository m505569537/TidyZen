import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';

interface MenuItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  showDivider?: boolean;
}

function MenuItem({ icon, label, subtitle, onPress, danger, showDivider = true }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.menuIconWrap, danger && { backgroundColor: colors.errorContainer }]}>
        <MaterialIcons name={icon as any} size={20} color={danger ? colors.error : colors.primary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, danger && { color: colors.error }]}>{label}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 头像区 */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={40} color={colors.onPrimary} />
          </View>
          <Text style={styles.nickname}>整理爱好者</Text>
          <Text style={styles.email}>tidyzen@example.com</Text>
        </View>

        {/* 统计卡片 */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/trends')} activeOpacity={0.8}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>分析次数</Text>
          </TouchableOpacity>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.healingGreen }]}>78</Text>
            <Text style={styles.statLabel}>平均得分</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.warmAmber }]}>+20</Text>
            <Text style={styles.statLabel}>总提升</Text>
          </View>
        </View>

        {/* 设置菜单 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>设置</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon="tune" label="偏好设置" subtitle="建议库偏好、通知" onPress={() => router.push('/settings')} />
            <MenuItem icon="lock" label="账号与安全" subtitle="修改密码、隐私" onPress={() => router.push('/account')} />
          </View>
        </View>

        {/* 支持菜单 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>支持</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon="help-outline" label="帮助中心" subtitle="常见问题" onPress={() => router.push('/help')} />
            <MenuItem icon="info-outline" label="关于 TidyZen" subtitle="版本 1.0.0" onPress={() => router.push('/about')} />
            <MenuItem icon="verified-user" label="隐私政策" onPress={() => router.push('/privacy')} />
          </View>
        </View>

        {/* 退出 */}
        <View style={styles.menuGroup}>
          <MenuItem icon="logout" label="退出登录" onPress={() => {}} danger />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 60 },

  // 头像
  profileHeader: { alignItems: 'center', paddingVertical: spacing.xl },
  avatar: {
    width: 80, height: 80, borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  nickname: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },
  email: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  // 统计
  statsRow: {
    flexDirection: 'row', gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1, alignItems: 'center',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    ...shadows.card,
  },
  statValue: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineLg.fontSize,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  // 菜单
  menuSection: { marginBottom: spacing.lg },
  sectionLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  menuGroup: {
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant + '60',
  },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: radius.md,
    backgroundColor: colors.primaryContainer + '40',
    alignItems: 'center', justifyContent: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  menuSubtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
});
