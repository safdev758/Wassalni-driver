import i18n from '../strings';

/**
 * Format a monetary amount using the currency symbol defined in the
 * active locale. Algeria uses the Algerian Dinar (DZD, displayed as "DA"
 * in Latin script or "دج" in Arabic).
 */
export function formatCurrency(amount: number, fractionDigits = 2): string {
  const symbol = i18n.t('currency.symbol');
  const formatted = amount.toLocaleString(i18n.language || 'en', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `${formatted} ${symbol}`;
}

/**
 * Format a distance value in kilometers (Algeria uses the metric system).
 */
export function formatDistanceKm(km: number, fractionDigits = 1): string {
  const formatted = km.toLocaleString(i18n.language || 'en', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `${formatted} km`;
}
