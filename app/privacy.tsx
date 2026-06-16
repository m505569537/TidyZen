import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';

const PRIVACY_CARDS = [
  { icon: 'photo-camera' as const, title: '照片隐私', text: '您的房间照片默认存储在设备本地。分析时照片会临时传输至 AI 模型（mimo-v2.5-pro）进行处理，处理完成后云端不保留原图。您可以随时在设备中删除照片。' },
  { icon: 'storage' as const, title: '数据存储', text: '分析结果（分数、杂物类型、建议内容）存储在您设备本地，用于历史记录和趋势追踪。您可以选择同步到云端，也可以随时清除所有本地数据。' },
  { icon: 'security' as const, title: '数据安全', text: '所有数据传输均通过加密通道进行。我们不会将您的照片或分析结果用于模型训练或其他目的。我们不会与第三方共享您的个人数据。' },
  { icon: 'delete' as const, title: '删除数据', text: '您可以在设置中清除所有分析记录和本地照片。清除操作不可撤销，请谨慎操作。' },
];

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>隐私政策</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {PRIVACY_CARDS.map((card, i) => (
          <View key={i} style={styles.privacyCard}>
            <View style={styles.iconWrap}>
              <MaterialIcons name={card.icon} size={24} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardText}>{card.text}</Text>
          </View>
        ))}
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

  privacyCard: {
    backgroundColor: colors.paperWhite, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
    ...shadows.card,
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: radius.lg,
    backgroundColor: colors.primaryContainer + '30',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant, lineHeight: 24,
  },
});
