import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { SegmentedControl, EmptyState, RecordCard, TipsModal } from '../../components';
import { useHistoryStore } from '../../stores/history';
import { getHistoryRecords } from '../../services/storage';

export default function HistoryScreen() {
  const { filter, setFilter, records, setRecords } = useHistoryStore();
  const [tipsVisible, setTipsVisible] = useState(false);

  // 从持久化存储加载历史记录到 store
  useEffect(() => {
    getHistoryRecords().then(setRecords);
  }, [setRecords]);

  const filteredRecords = records.filter((_r) => {
    if (filter === 'all') return true;
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航栏：深绿背景 */}
      <View style={styles.navbar}>
        {/* 左侧汉堡菜单 */}
        <TouchableOpacity style={styles.navIconBtn}>
          <MaterialIcons name="menu" size={24} color={colors.onPrimary} />
        </TouchableOpacity>

        {/* 中间标题 */}
        <Text style={styles.navTitle}>整理记录</Text>

        {/* 右侧：筛选图标 + 圆形头像 */}
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navIconBtn}>
            <MaterialIcons name="filter-list" size={22} color={colors.onPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarBtn}>
            <MaterialIcons name="person" size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 时间段筛选标签栏 */}
      <View style={styles.segmentWrapper}>
        <SegmentedControl
          options={['全部', '本周', '本月']}
          selected={filter}
          onChange={(v) => setFilter(v as 'all' | 'week' | 'month')}
        />
      </View>

      {/* 整理秘籍入口 */}
      <TouchableOpacity
        style={styles.tipsEntry}
        activeOpacity={0.8}
        onPress={() => setTipsVisible(true)}
      >
        <View style={styles.tipsIconWrap}>
          <MaterialIcons name="lightbulb" size={20} color="#3E9E77" />
        </View>
        <View style={styles.tipsTextWrap}>
          <Text style={styles.tipsTitle}>整理秘籍：办公桌线缆</Text>
          <Text style={styles.tipsSubtitle}>3 步搞定线缆收纳</Text>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
      </TouchableOpacity>

      {/* 列表 / 空状态 */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          icon="photo-camera"
          title="还没有整理记录"
          description="拍张照片，开始你的第一次整理吧"
          actionLabel="去拍照"
          onAction={() => router.push('/camera')}
        />
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecordCard
              record={item}
              onPress={() => router.push(`/record/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 整理秘籍弹窗 */}
      <TipsModal
        visible={tipsVisible}
        onClose={() => setTipsVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  // ── 导航栏 ──
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2E7D32',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 52,
  },
  navIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onPrimary,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ── 分段控制器 ──
  segmentWrapper: {
    paddingHorizontal: spacing.pageMargin,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  // ── 整理秘籍入口 ──
  tipsEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paperWhite,
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    gap: spacing.md,
  },
  tipsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: '#D4F5E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsTextWrap: {
    flex: 1,
  },
  tipsTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    marginBottom: 2,
  },
  tipsSubtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  // ── 列表 ──
  list: {
    paddingHorizontal: spacing.pageMargin,
    paddingBottom: 100,
  },
});
