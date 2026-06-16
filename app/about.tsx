import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';

const FEATURES = [
  { icon: 'auto-awesome' as const, bg: '#E8F5E9', color: colors.healingGreen, title: 'AI视觉分析', desc: '准确识别杂物，提供智能整理建议' },
  { icon: 'grid-on' as const, bg: '#C8E6C9', color: colors.primary, title: '田字格美学', desc: '基于传统秩序感的空间布局指南' },
  { icon: 'autorenew' as const, bg: '#FFF3E0', color: colors.warmAmber, title: '可持续生活', desc: '从源头减少堆积，践行极简循环' },
  { icon: 'favorite' as const, bg: '#E8F5E9', color: colors.primary, title: '心理治愈', desc: '通过整理环境，抚平焦虑情绪' },
];

const LINKS = [
  { icon: 'language' as const, label: '官方网站' },
  { icon: 'shield' as const, label: '隐私政策与条款' },
  { icon: 'mail-outline' as const, label: '商务合作 / 反馈' },
];

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name='arrow-back' size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>{'关于 TidyZen'}</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.brandSection}>
          <View style={styles.logoWrap}>
            <View style={styles.logo}>
              <MaterialIcons name='auto-awesome' size={48} color={colors.paperWhite} />
            </View>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>Pro</Text>
            </View>
          </View>
          <Text style={styles.appName}>TidyZen</Text>
          <Text style={styles.version}>VERSION V2.1.0</Text>
        </View>
        <View style={styles.philosophyCard}>
          <Text style={styles.philosophyTitle}>{'知行合一的整理之道'}</Text>
          <Text style={styles.philosophyText}>
            TidyZen {'不仅仅是一个收纳工具，而是融合了 AI 视觉分析、东方秩序美学与环保理念的智能整理伴侣。通过科技与禅意的结合，帮助每一个人找到属于自己的整洁治愈力。'}
          </Text>
        </View>
        <View style={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={[styles.featureIconWrap, { backgroundColor: f.bg }]}>
                <MaterialIcons name={f.icon} size={28} color={f.color} />
              </View>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.linksSectionTitle}>{'官方链接与资源'}</Text>
        {LINKS.map((link, i) => (
          <TouchableOpacity key={i} style={styles.linkCard} activeOpacity={0.6}>
            <MaterialIcons name={link.icon} size={22} color={colors.onSurfaceVariant} />
            <Text style={styles.linkLabel}>{link.label}</Text>
            <MaterialIcons name='chevron-right' size={22} color={colors.outline} />
          </TouchableOpacity>
        ))}
        <View style={styles.quoteBanner}>
          <Text style={styles.quoteText}>{'“整理房间，即是整理内心。”'}</Text>
        </View>
        <View style={styles.copyrightSection}>
          <Text style={styles.copyright1}>{'(c) 2024 TidyZen Creative Studio. All Rights Reserved.'}</Text>
          <Text style={styles.copyright2}>DESIGNED WITH ZEN IN MIND</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.pageMargin, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.onSurfaceVariant },
  brandSection: { alignItems: 'center', marginVertical: spacing.xl },
  logoWrap: { position: 'relative', marginBottom: spacing.sm },
  logo: { width: 120, height: 120, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  proBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: colors.healingGreen, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 2 },
  proText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 12, color: colors.paperWhite },
  appName: { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: 26, color: colors.onSurface, marginTop: spacing.sm },
  version: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.onSurfaceVariant, marginTop: 4, textTransform: 'uppercase' },
  philosophyCard: { backgroundColor: '#F8F9FA', borderRadius: radius.lg, paddingVertical: spacing.lg, paddingHorizontal: spacing.md, marginBottom: spacing.lg },
  philosophyTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 18, color: colors.primary, marginBottom: spacing.sm },
  philosophyText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurface, lineHeight: 24 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  featureCard: { width: '47%', backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.md, ...shadows.card },
  featureIconWrap: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  featureTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: colors.primary, marginBottom: 4 },
  featureDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 18 },
  linksSectionTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: colors.onSurface, marginBottom: spacing.sm },
  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md, ...shadows.card },
  linkLabel: { flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurface },
  quoteBanner: { backgroundColor: colors.primary, borderRadius: 20, padding: spacing.xl, alignItems: 'center', marginVertical: spacing.lg },
  quoteText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.paperWhite, fontStyle: 'italic', textAlign: 'center' },
  copyrightSection: { alignItems: 'center', marginTop: spacing.sm },
  copyright1: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.onSurface, textAlign: 'center' },
  copyright2: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 10, color: colors.onSurfaceVariant, marginTop: spacing.xs, textTransform: 'uppercase' },
});
