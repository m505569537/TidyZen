import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';
import { SCENES } from '../constants/scenes';
import { useAnalysisStore } from '../stores/analysis';
import { analyzeImage } from '../services/ai';
import type { ScenarioId } from '../types/analysis';

export default function CorrectionScreen() {
  const { selectedScenarios, setSelectedScenarios, photoBase64, setResult } = useAnalysisStore();

  const toggleScene = (id: ScenarioId) => {
    if (selectedScenarios.includes(id)) {
      setSelectedScenarios(selectedScenarios.filter((s) => s !== id));
    } else if (selectedScenarios.length >= 2) {
      Alert.alert('最多选择 2 个场景', '一次最多选择 2 个场景，请先取消已选的再选新的。');
    } else {
      setSelectedScenarios([...selectedScenarios, id]);
    }
  };

  const handleConfirm = async () => {
    if (selectedScenarios.length === 0) {
      Alert.alert('请至少选择一个场景');
      return;
    }
    if (!photoBase64) {
      router.replace('/camera');
      return;
    }
    router.replace('/analyzing');
    try {
      const correctionHint = selectedScenarios.join(',');
      const result = await analyzeImage(photoBase64, correctionHint);
      result.photoUri = useAnalysisStore.getState().photoUri ?? '';
      setResult(result);
    } catch {
      // fallback
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>手动选择场景</Text>
        <View style={styles.backBtn} />
      </View>

      <Text style={styles.subtitle}>AI 可能没看准，告诉我们你真正想整理什么？</Text>

      {/* 场景网格 */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {SCENES.map((scene) => {
          const selected = selectedScenarios.includes(scene.id);
          return (
            <TouchableOpacity
              key={scene.id}
              style={[styles.sceneCard, selected && styles.sceneCardSelected]}
              onPress={() => toggleScene(scene.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.sceneIconWrap, selected && { backgroundColor: colors.primaryContainer + '60' }]}>
                <MaterialIcons
                  name={scene.icon as any}
                  size={28}
                  color={selected ? colors.primary : colors.onSurfaceVariant}
                />
              </View>
              <Text style={[styles.sceneName, selected && styles.sceneNameSelected]}>
                {scene.name}
              </Text>
              <Text style={styles.sceneDesc}>{scene.description}</Text>
              {selected && (
                <View style={styles.checkMark}>
                  <MaterialIcons name="check" size={14} color={colors.onPrimary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 底部确认按钮 */}
      <SafeAreaView edges={['bottom']}>
        <TouchableOpacity
          style={[styles.confirmButton, selectedScenarios.length === 0 && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.8}
          disabled={selectedScenarios.length === 0}
        >
          <Text style={styles.confirmText}>
            {selectedScenarios.length > 0
              ? `确认场景，重新分析（已选 ${selectedScenarios.length}/2）`
              : '请选择场景'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
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
  title: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    paddingHorizontal: spacing.pageMargin,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.pageMargin, gap: spacing.sm,
    paddingBottom: 100,
  },
  sceneCard: {
    width: '47%',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2, borderColor: 'transparent',
    position: 'relative',
    ...shadows.card,
  },
  sceneCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryContainer + '25',
  },
  sceneIconWrap: {
    width: 48, height: 48, borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  sceneName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  sceneNameSelected: { color: colors.primary },
  sceneDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  checkMark: {
    position: 'absolute', top: 10, right: 10,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.pageMargin,
    borderRadius: radius.full, padding: spacing.md,
    marginBottom: spacing.md, alignItems: 'center',
  },
  confirmButtonDisabled: { opacity: 0.4 },
  confirmText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onPrimary,
  },
});
