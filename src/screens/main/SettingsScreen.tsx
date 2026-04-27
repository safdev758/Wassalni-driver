import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Switch, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useDriver } from '../../context/DriverContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavProp>();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { logout, driver } = useAuth();
  const { driverState } = useDriver();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emergencyEnabled, setEmergencyEnabled] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLanguageModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />

      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={32} color={colors.onSurface} />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{driver?.name || 'Driver'}</Text>
            <Text style={styles.profilePhone}>{driver?.phone || ''}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />
        </View>

        {/* Rating Card */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingIcon}>
            <Ionicons name="star" size={24} color={colors.primary} />
          </View>
          <Text style={styles.ratingValue}>{driverState.rating}</Text>
          <Text style={styles.ratingLabel}>{t('settings.rating')}</Text>
        </View>

        {/* Safety & Security */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{t('settings.safetySecurity')}</Text>
          <View style={styles.sectionCard}>
            <View style={styles.settingsItem}>
              <View style={styles.settingsIconContainer}>
                <Ionicons name="shield-checkmark-outline" size={22} color={colors.onSurface} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>{t('settings.twoFactor')}</Text>
                <Text style={styles.settingsItemDesc}>{t('settings.twoFactorDesc')}</Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary }}
                thumbColor={twoFactorEnabled ? colors.onPrimary : colors.onSurface}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingsItem}>
              <View style={styles.settingsIconContainer}>
                <Ionicons name="alert-circle-outline" size={22} color={colors.onSurface} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>{t('settings.emergencyContacts')}</Text>
                <Text style={styles.settingsItemDesc}>{t('settings.emergencyContactsDesc')}</Text>
              </View>
              <Switch
                value={emergencyEnabled}
                onValueChange={setEmergencyEnabled}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary }}
                thumbColor={emergencyEnabled ? colors.onPrimary : colors.onSurface}
              />
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{t('settings.preferences')}</Text>
          <View style={styles.sectionCard}>
            <View style={styles.settingsItem}>
              <View style={styles.settingsIconContainer}>
                <Ionicons name="notifications-outline" size={22} color={colors.onSurface} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>{t('settings.pushNotifications')}</Text>
                <Text style={styles.settingsItemDesc}>{t('settings.pushNotificationsDesc')}</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary }}
                thumbColor={pushNotifications ? colors.onPrimary : colors.onSurface}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingsItem} onPress={() => setShowLanguageModal(true)}>
              <View style={styles.settingsIconContainer}>
                <Ionicons name="language-outline" size={22} color={colors.onSurface} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>{t('settings.language')}</Text>
                <Text style={styles.settingsItemDesc}>
                  {i18n.language === 'ar' ? t('settings.arabic') : t('settings.english')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Legal */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{t('settings.supportLegal')}</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('Help')}>
              <View style={styles.settingsIconContainer}>
                <Ionicons name="help-circle-outline" size={22} color={colors.onSurface} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>{t('settings.helpCenter')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('TermsOfService')}>
              <View style={styles.settingsIconContainer}>
                <Ionicons name="document-text-outline" size={22} color={colors.onSurface} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>{t('settings.termsPrivacy')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>{t('settings.logOut')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
            <TouchableOpacity
              style={[
                styles.languageOption,
                i18n.language === 'en' && styles.languageOptionActive,
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[
                styles.languageText,
                i18n.language === 'en' && styles.languageTextActive,
              ]}>{t('settings.english')}</Text>
              {i18n.language === 'en' && (
                <Ionicons name="checkmark" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageOption,
                i18n.language === 'ar' && styles.languageOptionActive,
              ]}
              onPress={() => handleLanguageChange('ar')}
            >
              <Text style={[
                styles.languageText,
                i18n.language === 'ar' && styles.languageTextActive,
              ]}>{t('settings.arabic')}</Text>
              {i18n.language === 'ar' && (
                <Ionicons name="checkmark" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.modalCloseText}>{t('settings.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },

  /* ── Profile Card ── */
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.surface,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    ...typography.titleMedium,
    color: colors.onSurface,
    fontWeight: '600',
  },
  profilePhone: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  /* ── Rating Card ── */
  ratingCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  ratingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ratingValue: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '700',
  },
  ratingLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  /* ── Sections ── */
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.labelSmall,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    overflow: 'hidden',
  },

  /* ── Settings Item (rider-style layout) ── */
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '500',
  },
  settingsItemDesc: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant + '20',
    marginLeft: 56 + spacing.md,
  },

  /* ── Logout ── */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  logoutText: {
    ...typography.bodyMedium,
    color: colors.error,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },

  /* ── Language Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: spacing.xl,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  languageOptionActive: {
    backgroundColor: colors.primary + '1A',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  languageText: {
    ...typography.bodyLarge,
    color: colors.onSurface,
  },
  languageTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  modalCloseText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
  },
});
