import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { formatCurrency } from '../../utils/format';

export default function TripHistoryScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        {/* TopAppBar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={colors.primary} />
          </TouchableOpacity>
        <Text style={styles.brand}>{t('appName')}</Text>
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk_DMJXQhsZQok4lNmW-oMIB5NU7WANFfFVl61GJ9JvbCZbvRpTTwSboRID_a10y2QiMX4jhLuQAKy1C7-cbfXFtYyuL0q2ZKXHfDsml-bArbGIB8XlQHNyoewH2_UYgo5Gv-kEv3uGXysVBSWBNW6okCwqT_tCwtfeSajUKx2FsGp7R3tT4BdP8DX9WbppyS7iQDMHKLuWRoCI8VywVE4l-Xg8itibmP94FTrxr31-4lyyw4DlvmiXyEgns-MhSSmrbwIM0tdXzk' }}
          style={styles.profileImage}
        />
      </View>

      {/* NavigationDrawer */}
      <View style={styles.drawer}>
        <View style={styles.drawerProfile}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5uDu3aQRCqyEIw_U6P7vAKUCF4JyQjLOcaXAf5KYYyvlKXcnz2WorzfKvmZycrz0VwP_CN4NZ6-IVC_NjXjMoZr1ST5Xlb4MpGpH3vGAIvCfdoT7l9WbEJD0c0Qvtcn3_M2I7J1Mhz4QTyVDo1v1KcZi7DZGUb3xKH3eKdYTMW2tkJHcQmFb0QDw6fAdUmmjksZxb7m6yJwolg5WP5BvdFUy_ljot1qitWbBfAM2jY2Of2Qo7nYRR3i93I2dNCoa_EV11xhT4K90' }}
            style={styles.drawerAvatar}
          />
          <View style={styles.drawerInfo}>
            <Text style={styles.drawerName}>Alexander Vance</Text>
            <Text style={styles.drawerRole}>Premier Partner</Text>
            <View style={styles.drawerRating}>
              <Ionicons name="star" size={14} color={colors.secondary} />
              <Text style={styles.drawerRatingText}>4.98 Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.drawerNav}>
          <TouchableOpacity style={styles.drawerNavItem}>
            <Ionicons name="gift" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.drawerNavText}>Promotions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.drawerNavItem, styles.drawerNavItemActive]}>
            <Ionicons name="list" size={20} color={colors.primary} />
            <Text style={styles.drawerNavText}>Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerNavItem}>
            <Ionicons name="chatbubbles" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.drawerNavText}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerNavItem}>
            <Ionicons name="shield-checkmark" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.drawerNavText}>Safety</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerNavItem}>
            <Ionicons name="scale" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.drawerNavText}>Legal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerNavItem}>
            <Ionicons name="settings" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.drawerNavText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mobile Header */}
        <View style={styles.mobileHeader}>
          <Text style={styles.title}>{t('tripHistory.title')}</Text>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA7EoQwnt2JnXvk_wy2EmOgL7sh5xPQdzV_VIYGuSlsaaDsQBcQALu-txTR9jX3aivgnaOHSVi3jHHH9Q0Mgc8oDUzNxcbeeZPfVmUXu6erVhttZRB3PIhk2IhgObL1Sdj68kvnxJF_1yhCU9Hx--rleiqzGdGxNCR-zKAYKAsTfdgGJbXA5QGEmUj9frnw3bxcu59lQj00ZSGslNAAU2xh78N4Wk5DLDALlGKwF8fTwUo63jMTaHAqJqbkjwApQz-GMFUBwZEqek' }}
            style={styles.mobileProfileImage}
          />
        </View>

        {/* Desktop Header */}
        <View style={styles.desktopHeader}>
          <Text style={styles.desktopTitle}>{t('tripHistory.title')}</Text>
          <Text style={styles.subtitle}>{t('tripHistory.reviewPerformance')}</Text>
        </View>

        {/* Weekly Summary Bento Grid */}
        <View style={styles.summaryGrid}>
          {/* Earnings Hero Card */}
          <View style={[styles.summaryCard, styles.earningsHero]}>
            <Text style={styles.summaryLabel}>{t('tripHistory.weeklyEarnings')}</Text>
            <View style={styles.earningsValue}>
              <Text style={styles.earningsBig}>{formatCurrency(1458.50)}</Text>
            </View>
            <View style={styles.earningsStats}>
              <View style={styles.earningsStat}>
                <Text style={styles.earningsStatLabel}>{t('tripHistory.trips')}</Text>
                <Text style={styles.earningsStatValue}>42</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.earningsStat}>
                <Text style={styles.statLabel}>{t('tripHistory.onlineHours')}</Text>
                <Text style={styles.earningsStatValue}>36.5</Text>
              </View>
            </View>
            <View style={styles.trendBadge}>
              <Ionicons name="trending-up" size={14} color={colors.secondary} />
              <Text style={styles.trendLabel}>{t('tripHistory.vsLastWeek')}</Text>
            </View>
          </View>

          {/* Performance Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>{t('tripHistory.performance')}</Text>
            <View style={styles.performanceSection}>
              <View style={styles.performanceItem}>
                <View style={styles.performanceHeader}>
                  <Text style={styles.metricLabel}>{t('tripHistory.acceptanceRate')}</Text>
                  <Text style={styles.performanceValue}>94%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '94%' }]} />
                </View>
              </View>
              <View style={styles.performanceItem}>
                <View style={styles.performanceHeader}>
                  <Text style={styles.metricLabel}>{t('tripHistory.cancellationRate')}</Text>
                  <Text style={styles.performanceValue}>2%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, styles.progressFillLow, { width: '2%' }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Trips List Section */}
        <View style={styles.tripsSection}>
          <View style={styles.tripsHeader}>
            <Text style={styles.sectionTitle}>{t('tripHistory.recentTrips')}</Text>
            <TouchableOpacity>
              <Text style={styles.filterText}>{t('tripHistory.filter')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tripsList}>
            {/* Trip Item 1 */}
            <TouchableOpacity style={styles.tripItem}>
              <View style={styles.tripLeft}>
                <View style={styles.tripIcon}>
                  <Ionicons name="car" size={20} color={colors.onSurface} />
                </View>
                <View>
                  <Text style={styles.vehicleType}>{t('tripHistory.luxeBlack')}</Text>
                  <Text style={styles.tripDate}>Today, 2:45 PM</Text>
                </View>
              </View>
              <View style={styles.tripRight}>
                <Text style={styles.tripAmount}>{formatCurrency(45.20)}</Text>
                <Text style={styles.tripDuration}>32 min</Text>
              </View>
            </TouchableOpacity>

            {/* Trip Item 2 */}
            <TouchableOpacity style={styles.tripItem}>
              <View style={styles.tripLeft}>
                <View style={[styles.tripIcon, styles.tripIconTertiary]}>
                  <Ionicons name="car" size={20} color={colors.onTertiary} />
                </View>
                <View>
                  <Text style={styles.vehicleType}>{t('tripHistory.luxeStandard')}</Text>
                  <Text style={styles.tripDate}>Today, 11:30 AM</Text>
                </View>
              </View>
              <View style={styles.tripRight}>
                <Text style={styles.tripAmount}>{formatCurrency(28.50)}</Text>
                <Text style={styles.tripDuration}>24 min</Text>
              </View>
            </TouchableOpacity>

            {/* Trip Item 3 */}
            <TouchableOpacity style={styles.tripItem}>
              <View style={styles.tripLeft}>
                <View style={styles.tripIcon}>
                  <Ionicons name="car" size={20} color={colors.onSurface} />
                </View>
                <View>
                  <Text style={styles.vehicleType}>{t('tripHistory.luxeSUV')}</Text>
                  <Text style={styles.tripDate}>Yesterday, 8:15 PM</Text>
                </View>
              </View>
              <View style={styles.tripRight}>
                <Text style={styles.tripAmount}>{formatCurrency(85)}</Text>
                <Text style={styles.tripDuration}>55 min</Text>
              </View>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  menuButton: {
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 80,
    width: 320,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    shadowColor: colors.surface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 24,
  },
  drawerProfile: {
    marginBottom: spacing.xl,
  },
  drawerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: spacing.md,
  },
  drawerInfo: {
    marginBottom: spacing.sm,
  },
  drawerName: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  drawerRole: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
  },
  drawerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  drawerRatingText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  drawerNav: {
    gap: spacing.sm,
  },
  drawerNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  drawerNavItemActive: {
    backgroundColor: colors.surfaceContainer,
  },
  drawerNavText: {
    ...typography.labelSmall,
    color: colors.surfaceBright,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  mobileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  mobileTitle: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontWeight: '700',
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
  mobileProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  desktopHeader: {
    marginBottom: spacing.xl,
  },
  desktopTitle: {
    ...typography.displayMedium,
    color: colors.onSurface,
    fontWeight: '700',
  },
  desktopSubtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: spacing.xl,
    flex: 1,
  },
  earningsHero: {
    flex: 2,
  },
  summaryLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  earningsValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  earningsBig: {
    ...typography.displayLarge,
    color: colors.onSurface,
    fontWeight: '700',
  },
  earningsSmall: {
    ...typography.headlineSmall,
    color: colors.primary,
  },
  earningsStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  earningsStat: {
    flexDirection: 'column',
  },
  earningsStatLabel: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  earningsStatValue: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.surfaceContainerHighest,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: spacing.xl,
  },
  trendText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },
  trendLabel: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  sectionTitle: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  metricLabel: {
    ...typography.bodyMedium,
    color: colors.onSurface,
  },
  vehicleType: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  performanceSection: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  performanceItem: {
    gap: spacing.sm,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceLabel: {
    ...typography.bodyMedium,
    color: colors.onSurface,
  },
  performanceValue: {
    ...typography.headlineSmall,
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
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  filterText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  tripsList: {
    gap: spacing.md,
  },
  tripItem: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: spacing.md,
  },
  tripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  tripIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripIconTertiary: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  tripType: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  tripDate: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  tripRight: {
    alignItems: 'flex-end',
  },
  tripAmount: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  tripDuration: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
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
  },
});
