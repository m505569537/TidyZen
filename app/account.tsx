import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';

interface AccountRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  hint: string;
  onPress?: () => void;
  danger?: boolean;
}

function AccountRow({ icon, label, hint, onPress, danger }: AccountRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.iconWrap, danger && { backgroundColor: colors.errorContainer }]}>
        <MaterialIcons name={icon} size={20} color={danger ? colors.error : colors.primary} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, danger && { color: colors.error }]}>{label}</Text>
        <Text style={styles.rowHint}>{hint}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={danger ? colors.error : colors.outline} />
    </TouchableOpacity>
  );
}

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>账号与安全</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 安全设置 */}
        <Text style={styles.sectionLabel}>安全设置</Text>
        <View style={styles.group}>
          <AccountRow icon="lock-outline" label="修改密码" hint="上次修改：3 个月前" onPress={() => {}} />
          <AccountRow icon="mail-outline" label="绑定邮箱" hint="tidyzen@example.com" onPress={() => {}} />
          <AccountRow icon="phone-iphone" label="设备管理" hint="当前设备：iPhone" onPress={() => {}} />
        </View>

        {/* 危险操作 */}
        <Text style={styles.sectionLabel}>危险操作</Text>
        <View style={styles.group}>
          <AccountRow icon="delete-forever" label="注销账号" hint="此操作不可撤销" onPress={() => {}} danger />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 60 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.pageMargin, paddingVertical: spacing.md,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },

  sectionLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm, marginTop: spacing.md,
    paddingHorizontal: spacing.xs,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  group: {
    backgroundColor: colors.paperWhite, borderRadius: radius.lg,
    overflow: 'hidden', ...shadows.card,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant + '60',
  },
  iconWrap: {
    width: 36, height: 36, borderRadius: radius.md,
    backgroundColor: colors.primaryContainer + '40',
    alignItems: 'center', justifyContent: 'center',
  },
  rowContent: { flex: 1 },
  rowLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  rowHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
});
