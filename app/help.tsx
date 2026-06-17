import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';
import { useState } from 'react';

const CATEGORIES = ['全部', '识别问题', '隐私安全', '账号管理'];

const FAQS = [
  { q: '如何提高整洁度评分？', a: '按照建议逐步执行，将杂物归位。地面和床面的杂物对评分影响最大。', category: '识别问题' },
  { q: 'AI 识别不准怎么办？', a: '在分析结果页点击“识别不准”按钮，可以从 10 个场景中手动选择正确的问题类型。', category: '识别问题' },
  { q: '照片会上传到云端吗？', a: '分析时照片会临时传输到 AI 模型处理，分析完成后云端不会保留原图。', category: '隐私安全' },
  { q: '支持哪些房间类型？', a: '目前支持卧室、客厅、卫生间和桌面区域。系统会自动识别房间类型。', category: '识别问题' },
  { q: '建议需要花钱买工具吗？', a: '所有建议都为零成本方案，利用现有物品即可完成。', category: '全部' },
  { q: '照片存储在哪里？', a: '照片默认存储在您手机本地，您可以在设置中清除缓存。', category: '隐私安全' },
  { q: '如何分享分析结果？', a: '在分析结果页点击分享按钮，可以生成图片或链接分享给朋友。', category: '全部' },
  { q: '如何导出数据？', a: '目前暂不支持数据导出功能，我们将在后续版本中添加。', category: '账号管理' },
  { q: '如何注销账号？', a: '在设置 > 账号与安全 > 注销账号，注销后所有数据将永久删除。', category: '账号管理' },
  { q: '支持多设备登录吗？', a: '支持，使用同一账号可以在多台设备上登录，数据自动同步。', category: '账号管理' },
];

export default function HelpScreen() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const filteredFaqs = FAQS.filter((f) => {
    if (activeTab > 0 && f.category !== CATEGORIES[activeTab]) return false;
    if (search && !f.q.includes(search) && !f.a.includes(search)) return false;
    return true;
  });
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.backBtn}>
          <MaterialIcons name='arrow-back' size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>{'常见问题'}</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.searchBar}>
          <MaterialIcons name='search' size={20} color={colors.outline} />
          <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder={'搜索您遇到的问题...'} placeholderTextColor={colors.outline} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity key={i} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => setActiveTab(i)}>
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {filteredFaqs.map((faq, i) => {
          const isExpanded = expandedIdx === i;
          return (
            <TouchableOpacity key={i} style={styles.faqCard} onPress={() => setExpandedIdx(isExpanded ? null : i)} activeOpacity={0.7}>
              <View style={styles.faqRow}>
                <Text style={styles.faqQ}>{faq.q}</Text>
                <MaterialIcons name={isExpanded ? 'expand-less' : 'expand-more'} size={22} color={colors.outline} />
              </View>
              {isExpanded && <Text style={styles.faqA}>{faq.a}</Text>}
            </TouchableOpacity>
          );
        })}
        <View style={styles.helpArea}>
          <View style={styles.helpIconWrap}><MaterialIcons name='headset-mic' size={28} color={colors.primary} /></View>
          <Text style={styles.helpTitle}>{'仍有疑问？'}</Text>
          <Text style={styles.helpDesc}>{'我们的客服团队随时为您提供支持，或者您可以向我们反馈产品建议。'}</Text>
          <TouchableOpacity style={styles.helpBtnPrimary} activeOpacity={0.8}>
            <Text style={styles.helpBtnPrimaryText}>{'在线联系客服'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpBtnSecondary} activeOpacity={0.8}>
            <Text style={styles.helpBtnSecondaryText}>{'反馈建议'}</Text>
          </TouchableOpacity>
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
  title: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 18, color: colors.onSurface },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paperWhite, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 48, gap: spacing.sm, marginBottom: spacing.md, ...shadows.card },
  searchInput: { flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurface },
  tabRow: { gap: spacing.sm, marginBottom: spacing.md },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.md, backgroundColor: colors.paperWhite },
  tabActive: { backgroundColor: '#E8F5E9' },
  tabText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurfaceVariant },
  tabTextActive: { fontFamily: 'BeVietnamPro_600SemiBold', color: colors.onSurface },
  faqCard: { backgroundColor: colors.paperWhite, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, ...shadows.card },
  faqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQ: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.onSurface, flex: 1, marginRight: spacing.sm },
  faqA: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurfaceVariant, lineHeight: 22, marginTop: spacing.sm },
  helpArea: { backgroundColor: colors.primaryContainer + '30', borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', marginTop: spacing.lg },
  helpIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.paperWhite, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  helpTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 20, color: colors.onSurface, marginBottom: spacing.sm },
  helpDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurface, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
  helpBtnPrimary: { backgroundColor: colors.primary, borderRadius: radius.lg, height: 48, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  helpBtnPrimaryText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.paperWhite },
  helpBtnSecondary: { backgroundColor: colors.paperWhite, borderRadius: radius.lg, height: 48, width: '100%', alignItems: 'center', justifyContent: 'center' },
  helpBtnSecondaryText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.onSurface },
});
