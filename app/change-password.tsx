import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadows } from '../constants/theme';
import { useState } from 'react';

export default function ChangePasswordScreen() {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [showPw3, setShowPw3] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.6}>
          <MaterialIcons name="chevron-left" size={28} color={colors.primary} />
          <Text style={styles.title}>{'修改密码'}</Text>
        </TouchableOpacity>
        <View style={styles.scoreBadge}>
          <MaterialIcons name="eco" size={16} color={colors.primary} />
          <Text style={styles.scoreText}>{'整洁得分: 85'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <View style={styles.heroIconCircle}>
            <MaterialIcons name="shield" size={56} color={colors.primary} />
          </View>
          <Text style={styles.heroSubtitle}>{'定期更新密码，确保您的整理之旅始终安全无忧。'}</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{'旧密码'}</Text>
            <View style={styles.fieldRow}>
              <MaterialIcons name="lock-outline" size={20} color={colors.primary} style={styles.fieldLeftIcon} />
              <TextInput
                style={styles.fieldInput}
                secureTextEntry={!showPw1}
                value={currentPw}
                onChangeText={setCurrentPw}
                placeholder={'请输入当前密码'}
                placeholderTextColor={'#9E9E9E'}
              />
              <TouchableOpacity onPress={() => setShowPw1(!showPw1)} hitSlop={8}>
                <MaterialIcons name={showPw1 ? 'visibility' : 'visibility-off'} size={20} color={'#666666'} />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldDivider} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{'新密码'}</Text>
            <View style={styles.fieldRow}>
              <MaterialIcons name="lock-outline" size={20} color={colors.primary} style={styles.fieldLeftIcon} />
              <TextInput
                style={styles.fieldInput}
                secureTextEntry={!showPw2}
                value={newPw}
                onChangeText={setNewPw}
                placeholder={'至少8位字符'}
                placeholderTextColor={'#9E9E9E'}
              />
              <TouchableOpacity onPress={() => setShowPw2(!showPw2)} hitSlop={8}>
                <MaterialIcons name={showPw2 ? 'visibility' : 'visibility-off'} size={20} color={'#666666'} />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldDivider} />
          </View>

          <View style={[styles.fieldGroup, { marginBottom: 0 }]}>
            <Text style={styles.fieldLabel}>{'确认新密码'}</Text>
            <View style={styles.fieldRow}>
              <MaterialIcons name="lock-outline" size={20} color={colors.primary} style={styles.fieldLeftIcon} />
              <TextInput
                style={styles.fieldInput}
                secureTextEntry={!showPw3}
                value={confirmPw}
                onChangeText={setConfirmPw}
                placeholder={'请再次输入新密码'}
                placeholderTextColor={'#9E9E9E'}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85}>
            <MaterialIcons name="verified-user" size={20} color={colors.paperWhite} />
            <Text style={styles.submitBtnText}>{'提交修改'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipBox}>
          <MaterialIcons name="info" size={18} color={colors.primary} style={styles.tipIcon} />
          <Text style={styles.tipText}>
            {'密码必须包含字母、数字，且长度不少于8位。建议避免使用生日或简单的数字排列，每3个月更新一次以确保账户安全。'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.md,
    backgroundColor: 'transparent',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  title: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 18, color: colors.primary },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  scoreText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: colors.primary },

  heroWrap: { alignItems: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  heroIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSubtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
    textAlign: 'center',
    marginTop: spacing.md,
  },

  formCard: {
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: 20,
    ...shadows.card,
  },
  fieldGroup: { marginBottom: spacing.sm },
  fieldLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 14,
    color: colors.primary,
    marginBottom: 12,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', height: 48 },
  fieldLeftIcon: { marginRight: spacing.sm },
  fieldInput: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: colors.onSurface,
    paddingVertical: 0,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    marginTop: spacing.lg,
  },
  submitBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 16,
    color: colors.paperWhite,
  },

  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#E8F5E9',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  tipIcon: { marginTop: 2 },
  tipText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    lineHeight: 22,
    color: '#666666',
  },
});
