import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Drafts'>;

export default function DraftsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>Menu</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>{t('appName')}</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAtjEMugxEf4Qq5IDYmgF0k9OjDAbRqD5beythW6MtLUQHBW4-o3lJL1AkFyifZLyeAg9UzKUdqjWU4liGL4Y6cgalv_LekfwD9fUtakRIxPMRb649KdsgJrjFQZyDXsy6SMwVPkHi-jQ36JuY7dzVcQYq0N8I4PPW49K_GaEWaDRyf8vJoqST9u5lSYYRwWqmb4heuWvtwRnAf2dkHIg_moe071ICIFLfCaVGh5ByEeFKIIUXm0kP9GVa-Pf-RtO6DFfJuU3GLVX1' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>{t('drafts.title')}</Text>
          <Text style={styles.subtitle}>{t('drafts.subtitle')}</Text>
        </View>

        {/* Drafts List */}
        <View style={styles.draftsList}>
          {/* Draft Item 1 */}
          <TouchableOpacity style={styles.draftItem}>
            <View style={styles.draftLeft}>
              <View style={styles.draftIcon}>
                <Text style={styles.draftIconText}>Document</Text>
              </View>
              <View>
                <Text style={styles.draftTitle}>{t('drafts.personalInfoDraft')}</Text>
                <Text style={styles.draftDate}>{t('drafts.savedYesterday')}</Text>
              </View>
            </View>
            <View style={styles.draftRight}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editText}>{t('common.edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteText}>{t('common.delete')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>Folder</Text>
            <Text style={styles.emptyTitle}>{t('drafts.noDrafts')}</Text>
            <Text style={styles.emptyDescription}>{t('drafts.noDraftsDescription')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => navigation.navigate('PersonalDocuments')}
        >
          <Text style={styles.continueText}>{t('drafts.startNewApplication')}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingVertical: spacing.lg,
    backgroundColor: `${colors.surface}B3`,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 16,
    color: colors.onSurface,
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
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 130,
  },
  sectionHeader: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  draftsList: {
    gap: spacing.md,
  },
  draftItem: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  draftLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  draftIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftIconText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  draftTitle: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '600',
  },
  draftDate: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  draftRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  editText: {
    ...typography.bodySmall,
    color: colors.surfaceContainerLowest,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.error,
  },
  deleteText: {
    ...typography.bodySmall,
    color: colors.surfaceContainerLowest,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${colors.surface}E6`,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    ...typography.headlineSmall,
    color: colors.surfaceContainerLowest,
    fontWeight: '700',
  },
});
