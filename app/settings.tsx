import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notify, setNotify] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>设置</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>通知</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>推送通知</Text>
            <Switch value={notify} onValueChange={setNotify} trackColor={{ true: colors.primary }} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>数据</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>自动保存分析记录</Text>
            <Switch value={autoSave} onValueChange={setAutoSave} trackColor={{ true: colors.primary }} />
          </View>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>清除所有记录</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>建议库</Text>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>建议偏好设置</Text>
            <Text style={styles.settingHint}>全部房型</Text>
          </TouchableOpacity>
        </View>
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
  section: { marginBottom: spacing.lg },
  sectionLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.labelCaps.fontSize, color: colors.onSurfaceVariant, marginBottom: spacing.sm, paddingHorizontal: spacing.xs },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.md, marginBottom: 1 },
  settingLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurface },
  settingHint: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant },
});
