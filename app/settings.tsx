import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';
import { getProfile, getHistoryRecords, type UserProfile } from '../services/storage';
import { deriveLevelTag } from '../utils/level';

interface SettingItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  iconBg?: string;
  iconColor?: string;
  showArrow?: boolean;
}

function SettingItem({ icon, label, subtitle, right, onPress, iconBg, iconColor, showArrow = true }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.itemRow} onPress={onPress} activeOpacity={0.6} disabled={!onPress}>
      <View style={[styles.itemIconWrap, { backgroundColor: iconBg || colors.primaryContainer + '40' }]}>
        <MaterialIcons name={icon} size={20} color={iconColor || colors.primary} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemLabel}>{label}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      {right || (showArrow && <MaterialIcons name="chevron-right" size={22} color={colors.outline} />)}
    </TouchableOpacity>
  );
}

/** 递归遍历目录累加文件大小（深度受限防爆栈） */
async function dirSize(uri: string, depth: number = 0, maxDepth: number = 3): Promise<number> {
  if (depth > maxDepth) return 0;
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) return 0;
  if (!info.isDirectory) return info.size ?? 0;
  const entries = await FileSystem.readDirectoryAsync(uri);
  let total = 0;
  for (const name of entries) {
    const childUri = uri.endsWith('/') ? `${uri}${name}` : `${uri}/${name}`;
    total += await dirSize(childUri, depth + 1, maxDepth);
  }
  return total;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default function SettingsScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [totalScans, setTotalScans] = useState(0);
  const [cacheSizeLabel, setCacheSizeLabel] = useState('计算中…');

  // 页面聚焦时刷新：资料 + 扫描数 + 缓存大小
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [p, records] = await Promise.all([getProfile(), getHistoryRecords()]);
        if (cancelled) return;
        setProfile(p);
        setTotalScans(records.length);
        // 异步算缓存（不阻塞 UI）
        if (FileSystem.cacheDirectory) {
          dirSize(FileSystem.cacheDirectory).then((bytes) => {
            if (!cancelled) setCacheSizeLabel(formatSize(bytes));
          }).catch(() => {
            if (!cancelled) setCacheSizeLabel('无法计算');
          });
        } else {
          setCacheSizeLabel('不可用');
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const displayName = profile?.nickname ?? '整洁爱好者';
  const levelTag = deriveLevelTag(totalScans);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>设置</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.userCard} activeOpacity={0.7} onPress={() => router.push('/(tabs)/profile')}>
          <View style={styles.avatar}>
            {profile?.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.avatarImg} />
            ) : (
              <MaterialIcons name="person" size={28} color={colors.onPrimary} />
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.nickname}>{displayName}</Text>
            <View style={styles.levelTag}>
              <Text style={styles.levelText}>{levelTag}</Text>
            </View>
          </View>
          <MaterialIcons name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.groupTitle}>账号与安全</Text>
        <View style={styles.groupCard}>
          <SettingItem icon="person" label="个人资料" onPress={() => router.push('/(tabs)/profile')} />
          <SettingItem icon="link" label="账号绑定" onPress={() => Alert.alert('功能开发中', '「账号绑定」功能正在开发中，预计 v1.1 上线。')} right={
            <View style={styles.rightRow}>
              <Text style={styles.hintText}>已绑定微信</Text>
              <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
            </View>
          } />
          <SettingItem icon="lock-outline" label="修改密码" onPress={() => router.push('/account')} />
        </View>

        <Text style={styles.groupTitle}>个性化设置</Text>
        <View style={styles.groupCard}>
          <SettingItem
            icon="home"
            label="房间模板管理"
            subtitle="租房、宿舍、卧室"
            onPress={() => router.push('/room-templates')}
          />
          <SettingItem
            icon="tune"
            label="建议库偏好"
            onPress={() => router.push('/suggestion-preferences')}
          />
        </View>

        <Text style={styles.groupTitle}>系统设置</Text>
        <View style={styles.groupCard}>
          <SettingItem
            icon="notifications"
            label="消息通知"
            subtitle="自定义提醒时间与通知方式"
            onPress={() => router.push('/notification-preferences')}
          />
          <SettingItem icon="delete-sweep" label="清除本地照片缓存" subtitle="已开启隐私保护" showArrow={false}
            right={<Text style={styles.cacheSize}>{cacheSizeLabel}</Text>}
          />
          <SettingItem icon="shield" label="隐私政策" onPress={() => router.push('/privacy')} />
        </View>

        <Text style={styles.groupTitle}>帮助与关于</Text>
        <View style={styles.groupCard}>
          <SettingItem icon="help-outline" label="常见问题" iconBg={colors.softBlue + '30'} onPress={() => router.push('/help')} />
          <SettingItem icon="info-outline" label="关于 TidyZen" iconBg={colors.softBlue + '30'}
            right={<View style={styles.rightRow}><Text style={styles.hintText}>v1.0.0</Text><MaterialIcons name="chevron-right" size={22} color={colors.outline} /></View>}
            onPress={() => router.push('/about')}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.7}
          onPress={() => {
            Alert.alert(
              '退出登录',
              '退出登录后，您将无法使用以下功能：\n\n• 同步扫描记录到云端\n• 跨设备查看历史趋势\n• 解锁「整理达人」徽章\n\n退出登录功能正在开发中，预计 v1.1 上线。',
              [
                { text: '我再想想', style: 'cancel' },
                {
                  text: '仍要退出',
                  style: 'destructive',
                  onPress: () => Alert.alert('功能开发中', '退出登录功能正在开发中，预计 v1.1 上线。'),
                },
              ],
            );
          }}
        >
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.pageMargin, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 20, color: colors.onSurface },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FAF5', borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg, ...shadows.card },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: 60, height: 60, borderRadius: 30 },
  userInfo: { flex: 1, marginLeft: spacing.md },
  nickname: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 16, color: colors.primary, marginBottom: 4 },
  levelTag: { alignSelf: 'flex-start', backgroundColor: colors.primaryContainer, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.primary + '40', paddingHorizontal: 8, paddingVertical: 2 },
  levelText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 12, color: colors.primary },
  groupTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: '#5A7A6E', marginBottom: spacing.sm, marginTop: spacing.sm, paddingHorizontal: spacing.xs },
  groupCard: { backgroundColor: colors.paperWhite, borderRadius: radius.lg, overflow: 'hidden', ...shadows.card, marginBottom: spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md, minHeight: 48, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.outlineVariant + '60' },
  itemIconWrap: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  itemContent: { flex: 1, marginLeft: spacing.md },
  itemLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 16, color: colors.onSurface },
  itemSubtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  hintText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.onSurfaceVariant },
  cacheSize: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurfaceVariant },
  logoutBtn: { alignSelf: 'center', width: '80%', height: 56, borderRadius: 24, backgroundColor: '#FFEBE8', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  logoutText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 16, color: '#C0392B' },
});
