import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { SegmentedControl, EmptyState, RecordCard } from '../../components';
import { useHistoryStore } from '../../stores/history';
import type { HistoryRecord } from '../../types/analysis';

// Mock 数据
const MOCK_RECORDS: HistoryRecord[] = [
  { id: '1', score: 85, createdAt: '6月15日 14:30', clutterTags: ['衣物堆积', '纸箱'], scoreChange: 15, thumbnailUri: undefined },
  { id: '2', score: 72, createdAt: '6月12日 10:15', clutterTags: ['桌面杂物', '电线缠绕', '书籍', '瓶罐'], scoreChange: -5, thumbnailUri: undefined },
  { id: '3', score: 92, createdAt: '6月10日 18:00', clutterTags: ['整体整洁'], scoreChange: undefined, thumbnailUri: undefined },
  { id: '4', score: 78, createdAt: '6月8日 09:45', clutterTags: ['纸张整理'], scoreChange: 8, thumbnailUri: undefined },
  { id: '5', score: 65, createdAt: '6月5日 21:20', clutterTags: ['鞋履摆放'], scoreChange: -12, thumbnailUri: undefined },
];

export default function HistoryScreen() {
  const { filter, setFilter } = useHistoryStore();
  const records = MOCK_RECORDS;

  const filteredRecords = records.filter((r) => {
    if (filter === 'all') return true;
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>整理记录</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialIcons name="filter-list" size={22} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* 分段控制器 */}
      <View style={styles.segmentWrapper}>
        <SegmentedControl
          options={['全部', '本周', '本月']}
          selected={filter}
          onChange={(v) => setFilter(v as 'all' | 'week' | 'month')}
        />
      </View>

      {/* 列表 */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.pageMargin, paddingVertical: spacing.md,
  },
  title: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineLgMobile?.fontSize ?? 24,
    lineHeight: typography.headlineLgMobile?.lineHeight ?? 32,
    color: colors.onSurface,
  },
  filterBtn: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  segmentWrapper: { paddingHorizontal: spacing.pageMargin, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.pageMargin, paddingBottom: 100 },
});
