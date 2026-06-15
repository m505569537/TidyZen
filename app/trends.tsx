import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';
import { SegmentedControl } from '../components';
import { useState } from 'react';

const screenWidth = Dimensions.get('window').width;

const TREND_DATA = [
  { date: '6/5', score: 65 },
  { date: '6/8', score: 78 },
  { date: '6/10', score: 92 },
  { date: '6/12', score: 72 },
  { date: '6/15', score: 85 },
];

export default function TrendsScreen() {
  const [period, setPeriod] = useState('month');
  const chartHeight = 200;
  const chartWidth = screenWidth - spacing.pageMargin * 2 - 40;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} onPress={() => router.back()} />
          <Text style={styles.title}>整理足迹</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.segmentWrapper}>
          <SegmentedControl options={['本周', '本月', '全部']} selected={period} onChange={setPeriod} />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>整洁度趋势</Text>
          <View style={[styles.chartArea, { height: chartHeight, width: chartWidth }]}>
            <View style={styles.yAxis}>
              <Text style={styles.axisLabel}>100</Text>
              <Text style={styles.axisLabel}>50</Text>
              <Text style={styles.axisLabel}>0</Text>
            </View>
            <View style={styles.barsContainer}>
              {TREND_DATA.map((point, i) => {
                const barHeight = (point.score / 100) * (chartHeight - 20);
                return (
                  <View key={i} style={styles.barGroup}>
                    <Text style={styles.barValue}>{point.score}</Text>
                    <View style={[styles.bar, { height: barHeight, backgroundColor: point.score >= 70 ? colors.healingGreen : point.score >= 40 ? colors.warmAmber : colors.error }]} />
                    <Text style={styles.barLabel}>{point.date}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>总分析次数</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.healingGreen }]}>78.4</Text>
            <Text style={styles.statLabel}>平均得分</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.warmAmber }]}>+20</Text>
            <Text style={styles.statLabel}>总提升</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  title: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.headlineMd.fontSize, color: colors.onSurface },
  segmentWrapper: { marginBottom: spacing.lg },
  chartCard: { backgroundColor: colors.paperWhite, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  chartTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyLg.fontSize, color: colors.onSurface, marginBottom: spacing.md },
  chartArea: { flexDirection: 'row' },
  yAxis: { justifyContent: 'space-between', paddingRight: spacing.sm, height: '100%' },
  axisLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 10, color: colors.onSurfaceVariant },
  barsContainer: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', borderLeftWidth: 1, borderBottomWidth: 1, borderColor: colors.outlineVariant },
  barGroup: { alignItems: 'center', gap: 4 },
  barValue: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 12, color: colors.onSurface },
  bar: { width: 32, borderRadius: radius.sm, minHeight: 4 },
  barLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 10, color: colors.onSurfaceVariant },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: { flex: 1, backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  statValue: { fontFamily: 'BeVietnamPro_700Bold', fontSize: typography.headlineLg.fontSize, color: colors.primary },
  statLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.labelCaps.fontSize, color: colors.onSurfaceVariant, marginTop: 2 },
});
