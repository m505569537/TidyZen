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
    router.dismiss();
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.paperWhite} />
        </TouchableOpacity>
        <View style={styles.permissionContainer}>
          <MaterialIcons name="camera-alt" size={64} color={colors.onSurfaceVariant} />
          <Text style={styles.permissionTitle}>需要相机权限</Text>
          <Text style={styles.permissionDesc}>TidyZen 需要访问相机来拍摄房间照片，以便 AI 分析整洁度。</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
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
        {/* 顶部导航 */}
        <SafeAreaView edges={['top']}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={24} color={colors.paperWhite} />
            </TouchableOpacity>
            <Text style={styles.title}>智能房间整洁助手</Text>
            <View style={styles.backButton} />
          </View>
        </SafeAreaView>

        {/* 引导文案 */}
        <View style={styles.guideOverlay}>
          <Text style={styles.guideText}>将镜头对准房间杂乱区域，点击拍照开始分析</Text>
        </View>

        {/* 底部控制 */}
        <SafeAreaView edges={['bottom']}>
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.sideButton}>
              <MaterialIcons name="photo-library" size={28} color={colors.paperWhite} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shutterButton} onPress={takePicture} activeOpacity={0.7}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideButton}>
              <MaterialIcons name="flash-auto" size={28} color={colors.paperWhite} />
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
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingTop: spacing.sm,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyMd.fontSize,
    color: colors.paperWhite,
  },
  guideOverlay: {
    flex: 1, justifyContent: 'flex-end', alignItems: 'center',
    paddingBottom: 100,
  },
  guideText: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize,
    color: colors.paperWhite, backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingHorizontal: spacing.xl, paddingBottom: spacing.md,
  },
  sideButton: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  shutterButton: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 4, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  shutterInner: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.paperWhite,
  },
  permissionContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xl, gap: spacing.md,
  },
  permissionTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.headlineMd.fontSize,
    color: colors.onSurface,
  },
  permissionDesc: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant, textAlign: 'center', lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: radius.full, marginTop: spacing.sm,
  },
  permissionButtonText: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyLg.fontSize,
    color: colors.onPrimary,
  },
});
