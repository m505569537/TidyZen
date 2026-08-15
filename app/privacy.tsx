import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';
import { SegmentedControl } from '../components';

type TabOption = '隐私政策' | '用户协议';

// ── 隐私政策数据 ──
const PRIVACY_SECTIONS = [
  {
    title: '数据收集与使用',
    items: [
      '我们仅在您使用拍照功能时，临时上传照片至AI模型进行分析',
      '分析完成后云端不保留原图，仅保留匿名化的分析结果用于优化服务',
      '我们不会将您的照片用于模型训练或其他任何商业用途',
    ],
  },
  {
    title: '数据存储',
    items: [
      '分析结果、分数、杂物类型等数据默认存储在您设备本地',
      '您可以选择开启云端同步，数据将加密存储在安全的云服务器上',
      '您可以随时在设置中清除所有本地或云端数据',
    ],
  },
  {
    title: '数据安全',
    items: [
      '所有数据传输均通过 TLS 1.3 加密通道进行',
      '云端数据采用 AES-256 加密存储',
      '我们不会与任何第三方共享您的个人数据',
    ],
  },
];

const PRIVACY_CARDS = [
  {
    icon: 'photo-camera' as const,
    title: '照片隐私',
    text: '您的房间照片默认存储在设备本地。分析时照片会临时传输至 AI 模型进行处理，处理完成后云端不保留原图。',
  },
  {
    icon: 'storage' as const,
    title: '数据存储',
    text: '分析结果存储在您设备本地，用于历史记录和趋势追踪。您可以随时清除所有本地数据。',
  },
  {
    icon: 'security' as const,
    title: '数据安全',
    text: '所有数据传输均通过加密通道进行。我们不会将您的照片或分析结果用于模型训练。',
  },
];

// ── 用户协议数据 ──
const TOS_SECTIONS = [
  {
    title: '服务说明',
    items: [
      'TidyZen 是一款基于 AI 的房间整洁度分析工具，帮助用户识别房间杂物并提供整理建议',
      '分析结果仅供参考，实际整理效果可能因个人情况而异',
      '我们保留根据用户反馈改进和调整 AI 模型的权利',
    ],
  },
  {
    title: '用户责任',
    items: [
      '用户应确保所拍摄的照片内容合法、不侵犯他人隐私',
      '用户应自行判断和验证 AI 提供的整理建议的适用性',
      '禁止将本服务用于任何非法目的或违反社区准则的行为',
    ],
  },
  {
    title: '免责声明',
    items: [
      'TidyZen 不保证 AI 分析结果 100% 准确，用户需自行承担整理行为的结果',
      '因网络故障、设备问题等不可抗力导致的服务中断，我们不承担责任',
      '我们不对因使用本服务而产生的任何直接或间接损失负责',
    ],
  },
];

const TOS_CARDS = [
  {
    icon: 'gavel' as const,
    title: '服务条款',
    text: '使用 TidyZen 即表示您同意遵守本协议的所有条款。如不同意任何条款，请停止使用本服务。',
  },
  {
    icon: 'update' as const,
    title: '条款更新',
    text: '我们可能会不时更新服务条款。重大变更将通过应用内通知告知，继续使用即表示接受新条款。',
  },
  {
    icon: 'support-agent' as const,
    title: '用户支持',
    text: '如对服务条款有任何疑问，可通过应用内「帮助与反馈」或发送邮件至 legal@tidyzen.app 联系。',
  },
];

