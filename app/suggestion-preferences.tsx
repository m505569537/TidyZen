import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadows } from '../constants/theme';
import { useState } from 'react';

const categories = [
  { id: '1', name: '衣物整理', icon: 'checkroom', enabled: true },
  { id: '2', name: '桌面收纳', icon: 'desktop-windows', enabled: true },
  { id: '3', name: '厨房清洁', icon: 'restaurant', enabled: false },
  { id: '4', name: '书房整理', icon: 'menu-book', enabled: true },
  { id: '5', name: '客厅布局', icon: 'weekend', enabled: false },
  { id: '6', name: '卫生间清洁', icon: 'shower', enabled: true },
];

const difficultyLevels = [
  { id: 'easy', name: '简单', desc: '5分钟内完成的小任务', selected: true },
  { id: 'medium', name: '中等', desc: '10-15分钟的整理任务', selected: false },
  { id: 'hard', name: '挑战', desc: '30分钟以上的深度整理', selected: false },
];

export default function SuggestionPreferencesScreen() {
  const [prefs, setPrefs] = useState(categories);

  const togglePref = (id: string) => {
    setPrefs(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>建议库偏好</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>建议类别</Text>
        <Text style={styles.sectionDesc}>选择你感兴趣的整理类别</Text>
        
        <View style={styles.card}>
          {prefs.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.prefRow, index < prefs.length - 1 && styles.borderBottom]}
              onPress={() => togglePref(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, { backgroundColor: item.enabled ? colors.primaryContainer : colors.surfaceContainer }]}>
                <MaterialIcons name={item.icon as any} size={22} color={item.enabled ? colors.primary : colors.onSurfaceVariant} />
              </View>
              <Text style={[styles.prefName, !item.enabled && styles.disabledText]}>{item.name}</Text>
              <Switch 
                value={item.enabled} 
                onValueChange={() => togglePref(item.id)}
                trackColor={{ true: colors.primary, false: colors.outlineVariant }}
                thumbColor={colors.paperWhite}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>难度偏好</Text>
        <Text style={styles.sectionDesc}>选择适合你的任务难度</Text>
        
        <View style={styles.card}>
          {difficultyLevels.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.diffRow, index < difficultyLevels.length - 1 && styles.borderBottom]}
              activeOpacity={0.7}
            >
              <View style={[styles.radio, item.selected && styles.radioSelected]}>
                {item.selected && <View style={styles.radioInner} />}
              </View>
              <View style={styles.diffContent}>
                <Text style={styles.diffName}>{item.name}</Text>
                <Text style={styles.diffDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  sectionTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.onSurface, marginBottom: spacing.xs },
  sectionDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: colors.onSurfaceVariant, marginBottom: spacing.md },
  card: { backgroundColor: colors.paperWhite, borderRadius: radius.lg, overflow: 'hidden', ...shadows.card },
  prefRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  borderBottom: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.outlineVariant + '60' },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  prefName: { flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: 15, color: colors.onSurface, marginLeft: spacing.md },
  disabledText: { color: colors.onSurfaceVariant },
  diffRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  diffContent: { flex: 1, marginLeft: spacing.md },
  diffName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 15, color: colors.onSurface },
  diffDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
});
