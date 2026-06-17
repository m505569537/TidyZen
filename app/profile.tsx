import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../constants/theme';
import { useState } from 'react';

const MEDALS = [
  { id: 1, icon: 'nightlight-round' as const, bg: '#F5E6CC', color: '#D4A574', unlocked: true },
  { id: 2, icon: 'eco' as const, bg: '#C8E6C9', color: colors.primary, unlocked: true },
  { id: 3, icon: 'lock' as const, bg: colors.surfaceContainer, color: colors.outline, unlocked: false },
  { id: 4, icon: 'lock' as const, bg: colors.surfaceContainer, color: colors.outline, unlocked: false },
];

export default function ProfileScreen() {
  const [nickname, setNickname] = useState('陈洁');
  const [gender, setGender] = useState<'male' | 'female' | 'secret'>('male');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name='arrow-back' size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>{'个人资料'}</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.saveText}>{'保存'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <MaterialIcons name='person' size={48} color={colors.primary} />
            </View>
            <View style={styles.cameraBtn}>
              <MaterialIcons name='camera-alt' size={18} color={colors.paperWhite} />
            </View>
          </View>
          <Text style={styles.avatarHint}>{'点击更换头像'}</Text>
        </View>
        <View style={styles.levelRow}>
          <View style={styles.levelCard}>
            <View style={styles.levelCardContent}>
              <View style={styles.levelCardLeft}>
                <Text style={styles.levelLabel}>{'当前等级'}</Text>
                <Text style={styles.levelNumber}>85</Text>
                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                  <View style={styles.progressEmpty} />
                </View>
                <Text style={styles.levelRank}>Lv.12</Text>
              </View>
              <MaterialIcons name='bar-chart' size={48} color='#D0D0D0' />
            </View>
          </View>
          <View style={styles.titleCard}>
            <MaterialIcons name='military-tech' size={28} color='#B2DFDB' />
            <Text style={styles.titleLabel}>{'当前称号'}</Text>
            <Text style={styles.titleName}>{'极简主义新星'}</Text>
          </View>
        </View>
        <View style={styles.editSection}>
          <Text style={styles.editLabel}>{'昵称'}</Text>
          <TextInput style={styles.editInput} value={nickname} onChangeText={setNickname} placeholder={'输入昵称'} placeholderTextColor={colors.outline} />
        </View>
        <View style={styles.editSection}>
          <Text style={styles.editLabel}>{'性别'}</Text>
          <View style={styles.genderRow}>
            {(['male', 'female', 'secret'] as const).map((g) => {
              const labels = { male: '男', female: '女', secret: '保密' };
              const icons = { male: 'male' as const, female: 'female' as const, secret: 'remove' as const };
              const isActive = gender === g;
              return (
                <TouchableOpacity key={g} style={[styles.genderBtn, isActive && styles.genderBtnActive]} onPress={() => setGender(g)} activeOpacity={0.7}>
                  <MaterialIcons name={icons[g]} size={18} color={isActive ? colors.primary : colors.onSurfaceVariant} />
                  <Text style={[styles.genderText, isActive && styles.genderTextActive]}>{labels[g]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingsRow} onPress={() => router.push('/account')} activeOpacity={0.6}>
            <View style={[styles.settingsIconWrap, { backgroundColor: colors.primaryContainer + '40' }]}>
              <MaterialIcons name='shield' size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingsLabel}>{'账号安全'}</Text>
            <MaterialIcons name='chevron-right' size={22} color={colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.6}>
            <View style={[styles.settingsIconWrap, { backgroundColor: colors.primaryContainer + '40' }]}>
              <MaterialIcons name='notifications' size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingsLabel}>{'通知偏好'}</Text>
            <MaterialIcons name='chevron-right' size={22} color={colors.outline} />
          </TouchableOpacity>
        </View>
        <View style={styles.medalSection}>
          <View style={styles.medalHeader}>
            <Text style={styles.medalTitle}>{'获得勋章'}</Text>
            <TouchableOpacity><Text style={styles.medalAll}>{'全部'}</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.medalScroll}>
            {MEDALS.map((m) => (
              <View key={m.id} style={[styles.medalCircle, { backgroundColor: m.bg }]}>
                <MaterialIcons name={m.icon} size={24} color={m.color} />
              </View>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>{'保存'}</Text>
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
  title: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 18, color: colors.primary },
  saveText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.primary },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.lg },
  avatarWrap: { position: 'relative', marginBottom: spacing.sm },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#8FB5A5', alignItems: 'center', justifyContent: 'center' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.surface },
  avatarHint: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.primary, marginTop: spacing.xs },
  levelRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  levelCard: { flex: 1, backgroundColor: colors.paperWhite, borderRadius: radius.lg, padding: spacing.md, ...shadows.card },
  levelCardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 },
  levelCardLeft: { flex: 1 },
  levelLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.primary, marginBottom: 4 },
  levelNumber: { fontFamily: 'BeVietnamPro_800ExtraBold', fontSize: 36, color: colors.primary, marginBottom: 4 },
  progressBar: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  progressFill: { flex: 7, backgroundColor: colors.healingGreen, borderRadius: 3 },
  progressEmpty: { flex: 3, backgroundColor: colors.outlineVariant, borderRadius: 3 },
  levelRank: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.onSurfaceVariant, textAlign: 'right' },
  titleCard: { flex: 1, backgroundColor: colors.primaryDark, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', justifyContent: 'center', ...shadows.card },
  titleLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: colors.primaryContainer, marginTop: spacing.xs },
  titleName: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 18, color: colors.paperWhite, marginTop: 4, textAlign: 'center' },
  editSection: { marginBottom: spacing.md },
  editLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: colors.primary, marginBottom: spacing.sm },
  editInput: { backgroundColor: colors.paperWhite, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.md, height: 50, paddingHorizontal: spacing.md, fontFamily: 'BeVietnamPro_400Regular', fontSize: 16, color: colors.onSurface },
  genderRow: { flexDirection: 'row', gap: spacing.sm },
  genderBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 20, backgroundColor: colors.paperWhite, borderWidth: 1, borderColor: colors.outlineVariant },
  genderBtnActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primary },
  genderText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.onSurfaceVariant },
  genderTextActive: { fontFamily: 'BeVietnamPro_600SemiBold', color: colors.primary },
  settingsCard: { backgroundColor: colors.paperWhite, borderRadius: radius.lg, overflow: 'hidden', ...shadows.card, marginBottom: spacing.lg },
  settingsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md, gap: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.outlineVariant + '60' },
  settingsIconWrap: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  settingsLabel: { flex: 1, fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: colors.onSurface },
  medalSection: { marginBottom: spacing.lg },
  medalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  medalTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 18, color: colors.primary },
  medalAll: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: colors.primary },
  medalScroll: { gap: spacing.md },
  medalCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  saveBtn: { backgroundColor: colors.primary, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 16, color: colors.paperWhite },
});
