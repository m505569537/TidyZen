import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadows } from '../../constants/theme';

const templates = [
  { id: '1', name: '租房', icon: 'apartment', desc: '适合出租屋的空间整理方案', count: 12 },
  { id: '2', name: '宿舍', icon: 'domain', desc: '学生宿舍的空间优化建议', count: 8 },
  { id: '3', name: '卧室', icon: 'bed', desc: '卧室整理与收纳指南', count: 15 },
  { id: '4', name: '客厅', icon: 'weekend', desc: '客厅空间布局与整理', count: 10 },
  { id: '5', name: '厨房', icon: 'restaurant', desc: '厨房收纳与清洁方案', count: 9 },
  { id: '6', name: '书房', icon: 'menu-book', desc: '书房整理与学习空间优化', count: 7 },
];

export default function RoomTemplatesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>房间模板管理</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>选择房间类型，获取专属整理方案</Text>
        
        {templates.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.7}>
            <View style={[styles.iconWrap, { backgroundColor: colors.primaryContainer }]}>
              <MaterialIcons name={item.icon as any} size={28} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.count} 个方案</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.pageMargin, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 20, color: colors.onSurface },
  content: { padding: spacing.pageMargin, paddingBottom: 40 },
  subtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurfaceVariant, marginBottom: spacing.lg },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paperWhite, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, ...shadows.card },
  iconWrap: { width: 52, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, marginLeft: spacing.md },
  cardTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.onSurface },
  cardDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
  badge: { backgroundColor: colors.primaryContainer, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 4, marginRight: spacing.sm },
  badgeText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 12, color: colors.primary },
});
