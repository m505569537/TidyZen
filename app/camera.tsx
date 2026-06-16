import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { colors, typography, spacing, radius } from '../constants/theme';
import { useAnalysisStore } from '../stores/analysis';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [active, setActive] = useState(true);
  const setPhoto = useAnalysisStore((s) => s.setPhoto);

  const handleBack = () => {
    setActive(false);
    router.back();
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen} edges={['top', 'bottom']}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
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
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.8 });
      if (photo?.uri && photo?.base64) {
        setPhoto(photo.uri, photo.base64);
        router.push('/analyzing');
      }
    } catch {
      Alert.alert('拍照失败', '请重试');
    }
  };

  if (!active) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        {/* 顶部导航栏 */}
        <SafeAreaView edges={['top']}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconBtn} onPress={handleBack}>
              <MaterialIcons name="close" size={24} color={colors.paperWhite} />
            </TouchableOpacity>
            <View style={styles.titleBadge}>
              <MaterialIcons name="auto-awesome" size={16} color={colors.paperWhite} />
              <Text style={styles.title}>智能分析</Text>
            </View>
            <View style={styles.iconBtn} />
          </View>
        </SafeAreaView>

        {/* 取景框引导 */}
        <View style={styles.guideOverlay}>
          <View style={styles.guideFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <View style={styles.guideTextWrap}>
            <MaterialIcons name="info-outline" size={16} color={colors.paperWhite} />
            <Text style={styles.guideText}>将房间杂乱区域放入取景框内</Text>
          </View>
        </View>

        {/* 底部控制栏 */}
        <SafeAreaView edges={['bottom']}>
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.sideButton}>
              <MaterialIcons name="photo-library" size={26} color={colors.paperWhite} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shutterButton} onPress={takePicture} activeOpacity={0.7}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideButton}>
              <MaterialIcons name="flash-auto" size={26} color={colors.paperWhite} />
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

  // 顶部
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingTop: spacing.sm,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  titleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  title: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyMd.fontSize,
    color: colors.paperWhite,
  },

  // 取景引导
  guideOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  guideFrame: {
    width: 280, height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32, height: 32,
    borderColor: colors.paperWhite,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderRadius: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderRadius: 4 },
  guideTextWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginTop: spacing.lg,
  },
  guideText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: typography.bodyMd.fontSize,
    color: colors.paperWhite,
  },

  // 底部
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, paddingTop: spacing.md,
  },
  sideButton: {
    width: 48, height: 48, borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  shutterButton: {
    width: 76, height: 76, borderRadius: radius.full,
    borderWidth: 4, borderColor: colors.paperWhite,
    alignItems: 'center', justifyContent: 'center',
  },
  shutterInner: {
    width: 60, height: 60, borderRadius: radius.full,
    backgroundColor: colors.paperWhite,
  },

  // 权限页
  permissionScreen: { flex: 1, backgroundColor: colors.surface },
  backButton: {
    width: 40, height: 40, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: spacing.md, marginTop: spacing.sm,
  },
  permissionContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xl, gap: spacing.md,
  },
  permissionIconWrap: {
    width: 96, height: 96, borderRadius: radius.xl,
    backgroundColor: colors.primaryContainer + '40',
    alignItems: 'center', justifyContent: 'center',
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
    textAlign: 'center', lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: radius.full, marginTop: spacing.sm,
  },
  permissionButtonText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: typography.bodyLg.fontSize,
    color: colors.onPrimary,
  },
});
