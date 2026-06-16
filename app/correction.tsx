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
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TidyZen</Text>
        <View style={styles.avatarPlaceholder}>
          <MaterialIcons name="person" size={20} color={colors.onSurfaceVariant} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 标题提示区 */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>选择你房间的问题</Text>
          <Text style={styles.subTitle}>
            AI 可能没看准，告诉我们你真正想整理什么？
          </Text>
        </View>

        {/* 场景网格 */}
        <View style={styles.grid}>
          {SCENES.map((scene) => {
            const selected = selectedScenarios.includes(scene.id);
            return (
              <TouchableOpacity
                key={scene.id}
                style={[styles.sceneCard, selected && styles.sceneCardSelected]}
                onPress={() => toggleScene(scene.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.sceneIconWrap,
                    selected && styles.sceneIconWrapSelected,
                  ]}
                >
                  <MaterialIcons
                    name={scene.icon as any}
                    size={24}
                    color={selected ? colors.paperWhite : colors.onSurfaceVariant}
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
        </View>
      </ScrollView>

      {/* 底部确认按钮 */}
      <SafeAreaView edges={['bottom']}>
        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              selectedScenarios.length === 0 && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            activeOpacity={0.8}
            disabled={selectedScenarios.length === 0}
          >
            <Text style={styles.confirmText}>
              {selectedScenarios.length > 0
                ? `确认场景，重新分析（已选 ${selectedScenarios.length}/2）`
                : '请选择场景'}
            </Text>
            <MaterialIcons name="auto-awesome" size={20} color={colors.onPrimary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },

  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.pageMargin,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: spacing.pageMargin,
    paddingBottom: 20,
  },

  // 标题提示区
  titleSection: {
    marginBottom: spacing.lg,
  },
  mainTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 24,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  subTitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },

  // 场景网格
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sceneCard: {
    width: '47%',
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    ...shadows.card,
  },
  sceneCardSelected: {
    borderColor: '#2D6E4E',
    backgroundColor: '#E6F7F0',
  },
  sceneIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  sceneIconWrapSelected: {
    backgroundColor: '#2D6E4E',
  },
  sceneName: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: 2,
  },
  sceneNameSelected: {
    color: '#2D6E4E',
  },
  sceneDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: '#888888',
  },
  checkMark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2D6E4E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 底部确认按钮
  bottomArea: {
    paddingHorizontal: spacing.pageMargin,
    paddingBottom: spacing.md,
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: '#2D6E4E',
    borderRadius: radius.full,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: { opacity: 0.4 },
  confirmText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onPrimary,
  },
});
