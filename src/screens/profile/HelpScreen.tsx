import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { colors, typography, spacing } from '../../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface HelpItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export default function HelpScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavProp>();

  const helpItems: HelpItem[] = [
    {
      id: '1',
      icon: 'help-circle',
      title: t('help.faq'),
      description: 'Frequently asked questions about the app',
    },
    {
      id: 'payment',
      icon: 'card-outline',
      title: t('help.paymentIssues'),
      description: 'Troubleshoot payment problems',
    },
    {
      id: 'ride',
      icon: 'car-outline',
      title: t('help.rideIssues'),
      description: 'Report problems with your ride',
    },
    {
      id: 'safety',
      icon: 'shield-outline',
      title: t('help.safetyConcerns'),
      description: 'Report safety issues during rides',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('help.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>{t('help.subtitle')}</Text>

        {helpItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.helpItem}
            onPress={() => Alert.alert(item.title, 'This section is coming soon.')}
          >
            <View style={styles.helpIconContainer}>
              <Ionicons name={item.icon as any} size={24} color={colors.primary} />
            </View>
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpTitle}>{item.title}</Text>
              <Text style={styles.helpDescription}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>{t('help.contactSupport')}</Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Alert.alert('Call Support', 'Phone support coming soon.')}
          >
            <Ionicons name="call" size={20} color={colors.surfaceContainerLowest} />
            <Text style={styles.contactButtonText}>{t('help.callSupport')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  headerTitle: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '600',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  helpIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    ...typography.bodyLarge,
    color: colors.onSurface,
    fontWeight: '500',
    marginBottom: 2,
  },
  helpDescription: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  contactSection: {
    marginTop: spacing.xl,
  },
  contactTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  contactButtonText: {
    ...typography.bodyLarge,
    color: colors.surfaceContainerLowest,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});
