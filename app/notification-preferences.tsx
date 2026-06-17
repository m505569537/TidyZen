import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

// ── 设计稿色板（严格对齐 docs/designs/notification_preferences_design.md）──
const DESIGN = {
  primary: '#1A3C34',          // 深绿
  background: '#F5F7FA',       // 浅灰白
  card: '#FFFFFF',
  divider: '#EEEEEE',
  tipBg: '#E6F7F0',            // 浅薄荷绿
  textPrimary: '#222222',      // 选项文字
  textSecondary: '#666666',    // 分组标题
  textTertiary: '#444444',     // 小贴士正文
  switchOffTrack: '#E0E0E0',
  switchOffThumb: '#BDBDBD',
  navInactive: '#999999',
} as const;

// ── 通知内容开关项 ──
interface ToggleItem {
  id: string;
  label: string;
  enabled: boolean;
}

// ── 通知方式（带图标的开关项）──
interface IconToggleItem extends ToggleItem {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export default function NotificationPreferencesScreen() {
  const pathname = usePathname();

  // 「通知内容」分组
  const [contentItems, setContentItems] = useState<ToggleItem[]>([
    { id: 'reminder', label: '整理提醒通知', enabled: true },
    { id: 'analysis', label: 'AI 分析完成通知', enabled: true },
    { id: 'daily', label: '每日整洁度报告', enabled: false },
    { id: 'suggestion', label: '建议更新通知', enabled: true },
  ]);

  // 「发送时间」分组
  const [reminderTime, setReminderTime] = useState('19:00');
  const [reportTime, setReportTime] = useState('08:30');

  // 「通知方式」分组
  const [methodItems, setMethodItems] = useState<IconToggleItem[]>([
    { id: 'push', label: '推送通知', icon: 'bell-outline', enabled: true },
    { id: 'sound', label: '声音提醒', icon: 'volume-high', enabled: true },
    { id: 'vibrate', label: '震动提醒', icon: 'vibrate', enabled: false },
  ]);

  const toggleContent = (id: string) =>
    setContentItems((prev) => prev.map((it) => (it.id === id ? { ...it, enabled: !it.enabled } : it)));

