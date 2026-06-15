import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>账号与安全</Text>
          <View style={styles.backBtn} />
        </View>

        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="lock-outline" size={22} color={colors.primary} />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>修改密码</Text>
            <Text style={styles.rowHint}>上次修改：3 个月前</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="mail-outline" size={22} color={colors.primary} />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>绑定邮箱</Text>
            <Text style={styles.rowHint}>tidyzen@example.com</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="phone-iphone" size={22} color={colors.primary} />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>设备管理</Text>
            <Text style={styles.rowHint}>当前设备：iPhone</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.row, styles.dangerRow]}>
          <MaterialIcons name="delete-forever" size={22} color={colors.error} />
          <View style={styles.rowContent}>
            <Text style={[styles.rowLabel, { color: colors.error }]}>注销账号</Text>
            <Text style={styles.rowHint}>此操作不可撤销</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.error} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.headlineMd.fontSize, color: colors.onSurface },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.md, marginBottom: 1, gap: spacing.md },
  rowContent: { flex: 1 },
  rowLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyMd.fontSize, color: colors.onSurface },
  rowHint: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.labelCaps.fontSize, color: colors.onSurfaceVariant, marginTop: 1 },
  dangerRow: { marginTop: spacing.xl },
});
