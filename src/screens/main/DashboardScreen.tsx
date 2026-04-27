import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useDriver } from '../../context/DriverContext';
import { formatCurrency } from '../../utils/format';

const TAB_BAR_HEIGHT = 64;

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { driverState, setOnline, fetchEarnings } = useDriver();

  useEffect(() => {
    fetchEarnings();
  }, []);

  const handleGoOnline = () => {
    setOnline(!driverState.isOnline);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        {/* TopAppBar */}
        <View style={styles.header}>
          <Text style={styles.brand}>{t('appName')}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
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
              <Ionicons name="power" size={40} color={colors.surfaceContainerLowest} />
              <Text style={styles.goOnlineText}>{driverState.isOnline ? t('main.goOffline') : t('main.goOnline')}</Text>
            </TouchableOpacity>
            <Text style={styles.heroSubtitle}>{t('main.highDemand')}</Text>
          </View>

          {/* Earnings Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>{t('main.todaysEarnings')}</Text>
              <Ionicons name="wallet-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.earningsAmount}>{formatCurrency(driverState.todayEarnings)}</Text>
            <Text style={styles.earningsChange}>
              <Ionicons name="trending-up" size={14} color={colors.secondary} /> {t('main.vsYesterday')}
            </Text>
          </View>

          {/* Rating Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('main.currentRating')}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingValue}>
                {driverState.rating} 
              </Text>
              <Ionicons name="star" size={18} color={colors.secondary} />
            </View>
          </View>

          {/* Trips Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('main.tripsCompleted')}</Text>
            <Text style={styles.tripsValue}>{driverState.todayTrips}</Text>
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
  brand: {
    ...typography.headlineSmall,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  heroTitle: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    marginBottom: spacing.xl,
  },
  goOnlineButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  goOnlineText: {
    ...typography.labelLarge,
    color: colors.surfaceContainerLowest,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 8,
  },
  heroSubtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.lg,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  earningsAmount: {
    ...typography.displaySmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  earningsChange: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  ratingValue: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontWeight: '700',
  },
  tripsValue: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontWeight: '700',
    marginTop: 8,
  },
});
