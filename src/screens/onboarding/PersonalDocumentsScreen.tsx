import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing } from '../../theme';
import type { RootStackParamList } from '../../types/navigation';
import { documentAPI } from '../../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PersonalDocuments'>;

export default function PersonalDocumentsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [frontLicenseImage, setFrontLicenseImage] = useState<string | null>(null);
  const [backLicenseImage, setBackLicenseImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'success' | 'warning' | 'error' | null>(null);

  const handleContinue = () => {
    // Allow navigation even without images - upload is optional for testing
    navigation.navigate('VehicleInformation');
  };

  const skipUpload = () => {
    console.log('Skip button pressed');
    Alert.alert(
      'Skip Upload (Testing Mode)',
      'Document upload will be marked as optional. Continue to next screen?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {
          console.log('Navigating to VehicleInformation');
          navigation.navigate('VehicleInformation');
        }}
      ]
    );
  };

  const validateAlgerianDocument = async (imageUri: string, type: 'front' | 'back' | 'selfie') => {
    setIsVerifying(true);
    setValidationResult(null);

    const docTypeMap: Record<string, string> = {
      front: 'drivers_license_front',
      back: 'drivers_license_back',
      selfie: 'selfie',
    };

    try {
      const result = await documentAPI.uploadAndVerify(docTypeMap[type], imageUri);
      setIsVerifying(false);
      if (result.status === 'approved') {
        setValidationStatus('success');
        setValidationResult(`Document verified (${(result.confidence * 100).toFixed(0)}% confidence)`);
      } else if (result.status === 'needs_review') {
        setValidationStatus('warning');
        setValidationResult(`Document submitted for review (${(result.confidence * 100).toFixed(0)}% confidence)`);
      } else {
        setValidationStatus('error');
        setValidationResult(result.rejection_reason || 'Verification failed. Please retake photo with better lighting.');
      }
    } catch (error) {
      setIsVerifying(false);
      setValidationStatus('error');
      setValidationResult('Upload failed. Please try again.');
    }
  };

  const handleSaveDraft = () => {
    // Save draft logic here - for now just navigate to drafts screen
    navigation.navigate('Drafts');
  };

  const pickImage = async (type: 'front' | 'back' | 'selfie') => {
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
        if (type === 'front') {
          setFrontLicenseImage(uri);
        } else if (type === 'back') {
          setBackLicenseImage(uri);
        } else if (type === 'selfie') {
          setSelfieImage(uri);
        }
      }
    } catch (error) {
      console.error('pickImage error:', error);
      Alert.alert(t('common.error'), t('permissions.failedPickImage'));
    }
  };

  const takePhoto = async (type: 'front' | 'back' | 'selfie') => {
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
        if (type === 'front') {
          setFrontLicenseImage(uri);
        } else if (type === 'back') {
          setBackLicenseImage(uri);
        } else if (type === 'selfie') {
          setSelfieImage(uri);
        }
      }
    } catch (error) {
      console.error('takePhoto error:', error);
      Alert.alert(t('common.error'), t('permissions.failedTakePhoto'));
    }
  };

  const showImagePickerOptions = (type: 'front' | 'back' | 'selfie') => {
    const isSelfie = type === 'selfie';
    Alert.alert(
      isSelfie ? 'Liveness Check' : 'Upload Algerian Document',
      isSelfie 
        ? 'Take a selfie for identity verification' 
        : 'Upload your Algerian driver\'s license',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Gallery', onPress: () => pickImage(type) },
        { text: 'Camera', onPress: () => takePhoto(type) },
        { text: 'Skip (Test)', style: 'default', onPress: () => {
          // Set a placeholder image for testing
          const placeholderUri = isSelfie 
            ? 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=Selfie'
            : 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Algerian+License';
          if (type === 'front') setFrontLicenseImage(placeholderUri);
          else if (type === 'back') setBackLicenseImage(placeholderUri);
          else setSelfieImage(placeholderUri);
        }},
      ],
      { cancelable: true }
    );
  };

  const verifyWithAI = () => {
    const images = [
      { uri: frontLicenseImage, type: 'front' as const },
      { uri: backLicenseImage, type: 'back' as const },
      { uri: selfieImage, type: 'selfie' as const }
    ].filter(img => img.uri);

    if (images.length === 0) {
      Alert.alert('No Images', 'Please upload at least one document to verify.');
      return;
    }

    Alert.alert(
      'AI/OCR Verification',
      `Validating ${images.length} document(s) using Algerian ID recognition...`,
      [{ text: 'OK', onPress: async () => {
        for (const img of images) {
          await validateAlgerianDocument(img.uri!, img.type);
        }
      }}]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      {/* TopAppBar */}
      <View style={styles.header}>
        <Text style={styles.brand}>{t('appName')}</Text>
        <View style={styles.profileButton}>
          <Ionicons name="person" size={20} color={colors.primary} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Onboarding Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>{t('onboarding.identityVerification')}</Text>
          <View style={styles.progress}>
            <View style={styles.progressLine}>
              <View style={[styles.progressFill, { width: '33%' }]} />
            </View>
            <View style={styles.step}>
              <View style={styles.stepCompleted}>
                <Ionicons name="checkmark" size={16} color={colors.primaryContainer} />
              </View>
              <Text style={styles.stepLabelActive}>{t('onboarding.basics')}</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepActive}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <Text style={styles.stepLabel}>{t('onboarding.identity')}</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepInactive}>
                <Text style={styles.stepNumberInactive}>3</Text>
              </View>
              <Text style={styles.stepLabelInactive}>{t('onboarding.vehicle')}</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>{t('onboarding.personalInformation')}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('onboarding.fullLegalName')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('onboarding.asItAppearsOnLicense')}
                placeholderTextColor={colors.onSurfaceVariant}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('onboarding.emailAddress')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('onboarding.youAtDomain')}
                placeholderTextColor={colors.onSurfaceVariant}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('onboarding.homeAddress')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('onboarding.streetAddress')}
                placeholderTextColor={colors.onSurfaceVariant}
                value={address}
                onChangeText={setAddress}
              />
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.inputHalf]}
                  placeholder={t('onboarding.city')}
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={city}
                  onChangeText={setCity}
                />
                <TextInput
                  style={[styles.input, styles.inputHalf]}
                  placeholder={t('onboarding.zip')}
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={zip}
                  onChangeText={setZip}
                />
              </View>
            </View>
          </View>

          <View style={[styles.formCard, styles.uploadCard]}>
            <Text style={styles.cardTitle}>{t('onboarding.driversLicense')}</Text>
            <Text style={styles.cardDescription}>
              {t('onboarding.uploadClearImages')}
            </Text>

            <View style={styles.uploadGrid}>
              <TouchableOpacity style={styles.uploadBox} onPress={() => showImagePickerOptions('front')}>
                {frontLicenseImage ? (
                  <Image source={{ uri: frontLicenseImage }} style={styles.uploadedImage} />
                ) : (
                  <>
                    <Ionicons name="camera" size={32} color={colors.primary} />
                    <Text style={styles.uploadLabel}>{t('onboarding.frontSide')}</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadBox, styles.uploadBoxInactive]}
                onPress={() => showImagePickerOptions('back')}
              >
                {backLicenseImage ? (
                  <Image source={{ uri: backLicenseImage }} style={styles.uploadedImage} />
                ) : (
                  <>
                    <Ionicons name="camera" size={32} color={colors.onSurfaceVariant} />
                    <Text style={[styles.uploadLabel, styles.uploadLabelInactive]}>{t('onboarding.backSide')}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.livenessHeader}>
              <View>
                <Text style={styles.cardTitle}>{t('onboarding.livenessCheck')}</Text>
                <Text style={styles.cardDescription}>
                  {t('onboarding.takeQuickSelfie')}
                </Text>
              </View>
              <View style={styles.livenessIcon}>
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
            </View>
            <TouchableOpacity style={styles.captureButton} onPress={() => showImagePickerOptions('selfie')}>
              {selfieImage ? (
                <Image source={{ uri: selfieImage }} style={styles.selfieImage} />
              ) : (
                <>
                  <Ionicons name="camera" size={24} color={colors.onSurface} />
                  <Text style={styles.captureText}>{t('onboarding.captureSelfie')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* AI/OCR Verification Section */}
          <View style={[styles.formCard, styles.verifyCard]}>
            <Text style={styles.cardTitle}>AI Document Verification</Text>
            <Text style={styles.cardDescription}>
              Validate Algerian documents using AI/OCR (Optional)
            </Text>
            
            {isVerifying && (
              <View style={styles.verifyingContainer}>
                <Text style={styles.verifyingText}>Verifying...</Text>
              </View>
            )}
            
            {validationResult && (
              <View style={styles.validationResult}>
                <Ionicons 
                  name={validationStatus === 'success' ? 'checkmark-circle' : validationStatus === 'warning' ? 'alert-circle' : 'warning'} 
                  size={20} 
                  color={validationStatus === 'success' ? colors.secondary : validationStatus === 'warning' ? colors.onSurfaceVariant : colors.error} 
                />
                <Text style={[styles.validationText, validationStatus === 'error' ? styles.validationError : styles.validationSuccess]}>
                  {validationResult}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.verifyButton} onPress={verifyWithAI} disabled={isVerifying}>
              <Ionicons name="scan" size={20} color={colors.onPrimary} />
              <Text style={styles.verifyButtonText}>Verify with AI/OCR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.skipButton} onPress={skipUpload}>
          <Text style={styles.skipText}>Skip (Test)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveDraft}>
          <Text style={styles.saveText}>{t('onboarding.saveDraft')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.continueText}>{t('onboarding.continueToVehicle')}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.primaryContainer} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  brand: {
    ...typography.headlineSmall,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 150, // Extra padding for bottom action bar + system gestures
  },
  progressSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    marginBottom: spacing.xl,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  progressLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.surfaceVariant,
    zIndex: -1,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  step: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepCompleted: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIcon: {
    color: colors.primaryContainer,
    fontSize: 20,
  },
  stepActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepInactive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    ...typography.titleSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  stepNumberInactive: {
    ...typography.titleSmall,
    color: colors.onSurfaceVariant,
    fontWeight: '700',
  },
  stepLabelActive: {
    ...typography.labelSmall,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  stepLabel: {
    ...typography.labelSmall,
    color: colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  stepLabelInactive: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  formContainer: {
    gap: spacing.xl,
  },
  formCard: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.xl,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  uploadCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  cardTitle: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  cardDescription: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceContainerHigh,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    ...typography.bodyMedium,
    color: colors.onSurface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
  uploadGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  uploadBox: {
    flex: 1,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 2,
    borderColor: `${colors.outlineVariant}40`,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 160,
  },
  uploadBoxInactive: {
    opacity: 0.5,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  uploadIconInactive: {
    color: colors.onSurfaceVariant,
  },
  uploadLabel: {
    ...typography.labelSmall,
    color: colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  uploadLabelInactive: {
    color: colors.onSurfaceVariant,
  },
  uploadedImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  livenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  livenessIcon: {
    backgroundColor: `${colors.primary}10`,
    padding: spacing.md,
    borderRadius: 24,
  },
  livenessEmoji: {
    fontSize: 24,
  },
  captureButton: {
    backgroundColor: colors.surfaceContainerHighest,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  captureIcon: {
    fontSize: 24,
  },
  captureText: {
    ...typography.bodyMedium,
    color: colors.onSurface,
  },
  selfieImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${colors.surface}F2`,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: `${colors.outlineVariant}40`,
    gap: spacing.sm,
    zIndex: 100,
    elevation: 10,
  },
  skipButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 8,
    minWidth: 80,
  },
  skipText: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  saveText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '500',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  continueText: {
    ...typography.labelLarge,
    color: colors.primaryContainer,
    fontWeight: '700',
  },
  continueArrow: {
    fontSize: 16,
    color: colors.primaryContainer,
  },
  verifyCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: spacing.lg,
    marginTop: spacing.lg,
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
});
