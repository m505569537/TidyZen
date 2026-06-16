import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Button } from '../../components';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const suggestion = {
    title: '椅子急救法',
    type: 'must_do' as const,
    difficulty: 'easy' as const,
    time_cost: '3分钟',
    items_needed: [] as string[],
    expected_effect: '视觉整洁度+40%',
    content: '1. 穿过的衣服全部挂进衣柜（哪怕只是挂着）\n2. 干净衣服叠成方块竖放（像摆书一样）\n3. 脏衣服直接踢进洗衣篮',
    acceptance_criteria: '椅子和床单露出 80% 原色',
  };

  const steps = suggestion.content.split('\n').filter(Boolean);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>整理指引</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 标题区域 */}
        <View style={styles.titleSection}>
          <View style={[styles.typeBadge, {
            backgroundColor: suggestion.type === 'must_do' ? colors.primary : colors.outlineVariant
          }]}>
            <Text style={[styles.typeText, {
              color: suggestion.type === 'must_do' ? colors.onPrimary : colors.onSurfaceVariant
            }]}>
              {suggestion.type === 'must_do' ? '必做' : '备选'}
            </Text>
          </View>
          <Text style={styles.title}>{suggestion.title}</Text>
        </View>

        {/* 元信息行 */}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <MaterialIcons name="timer" size={16} color={colors.onSurfaceVariant} />
            <Text style={styles.metaText}>{suggestion.time_cost}</Text>
          </View>
          <View style={styles.metaChip}>
            <MaterialIcons name="star" size={16} color={colors.warmAmber} />
            <Text style={styles.metaText}>
              {suggestion.difficulty === 'easy' ? '简单' : '中等'}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <MaterialIcons name="inventory-2" size={16} color={colors.onSurfaceVariant} />
            <Text style={styles.metaText}>
              {suggestion.items_needed.length === 0 ? '零成本' : suggestion.items_needed.join(', ')}
            </Text>
          </View>
        </View>

        {/* 操作步骤 */}
        <Text style={styles.sectionTitle}>操作步骤</Text>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step.replace(/^\d+\.\s*/, '')}</Text>
          </View>
        ))}

        {/* 验收标准 */}
        <View style={styles.criteriaCard}>
          <MaterialIcons name="verified" size={20} color={colors.healingGreen} />
          <Text style={styles.criteriaText}>验收标准：{suggestion.acceptance_criteria}</Text>
        </View>

        {/* 预期效果 */}
        <View style={styles.effectCard}>
          <Text style={styles.effectLabel}>预期效果</Text>
          <Text style={styles.effectValue}>{suggestion.expected_effect}</Text>
        </View>

        {/* 视频教程按钮 */}
        <Button
          title="查看视频教程（15秒）"
          onPress={() => router.push(`/video/${id}`)}
          variant="outline"
          icon={<MaterialIcons name="play-circle" size={22} color={colors.primary} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.pageMargin, paddingVertical: spacing.md,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 60 },

  // 标题
  titleSection: { marginBottom: spacing.lg },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 3,
    borderRadius: radius.full, marginBottom: spacing.sm,
  },
  typeText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.labelCaps.fontSize,
  },
  title: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: typography.headlineLg.fontSize,
    color: colors.onSurface,
  },

  // 元信息
  metaRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: spacing.sm + 4, paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  metaText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },

  // 步骤
  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  stepCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.paperWhite, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm,
    gap: spacing.md, ...shadows.card,
  },
  stepNumber: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onPrimary,
  },
  stepText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface, flex: 1, lineHeight: 24,
  },

  // 验收标准
  criteriaCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.healingGreen + '15',
    borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.md, gap: spacing.sm,
  },
  criteriaText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface, flex: 1, lineHeight: 24,
  },

  // 预期效果
  effectCard: {
    backgroundColor: colors.primaryContainer + '30',
    borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.lg, alignItems: 'center',
  },
  effectLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },
  effectValue: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.primary, marginTop: 2,
  },
});
