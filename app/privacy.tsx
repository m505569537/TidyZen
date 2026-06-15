import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>隐私政策</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.card}>
          <MaterialIcons name="photo-camera" size={28} color={colors.primary} />
          <Text style={styles.cardTitle}>照片隐私</Text>
          <Text style={styles.cardText}>
            您的房间照片默认存储在设备本地。分析时照片会临时传输至 AI 模型（mimo-v2.5-pro）进行处理，处理完成后云端不保留原图。您可以随时在设备中删除照片。
          </Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="storage" size={28} color={colors.primary} />
          <Text style={styles.cardTitle}>数据存储</Text>
          <Text style={styles.cardText}>
            分析结果（分数、杂物类型、建议内容）存储在您设备本地，用于历史记录和趋势追踪。您可以选择同步到云端，也可以随时清除所有本地数据。
          </Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="security" size={28} color={colors.primary} />
          <Text style={styles.cardTitle}>数据安全</Text>
          <Text style={styles.cardText}>
            所有数据传输均通过加密通道进行。我们不会将您的照片或分析结果用于模型训练或其他目的。我们不会与第三方共享您的个人数据。
          </Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="delete" size={28} color={colors.primary} />
          <Text style={styles.cardTitle}>删除数据</Text>
          <Text style={styles.cardText}>
            您可以在设置中清除所有分析记录和本地照片。清除操作不可撤销，请谨慎操作。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.headlineMd.fontSize, color: colors.onSurface },
  card: { backgroundColor: colors.paperWhite, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md },
  cardTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: typography.bodyLg.fontSize, color: colors.onSurface, marginTop: spacing.sm, marginBottom: spacing.sm },
  cardText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant, lineHeight: 24 },
});
