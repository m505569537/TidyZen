import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>关于 TidyZen</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <MaterialIcons name="auto-awesome" size={48} color={colors.onPrimary} />
          </View>
          <Text style={styles.appName}>TidyZen</Text>
          <Text style={styles.version}>版本 1.0.0 (MVP)</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>智能房间整洁助手</Text>
          <Text style={styles.infoText}>
            TidyZen 是一款基于 AI 视觉分析的房间整洁助手。拍照即可获得即时整理建议，帮助你在 5 分钟内改善房间视觉整洁度。所有建议零成本、立竿见影。
          </Text>
        </View>

        <View style={styles.techCard}>
          <Text style={styles.techTitle}>技术栈</Text>
          <View style={styles.techRow}>
            <Text style={styles.techLabel}>前端</Text>
            <Text style={styles.techValue}>React Native (Expo) + TypeScript</Text>
          </View>
          <View style={styles.techRow}>
            <Text style={styles.techLabel}>AI</Text>
            <Text style={styles.techValue}>mimo-v2.5-pro 视觉大模型</Text>
          </View>
          <View style={styles.techRow}>
            <Text style={styles.techLabel}>设计</Text>
            <Text style={styles.techValue}>TidyZen 设计系统 (Stitch)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.headlineMd.fontSize, color: colors.onSurface },
  logoSection: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { width: 96, height: 96, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  appName: { fontFamily: 'BeVietnamPro_700Bold', fontSize: typography.headlineLg.fontSize, color: colors.onSurface },
  version: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant, marginTop: 2 },
  infoCard: { backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md },
  infoTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyLg.fontSize, color: colors.onSurface, marginBottom: spacing.sm },
  infoText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant, lineHeight: 24 },
  techCard: { backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.lg },
  techTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyLg.fontSize, color: colors.onSurface, marginBottom: spacing.md },
  techRow: { flexDirection: 'row', marginBottom: spacing.sm },
  techLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyMd.fontSize, color: colors.primary, width: 60 },
  techValue: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurface },
});
