import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import type { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhoneAuth'>;

export default function PhoneAuthScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  const { phone: initialPhone } = route.params as { phone: string };
  const { verifyOTP } = useAuth();
  
  const [phone, setPhone] = useState(initialPhone || '555 123 456');
  const [otp, setOtp] = useState('');

  const handleNumberPress = (num: string) => {
    if (phone.replace(/\s/g, '').length < 12) {
      const formatted = phone.replace(/\s/g, '');
      if (formatted.length <= 3) {
        setPhone(formatted);
      } else if (formatted.length <= 6) {
        setPhone(`${formatted.slice(0, 3)} ${formatted.slice(3)}`);
      } else {
        setPhone(`${formatted.slice(0, 3)} ${formatted.slice(3, 6)} ${formatted.slice(6)}`);
      }
    }
  };

  const handleBackspace = () => {
    const formatted = phone.replace(/\s/g, '');
    if (formatted.length > 0) {
      const newFormatted = formatted.slice(0, -1);
      if (newFormatted.length <= 3) {
        setPhone(newFormatted);
      } else if (newFormatted.length <= 6) {
        setPhone(`${newFormatted.slice(0, 3)} ${newFormatted.slice(3)}`);
      } else {
        setPhone(`${newFormatted.slice(0, 3)} ${newFormatted.slice(3, 6)} ${newFormatted.slice(6)}`);
      }
    }
  };

  const handleContinue = async () => {
    // Navigate to OTP verification
    navigation.navigate('OTPVerification', { phone: `+213 ${phone}` });
  };

  const keypadNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'Del'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        {/* Ambient Glow */}
        <View style={styles.ambientGlow} />

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headline}>
              {t('auth.verifyIdentity').split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && <Text style={styles.headlineGradient}>{' '}</Text>}
                  {i === 0 && <Text style={styles.headlineGradient}>Identity.</Text>}
                </React.Fragment>
              ))}
            </Text>
            <Text style={styles.description}>
              {t('auth.enterMobileNumber')}
            </Text>
          </View>

          {/* Phone Input Display */}
          <View style={styles.phoneDisplay}>
            <TouchableOpacity style={styles.countrySelector}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDphN9M2ME9X_iRSywS9xBNyYM8B5rCpUBUUt4fiunBFnb4KkLZ4wg-xytmdlFoEAasHC1FPrg6QQh0K1DxODogJk4zkLSYbneZtq8ovmq-2Mhi1_7GFsxx3u1osDEcSjmDAvbS2PZvyYab6mVSyyBfe7sX95blH4acZLHqaWCa_wjtZRmm_ya7L2e-eUh-NPSQPgWaeNSuuMw8Ro2sKu3uToWxEMe6uzB2CIstPJShItRo3J9OY9mZjwYo6f5QEw5t5d7yAwz10li5' }}
                style={styles.flag}
              />
              <Text style={styles.countryCode}>+213</Text>
              <Ionicons name="chevron-down" size={16} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
            <Text style={styles.phoneNumber}>{phone || '555 123 456'}</Text>
          </View>

          <Text style={styles.rateLabel}>{t('auth.resendCodeIn')} 0:59</Text>

          {/* Custom Keypad */}
          <View style={styles.keypad}>
            {keypadNumbers.map((num, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.keypadButton,
                  num === '' && styles.keypadButtonEmpty,
                ]}
                onPress={() => {
                  if (num === 'Del') {
                    handleBackspace();
                  } else if (num !== '') {
                    handleNumberPress(num);
                  }
                }}
                disabled={num === ''}
                activeOpacity={0.7}
              >
                {num === 'Del' ? (
                  <Ionicons name="backspace" size={28} color={colors.onSurfaceVariant} />
                ) : num !== '' ? (
                  <View style={styles.keypadContent}>
                    <Text style={styles.keypadNumber}>{num}</Text>
                    {index > 0 && index < 9 && index % 3 !== 0 && (
                      <Text style={styles.keypadLetters}>
                        {index === 1 ? 'ABC' : index === 2 ? 'DEF' : index === 4 ? 'GHI' : index === 5 ? 'JKL' : index === 6 ? 'MNO' : index === 7 ? 'PQRS' : index === 8 ? 'TUV' : 'WXYZ'}
                      </Text>
                    )}
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
            <Text style={styles.continueText}>{t('auth.continue')}</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  ambientGlow: {
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: `${colors.primary}08`,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl + 20, // Extra padding for system gestures
  },
  header: {
    marginBottom: spacing.xxl,
  },
  headline: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
  },
  headlineGradient: {
    ...typography.headlineLarge,
    color: colors.primary,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
  },
  description: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    maxWidth: '80%',
    marginTop: spacing.md,
  },
  phoneDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: `${colors.primary}30`,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginRight: spacing.md,
  },
  flag: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  countryCode: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '600',
    fontSize: 18,
  },
  phoneNumber: {
    ...typography.headlineMedium,
    color: colors.surfaceVariant,
    letterSpacing: 2,
    flex: 1,
  },
  rateLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.lg,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  keypadButton: {
    width: '30%',
    aspectRatio: 2,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  keypadButtonEmpty: {
    backgroundColor: 'transparent',
  },
  keypadContent: {
    alignItems: 'center',
  },
  keypadNumber: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '600',
    fontSize: 28,
  },
  keypadLetters: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    letterSpacing: 2,
    marginTop: 2,
    fontSize: 10,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginTop: 'auto',
  },
  continueText: {
    ...typography.bodyLarge,
    color: colors.onPrimary,
    fontWeight: '700',
  },
});
