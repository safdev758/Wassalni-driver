import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing } from '../../theme';
import { useDriver } from '../../context/DriverContext';

export default function RideRequestScreen() {
  const navigation = useNavigation();
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
  }, []);

  const handleAccept = () => {
    acceptRide({
      id: 'ride_001',
      type: 'Black SUV',
      pickup: {
        address: '1240 Avenue of the Americas',
        latitude: 40.7580,
        longitude: -73.9855,
      },
      dropoff: {
        address: 'JFK International Airport',
        latitude: 40.6413,
        longitude: -73.7781,
      },
      estimatedFare: 42.50,
      distance: '5.2 mi',
      duration: '32 min',
      rider: {
        name: 'John Doe',
        rating: 4.92,
      },
    });
    navigation.navigate('RideNavigation' as never);
  };

  const handleReject = () => {
    rejectRide();
    navigation.goBack();
  };

  return (
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
        {/* Subtle gradient glow */}
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
            <Text style={styles.starIcon}>Star</Text>
            <Text style={styles.rating}>4.92</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.riderType}>{t('rideRequest.premiumRider')}</Text>
          </View>
        </View>

        {/* Location & Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Pickup Info */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{t('rideRequest.pickup')}</Text>
            <Text style={styles.metricValue}>{t('rideRequest.minsAway')}</Text>
            <Text style={styles.metricAddress}>1240 Avenue of the Americas</Text>
          </View>

          {/* Est. Fare & Distance */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{t('rideRequest.estFare')}</Text>
            <Text style={styles.fareAmount}>$42.50</Text>
            <View style={styles.distanceInfo}>
              <Text style={styles.distanceIcon}>Pin</Text>
              <Text style={styles.distanceText}>5.2 mi {t('rideRequest.trip')}</Text>
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
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 999,
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
  starIcon: {
    fontSize: 18,
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
  distanceIcon: {
    fontSize: 14,
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
