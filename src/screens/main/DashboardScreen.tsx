import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useDriver } from '../../context/DriverContext';

export default function DashboardScreen() {
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
        {/* TopAppBar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        <Text style={styles.brand}>{t('appName')}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpIvkjLX9ifl-Sl5qJbuZcQNN0ZRc7nzFB5sEiFiim6YsgMaX8J-jRVFTfLIiUgqdkjcJrHLhf0qV1azZIH0PirRiAYUHXL2H5AhoQ1fkTkN3vR-F1T4t5TIRMswzAxh5oUlyxv5hvz_x_3ht6EmU5hENQggLboHHp-KJiPbQf6Y3Q4fVps1goDVSPRPt0JsHMAiaSfzqp7qv0OjOcAsxL2hmtVByPdkvzPfTmH44R0PXjd2UV1E-hyKZADgtLKO03b4WyOZObYkI' }}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Map Background */}
      <Image
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO84rAeGCyKhbfO98HWqZ-ugeMYmywzPwamldWO3UQlfyRlRaMGYh_IDBbvLh3lXtPREAUzf1qNKh_HOJ7pMaIcZ5Ydf0MNakscSXHV7TBy12dz5vf5EDrsJLBddSKbFpL7orpn7YL12FHXlwrl5YUSOoyZbyJfBnaREKtYdVMk1j_n_iwnx45RQnCBu-_lKdbCaOzrJnbj2NQt27UaxzKZWXa_5iEOE_4SPMgisfDYUN8B1fcbVIKOVmyVNwjMhMAtqUUDqFNZX0' }}
        style={styles.mapBackground}
        resizeMode="cover"
      />
      <View style={styles.mapOverlay} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Online Toggle Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>{t('main.readyToDrive')}</Text>
          <TouchableOpacity 
            style={[
              styles.goOnlineButton,
              driverState.isOnline && styles.goOnlineButtonActive,
            ]} 
            onPress={handleGoOnline}
            activeOpacity={0.8}
          >
            <Ionicons name="power" size={32} color={colors.onPrimary} />
            <Text style={styles.goOnlineText}>{driverState.isOnline ? t('main.goOffline') : t('main.goOnline')}</Text>
          </TouchableOpacity>
          <Text style={styles.heroSubtitle}>{t('main.highDemand')}</Text>
        </View>

        {/* Dashboard Bento Grid */}
        <View style={styles.dashboardGrid}>
          {/* Earnings Card */}
          <View style={[styles.card, styles.earningsCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>{t('main.todaysEarnings')}</Text>
              <Ionicons name="wallet-outline" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.earningsAmount}>${driverState.todayEarnings.toFixed(2)}</Text>
              <Text style={styles.earningsChange}>
                <Ionicons name="trending-up" size={14} color={colors.secondary} /> +12% {t('main.vsYesterday')}
              </Text>
            </View>
          </View>

          {/* Rating & Trips Column */}
          <View style={styles.column}>
            {/* Rating */}
            <View style={styles.card}>
              <View>
                <Text style={styles.cardLabel}>{t('main.currentRating')}</Text>
                <Text style={styles.ratingValue}>
                  {driverState.rating} <Ionicons name="star" size={18} color={colors.secondary} />
                </Text>
              </View>
              <View style={styles.iconBadge}>
                <Ionicons name="trophy" size={20} color={colors.primary} />
              </View>
            </View>

            {/* Trips */}
            <View style={styles.card}>
              <View>
                <Text style={styles.cardLabel}>{t('main.tripsCompleted')}</Text>
                <Text style={styles.tripsValue}>{driverState.todayTrips}</Text>
              </View>
              <View style={styles.iconBadge}>
                <Ionicons name="car" size={20} color={colors.primary} />
              </View>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: `${colors.surface}CC`,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: colors.onSurface,
  },
  brand: {
    ...typography.headlineSmall,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.surfaceContainerHigh,
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `linear-gradient(to top, ${colors.surface}, ${colors.surface}80, transparent)`,
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  heroTitle: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    marginBottom: spacing.xl,
  },
  goOnlineButton: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 4,
    borderColor: colors.surfaceContainerHigh,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  goOnlineButtonActive: {
    backgroundColor: colors.error,
  },
  goOnlineIcon: {
    fontSize: 80,
    color: colors.surfaceContainerLowest,
  },
  goOnlineText: {
    ...typography.headlineSmall,
    color: colors.surfaceContainerLowest,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: spacing.sm,
  },
  heroSubtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  dashboardGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    backgroundColor: `${colors.surfaceContainerHigh}CC`,
    padding: spacing.lg,
    borderRadius: 12,
    flex: 1,
  },
  earningsCard: {
    flex: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  cardIcon: {
    fontSize: 20,
    color: colors.primary,
  },
  earningsAmount: {
    ...typography.displaySmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  earningsChange: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  trendIcon: {
    fontSize: 14,
  },
  column: {
    flex: 1,
    gap: spacing.md,
  },
  ratingValue: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '700',
  },
  starIcon: {
    fontSize: 20,
  },
  tripsValue: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '700',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}20`,
  },
});
