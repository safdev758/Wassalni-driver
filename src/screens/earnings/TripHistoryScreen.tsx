import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { formatCurrency } from '../../utils/format';

const TAB_BAR_HEIGHT = 64;

const TRIPS = [
  {
    id: '1',
    type: 'tripHistory.luxeBlack',
    date: 'Today, 2:45 PM',
    amount: 45.20,
    duration: '32 min',
    pickup: '1200 Luxury Ave, Downtown',
    dropoff: '4500 Business Pkwy, Tech District',
    iconColor: colors.primary,
  },
  {
    id: '2',
    type: 'tripHistory.luxeStandard',
    date: 'Today, 11:30 AM',
    amount: 28.50,
    duration: '24 min',
    pickup: '800 Riverside Dr, Westside',
    dropoff: '1200 Luxury Ave, Downtown',
    iconColor: colors.tertiary,
  },
  {
    id: '3',
    type: 'tripHistory.luxeSUV',
    date: 'Yesterday, 8:15 PM',
    amount: 85,
    duration: '55 min',
    pickup: 'International Airport, Terminal 1',
    dropoff: 'Grand Hotel, City Center',
    iconColor: colors.primary,
  },
];

export default function TripHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.title}>{t('tripHistory.title')}</Text>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Earnings Hero Card */}
          <View style={styles.earningsCard}>
            <Text style={styles.sectionLabel}>{t('tripHistory.weeklyEarnings')}</Text>
            <Text style={styles.earningsBig}>{formatCurrency(1458.50)}</Text>

            <View style={styles.earningsStats}>
              <View style={styles.earningsStat}>
                <Text style={styles.statLabel}>{t('tripHistory.trips')}</Text>
                <Text style={styles.statValue}>42</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.earningsStat}>
                <Text style={styles.statLabel}>{t('tripHistory.onlineHours')}</Text>
                <Text style={styles.statValue}>36.5</Text>
              </View>
            </View>

            <View style={styles.trendBadge}>
              <Ionicons name="trending-up" size={14} color={colors.secondary} />
              <Text style={styles.trendText}>+12% {t('tripHistory.vsLastWeek')}</Text>
            </View>
          </View>

          {/* Performance Card */}
          <View style={styles.performanceCard}>
            <Text style={styles.sectionLabel}>{t('tripHistory.performance')}</Text>

            <View style={styles.performanceItem}>
              <View style={styles.performanceRow}>
                <Text style={styles.performanceLabel}>{t('tripHistory.acceptanceRate')}</Text>
                <Text style={styles.performanceValue}>94%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '94%' }]} />
              </View>
            </View>

            <View style={styles.performanceItem}>
              <View style={styles.performanceRow}>
                <Text style={styles.performanceLabel}>{t('tripHistory.cancellationRate')}</Text>
                <Text style={styles.performanceValue}>2%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, styles.progressFillLow, { width: '2%' }]} />
              </View>
            </View>
          </View>

          {/* Trips List Section */}
          <View style={styles.tripsSection}>
            <View style={styles.tripsHeader}>
              <Text style={styles.tripsTitle}>{t('tripHistory.recentTrips')}</Text>
              <TouchableOpacity>
                <Text style={styles.filterText}>{t('tripHistory.filter')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tripsList}>
              {TRIPS.map((trip) => (
                <TouchableOpacity key={trip.id} style={styles.tripCard}>
                  {/* Top row: icon + type/date + amount/duration */}
                  <View style={styles.tripTopRow}>
                    <View style={styles.tripInfo}>
                      <View style={styles.tripIcon}>
                        <Ionicons name="car" size={20} color={trip.iconColor} />
                      </View>
                      <View>
                        <Text style={styles.tripType}>{t(trip.type)}</Text>
                        <Text style={styles.tripDate}>{trip.date}</Text>
                      </View>
                    </View>
                    <View style={styles.tripAmountBlock}>
                      <Text style={styles.tripAmount}>{formatCurrency(trip.amount)}</Text>
                      <Text style={styles.tripDuration}>{trip.duration}</Text>
                    </View>
                  </View>

                  {/* Route visualization */}
                  <View style={styles.routeSection}>
                    <View style={styles.routeTimeline}>
                      <View style={styles.routeDotOutline} />
                      <View style={styles.routeLine} />
                      <View style={styles.routeDotFilled} />
                    </View>
                    <View style={styles.routeAddresses}>
                      <Text style={styles.routePickup} numberOfLines={1}>{trip.pickup}</Text>
                      <Text style={styles.routeDropoff} numberOfLines={1}>{trip.dropoff}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>{t('tripHistory.loadMoreTrips')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontWeight: '700',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ── Earnings Hero Card ── */
  earningsCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  earningsBig: {
    ...typography.displaySmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  earningsStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  earningsStat: {},
  statLabel: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  statValue: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.surfaceContainerHighest,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginTop: spacing.lg,
  },
  trendText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },

  /* ── Performance Card ── */
  performanceCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },
  performanceItem: {
    gap: spacing.sm,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceLabel: {
    ...typography.bodySmall,
    color: colors.onSurface,
  },
  performanceValue: {
    ...typography.bodySmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressFillLow: {
    backgroundColor: colors.tertiary,
  },

  /* ── Trips List ── */
  tripsSection: {
    marginBottom: spacing.xl,
  },
  tripsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tripsTitle: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '700',
  },
  filterText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '500',
  },
  tripsList: {
    gap: spacing.md,
  },

  /* ── Trip Card ── */
  tripCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: spacing.lg,
  },
  tripTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tripIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripType: {
    ...typography.titleSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  tripDate: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  tripAmountBlock: {
    alignItems: 'flex-end',
  },
  tripAmount: {
    ...typography.titleMedium,
    color: colors.onSurface,
    fontWeight: '700',
  },
  tripDuration: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  /* ── Route visualization ── */
  routeSection: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.md,
    paddingLeft: spacing.xs,
  },
  routeTimeline: {
    alignItems: 'center',
    width: 12,
    paddingVertical: 2,
  },
  routeDotOutline: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.surfaceContainerHighest,
    marginVertical: 4,
  },
  routeDotFilled: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  routeAddresses: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 0,
    minHeight: 48,
  },
  routePickup: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  routeDropoff: {
    ...typography.bodySmall,
    color: colors.onSurface,
  },

  /* ── Load More ── */
  loadMoreButton: {
    alignSelf: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
    marginTop: spacing.xl,
  },
  loadMoreText: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '500',
  },
});
