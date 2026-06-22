import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../constants/theme';
import { useState, useCallback } from 'react';
import { saveSetting, getSettings } from '../services/storage';
import type { SceneLabel } from '../types/analysis';

// ── 房间模板数据 ──
interface RoomTemplate {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  desc: string;
  tags: string[];
  /** 默认场景类型，用于 AI 分析时传给后端 */
  defaultScene: SceneLabel;
  selected?: boolean;
}

/** 5 个内置房间模板 */
const TEMPLATE_DEFS: RoomTemplate[] = [
  {
    id: 'rental',
    name: '出租屋',
    icon: 'apartment',
    desc: '聚焦收纳空间不足与多功能分区优化，平衡生活与工作节奏。',
    tags: ['小户型', '多功能', '收纳'],
    defaultScene: 'living_room',
  },
  {
    id: 'dorm',
    name: '宿舍',
    icon: 'domain',
    desc: '适合学生宿舍的紧凑空间整理方案，兼顾学习与生活区域。',
    tags: ['紧凑空间', '共享', '学习区'],
    defaultScene: 'bedroom',
  },
  {
    id: 'bedroom',
    name: '卧室',
    icon: 'bed',
    desc: '打造舒适的睡眠与休息环境，优化衣物收纳与床面整洁。',
    tags: ['睡眠', '衣物收纳', '舒适'],
    defaultScene: 'bedroom',
  },
  {
    id: 'living_room',
    name: '客厅',
    icon: 'weekend',
    desc: '公共区域的空间布局与动线优化，提升家庭生活品质。',
    tags: ['公共区域', '动线', '会客'],
    defaultScene: 'living_room',
  },
  {
    id: 'office',
    name: '办公室',
    icon: 'desktop-windows',
    desc: '桌面与工位整理，营造专注的工作环境与高效动线。',
    tags: ['工作区', '专注', '动线'],
    defaultScene: 'desk_area',
  },
];

/** AsyncStorage settings 内的键名，存放 JSON 字符串：string[] of template ids */
const SELECTED_TEMPLATES_KEY = 'roomTemplates.selectedIds';

export default function RoomTemplatesScreen() {
  const [templates, setTemplates] = useState<RoomTemplate[]>(() =>
    TEMPLATE_DEFS.map((t) => ({ ...t, selected: false }))
  );

  /** 把当前选中 id 集合持久化 */
  const persistSelection = useCallback(async (next: RoomTemplate[]) => {
    const ids = next.filter((t) => t.selected).map((t) => t.id);
    await saveSetting(SELECTED_TEMPLATES_KEY, JSON.stringify(ids));
  }, []);

  // 页面聚焦时从 storage 读取已选模板
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const settings = await getSettings();
        const raw = settings[SELECTED_TEMPLATES_KEY];
        let selectedIds: string[] = [];
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) selectedIds = parsed.filter((x) => typeof x === 'string');
          } catch {
            // 异常数据忽略，回退到无选中
          }
        }
        if (cancelled) return;
        setTemplates(
          TEMPLATE_DEFS.map((t) => ({ ...t, selected: selectedIds.includes(t.id) }))
        );
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const toggleSelect = (id: string) => {
    setTemplates((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      );
      // 持久化不阻塞 UI
      persistSelection(next);
      return next;
    });
  };

  const handleConfirm = () => {
    if (selectedCount === 0) {
      Alert.alert('提示', '请至少选择一个房间模板');
      return;
    }
    Alert.alert('已保存', `已选择 ${selectedCount} 个模板，AI 将基于此生成建议`, [
      { text: '好的', onPress: () => router.canGoBack() && router.back() },
    ]);
  };

  const selectedCount = templates.filter((t) => t.selected).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── 顶部导航栏 ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>房间模板管理</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 空间类型定制标题区 ── */}
        <Text style={styles.mainTitle}>空间类型定制</Text>
        <Text style={styles.mainDesc}>
          选择您当前的居住场景，AI 将为您生成最符合空间的动线优化建议与整理方案。
        </Text>

        {/* ── 空间选择卡片列表 ── */}
        {templates.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              item.selected && styles.cardSelected,
            ]}
            activeOpacity={0.7}
            onPress={() => toggleSelect(item.id)}
          >
            {/* 选中图标 */}
            {item.selected && (
              <View style={styles.checkCircle}>
                <MaterialIcons name="check" size={14} color="#FFFFFF" />
              </View>
            )}

            {/* 图标 */}
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: item.selected ? '#FFF8E1' : '#E8F5E9',
                },
              ]}
            >
              <MaterialIcons
                name={item.icon}
                size={24}
                color="#2E7D32"
              />
            </View>

            {/* 标题 */}
            <Text style={styles.cardTitle}>{item.name}</Text>

            {/* 描述 */}
            <Text style={styles.cardDesc}>{item.desc}</Text>

            {/* 标签组 */}
            <View style={styles.tagRow}>
              {item.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        {/* ── 确认按钮 ── */}
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.8} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>
            确认并开始优化
            {selectedCount > 0 ? `（已选 ${selectedCount} 项）` : ''}
          </Text>
        </TouchableOpacity>

        {/* ── 底部 AI 信息卡片 ── */}
        <View style={styles.aiCard}>
          <View style={styles.aiCardContent}>
            <Text style={styles.aiCardTitle}>空间感知 AI</Text>
            <Text style={styles.aiCardDesc}>
              基于"Perceptual Serenity"美学，我们将深度分析您选择的场景，为您平衡美学高度与生活便捷度。
            </Text>
          </View>
          {/* 装饰图标 */}
          <MaterialCommunityIcons
            name="head-snowflake-outline"
            size={60}
            color="#E0F2F1"
            style={styles.aiDecoIcon}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // ── 顶部导航栏 ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 56,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 18,
    color: '#333333',
  },

  // ── 主内容区 ──
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  mainTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 22,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  mainDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 21,
    marginBottom: 24,
  },

  // ── 卡片 ──
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: 16,
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: '#2E7D32',
  },
  checkCircle: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 16,
    color: '#1A1A1A',
    marginTop: 12,
  },
  cardDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginTop: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 11,
    color: '#444444',
  },

  // ── 确认按钮 ──
  confirmBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 28,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
    marginTop: 24,
  },
  confirmBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },

  // ── AI 信息卡 ──
  aiCard: {
    backgroundColor: '#FDF6EC',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  aiCardContent: {
    flex: 1,
  },
  aiCardTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 6,
  },
  aiCardDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
  },
  aiDecoIcon: {
    marginLeft: 8,
  },
});
