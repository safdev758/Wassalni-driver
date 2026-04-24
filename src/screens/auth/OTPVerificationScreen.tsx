import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import type { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTPVerification'>;

export default function OTPVerificationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  const { phone } = route.params as { phone: string };
  const { verifyOTP } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = React.useRef<(TextInput | null)[]>([]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOtp(newOTP);
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length === 6) {
      await verifyOTP(phone, code);
      navigation.navigate('PersonalDocuments');
    }
  };

  const handleResend = () => {
    // Resend OTP logic
    console.log('Resend OTP');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
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
            Enter{'\n'}
            <Text style={styles.headlineGradient}>Code.</Text>
          </Text>
          <Text style={styles.description}>
            {t('auth.enterOtp')}{' '}
            <Text style={styles.phoneText}>{phone}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
              ]}
              value={digit}
              onChangeText={(value) => handleOTPChange(index, value)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Timer */}
        <Text style={styles.timer}>Resend code in 0:59</Text>

        {/* Resend Button */}
        <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <TouchableOpacity 
          style={[
            styles.verifyButton,
            otp.join('').length !== 6 && styles.verifyButtonDisabled,
          ]} 
          onPress={handleVerify}
          disabled={otp.join('').length !== 6}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyText}>Verify</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl + 20, // Extra padding for system gestures
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    alignSelf: 'flex-start',
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
    marginTop: spacing.md,
  },
  phoneText: {
    color: colors.primary,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    ...typography.headlineMedium,
    color: colors.onSurface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainerHigh,
  },
  timer: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: spacing.xxl,
  },
  resendText: {
    ...typography.labelMedium,
    color: colors.primary,
  },
  verifyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginTop: 'auto',
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyText: {
    ...typography.bodyLarge,
    color: colors.onPrimary,
    fontWeight: '700',
  },
});
