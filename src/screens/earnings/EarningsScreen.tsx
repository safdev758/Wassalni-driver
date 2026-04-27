import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { formatCurrency } from '../../utils/format';
import { driverAPI } from '../../services/api';

const TAB_BAR_HEIGHT = 64;

type Transaction = {
  id: string;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  amount: number;
};

type PaymentMethod = {
  id: string;
  type: string;
  name: string;
  last4: string;
  isDefault: boolean;
};

export default function EarningsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'wallet', name: 'Cash', last4: '', isDefault: true },
  ]);

  useEffect(() => {
    driverAPI.getEarningsToday().then((data) => {
      setBalance(data.total_earnings || 0);
    }).catch(() => {});

    driverAPI.getTransactions().then((data) => {
      if (data?.transactions) {
        setTransactions(data.transactions.map((tx: Record<string, unknown>) => ({
          id: tx.ride_id as string,
          type: 'credit' as const,
          description: `${tx.pickup_address || 'Ride'} → ${tx.dropoff_address || ''}`,
          date: tx.completed_at as string || '',
          amount: tx.final_price as number || 0,
        })));
      }
    }).catch(() => {});
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        {/* TopAppBar */}
        <View style={styles.header}>
          <Text style={styles.brand}>{t('appName')}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={22} color={colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="person" size={20} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Balance Card Hero */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceGradient} />
            <View style={styles.balanceContent}>
              <Text style={styles.balanceLabel}>{t('earnings.balance')}</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
              <View style={styles.balanceActions}>
                <TouchableOpacity
                  style={styles.cashOutButton}
                  onPress={() => Alert.alert(t('earnings.cashOutNow'))}
                >
                  <Ionicons name="arrow-up" size={18} color={colors.surfaceContainerLowest} />
                  <Text style={styles.cashOutText}>{t('earnings.cashOutNow')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.withdrawButton}
                  onPress={() => Alert.alert(t('earnings.withdraw'))}
                >
                  <Text style={styles.withdrawText}>{t('earnings.withdraw')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Earnings Breakdown */}
          <View style={styles.earningsGrid}>
            <View style={styles.earningsCard}>
              <View style={styles.earningsIconWrap}>
                <Ionicons name="time" size={18} color={colors.onSurfaceVariant} />
              </View>
              <Text style={styles.earningsCardLabel}>{t('earnings.tripEarnings')}</Text>
              <Text style={styles.earningsCardValue}>{formatCurrency(balance)}</Text>
            </View>
            <View style={styles.earningsCard}>
              <View style={[styles.earningsIconWrap, { backgroundColor: colors.primary + '1A' }]}>
                <Ionicons name="cash" size={18} color={colors.primary} />
              </View>
              <Text style={styles.earningsCardLabel}>{t('earnings.tips')}</Text>
              <Text style={styles.earningsCardValue}>{formatCurrency(0)}</Text>
            </View>
            <View style={styles.earningsCard}>
              <View style={styles.earningsIconWrap}>
                <Ionicons name="gift" size={18} color={colors.onSurfaceVariant} />
              </View>
              <Text style={styles.earningsCardLabel}>{t('earnings.bonuses')}</Text>
              <Text style={styles.earningsCardValue}>{formatCurrency(0)}</Text>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('earnings.paymentMethods')}</Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentCard, method.isDefault && styles.paymentCardDefault]}
              >
                <View style={styles.paymentLeft}>
                  <View style={styles.paymentIconWrap}>
                    <Ionicons
                      name={method.type === 'card' ? 'card' : 'wallet'}
                      size={20}
                      color={method.isDefault ? colors.primary : colors.onSurface}
                    />
                  </View>
                  <View>
                    <Text style={styles.paymentName}>{method.name}</Text>
                    {method.last4 ? (
                      <Text style={styles.paymentLast4}>•••• {method.last4}</Text>
                    ) : null}
                  </View>
                </View>
                {method.isDefault ? (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>{t('earnings.default')}</Text>
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addPaymentButton}>
              <Ionicons name="add-circle" size={20} color={colors.primary} />
              <Text style={styles.addPaymentText}>{t('earnings.addNewMethod')}</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('earnings.recentActivity')}</Text>
            {transactions.map((tx) => (
              <View key={tx.id} style={styles.transactionItem}>
                <View style={[
                  styles.transactionIcon,
                  tx.type === 'credit' && { backgroundColor: colors.surfaceContainerHighest },
                  tx.type === 'debit' && { backgroundColor: colors.primary + '1A' },
                ]}>
                  <Ionicons
                    name={tx.type === 'credit' ? 'car' : 'arrow-down'}
                    size={20}
                    color={tx.type === 'credit' ? colors.onSurface : colors.primary}
                  />
                </View>
                <View style={styles.transactionTextWrap}>
                  <Text style={styles.transactionTitle}>{tx.description}</Text>
                  <Text style={styles.transactionDate}>{tx.date}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  tx.amount > 0 && styles.creditAmount,
                  tx.amount < 0 && styles.debitAmount,
                ]}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>{t('earnings.viewAll')}</Text>
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

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
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
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },

  /* ── Balance Card Hero ── */
  balanceCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    minHeight: 200,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  balanceGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary + '1A',
  },
  balanceContent: {
    position: 'relative',
    zIndex: 1,
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
    fontWeight: '500',
    marginBottom: spacing.lg,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cashOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cashOutText: {
    ...typography.bodyMedium,
    color: colors.surfaceContainerLowest,
    fontWeight: '600',
  },
  withdrawButton: {
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  withdrawText: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '500',
  },

  /* ── Earnings Breakdown ── */
  earningsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  earningsCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: spacing.md,
    gap: spacing.sm,
  },
  earningsIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningsCardLabel: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  earningsCardValue: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '700',
  },

  /* ── Payment Methods ── */
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '500',
    marginBottom: spacing.md,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  paymentCardDefault: {
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.primary + '33',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  paymentIconWrap: {
    width: 48,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentName: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '500',
  },
  paymentLast4: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  defaultBadge: {
    backgroundColor: colors.primary + '1A',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  defaultBadgeText: {
    ...typography.labelSmall,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant + '4D',
    borderRadius: 20,
  },
  addPaymentText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '500',
  },

  /* ── Transaction History ── */
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  transactionTextWrap: {
    flex: 1,
  },
  transactionTitle: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '500',
  },
  transactionDate: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  transactionAmount: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '600',
  },
  creditAmount: {
    color: colors.onSurface,
  },
  debitAmount: {
    color: colors.error,
  },
  viewAllButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  viewAllText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '500',
  },
});
