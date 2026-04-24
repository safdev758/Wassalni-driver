import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import type { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuickLogin'>;

export default function QuickLoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [phone, setPhone] = React.useState('');

  const handleBiometricLogin = () => {
    // Handle biometric authentication
    console.log('Biometric login');
  };

  const handlePhoneLogin = () => {
    if (phone) {
      navigation.navigate('PhoneAuth', { phone });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Background Image with Gradient Overlay */}
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKONJNAxN58ivZYvXHLBtvn2hOdUSv8ZFN_cbc-YOvvaF5REpDEkegw68t5PtUYz3S3fh2e0xSuae0_fdDmgoqH2vnRo6apAAkJ7kXZoaFCeH6tuh2Y_M6uTwBqP_udZV50CAcCu7ZIh5Ki7k__YepUIsn30tcsvhEq1rhRdzPnKEw2S0AFoqcNqQe8f3kP94tMVARw_JXb2TWN9JUzaEc8A78a7LgKXwJw-EFttUhNDZ2G5QPiJuVOQKMdXDQ9VeNGlsvIWPqQQle' }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <View style={styles.backgroundGradient} />

          {/* Content */}
          <View style={styles.content}>
            {/* Brand Header */}
            <View style={styles.header}>
              <Text style={styles.brand}>{t('appName')}</Text>
            </View>
            
            {/* Editorial Section */}
            <View style={styles.editorial}>
              <Text style={styles.headline}>
                {t('auth.enterTheFleet').split('\n').map((line: string, i: number) => (
                  <React.Fragment key={i}>
                    {line}
                    {i === 0 && <Text style={styles.headlineVariant}>the fleet.</Text>}
                  </React.Fragment>
                ))}
              </Text>
              <Text style={styles.description}>
                {t('auth.authenticateBiometric')}
              </Text>
            </View>

            {/* Biometric Button */}
            <View style={styles.biometricSection}>
              <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
                <View style={styles.biometricGlow} />
                <Ionicons name="finger-print" size={64} color={colors.onPrimary} />
              </TouchableOpacity>
              <View style={styles.biometricLabel}>
                <Text style={styles.sensorLabel}>{t('auth.sensorActive')}</Text>
                <Text style={styles.tapLabel}>{t('auth.tapScanner')}</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('auth.orAuthenticateVia')}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Phone Input */}
            <View style={styles.phoneInputSection}>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+213</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="555 000 000"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={12}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handlePhoneLogin}>
                  <Ionicons name="arrow-forward" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    minHeight: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '60%',
    opacity: 0.5,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: colors.surface,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl + 20, // Extra padding for system gestures
  },
  header: {
    marginBottom: spacing.xl,
  },
  brand: {
    ...typography.headlineSmall,
    color: colors.primary,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  editorial: {
    marginBottom: spacing.xxl,
  },
  headline: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    lineHeight: 40,
    textAlign: 'center',
  },
  headlineVariant: {
    ...typography.headlineLarge,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  description: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 300,
    alignSelf: 'center',
  },
  biometricSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  biometricButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  biometricGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: `${colors.primary}20`,
  },
  biometricLabel: {
    alignItems: 'center',
  },
  sensorLabel: {
    ...typography.labelMedium,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  tapLabel: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    opacity: 0.6,
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surfaceVariant,
  },
  dividerText: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    marginHorizontal: spacing.md,
    textTransform: 'uppercase',
  },
  phoneInputSection: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: spacing.sm,
    width: '100%',
  },
  countryCode: {
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  countryCodeText: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.onSurface,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceBright,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});
