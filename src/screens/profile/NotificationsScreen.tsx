import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { colors, typography, spacing } from '../../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationPref {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface NotificationHistory {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'ride' | 'promotion' | 'account';
  read: boolean;
}

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavProp>();

  const [preferences, setPreferences] = useState<NotificationPref[]>([
    { id: '1', title: t('notifications.rideUpdates'), description: t('notifications.rideUpdatesDesc'), enabled: true },
    { id: '2', title: t('notifications.promotions'), description: t('notifications.promotionsDesc'), enabled: true },
    { id: '3', title: t('notifications.messages'), description: t('notifications.messagesDesc'), enabled: true },
    { id: '4', title: t('notifications.accountActivity'), description: t('notifications.accountActivityDesc'), enabled: true },
  ]);

  const [history] = useState<NotificationHistory[]>([
    { id: '1', title: t('notifications.rideCompleted'), message: t('notifications.rideCompletedMsg'), time: t('notifications.twoHoursAgo'), type: 'ride', read: true },
    { id: '2', title: t('notifications.specialOffer'), message: t('notifications.specialOfferMsg'), time: t('notifications.yesterday'), type: 'promotion', read: false },
    { id: '3', title: t('notifications.paymentSuccess'), message: t('notifications.paymentSuccessMsg'), time: t('notifications.twoDaysAgo'), type: 'account', read: true },
    { id: '4', title: t('notifications.newRideRequest'), message: t('notifications.newRideRequestMsg'), time: t('notifications.threeDaysAgo'), type: 'ride', read: true },
  ]);

  const togglePref = (id: string) => {
    setPreferences(prev =>
      prev.map(item => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'ride': return 'car';
      case 'promotion': return 'pricetag';
      default: return 'shield-checkmark';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Preferences */}
        <Text style={styles.sectionTitle}>{t('notifications.preferences')}</Text>
        {preferences.map((item) => (
          <View key={item.id} style={styles.prefItem}>
            <View style={styles.prefTextContainer}>
              <Text style={styles.prefTitle}>{item.title}</Text>
              <Text style={styles.prefDescription}>{item.description}</Text>
            </View>
            <Switch
              value={item.enabled}
              onValueChange={() => togglePref(item.id)}
              trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary }}
              thumbColor={item.enabled ? colors.onPrimary : colors.onSurfaceVariant}
            />
          </View>
        ))}

        {/* History */}
        <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>{t('notifications.history')}</Text>
        {history.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.historyItem, !item.read && styles.historyItemUnread]}
            activeOpacity={0.8}
          >
            <View style={styles.historyIconContainer}>
              <Ionicons
                name={getTypeIcon(item.type) as any}
                size={20}
                color={item.read ? colors.onSurfaceVariant : colors.primary}
              />
            </View>
            <View style={styles.historyTextContainer}>
              <Text style={[styles.historyTitle, !item.read && styles.historyTitleUnread]}>
                {item.title}
              </Text>
              <Text style={styles.historyMessage}>{item.message}</Text>
              <Text style={styles.historyTime}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
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

  /* ── Section Title ── */
  sectionTitle: {
    ...typography.labelSmall,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  sectionTitleMargin: {
    marginTop: spacing.xl,
  },

  /* ── Preferences ── */
  prefItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  prefTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  prefTitle: {
    ...typography.bodyLarge,
    color: colors.onSurface,
    fontWeight: '500',
    marginBottom: 4,
  },
  prefDescription: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },

  /* ── History ── */
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  historyItemUnread: {
    backgroundColor: colors.primary + '0D',
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyTitle: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '500',
    marginBottom: 2,
  },
  historyTitleUnread: {
    color: colors.primary,
  },
  historyMessage: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  historyTime: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
