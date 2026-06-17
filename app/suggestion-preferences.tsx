import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../constants/theme';
import { useState } from 'react';

// ── 杂物类型数据 ──
interface ClutterCategory {
  id: string;
  name: string;
  desc: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconBg: string;
  enabled: boolean;
}

const defaultCategories: ClutterCategory[] = [
  {
    id: '1',
    name: '衣物与织物',
    desc: '床面、沙发或椅子上的散乱衣物',
    icon: 'tshirt-crew-outline',
    iconBg: '#E8F5E9',
    enabled: true,
  },
  {
    id: '2',
    name: '桌面杂物',
    desc: '书桌、餐桌等平面上的零散物品',
    icon: 'desk-lamp-on',
    iconBg: '#F5F5F5',
    enabled: true,
  },
  {
    id: '3',
    name: '地面堆积',
    desc: '地板上堆放的杂物与未归类物品',
    icon: 'floor-lamp-outline',
    iconBg: '#F5F5F5',
    enabled: false,
  },
  {
    id: '4',
    name: '纸箱与包裹',
    desc: '未拆封的快递与闲置纸箱',
    icon: 'package-variant-closed',
    iconBg: '#E8F5E9',
    enabled: true,
  },
  {
    id: '5',
    name: '电线管理',
    desc: '杂乱的充电线、数据线和插座',
    icon: 'power-plug-outline',
    iconBg: '#FFF3E0',
    enabled: true,
  },
];

export default function SuggestionPreferencesScreen() {
  const [categories, setCategories] = useState(defaultCategories);

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const enabledCount = categories.filter((c) => c.enabled).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── 顶部导航栏 ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>建议库偏好</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <MaterialIcons name="search" size={24} color="#333333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <MaterialIcons name="person-outline" size={24} color="#333333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Banner 区 ── */}
        <View style={styles.banner}>
          <View style={styles.bannerOverlay} />
          {/* 装饰性背景元素 */}
          <View style={styles.bannerDecoCircle1} />
          <View style={styles.bannerDecoCircle2} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>建议库偏好</Text>
            <Text style={styles.bannerSubtitle}>定制你的 AI 整理管家</Text>
          </View>
        </View>

        {/* ── 说明文字区 ── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            选择你希望 AI 在房间分析中重点识别的杂物类型。关闭开关后，该类别的整理建议将不再出现在分析报告中，让建议结果更符合你的生活习惯。
          </Text>
        </View>

        {/* ── 杂物类型过滤区 ── */}
        <Text style={styles.sectionTitle}>杂物类型过滤</Text>

        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.filterRow}
            activeOpacity={0.7}
            onPress={() => toggleCategory(item.id)}
          >
            {/* 左侧圆形图标 */}
            <View style={[styles.filterIconWrap, { backgroundColor: item.iconBg }]}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color="#333333"
              />
            </View>

            {/* 中间文字区 */}
            <View style={styles.filterContent}>
              <Text style={styles.filterName}>{item.name}</Text>
              <Text style={styles.filterDesc}>{item.desc}</Text>
            </View>

            {/* 右侧开关 */}
            <Switch
              value={item.enabled}
              onValueChange={() => toggleCategory(item.id)}
              trackColor={{ true: '#2196F3', false: '#999999' }}
              thumbColor="#FFFFFF"
              style={styles.toggle}
            />
          </TouchableOpacity>
        ))}

        {/* ── 底部提示卡 ── */}
        <View style={styles.tipCard}>
          {/* 顶部图标 */}
          <View style={styles.tipIconRow}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={24}
              color="#4CAF50"
            />
          </View>

          <Text style={styles.tipTitle}>AI 正在学习你的整理风格</Text>
          <Text style={styles.tipDesc}>
            根据你的开关记录，我们会自动微调 AI 的评分权重，为你提供更精准的整洁度评分。
          </Text>
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
    paddingHorizontal: spacing.sm,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── 主内容区 ──
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Banner 区 ──
  banner: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2E7D32',
    position: 'relative',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(46, 125, 50, 0.85)',
  },
  bannerDecoCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bannerDecoCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  bannerTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  // ── 说明文字区 ──
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  infoText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
  },

  // ── 杂物类型过滤区 ──
  sectionTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 16,
    color: '#333333',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
  },
  filterIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContent: {
    flex: 1,
    marginLeft: 16,
  },
  filterName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 16,
    color: '#333333',
  },
  filterDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginTop: 4,
  },
  toggle: {
    marginLeft: 16,
  },

  // ── 底部提示卡 ──
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  tipIconRow: {
    marginBottom: 12,
  },
  tipTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  tipDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    textAlign: 'center',
  },
});