  const toggleMethod = (id: string) =>
    setMethodItems((prev) => prev.map((it) => (it.id === id ? { ...it, enabled: !it.enabled } : it)));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── 顶部导航栏 ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.6}>
          <MaterialIcons name="arrow-back" size={24} color={DESIGN.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>通知偏好</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. 通知内容 ── */}
        <Text style={styles.groupTitle}>通知内容</Text>
        <View style={styles.card}>
          {contentItems.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.row, idx < contentItems.length - 1 && styles.rowDivider]}
            >
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Switch
                value={item.enabled}
                onValueChange={() => toggleContent(item.id)}
                trackColor={{ true: DESIGN.primary, false: DESIGN.switchOffTrack }}
                thumbColor={item.enabled ? '#FFFFFF' : DESIGN.switchOffThumb}
                ios_backgroundColor={DESIGN.switchOffTrack}
              />
            </View>
          ))}
        </View>

        {/* ── 2. 发送时间 ── */}
        <Text style={styles.groupTitle}>发送时间</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.row, styles.rowDivider]}
            activeOpacity={0.6}
            onPress={() => {
              // 真实场景：弹出时间选择器
              setReminderTime((t) => (t === '19:00' ? '20:00' : '19:00'));
            }}
          >
            <Text style={styles.rowLabel}>整理提醒时间</Text>
            <View style={styles.timeRight}>
              <Text style={styles.timeText}>{reminderTime}</Text>
              <MaterialIcons name="chevron-right" size={16} color={DESIGN.primary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.6}
            onPress={() => {
              setReportTime((t) => (t === '08:30' ? '09:00' : '08:30'));
            }}
          >
            <Text style={styles.rowLabel}>报告推送时间</Text>
            <View style={styles.timeRight}>
              <Text style={styles.timeText}>{reportTime}</Text>
              <MaterialIcons name="chevron-right" size={16} color={DESIGN.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── 3. 通知方式 ── */}
        <Text style={styles.groupTitle}>通知方式</Text>
        <View style={styles.card}>
          {methodItems.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.row, idx < methodItems.length - 1 && styles.rowDivider]}
            >
              <View style={styles.rowLeft}>
                <MaterialCommunityIcons name={item.icon} size={20} color={DESIGN.primary} />
                <Text style={[styles.rowLabel, styles.rowLabelWithIcon]}>{item.label}</Text>
              </View>
              <Switch
                value={item.enabled}
                onValueChange={() => toggleMethod(item.id)}
                trackColor={{ true: DESIGN.primary, false: DESIGN.switchOffTrack }}
                thumbColor={item.enabled ? '#FFFFFF' : DESIGN.switchOffThumb}
                ios_backgroundColor={DESIGN.switchOffTrack}
              />
            </View>
          ))}
        </View>

        {/* ── 小贴士卡片 ── */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconWrap}>
            <MaterialCommunityIcons name="leaf" size={24} color={DESIGN.primary} />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>小贴士</Text>
            <Text style={styles.tipBody}>
              合理的通知设置能帮助您养成每天整理的小习惯。准时的提醒就像一位温和的伙伴，在您最需要的时候给予指引，让整洁成为您生活的一部分。
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── 底部全局导航栏 ── */}
      <View style={styles.bottomNav}>
        <BottomNavItem
          icon="home-outline"
          label="首页"
          active={false}
          onPress={() => router.replace('/(tabs)')}
        />
        <BottomNavItem
          icon="calendar-blank-outline"
          label="计划"
          active={false}
          onPress={() => router.replace('/(tabs)/history')}
        />
        <BottomNavItem icon="bell-outline" label="通知" active={true} />
        <BottomNavItem
          icon="account-outline"
          label="我的"
          active={false}
          onPress={() => router.replace('/(tabs)/profile')}
        />
      </View>
    </SafeAreaView>
  );
}

// ── 底部导航项 ──
interface BottomNavItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  active: boolean;
  onPress?: () => void;
}

function BottomNavItem({ icon, label, active, onPress }: BottomNavItemProps) {
  return (
    <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onPress} disabled={active}>
      <View style={[styles.navItemInner, active && styles.navItemActive]}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={active ? DESIGN.primary : DESIGN.navInactive}
        />
        <Text
          style={[styles.navItemLabel, { color: active ? DESIGN.primary : DESIGN.navInactive }]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.background,
  },

  // ── 顶部导航栏 ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingLeft: 16,
    backgroundColor: DESIGN.background,
  },
  backBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 18,
    color: DESIGN.primary,
    marginLeft: 12,
  },

  // ── 滚动内容 ──
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  // ── 分组标题 ──
  groupTitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: DESIGN.textSecondary,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  // ── 设置卡片 ──
  card: {
    backgroundColor: DESIGN.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.divider,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 16,
    color: DESIGN.textPrimary,
  },
  rowLabelWithIcon: {
    marginLeft: 8,
  },

  // ── 时间项 ──
  timeRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 16,
    color: DESIGN.primary,
    marginRight: 8,
  },

  // ── 小贴士卡片 ──
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: DESIGN.tipBg,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  tipIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: DESIGN.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 16,
    color: DESIGN.primary,
    marginBottom: 4,
  },
  tipBody: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: DESIGN.textTertiary,
    lineHeight: 21, // 行间距 1.5 * 14
  },

  // ── 底部全局导航栏 ──
  bottomNav: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: DESIGN.card,
    borderTopWidth: 1,
    borderTopColor: DESIGN.divider,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: DESIGN.tipBg,
  },
  navItemLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    marginTop: 4,
  },
});
