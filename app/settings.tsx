import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notify, setNotify] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>设置</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 通知 */}
        <Text style={styles.sectionLabel}>通知</Text>
        <View style={styles.settingGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconWrap, { backgroundColor: colors.primaryContainer + '40' }]}>
                <MaterialIcons name="notifications" size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingLabel}>推送通知</Text>
            </View>
            <Switch
              value={notify}
              onValueChange={setNotify}
              trackColor={{ true: colors.primary, false: colors.outlineVariant }}
              thumbColor={colors.paperWhite}
            />
          </View>
        </View>

        {/* 数据 */}
        <Text style={styles.sectionLabel}>数据</Text>
        <View style={styles.settingGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconWrap, { backgroundColor: colors.healingGreen + '20' }]}>
                <MaterialIcons name="save" size={20} color={colors.healingGreen} />
              </View>
              <Text style={styles.settingLabel}>自动保存分析记录</Text>
            </View>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ true: colors.primary, false: colors.outlineVariant }}
              thumbColor={colors.paperWhite}
            />
          </View>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconWrap, { backgroundColor: colors.errorContainer }]}>
                <MaterialIcons name="delete-sweep" size={20} color={colors.error} />
              </View>
              <Text style={styles.settingLabel}>清除所有记录</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
          </TouchableOpacity>
        </View>

        {/* 建议库 */}
        <Text style={styles.sectionLabel}>建议库</Text>
        <View style={styles.settingGroup}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconWrap, { backgroundColor: colors.warmAmber + '20' }]}>
                <MaterialIcons name="tune" size={20} color={colors.warmAmber} />
              </View>
              <Text style={styles.settingLabel}>建议偏好设置</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingHint}>全部房型</Text>
              <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
            </View>
          </TouchableOpacity>
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
  settingGroup: {
    backgroundColor: colors.paperWhite, borderRadius: radius.lg,
    overflow: 'hidden', ...shadows.card,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant + '60',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  settingIconWrap: {
    width: 36, height: 36, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  settingLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  settingHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
});
