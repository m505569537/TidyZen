import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import { useRef, useState } from 'react';
import { colors, typography, spacing, radius } from '../constants/theme';
import { useAnalysisStore } from '../stores/analysis';
import { BoundingBox } from '../components';

/**
 * Get image as base64 for API analysis.
 * Uses the base64 directly from ImagePicker.
 * Note: On iOS, photos may be HEIC format. The API supports jpeg/png/webp.
 * If the API rejects the format, the error message will guide the user.
 */
async function getImageBase64(uri: string, pickerBase64?: string): Promise<{ uri: string; base64: string }> {
  if (pickerBase64) {
    console.log('[camera] getImageBase64: using picker base64, length=', pickerBase64.length, 'prefix=', pickerBase64.slice(0, 6));
    return { uri, base64: pickerBase64 };
  }
  throw new Error('无法获取图片 base64');
}

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [active, setActive] = useState(true);
  const setPhoto = useAnalysisStore((s) => s.setPhoto);

  const handleBack = () => {
    setActive(false);
    // 优先回到上一页（通常是 scan tab 落地页）；无历史时兜底到 scan tab
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/scan');
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen} edges={['top', 'bottom']}>
        <TouchableOpacity style={styles.permissionBackBtn} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIconWrap}>
            <MaterialIcons name="camera-alt" size={48} color={colors.primary} />
          </View>
          <Text style={styles.permissionTitle}>需要相机权限</Text>
          <Text style={styles.permissionDesc}>
            TidyZen 需要访问相机来拍摄房间照片，以便 AI 分析整洁度。
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission} activeOpacity={0.8}>
            <Text style={styles.permissionButtonText}>授予权限</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: true });
      if (!photo?.uri || !photo?.base64) return;
      console.log('[camera] takePicture: base64 length=', photo.base64.length, 'prefix=', photo.base64.slice(0, 6));
      setPhoto(photo.uri, photo.base64);
      router.push('/analyzing');
    } catch (e: any) {
      console.error('[camera] takePicture failed:', e);
      Alert.alert('拍照失败', e?.message ?? '请重试');
    }
  };

  const pickFromGallery = async () => {
    try {
      // 请求相册权限（首次调用时弹出系统授权）
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('需要相册权限', '请在系统设置中允许 TidyZen 访问相册。');
        return;
      }

      // 注意：iOS 模拟器在 allowsEditing:true 时，系统裁剪 UI 的「Choose」按钮
      // 会卡住/不可点（PHPicker bug）。这里改为直接返回原图：
      // 用户点选 → 系统自动确认 → 直接进入分析页。
      // 同样不索取 base64：iOS 17+ 即便指定 quality 也可能返回 HEIC，
      // 统一交给 toJpegBase64() 转码。
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
      });

      if (res.canceled) return;
      const asset = res.assets?.[0];
      if (!asset?.uri) {
        Alert.alert('选择失败', '无法读取所选图片，请重试。');
        return;
      }
      // Try manipulator conversion, fall back to raw base64 from ImagePicker
      const { uri, base64 } = await getImageBase64(asset.uri, asset.base64);
      setPhoto(uri, base64);
      router.push('/analyzing');
    } catch (e: any) {
      console.error('[camera] pickFromGallery failed:', e);
      Alert.alert('选择失败', e?.message ?? '打开相册时出错，请重试。');
    }
  };

  if (!active) {
    return <View style={styles.container} />;
  }

  // Sample bounding boxes for demo (would come from real-time detection in production)
  const demoBoxes = [
    { bbox: [0.15, 0.3, 0.28, 0.22] as [number, number, number, number], label: '纸箱 42%', color: '#90CAF9' },
    { bbox: [0.5, 0.25, 0.3, 0.25] as [number, number, number, number], label: '衣物 28%', color: '#A5D6A7' },
  ];

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        {/* 顶部控制区 */}
        <SafeAreaView edges={['top']}>
          <View style={styles.topBar}>
            {/* 左侧关闭按钮 */}
            <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
              <MaterialIcons name="close" size={20} color={colors.onSurface} />
            </TouchableOpacity>

            {/* 中央实时整洁度卡片 */}
            <View style={styles.tidinessCard}>
              <View style={styles.tidinessIconWrap}>
                <MaterialIcons name="check-circle" size={18} color="#2E7D32" />
              </View>
              <View style={styles.tidinessTextWrap}>
                <Text style={styles.tidinessLabel}>实时整洁度</Text>
                <View style={styles.tidinessValueRow}>
                  <Text style={styles.tidinessScore}>85</Text>
                  <MaterialIcons name="trending-up" size={14} color="#2E7D32" />
                </View>
              </View>
            </View>

            {/* 右侧占位保持居中 */}
            <View style={styles.closeButton} />
          </View>
        </SafeAreaView>

        {/* 取景引导 + AI识别框 */}
        <View style={styles.guideOverlay}>
          {/* AI 物品识别框 */}
          <View style={styles.bboxContainer}>
            {demoBoxes.map((box, i) => (
              <BoundingBox
                key={i}
                bbox={box.bbox}
                label={box.label}
                containerWidth={280}
                containerHeight={280}
                color={box.color}
              />
            ))}
          </View>

          {/* L型直角角标 */}
          <View style={styles.guideFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>

          {/* 淡绿色水平引导线 */}
          <View style={styles.guideLines}>
            <View style={styles.guideLineH} />
            <View style={styles.guideLineH} />
          </View>

          {/* 操作引导提示 */}
          <View style={styles.instructionBar}>
            <MaterialIcons name="info-outline" size={16} color={colors.paperWhite} />
            <Text style={styles.instructionText}>请将镜头对准房间杂乱区域</Text>
          </View>
        </View>

        {/* 底部控制栏 */}
        <SafeAreaView edges={['bottom']}>
          <View style={styles.bottomBar}>
            {/* 左侧相册按钮 */}
            <TouchableOpacity style={styles.sideButton} onPress={pickFromGallery} activeOpacity={0.7}>
              <MaterialIcons name="photo-library" size={24} color={colors.onSurface} />
            </TouchableOpacity>

            {/* 中央扫描按钮 */}
            <TouchableOpacity
              style={styles.shutterOuter}
              onPress={takePicture}
              activeOpacity={0.7}
            >
              <View style={styles.shutterInner}>
                <MaterialIcons name="center-focus-strong" size={28} color="#2E7D32" />
              </View>
            </TouchableOpacity>

            {/* 右侧闪光灯按钮 */}
            <TouchableOpacity style={styles.sideButton}>
              <MaterialIcons name="flash-auto" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },

  // 顶部控制区
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.paperWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tidinessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: colors.paperWhite,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tidinessIconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tidinessTextWrap: {
    alignItems: 'flex-start',
  },
  tidinessLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 14,
  },
  tidinessValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  tidinessScore: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 18,
    color: colors.onSurface,
    lineHeight: 22,
  },

  // 取景引导 + AI识别框
  guideOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bboxContainer: {
    width: 280,
    height: 280,
    position: 'absolute',
  },
  guideFrame: {
    width: 280,
    height: 280,
    position: 'absolute',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: colors.paperWhite,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderRadius: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderRadius: 4 },

  // 淡绿色水平引导线
  guideLines: {
    width: 280,
    height: 280,
    position: 'absolute',
    justifyContent: 'space-around',
  },
  guideLineH: {
    height: 1,
    backgroundColor: '#A5D6A7',
    opacity: 0.4,
    marginHorizontal: 32,
  },

  // 操作引导提示
  instructionBar: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(93, 93, 93, 0.8)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
  },
  instructionText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.paperWhite,
  },

  // 底部控制栏
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  sideButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.paperWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 权限页
  permissionScreen: { flex: 1, backgroundColor: colors.surface },
  permissionBackBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
    marginTop: spacing.sm,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  permissionIconWrap: {
    width: 96,
    height: 96,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryContainer + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  permissionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },
  permissionDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  permissionButtonText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onPrimary,
  },
});
