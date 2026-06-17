import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { typography, spacing, radius } from '../constants/theme';

export interface TipStep {
  title: string;
  description: string;
}

interface TipsModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
  title?: string;
  imageSource?: ImageSourcePropType;
  imageBadge?: string;
  steps?: TipStep[];
  completeLabel?: string;
}

const DEFAULT_STEPS: TipStep[] = [
  {
    title: '收集线缆',
    description: '将散落在桌面下方的电源线、数据线集中归拢，按设备分组。',
  },
  {
    title: '使用长尾夹固定',
    description: '把长尾夹夹在桌沿，将线缆穿过夹子的金属环，固定走线方向。',
  },
  {
    title: '理顺与归位',
    description: '将线缆收纳整齐后贴边走线，可使用扎带进一步隐藏多余线缆。',
  },
];

export function TipsModal({
  visible,
  onClose,
  onComplete,
  title = '整理秘籍：办公桌线缆',
  imageSource,
  imageBadge = '✨ 长尾夹的大妙用',
  steps = DEFAULT_STEPS,
  completeLabel = '我已完成整理',
}: TipsModalProps) {
  const handleComplete = () => {
    onComplete?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* 顶部标题栏 */}
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <MaterialIcons name="lightbulb" size={20} color="#3E9E77" />
                  <Text style={styles.title} numberOfLines={1}>
                    {title}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons name="close" size={22} color="#999999" />
                </TouchableOpacity>
              </View>

              {/* 内容滚动区 */}
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* 视觉展示区 */}
                <View style={styles.imageWrapper}>
                  {imageSource ? (
                    <Image source={imageSource} style={styles.image} resizeMode="cover" />
                  ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                      <MaterialIcons name="image" size={48} color="#CFD8DC" />
                    </View>
                  )}
                  {imageBadge ? (
                    <View style={styles.imageBadge}>
                      <Text style={styles.imageBadgeText}>{imageBadge}</Text>
                    </View>
                  ) : null}
                </View>

                {/* 步骤说明区 */}
                <View style={styles.stepsContainer}>
                  {steps.map((step, idx) => {
                    const isLast = idx === steps.length - 1;
                    return (
                      <View key={idx} style={styles.stepRow}>
                        {/* 序号 + 连接线 */}
                        <View style={styles.stepIndicatorCol}>
                          <View style={styles.stepBadge}>
                            <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                          </View>
                          {!isLast && <View style={styles.stepConnector} />}
                        </View>

                        {/* 步骤文字 */}
                        <View style={styles.stepBody}>
                          <Text style={styles.stepTitle}>{step.title}</Text>
                          <Text style={styles.stepDescription}>{step.description}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>

              {/* 底部操作栏 */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.completeBtn}
                  onPress={handleComplete}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="check-circle-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.completeBtnText}>{completeLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  // ── 标题栏 ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ── 内容滚动区 ──
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  // ── 图片 ──
  imageWrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 180,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBadge: {
    position: 'absolute',
    left: spacing.md,
    bottom: spacing.md,
    backgroundColor: '#2D7A5A',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  imageBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontWeight: '600',
  },
  // ── 步骤 ──
  stepsContainer: {
    marginTop: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIndicatorCol: {
    width: 32,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4F5E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    color: '#3E9E77',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'BeVietnamPro_700Bold',
  },
  stepConnector: {
    flex: 1,
    width: 1,
    minHeight: 24,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  stepBody: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'BeVietnamPro_700Bold',
    color: '#000000',
    marginBottom: spacing.sm,
  },
  stepDescription: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'BeVietnamPro_400Regular',
    color: '#555555',
    lineHeight: 20,
  },
  // ── 底部按钮 ──
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: '#FFFFFF',
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F6B4D',
    borderRadius: radius.full,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'BeVietnamPro_600SemiBold',
    lineHeight: typography.bodyMd.lineHeight,
  },
});