export default function PrivacyScreen() {
  const [tab, setTab] = useState<TabOption>('隐私政策');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 头部隐私声明区 */}
        <SafeAreaView edges={['top']}>
          <View style={styles.headerArea}>
            {/* 返回按钮 */}
            <TouchableOpacity
              style={styles.headerBackBtn}
              onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
            </TouchableOpacity>

            {/* 盾牌图标 */}
            <View style={styles.shieldIconWrap}>
              <View style={styles.shieldInner}>
                <MaterialIcons name="verified-user" size={40} color={colors.paperWhite} />
              </View>
            </View>

            <Text style={styles.headerTitle}>TidyZen 承诺保护您的隐私</Text>
            <Text style={styles.headerDate}>最后更新日期：2024年1月15日</Text>
          </View>
        </SafeAreaView>

        {/* Tab 切换 */}
        <View style={styles.tabContainer}>
          <SegmentedControl
            options={['隐私政策', '用户协议']}
            selected={tab}
            onChange={(v) => setTab(v as TabOption)}
          />
        </View>

        {/* 内容区 */}
        <View style={styles.contentArea}>
          {tab === '隐私政策' ? (
            <>
              {/* 章节列表 */}
              {PRIVACY_SECTIONS.map((section, i) => (
                <View key={i} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionLine} />
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                  {section.items.map((item, j) => (
                    <View key={j} style={styles.listItem}>
                      <View style={styles.listDot} />
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ))}

              {/* 卡片 */}
              {PRIVACY_CARDS.map((card, i) => (
                <View key={i} style={styles.infoCard}>
                  <View style={styles.infoCardIcon}>
                    <MaterialIcons name={card.icon} size={22} color={colors.primary} />
                  </View>
                  <View style={styles.infoCardContent}>
                    <Text style={styles.infoCardTitle}>{card.title}</Text>
                    <Text style={styles.infoCardText}>{card.text}</Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <>
              {/* 章节列表 */}
              {TOS_SECTIONS.map((section, i) => (
                <View key={i} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionLine} />
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                  {section.items.map((item, j) => (
                    <View key={j} style={styles.listItem}>
                      <View style={styles.listDot} />
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ))}

              {/* 卡片 */}
              {TOS_CARDS.map((card, i) => (
                <View key={i} style={styles.infoCard}>
                  <View style={styles.infoCardIcon}>
                    <MaterialIcons name={card.icon} size={22} color={colors.primary} />
                  </View>
                  <View style={styles.infoCardContent}>
                    <Text style={styles.infoCardTitle}>{card.title}</Text>
                    <Text style={styles.infoCardText}>{card.text}</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* 底部联系支持区 */}
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>有任何疑问？</Text>
            <Text style={styles.contactDesc}>
              如需了解更多隐私政策细节或行使您的数据权利，请联系我们的法务团队。
            </Text>
            <TouchableOpacity style={styles.contactButton} activeOpacity={0.8} onPress={() => Linking.openURL('mailto:legal@tidyzen.app?subject=法务咨询').catch(() => Alert.alert('打开失败', '请检查是否已配置邮件 App')) }>
              <Text style={styles.contactButtonText}>联系法务团队</Text>
              <MaterialIcons name="chevron-right" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* 底部版权 */}
          <Text style={styles.copyright}>© 2024 TidyZen Inc.</Text>
        </View>
      </ScrollView>

      {/* 悬浮按钮 */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => Linking.openURL('mailto:support@tidyzen.app?subject=联系客服').catch(() => Alert.alert('打开失败', '请检查是否已配置邮件 App')) }>
        <MaterialIcons name="chat-bubble" size={24} color={colors.paperWhite} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // 头部
  headerArea: {
    backgroundColor: '#E6F7F0',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.pageMargin,
  },
  headerBackBtn: {
    position: 'absolute',
    top: 50,
    left: spacing.pageMargin,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.paperWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIconWrap: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  shieldInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.healingGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineLgMobile.fontSize,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  headerDate: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    opacity: 0.6,
  },

  // Tab
  tabContainer: {
    paddingHorizontal: spacing.pageMargin,
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
  },

  // 内容区
  contentArea: {
    paddingHorizontal: spacing.pageMargin,
    paddingBottom: 100,
  },

  // 章节
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionLine: {
    width: 2,
    height: 18,
    backgroundColor: colors.healingGreen,
    borderRadius: 1,
  },
  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurface,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingVertical: spacing.xs + 1,
    gap: spacing.sm,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.healingGreen,
    marginTop: 8,
  },
  listText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
    flex: 1,
  },

  // 信息卡片
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.paperWhite,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadows.card,
  },
  infoCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryContainer + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardContent: {
    flex: 1,
    gap: 2,
  },
  infoCardTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  infoCardText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },

  // 联系支持
  contactCard: {
    backgroundColor: '#F5F0EB',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  contactTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurface,
  },
  contactDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  contactButtonText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.primary,
  },

  // 版权
  copyright: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    opacity: 0.5,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  // 悬浮按钮
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
