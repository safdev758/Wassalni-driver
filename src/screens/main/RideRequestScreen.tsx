import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useDriver } from '../../context/DriverContext';
import { formatCurrency, formatDistanceKm } from '../../utils/format';
import type { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RideRequest'>;



export default function RideRequestScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { acceptRide, rejectRide, driverState } = useDriver();
  const [countdown, setCountdown] = useState(12);

  const ride = driverState.pendingRide;
  if (!ride) {
    return null;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          rejectRide();
          navigation.goBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigation, rejectRide]);

  const handleAccept = () => {
    acceptRide(ride);
    navigation.navigate('RideNavigation');
  };

  const handleReject = () => {
    rejectRide();
    navigation.goBack();
  };

  const fareLabel = formatCurrency(ride.estimatedFare, 0);
  const distanceLabel = ride.distance;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        {/* Background Map Placeholder */}
        <View style={styles.mapBackground} />

        {/* Ride Request Modal */}
        <View style={styles.modal}>
          <View style={styles.modalGlow} />

          {/* Countdown Timer */}
          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>{countdown}</Text>
            </View>
            <Text style={styles.timerLabel}>{t('rideRequest.seconds')}</Text>
          </View>

          {/* Ride Details */}
          <View style={styles.rideDetails}>
            <Text style={styles.rideType}>{t('rideRequest.blackSUV')}</Text>
            <View style={styles.riderInfo}>
              <Ionicons name="star" size={18} color={colors.secondary} />
              <Text style={styles.rating}>{ride.rider.rating.toFixed(2)}</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.riderType}>{t('rideRequest.premiumRider')}</Text>
            </View>
          </View>

          {/* Location & Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>{t('rideRequest.pickup')}</Text>
              <Text style={styles.metricValue}>{t('rideRequest.minsAway')}</Text>
              <Text style={styles.metricAddress}>{ride.pickup.address}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>{t('rideRequest.estFare')}</Text>
              <Text style={styles.fareAmount}>{fareLabel}</Text>
              <View style={styles.distanceInfo}>
                <Ionicons name="location" size={14} color={colors.onSurfaceVariant} />
                <Text style={styles.distanceText}>{distanceLabel} {t('rideRequest.trip')}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
              <Text style={styles.rejectText}>{t('rideRequest.reject')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <Text style={styles.acceptText}>{t('rideRequest.acceptRide')}</Text>
            </TouchableOpacity>
          </View>
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
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${colors.surfaceContainerLow}E6`,
    borderRadius: 32,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  modalGlow: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -150 }],
    width: 300,
    height: 150,
    borderRadius: 150,
    backgroundColor: `${colors.primary}10`,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  timerCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timerText: {
    ...typography.displayMedium,
    color: colors.onSurface,
    fontWeight: '700',
  },
  timerLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  rideDetails: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  rideType: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rating: {
    ...typography.bodyLarge,
    color: colors.primary,
    fontWeight: '700',
  },
  separator: {
    color: colors.onSurfaceVariant,
  },
  riderType: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
    borderRadius: 12,
  },
  metricLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  metricValue: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  metricAddress: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
  },
  fareAmount: {
    ...typography.headlineMedium,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  distanceText: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHighest,
    paddingVertical: spacing.md,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectText: {
    ...typography.titleMedium,
    color: colors.onSurface,
    fontWeight: '700',
  },
  acceptButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  acceptText: {
    ...typography.titleMedium,
    color: colors.surfaceContainerLowest,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
