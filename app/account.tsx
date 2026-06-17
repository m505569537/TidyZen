import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';
import { useState } from 'react';

export default function AccountScreen() {
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [showPw3, setShowPw3] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>{'账号设置'}</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{'管理您的绑定信息与账户安全状态'}</Text>
        <View style={styles.bindCard}>
          <View style={styles.bindIconWrap}><MaterialIcons name="phone" size={22} color={colors.softBlue} /></View>
          <View style={styles.bindContent}>
            <Text style={styles.bindLabel}>{'手机号码'}</Text>
            <Text style={styles.bindHint}>138****8888</Text>
          </View>
          <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>{'修改'}</Text></TouchableOpacity>
        </View>
        <View style={styles.bindCard}>
          <View style={[styles.bindIconWrap, { backgroundColor: colors.healingGreen + '20' }]}><MaterialIcons name="chat" size={22} color={colors.healingGreen} /></View>
          <View style={styles.bindContent}>
            <Text style={styles.bindLabel}>{'微信账号'}</Text>
            <Text style={styles.bindHint}>{'已绑定：林间小径'}</Text>
          </View>
          <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>{'解绑'}</Text></TouchableOpacity>
        </View>
        <View style={styles.bindCard}>
          <View style={[styles.bindIconWrap, { backgroundColor: colors.warmAmber + '20' }]}><MaterialIcons name="email" size={22} color={colors.warmAmber} /></View>
          <View style={styles.bindContent}>
            <Text style={styles.bindLabel}>{'邮箱'}</Text>
            <Text style={styles.bindHint}>{'未绑定'}</Text>
          </View>
          <TouchableOpacity style={styles.primaryBtn}><Text style={styles.primaryBtnText}>{'去绑定'}</Text></TouchableOpacity>
        </View>
        <View style={styles.warningCard}>
          <View style={styles.warningHeader}><MaterialIcons name="warning" size={20} color={colors.error} /><Text style={styles.warningTitle}>{'安全警示'}</Text></View>
          <Text style={styles.warningItem}>{'• 解绑微信将导致无法使用微信快速登录'}</Text>
          <Text style={styles.warningItem}>{'• 注销账号将永久删除所有数据'}</Text>
          <Text style={styles.warningItem}>{'• 操作不可撤销，请谨慎操作'}</Text>
        </View>
        {!showChangePw ? (
          <TouchableOpacity style={styles.pwCard} onPress={() => setShowChangePw(true)} activeOpacity={0.6}>
            <View style={[styles.bindIconWrap, { backgroundColor: colors.primaryContainer + '40' }]}><MaterialIcons name="lock" size={22} color={colors.primary} /></View>
            <Text style={styles.pwLabel}>{'修改密码'}</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
          </TouchableOpacity>
        ) : (
          <View style={styles.pwFormCard}>
            <View style={styles.pwTipRow}>
              <View style={styles.pwTipIcon}><MaterialIcons name="lock" size={24} color={colors.primary} /></View>
              <Text style={styles.pwTipText}>{'定期更新密码，确保您的数据安全。'}</Text>
            </View>
            <View style={styles.pwInputGroup}>
              <Text style={styles.pwInputLabel}>{'当前密码'}</Text>
              <View style={styles.pwInputRow}>
                <TextInput style={styles.pwInput} secureTextEntry={!showPw1} value={currentPw} onChangeText={setCurrentPw} placeholder={'请输入当前密码'} placeholderTextColor={colors.outline} />
                <TouchableOpacity onPress={() => setShowPw1(!showPw1)}><MaterialIcons name={showPw1 ? 'visibility' : 'visibility-off'} size={20} color={colors.outline} /></TouchableOpacity>
              </View>
            </View>
            <View style={styles.pwInputGroup}>
              <Text style={styles.pwInputLabel}>{'新密码'}</Text>
              <View style={styles.pwInputRow}>
                <TextInput style={styles.pwInput} secureTextEntry={!showPw2} value={newPw} onChangeText={setNewPw} placeholder={'请输入新密码'} placeholderTextColor={colors.outline} />
                <TouchableOpacity onPress={() => setShowPw2(!showPw2)}><MaterialIcons name={showPw2 ? 'visibility' : 'visibility-off'} size={20} color={colors.outline} /></TouchableOpacity>
              </View>
            </View>
            <View style={styles.pwInputGroup}>
              <Text style={styles.pwInputLabel}>{'确认密码'}</Text>
              <View style={styles.pwInputRow}>
                <TextInput style={styles.pwInput} secureTextEntry={!showPw3} value={confirmPw} onChangeText={setConfirmPw} placeholder={'请再次输入新密码'} placeholderTextColor={colors.outline} />
                <TouchableOpacity onPress={() => setShowPw3(!showPw3)}><MaterialIcons name={showPw3 ? 'visibility' : 'visibility-off'} size={20} color={colors.outline} /></TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
              <MaterialIcons name="verified" size={18} color={colors.paperWhite} />
              <Text style={styles.submitBtnText}>{'提交修改'}</Text>
            </TouchableOpacity>
            <View style={styles.pwRulesBox}>
              <MaterialIcons name="info" size={16} color={colors.primary} />
              <Text style={styles.pwRulesText}>{'密码必须包含字母、数字，且长度不少于8位。建议避免使用生日或简单的数字排列。'}</Text>
            </View>
          </View>
        )}
        <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7}>
          <MaterialIcons name="power-settings-new" size={18} color={colors.error} />
          <Text style={styles.deleteBtnText}>{'注销账号'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.pageMargin, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.pageMargin, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 20, color: colors.onSurface },
  subtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurfaceVariant, marginBottom: spacing.lg },
  bindCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paperWhite, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md, ...shadows.card },
  bindIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.softBlue + '20', alignItems: 'center', justifyContent: 'center' },
  bindContent: { flex: 1 },
  bindLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.onSurface },
  bindHint: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: colors.onSurfaceVariant, marginTop: 2 },
  secondaryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant, backgroundColor: colors.paperWhite },
  secondaryBtnText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurfaceVariant },
  primaryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.primary },
  primaryBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: colors.paperWhite },
  warningCard: { backgroundColor: '#FFF0F0', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.error + '40', padding: spacing.md, marginTop: spacing.md, marginBottom: spacing.md },
  warningHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  warningTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 16, color: colors.error },
  warningItem: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurfaceVariant, lineHeight: 22, paddingLeft: spacing.sm },
  pwCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paperWhite, borderRadius: radius.lg, padding: spacing.md, gap: spacing.md, ...shadows.card, marginBottom: spacing.md },
  pwLabel: { flex: 1, fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.onSurface },
  pwFormCard: { backgroundColor: colors.paperWhite, borderRadius: radius.lg, padding: spacing.lg, ...shadows.card, marginBottom: spacing.md },
  pwTipRow: { alignItems: 'center', marginBottom: spacing.lg },
  pwTipIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primaryContainer + '30', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  pwTipText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.primary, textAlign: 'center' },
  pwInputGroup: { marginBottom: spacing.md },
  pwInputLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: colors.primary, marginBottom: spacing.xs },
  pwInputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  pwInput: { flex: 1, height: 48, fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurface },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.lg, height: 48, marginTop: spacing.sm },
  submitBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 16, color: colors.paperWhite },
  pwRulesBox: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  pwRulesText: { flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.primary, lineHeight: 18 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.error, height: 50, marginTop: spacing.lg },
  deleteBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.error },
});
