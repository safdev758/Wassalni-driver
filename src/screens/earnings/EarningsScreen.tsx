import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { formatCurrency } from '../../utils/format';

export default function EarningsScreen() {
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
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFkxBmRgbT87DHdQPuM7HpRoJ3beK_GNAtHquSuqABUa2dVhJXPP8UpbVivdtoYkCAefJs2oLpalMecpa967c4I7bcB-I-8dYsUQ-JlhuER2COek7ALHJeGcgcR4OrFfygwpiRdWPvQLXXH7VKmlF3iP7zQYm33nQqhB2BjGb9ey5L9-4zt4Elk4syN2gWHQRZpAS0ts9dR00d05d9gANZg4sfsEf-AXvu6MFWK0OnZHMPPPFwb5hipU-f6U7EtS9a4lN169KVfmg' }}
          style={styles.profileImage}
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>{t('earnings.title')}</Text>
          <Text style={styles.subtitle}>{t('earnings.availableBalance')}</Text>
        </View>

        {/* Balance Hero Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceContent}>
            <Text style={styles.balanceLabel}>{t('earnings.availableBalance')}</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(1248.50)}</Text>
          </View>
          <TouchableOpacity style={styles.cashOutButton}>
            <Text style={styles.cashOutText}>{t('earnings.cashOutNow')}</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Breakdown Bento */}
        <View style={styles.earningsGrid}>
          <View style={styles.earningsCard}>
            <View style={styles.earningsCardHeader}>
              <Ionicons name="time" size={20} color={colors.onSurfaceVariant} />
              <Text style={styles.breakdownLabel}>{t('earnings.tripEarnings')}</Text>
            </View>
            <Text style={styles.earningsCardValue}>{formatCurrency(890)}</Text>
          </View>

          <View style={styles.earningsCard}>
            <View style={styles.earningsCardHeader}>
              <Ionicons name="cash" size={20} color={colors.primary} />
              <Text style={styles.breakdownLabel}>{t('earnings.tips')}</Text>
            </View>
            <Text style={styles.earningsCardValue}>{formatCurrency(235.50)}</Text>
          </View>

          <View style={styles.earningsCard}>
            <View style={styles.earningsCardHeader}>
              <Ionicons name="gift" size={20} color={colors.onSurfaceVariant} />
              <Text style={styles.breakdownLabel}>{t('earnings.bonuses')}</Text>
            </View>
            <Text style={styles.earningsCardValue}>{formatCurrency(123)}</Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>{t('earnings.recentActivity')}</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>{t('earnings.viewAll')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionList}>
            {/* Transaction Item 1 */}
            <TouchableOpacity style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={styles.transactionIcon}>
                  <Ionicons name="car" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.transactionTitle}>{t('earnings.tripTo')} LAX Airport</Text>
                  <Text style={styles.transactionDate}>Today, 2:45 PM</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>+{formatCurrency(84.50)}</Text>
                <Text style={styles.transactionTip}>{t('earnings.includesTip', { tip: formatCurrency(15) })}</Text>
              </View>
            </TouchableOpacity>

            {/* Transaction Item 2 */}
            <TouchableOpacity style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={styles.transactionIcon}>
                  <Ionicons name="car" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.transactionTitle}>{t('earnings.tripTo')} Beverly Hills</Text>
                  <Text style={styles.transactionDate}>Today, 11:30 AM</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>+{formatCurrency(142)}</Text>
                <Text style={styles.transactionTip}>{t('earnings.includesTip', { tip: formatCurrency(25) })}</Text>
              </View>
            </TouchableOpacity>

            {/* Transaction Item 3 */}
            <TouchableOpacity style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={styles.transactionIcon}>
                  <Ionicons name="card" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.payoutLabel}>{t('earnings.weeklyPayout')}</Text>
                  <Text style={styles.transactionDate}>Yesterday</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={[styles.transactionAmount, styles.transactionAmountNegative]}>-{formatCurrency(2450)}</Text>
                <Text style={styles.payoutStatus}>{t('earnings.processed')}</Text>
              </View>
            </TouchableOpacity>
          </View>
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
  menuIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  brand: {
    ...typography.headlineSmall,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  pageTitle: {
    ...typography.headlineLarge,
    color: colors.onSurface,
  },
  pageSubtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  balanceCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 12,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balanceContent: {
    flex: 1,
  },
  balanceLabel: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  balanceAmount: {
    ...typography.displayLarge,
    color: colors.onSurface,
    fontWeight: '700',
  },
  cashOutButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  cashOutText: {
    ...typography.headlineSmall,
    color: colors.primaryContainer,
    fontWeight: '700',
  },
  earningsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  earningsCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: spacing.md,
  },
  earningsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  earningsCardLabel: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  breakdownLabel: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  earningsCardValue: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '700',
  },
  historySection: {
    marginBottom: spacing.xl,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  historyTitle: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  sectionTitle: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  viewAllText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  viewAll: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  transactionList: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.outlineVariant}10`,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionTitle: {
    ...typography.bodyLarge,
    color: colors.onSurface,
    fontWeight: '500',
  },
  transactionDate: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    fontWeight: '700',
  },
  transactionAmountNegative: {
    color: colors.error,
  },
  transactionTip: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: 4,
  },
  transactionStatus: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  payoutLabel: {
    ...typography.bodyLarge,
    color: colors.onSurface,
    fontWeight: '500',
  },
  payoutStatus: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: 4,
  },
});
