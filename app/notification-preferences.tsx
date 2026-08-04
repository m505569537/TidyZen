import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';

// ── 设计稿色板（严格对齐 docs/designs/notification_preferences_design_v2.md）──
const DESIGN = {
  primary: '#1A7354',          // 深绿（开关滑块、导航选中、强调色）
  background: '#F5F5F5',       // 页面浅灰背景
  card: '#FFFFFF',
  divider: '#E0E0E0',          // 分隔线 / 关闭态轨道
  tipBg: '#E6F7EE',            // 浅绿提示框背景
  switchOnTrack: '#C8F4E3',    // 开启态轨道浅绿
  switchOffTrack: '#E0E0E0',   // 关闭态轨道浅灰
  switchOffThumb: '#FFFFFF',   // 关闭态滑块
  navActiveBg: '#E6F7EE',      // 底部导航选中背景
  navInactive: '#333333',      // 底部导航未选中文字（设计稿规定）
  textPrimary: '#333333',      // 主文字
  textSecondary: '#666666',    // 模块标题
} as const;

// ── 自定义双色开关 ──────────────────────────────────────────────
interface CustomSwitchProps {
  value: boolean;
  onValueChange: () => void;
}

function CustomSwitch({ value, onValueChange }: CustomSwitchProps) {
  // 滑块横向位移动画：关闭=2，开启=22（轨道宽 44，滑块直径 20，左右各留 2px 间隙）
  const translate = useRef(new Animated.Value(value ? 22 : 2)).current;

  useEffect(() => {
    Animated.timing(translate, {
      toValue: value ? 22 : 2,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [value, translate]);

  return (
    <Pressable
      onPress={onValueChange}
      hitSlop={8}
      style={[
        switchStyles.track,
        { backgroundColor: value ? DESIGN.switchOnTrack : DESIGN.switchOffTrack },
      ]}
    >
      <Animated.View
        style={[
          switchStyles.thumb,
          {
            backgroundColor: value ? DESIGN.primary : DESIGN.switchOffThumb,
            transform: [{ translateX: translate }],
          },
        ]}
      />
    </Pressable>
  );
}

const switchStyles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    // 关闭态白色滑块需要轻微阴影才能从浅灰轨道里跳出来
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});

// ── 数据结构 ──
interface ToggleItem {
  id: string;
  label: string;
  enabled: boolean;
}

export default function NotificationPreferencesScreen() {
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
  const [methodItems, setMethodItems] = useState<ToggleItem[]>([
    { id: 'push', label: '推送通知', enabled: true },
    { id: 'sound', label: '声音提醒', enabled: true },
    { id: 'vibrate', label: '震动提醒', enabled: false },
  ]);

  const toggleContent = (id: string) =>
    setContentItems((prev) => prev.map((it) => (it.id === id ? { ...it, enabled: !it.enabled } : it)));

  const toggleMethod = (id: string) =>
    setMethodItems((prev) => prev.map((it) => (it.id === id ? { ...it, enabled: !it.enabled } : it)));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── 顶部导航栏 ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.backBtn} activeOpacity={0.6}>
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
              <CustomSwitch value={item.enabled} onValueChange={() => toggleContent(item.id)} />
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
              <MaterialIcons name="chevron-right" size={20} color={DESIGN.primary} />
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
              <MaterialIcons name="chevron-right" size={20} color={DESIGN.primary} />
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
              <Text style={styles.rowLabel}>{item.label}</Text>
              <CustomSwitch value={item.enabled} onValueChange={() => toggleMethod(item.id)} />
            </View>
          ))}
        </View>

        {/* ── 引导提示框 ── */}
        <View style={styles.tipCard}>
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={22}
            color={DESIGN.primary}
            style={styles.tipIcon}
          />
          <Text style={styles.tipText}>
            合理的通知设置能帮助您养成每天整理的小习惯。通过AI分析和实时提醒，我们将共同打造一个更舒适的生活空间。
          </Text>
        </View>
      </ScrollView>

      {/* ── 底部全局导航栏（4 个入口）── */}
      <View style={styles.bottomNav}>
        <BottomNavItem
          icon="home-outline"
          label="首页"
          active={false}
          onPress={() => router.replace('/(tabs)')}
        />
        <BottomNavItem
          icon="broom"
          label="整理"
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
    color: DESIGN.textPrimary,
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
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.divider,
  },
  rowLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 16,
    color: DESIGN.textPrimary,
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
    marginRight: 4,
  },

  // ── 引导提示框 ──
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: DESIGN.tipBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: DESIGN.primary,
    lineHeight: 22, // 行间距 ~1.6 * 14
  },

  // ── 底部全局导航栏 ──
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: DESIGN.card,
    borderTopWidth: 1,
    borderTopColor: DESIGN.divider,
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  navItemActive: {
    backgroundColor: DESIGN.navActiveBg,
  },
  navItemLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    marginTop: 4,
  },
});
