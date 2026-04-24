import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useDriver } from '../../context/DriverContext';

export default function RadarDashboardScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { driverState, setOnline } = useDriver();

  const handleGoOnline = () => {
    setOnline(!driverState.isOnline);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        {/* Map Background */}
        <View style={styles.mapBg}>
          <View style={styles.surgeAreaHigh} />
          <View style={styles.surgeAreaMed} />
          
          {/* Driver Pin */}
          <View style={styles.driverPin}>
            <View style={styles.driverPinInner}>
              <Ionicons name="car" size={24} color={colors.onSurface} />
            </View>
            <View style={styles.driverStatus}>
              <Text style={styles.driverStatusText}>{driverState.isOnline ? t('main.goOffline') : t('main.goOnline')}</Text>
            </View>
          </View>
        </View>

      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="menu" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.brand}>{t('appName')}</Text>
        <TouchableOpacity style={[styles.headerButton, styles.profileButton]}>
          <Ionicons name="person" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* UI Overlay */}
      <View style={styles.overlay}>
        {/* Top Stats Banner */}
        <View style={styles.topBanner}>
          {/* Earnings Summary */}
          <View style={styles.earningsPill}>
            <Text style={styles.earningsLabel}>{t('main.todayEarnings')}</Text>
            <Text style={styles.earningsAmount}>${driverState.todayEarnings.toFixed(2)}</Text>
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
              <Text style={styles.emergencyIcon}>SOS</Text>
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} style={styles.slideArrow} />
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
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1c1e',
  },
  surgeAreaHigh: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: `${colors.error}30`,
  },
  surgeAreaMed: {
    position: 'absolute',
    top: '50%',
    right: '10%',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: `${colors.primary}20`,
  },
  driverPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    alignItems: 'center',
  },
  driverPinInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.surface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  driverStatus: {
    backgroundColor: `${colors.surface}80`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}20`,
  },
  driverStatusText: {
    ...typography.labelSmall,
    color: colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: `${colors.surface}B3`,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    ...typography.headlineSmall,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  profileButton: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  earningsPill: {
    backgroundColor: `${colors.surfaceContainerHigh}CC`,
    padding: spacing.md,
    borderRadius: 24,
    minWidth: 140,
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
    backgroundColor: `${colors.surfaceBright}B8`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slideArrow: {
    marginHorizontal: spacing.sm,
  },
  opportunityText: {
    ...typography.bodySmall,
    color: colors.onSurface,
    fontWeight: '500',
  },
  bottomActions: {
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  emergencySlide: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.surfaceContainer}99`,
    padding: spacing.sm,
    borderRadius: 24,
    width: '100%',
    maxWidth: 350,
  },
  emergencyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyIcon: {
    fontSize: 24,
  },
  emergencyText: {
    ...typography.headlineSmall,
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
    ...typography.headlineSmall,
    color: colors.surfaceContainerLowest,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
