import { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { useAnalysisStore } from '../../stores/analysis';

export default function ScanTab() {
  const setPhoto = useAnalysisStore((s) => s.setPhoto);
  const reset = useAnalysisStore((s) => s.reset);

  // 每次进入 scan tab 时清空旧的分析状态，保证新的扫描从空白开始
  useFocusEffect(
    useCallback(() => {
      reset();
    }, [reset]),
  );

  const handleCamera = () => {
    router.push('/camera');
  };

  const handleGallery = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('需要相册权限', '请在系统设置中允许 TidyZen 访问相册。');
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true,
      });

      if (res.canceled) return;
      const asset = res.assets?.[0];
      if (asset?.uri && asset?.base64) {
        setPhoto(asset.uri, asset.base64);
        router.push('/analyzing');
      } else {
        Alert.alert('选择失败', '无法读取所选图片，请重试。');
      }
    } catch {
      Alert.alert('选择失败', '打开相册时出错，请重试。');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 顶部品牌 + 标题 */}
      <View style={styles.header}>
        <Text style={styles.brand}>TidyZen AI</Text>
        <Text style={styles.title}>开始一次整理扫描</Text>
        <Text style={styles.subtitle}>拍摄或选择一张房间照片，AI 会分析整洁度并给出整理建议。</Text>
      </View>

      {/* 主操作区：两张大卡片 */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionCard, styles.primaryCard]}
          onPress={handleCamera}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, styles.iconCirclePrimary]}>
            <MaterialIcons name="camera-alt" size={32} color={colors.onPrimary} />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={[styles.actionTitle, styles.actionTitleOnPrimary]}>拍照扫描</Text>
            <Text style={[styles.actionDesc, styles.actionDescOnPrimary]}>
              打开相机，对准房间拍摄实时画面
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.onPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.secondaryCard]}
          onPress={handleGallery}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, styles.iconCircleSecondary]}>
            <MaterialIcons name="photo-library" size={32} color={colors.primary} />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>从相册选择</Text>
            <Text style={styles.actionDesc}>挑选一张已有的房间照片进行分析</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* 隐私小提示 */}
      <View style={styles.footer}>
        <MaterialIcons name="verified-user" size={16} color={colors.onSurfaceVariant} />
        <Text style={styles.footerText}>所有照片仅用于本次分析，不会上传到云端</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.pageMargin,
  },

  // 头部
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  brand: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.labelCaps.fontSize,
    letterSpacing: typography.labelCaps.letterSpacing,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineLg.fontSize,
    lineHeight: typography.headlineLg.lineHeight,
    color: colors.onSurface,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.onSurfaceVariant,
  },

  // 主操作区
  actions: {
    flex: 1,
    gap: spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  primaryCard: {
    backgroundColor: colors.primary,
  },
  secondaryCard: {
    backgroundColor: colors.paperWhite,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCirclePrimary: {
    backgroundColor: colors.primaryDark,
  },
  iconCircleSecondary: {
    backgroundColor: colors.primaryContainer,
  },
  actionTextWrap: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.headlineMd.fontSize,
    lineHeight: typography.headlineMd.lineHeight,
    color: colors.onSurface,
  },
  actionTitleOnPrimary: {
    color: colors.onPrimary,
  },
  actionDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  actionDescOnPrimary: {
    color: colors.onPrimaryContainer,
  },

  // 底部
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.labelCaps.fontSize,
    color: colors.onSurfaceVariant,
  },
});
