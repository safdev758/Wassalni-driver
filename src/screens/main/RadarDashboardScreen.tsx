import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors, typography, spacing } from '../../theme';
import { useDriver } from '../../context/DriverContext';
import { formatCurrency } from '../../utils/format';

const TAB_BAR_HEIGHT = 64;

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d1d1d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#e2e2e2' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1d1d1d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3b67ff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#131313' }] },
];

export default function RadarDashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { driverState, setOnline } = useDriver();

  const [location, setLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 36.7538,
    longitude: 3.0588,
  });

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Location permission denied');
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  const handleGoOnline = () => {
    setOnline(!driverState.isOnline);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Real Map Background */}
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={darkMapStyle}
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title={t('appName')}
        >
          <View style={styles.markerContainer}>
            <View style={styles.markerPulse} />
            <View style={styles.markerDot}>
              <Ionicons name="car" size={14} color={colors.surface} />
            </View>
            <View style={styles.markerStem} />
            <View style={styles.markerShadow} />
          </View>
        </Marker>
      </MapView>

      {/* Top Safe Area Overlay */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.brand}>{t('appName')}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications" size={24} color={colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="person" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* UI Overlay */}
      <View style={[styles.overlay, { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 }]}>
        {/* Top Stats Banner */}
        <View style={styles.topBanner}>
          {/* Earnings Summary */}
          <View style={styles.earningsPill}>
            <Text style={styles.earningsLabel}>{t('main.todayEarnings')}</Text>
            <Text style={styles.earningsAmount}>{formatCurrency(driverState.todayEarnings)}</Text>
            <View style={styles.tripsIndicator}>
              <View style={styles.dot} />
              <Text style={styles.tripsText}>{driverState.todayTrips} {t('main.trips')}</Text>
            </View>
          </View>

          {/* Opportunities */}
          <View style={styles.opportunities}>
            <View style={styles.opportunityBadge}>
              <Ionicons name="flame" size={16} color={colors.error} />
              <Text style={styles.opportunityText}>{t('main.highDemandDowntown')}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Action Area */}
        <View style={styles.bottomActions}>
          {/* Emergency Slide */}
          <View style={styles.emergencySlide}>
            <TouchableOpacity style={styles.emergencyButton}>
              <Ionicons name="warning" size={24} color={colors.onError} />
            </TouchableOpacity>
            <Text style={styles.emergencyText}>{t('main.slideForEmergency')}</Text>
          </View>

          {/* Go Online Button */}
          <TouchableOpacity
            style={[
              styles.goOnlineButton,
              driverState.isOnline && styles.goOnlineButtonActive,
            ]}
            onPress={handleGoOnline}
            activeOpacity={0.8}
          >
            <Ionicons name="power" size={48} color={colors.surfaceContainerLowest} />
            <Text style={styles.goOnlineText}>{driverState.isOnline ? t('main.goOffline') : t('main.goOnline')}</Text>
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  /* ── Marker (copied from rider) ── */
  markerContainer: {
    alignItems: 'center',
  },
  markerPulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '40',
  },
  markerDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.surface,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  markerStem: {
    width: 4,
    height: 32,
    backgroundColor: colors.primary,
    opacity: 0.5,
    marginTop: -4,
  },
  markerShadow: {
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#000',
    opacity: 0.6,
    marginTop: -2,
  },

  /* ── Safe Area + Header ── */
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface + 'CC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  brand: {
    ...typography.headlineSmall,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
  },

  /* ── Overlay ── */
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingTop: 120,
    paddingHorizontal: spacing.md,
    pointerEvents: 'box-none',
  },
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  earningsPill: {
    backgroundColor: colors.surfaceContainerHigh + 'CC',
    padding: spacing.md,
    borderRadius: 24,
    minWidth: 140,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 6,
  },
  earningsLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  earningsAmount: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontWeight: '700',
  },
  tripsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  tripsText: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  opportunities: {
    flexDirection: 'column',
    gap: 8,
  },
  opportunityBadge: {
    backgroundColor: colors.surfaceBright + 'B8',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  opportunityText: {
    ...typography.bodySmall,
    color: colors.onSurface,
    fontWeight: '500',
  },
  bottomActions: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  emergencySlide: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer + '99',
    padding: spacing.sm,
    borderRadius: 24,
    width: '100%',
    maxWidth: 350,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 6,
  },
  emergencyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyText: {
    ...typography.labelMedium,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    flex: 1,
    textAlign: 'center',
    opacity: 0.7,
  },
  goOnlineButton: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.surface,
    shadowColor: colors.onPrimaryContainer,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 12,
  },
  goOnlineButtonActive: {
    backgroundColor: colors.error,
  },
  goOnlineText: {
    ...typography.labelLarge,
    color: colors.surfaceContainerLowest,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
