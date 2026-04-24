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

// Placeholder ride shown until a real ride request arrives from the backend.
const SAMPLE_RIDE = {
  id: 'ride_001',
  type: 'Economy',
  pickup: {
    address: 'Place des Martyrs, Alger-Centre',
    latitude: 36.7878,
    longitude: 3.0603,
  },
  dropoff: {
    address: 'Aéroport Houari Boumediene',
    latitude: 36.6910,
    longitude: 3.2155,
  },
  estimatedFare: 1850,
  distanceKm: 18.4,
  distance: '18.4 km',
  duration: '32 min',
  rider: {
    name: 'Yacine B.',
    rating: 4.92,
  },
};

const PICKUP_MINUTES_AWAY = 4;

export default function RideRequestScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { acceptRide, rejectRide } = useDriver();
  const [countdown, setCountdown] = useState(12);

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
    acceptRide(SAMPLE_RIDE);
    navigation.navigate('RideNavigation');
  };

  const handleReject = () => {
    rejectRide();
    navigation.goBack();
  };

  const fareLabel = formatCurrency(SAMPLE_RIDE.estimatedFare, 0);
  const distanceLabel = formatDistanceKm(SAMPLE_RIDE.distanceKm);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        {/* Background Map */}
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF1qOZj3o2y0JvTHkFNkPbkmDygHjyCy3ccUmptYIDGntv_7GROy0FWzlsK9MSbmSQKLiaaMkZ1kQdDEfocfLmrT-I2U5drbeW-FC7E1ZXZ8wBm-FssO-fs1EdF_T6mjPcPglimoOUVOs2F_E892oDiUoJsz5tWyPjY-Id0u2oAVknf4Dwekt7rZiNCbw_gXgV5lLftfRAvhsaH521lX83QGMflWhbBFK5ci-MUrCMoTuLmtrKfK9Fwh7O1iSmkdX-D0jGdTc_QLM' }}
          style={styles.mapBackground}
          resizeMode="cover"
        />
        <View style={styles.mapOverlay} />

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
              <Text style={styles.rating}>{SAMPLE_RIDE.rider.rating.toFixed(2)}</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.riderType}>{t('rideRequest.premiumRider')}</Text>
            </View>
          </View>

          {/* Location & Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>{t('rideRequest.pickup')}</Text>
              <Text style={styles.metricValue}>{PICKUP_MINUTES_AWAY} {t('rideRequest.minsAway')}</Text>
              <Text style={styles.metricAddress}>{SAMPLE_RIDE.pickup.address}</Text>
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
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${colors.surface}66`,
  },
  modal: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
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
    ...typography.headlineLarge,
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
    ...typography.headlineSmall,
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
    ...typography.headlineSmall,
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
    ...typography.headlineSmall,
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
    ...typography.headlineSmall,
    color: colors.surfaceContainerLowest,
    fontWeight: '700',
  },
});
