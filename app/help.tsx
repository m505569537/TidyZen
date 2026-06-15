import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';

const FAQS = [
  { q: '如何提高整洁度评分？', a: '按照建议逐步执行，将杂物归位。地面和床面的杂物对评分影响最大。执行后重新拍照可以看到评分变化。' },
  { q: 'AI 识别不准怎么办？', a: '在分析结果页点击"识别不准"按钮，可以从 10 个场景中手动选择正确的问题类型，系统会重新匹配建议。' },
  { q: '照片会上传到云端吗？', a: '分析时照片会临时传输到 AI 模型进行处理，分析完成后云端不会保留原图。照片默认存储在您手机本地。' },
  { q: '支持哪些房间类型？', a: '目前支持卧室、客厅、卫生间和桌面区域。系统会自动识别房间类型，您也可以在纠错时手动调整。' },
  { q: '建议需要花钱买工具吗？', a: '所有建议都为零成本方案，利用现有物品即可完成。部分进阶建议可能用到纸箱、长尾夹等日常物品。' },
];

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>帮助中心</Text>
          <View style={styles.backBtn} />
        </View>

        <Text style={styles.subtitle}>常见问题</Text>
        {FAQS.map((faq, i) => (
          <View key={i} style={styles.faqCard}>
            <View style={styles.faqHeader}>
              <MaterialIcons name="help-outline" size={18} color={colors.primary} />
              <Text style={styles.faqQ}>{faq.q}</Text>
            </View>
            <Text style={styles.faqA}>{faq.a}</Text>
          </View>
        ))}

        <View style={styles.contactCard}>
          <MaterialIcons name="mail-outline" size={20} color={colors.primary} />
          <Text style={styles.contactText}>还有问题？发送邮件至 support@tidyzen.app</Text>
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
  subtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyLg.fontSize, color: colors.onSurfaceVariant, marginBottom: spacing.md },
  faqCard: { backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  faqHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  faqQ: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyMd.fontSize, color: colors.onSurface, flex: 1 },
  faqA: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant, lineHeight: 22, paddingLeft: 26 },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryContainer + '40', borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg, gap: spacing.sm },
  contactText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurface, flex: 1 },
});
