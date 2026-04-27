import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function VehicleInformationScreen() {
  const { t } = useTranslation();
  const { completeOnboarding } = useAuth();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [insuranceImage, setInsuranceImage] = useState<string | null>(null);
  const [registrationImage, setRegistrationImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const finishOnboarding = async () => {
    try {
      await completeOnboarding();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const handleContinue = () => {
    Alert.alert(
      t('onboardingComplete.title'),
      t('onboardingComplete.description'),
      [
        {
          text: t('common.done'),
          onPress: () => {
            void finishOnboarding();
          },
        },
      ],
    );
  };

  const skipUpload = () => {
    Alert.alert(
      t('onboardingComplete.skipTitle'),
      t('onboardingComplete.skipDescription'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: () => {
            void finishOnboarding();
          },
        },
      ],
    );
  };

  const validateAlgerianDocument = async (imageUri: string, type: 'insurance' | 'registration') => {
    setIsVerifying(true);
    setValidationResult(null);
    
    // Simulate AI/OCR validation for Algerian vehicle documents
    setTimeout(() => {
      setIsVerifying(false);
      const isValid = Math.random() > 0.2; // 80% success rate for testing
      if (isValid) {
        setValidationResult(`${type === 'insurance' ? 'Insurance' : 'Registration'} validated successfully`);
      } else {
        setValidationResult('Verification failed. Please retake photo with better lighting.');
      }
    }, 1500);
  };

  const pickImage = async (type: 'insurance' | 'registration') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          t('permissions.photoLibraryDeniedTitle'),
          t('permissions.photoLibraryDeniedMessage'),
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        if (type === 'insurance') {
          setInsuranceImage(uri);
        } else if (type === 'registration') {
          setRegistrationImage(uri);
        }
      }
    } catch (error) {
      console.error('pickImage error:', error);
      Alert.alert(t('common.error'), t('permissions.failedPickImage'));
    }
  };

  const takePhoto = async (type: 'insurance' | 'registration') => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          t('permissions.cameraDeniedTitle'),
          t('permissions.cameraDeniedMessage'),
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        if (type === 'insurance') {
          setInsuranceImage(uri);
        } else if (type === 'registration') {
          setRegistrationImage(uri);
        }
      }
    } catch (error) {
      console.error('takePhoto error:', error);
      Alert.alert(t('common.error'), t('permissions.failedTakePhoto'));
    }
  };

  const showImagePickerOptions = (type: 'insurance' | 'registration') => {
    const isInsurance = type === 'insurance';
    Alert.alert(
      isInsurance ? 'Upload Insurance Card' : 'Upload Vehicle Registration',
      'Algerian vehicle documents accepted',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Gallery', onPress: () => pickImage(type) },
        { text: 'Camera', onPress: () => takePhoto(type) },
        { text: 'Skip (Test)', style: 'default', onPress: () => {
          // Set a placeholder image for testing
          const placeholderUri = isInsurance 
            ? 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Algerian+Insurance'
            : 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Algerian+Registration';
          if (type === 'insurance') setInsuranceImage(placeholderUri);
          else setRegistrationImage(placeholderUri);
        }},
      ],
      { cancelable: true }
    );
  };

  const verifyWithAI = () => {
    const images = [
      { uri: insuranceImage, type: 'insurance' as const },
      { uri: registrationImage, type: 'registration' as const }
    ].filter(img => img.uri);

    if (images.length === 0) {
      Alert.alert('No Images', 'Please upload at least one document to verify.');
      return;
    }

    // Simulate AI/OCR validation
    Alert.alert(
      'AI/OCR Verification',
      `Validating ${images.length} Algerian vehicle document(s)...`,
      [{ text: 'OK', onPress: () => {
        images.forEach(img => validateAlgerianDocument(img.uri!, img.type));
      }}]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>{t('appName')}</Text>
          <Text style={styles.progressLabel}>{t('onboarding.step2Of4')}</Text>
        </View>

        {/* Editorial */}
        <View style={styles.editorial}>
          <Text style={styles.headline}>
            {t('onboarding.vehicleIdentity').split('\n').map((line: string, i: number) => (
              <React.Fragment key={i}>
                {line}
                {i === 0 && <Text style={styles.headlineVariant}>{' '}</Text>}
                {i === 0 && <Text style={styles.headlineVariant}>Identity.</Text>}
              </React.Fragment>
            ))}
          </Text>
          <Text style={styles.description}>
            {t('onboarding.precisionParamount')}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Make & Model */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('onboarding.makeAndModel')}</Text>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('onboarding.make')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.makePlaceholder')}
                  placeholderTextColor={colors.onTertiaryFixedVariant}
                  value={make}
                  onChangeText={setMake}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('onboarding.model')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.modelPlaceholder')}
                  placeholderTextColor={colors.onTertiaryFixedVariant}
                  value={model}
                  onChangeText={setModel}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('onboarding.year')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.yearPlaceholder')}
                  placeholderTextColor={colors.onTertiaryFixedVariant}
                  value={year}
                  onChangeText={setYear}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('onboarding.licensePlate')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.licensePlatePlaceholder')}
                  placeholderTextColor={colors.onTertiaryFixedVariant}
                  value={plate}
                  onChangeText={setPlate}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>

          {/* Documentation */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('onboarding.documentation')}</Text>
              <Text style={styles.sectionDescription}>
                {t('onboarding.uploadClearCopies')}
              </Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.uploadCard} onPress={() => showImagePickerOptions('insurance')}>
                {insuranceImage ? (
                  <Image source={{ uri: insuranceImage }} style={styles.uploadedImage} />
                ) : (
                  <>
                    <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
                    <Text style={styles.uploadTitle}>{t('onboarding.proofOfInsurance')}</Text>
                    <Text style={styles.uploadDescription}>{t('onboarding.tapToUploadFile')}</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadCard} onPress={() => showImagePickerOptions('registration')}>
                {registrationImage ? (
                  <Image source={{ uri: registrationImage }} style={styles.uploadedImage} />
                ) : (
                  <>
                    <Ionicons name="car" size={32} color={colors.primary} />
                    <Text style={styles.uploadTitle}>{t('onboarding.vehicleRegistration')}</Text>
                    <Text style={styles.uploadDescription}>{t('onboarding.tapToUploadFile')}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* AI/OCR Verification Section */}
          <View style={styles.verifyCard}>
            <Text style={styles.verifyCardTitle}>AI Document Verification</Text>
            <Text style={styles.verifyCardDescription}>
              Validate Algerian vehicle documents using AI/OCR (Optional)
            </Text>
            
            {isVerifying && (
              <View style={styles.verifyingContainer}>
                <Text style={styles.verifyingText}>Verifying...</Text>
              </View>
            )}
            
            {validationResult && (
              <View style={styles.validationResult}>
                <Ionicons 
                  name={validationResult.includes('success') ? 'checkmark-circle' : 'warning'} 
                  size={20} 
                  color={validationResult.includes('success') ? colors.secondary : colors.error} 
                />
                <Text style={[styles.validationText, validationResult.includes('success') ? styles.validationSuccess : styles.validationError]}>
                  {validationResult}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.verifyButton} onPress={verifyWithAI} disabled={isVerifying}>
              <Ionicons name="scan" size={20} color={colors.onPrimary} />
              <Text style={styles.verifyButtonText}>Verify with AI/OCR</Text>
            </TouchableOpacity>
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
            <Text style={styles.continueText}>{t('onboarding.continueToBackgroundCheck')}</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.primaryContainer} />
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={skipUpload}>
            <Text style={styles.skipText}>Skip Upload (Test Mode)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl + 20, // Extra padding for system gestures
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brand: {
    ...typography.headlineSmall,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  progressLabel: {
    ...typography.labelSmall,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  editorial: {
    marginBottom: spacing.xl,
  },
  headline: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.md,
    lineHeight: 36,
  },
  headlineVariant: {
    ...typography.headlineLarge,
    color: colors.primary,
    fontWeight: '700',
  },
  description: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
  },
  form: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderBottomWidth: 2,
    borderBottomColor: colors.surfaceVariant,
    ...typography.bodyMedium,
    color: colors.onSurface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  uploadCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.lg,
    borderRadius: 12,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 32,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  uploadTitle: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '500',
    textAlign: 'center',
  },
  uploadDescription: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  uploadedImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  continueText: {
    ...typography.bodyLarge,
    color: colors.primaryContainer,
    fontWeight: '700',
  },
  continueArrow: {
    fontSize: 14,
    color: colors.primaryContainer,
    fontWeight: '600',
  },
  verifyCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  verifyCardTitle: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  verifyCardDescription: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  verifyingContainer: {
    backgroundColor: `${colors.primary}20`,
    padding: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  verifyingText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
  },
  validationResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.md,
  },
  validationText: {
    ...typography.bodyMedium,
    flex: 1,
    fontWeight: '500',
  },
  validationSuccess: {
    color: colors.secondary,
  },
  validationError: {
    color: colors.error,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.tertiary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  verifyButtonText: {
    ...typography.bodyMedium,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  skipText: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
});
