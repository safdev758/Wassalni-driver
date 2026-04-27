import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useDriver } from '../../context/DriverContext';
import { formatCurrency } from '../../utils/format';
import type { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RideNavigation'>;

export default function RideNavigationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { driverState, completeRide, updateEarnings } = useDriver();
  const ride = driverState.currentRide;

  const handleComplete = () => {
    if (ride) {
      updateEarnings(ride.estimatedFare);
    }
    completeRide();
    Alert.alert(
      t('rideNavigation.rideCompleted'),
      t('rideNavigation.rideCompletedDescription'),
      [{ text: t('common.done'), onPress: () => navigation.navigate('MainTabs') }],
    );
  };

  const handleCancel = () => {
    Alert.alert(
      t('rideNavigation.cancelRide'),
      t('rideNavigation.cancelConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: () => {
            completeRide();
            navigation.navigate('MainTabs');
          },
        },
      ],
    );
  };

  if (!ride) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
        <View style={styles.emptyContainer}>
          <Ionicons name="navigate-outline" size={64} color={colors.onSurfaceVariant} />
          <Text style={styles.emptyTitle}>{t('rideNavigation.noActiveRide')}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.primaryButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const fareLabel = formatCurrency(ride.estimatedFare);
  const distanceLabel = ride.distance;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        <View style={styles.mapBackground} />

        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleCancel}>
            <Ionicons name="close" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.etaBadge}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.etaText}>{ride.duration}</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.riderRow}>
            <View style={styles.riderAvatar}>
              <Ionicons name="person" size={24} color={colors.onSurface} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.riderName}>{ride.rider.name}</Text>
              <View style={styles.riderMetaRow}>
                <Ionicons name="star" size={14} color={colors.secondary} />
                <Text style={styles.riderMeta}>{ride.rider.rating.toFixed(2)}</Text>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.riderMeta}>{ride.type}</Text>
              </View>
            </View>
          </View>

          <View style={styles.locationBlock}>
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, { backgroundColor: colors.primary }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationLabel}>{t('rideNavigation.pickup')}</Text>
                <Text style={styles.locationAddress}>{ride.pickup.address}</Text>
              </View>
            </View>
            <View style={styles.timeline} />
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, { backgroundColor: colors.secondary }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationLabel}>{t('rideNavigation.dropoff')}</Text>
                <Text style={styles.locationAddress}>{ride.dropoff.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>{t('rideNavigation.fare')}</Text>
              <Text style={styles.metricValue}>{fareLabel}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>{t('rideNavigation.distance')}</Text>
              <Text style={styles.metricValue}>{distanceLabel}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>{t('rideNavigation.eta')}</Text>
              <Text style={styles.metricValue}>{ride.duration}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
            <Ionicons name="checkmark-circle" size={20} color={colors.surfaceContainerLowest} />
            <Text style={styles.primaryButtonText}>{t('rideNavigation.completeRide')}</Text>
          </TouchableOpacity>
        </View>
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
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1c1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerHigh,
  },
  etaText: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '600',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surfaceContainerLow,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceVariant,
    marginBottom: spacing.sm,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riderName: {
    ...typography.titleMedium,
    color: colors.onSurface,
    fontWeight: '700',
  },
  riderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  riderMeta: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  separator: {
    color: colors.onSurfaceVariant,
  },
  locationBlock: {
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
    borderRadius: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timeline: {
    width: 2,
    height: 16,
    backgroundColor: colors.surfaceVariant,
    marginLeft: 5,
    marginVertical: spacing.xs,
  },
  locationLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  locationAddress: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '600',
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
    borderRadius: 16,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.surfaceVariant,
  },
  metricLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  metricValue: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '700',
    marginTop: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  primaryButtonText: {
    ...typography.titleMedium,
    color: colors.surfaceContainerLowest,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  emptyTitle: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '600',
    textAlign: 'center',
  },
});

