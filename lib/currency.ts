/**
 * Currency formatting utilities for locale-aware price display
 * EUR is the standard currency for Treido EU marketplace
 * - Bulgarian locale: 29,99 € (symbol after, comma decimal)
 * - English locale: €29.99 (symbol before, dot decimal)
 */

export type SupportedLocale = 'en' | 'bg'

/** BGN/EUR fixed exchange rate (Bulgarian Lev pegged to Euro) */
export const EUR_TO_BGN_RATE = 1.95583

export function eurToBgnApprox(eurAmount: number): number {
  return Math.round(eurAmount * EUR_TO_BGN_RATE * 100) / 100
}

/**
 * Currency configuration - EUR for all locales
 * Only display formatting differs by locale
 */
const currencyConfig: Record<SupportedLocale, { currency: string; symbol: string }> = {
  en: { currency: 'EUR', symbol: '€' },
  bg: { currency: 'EUR', symbol: '€' }
}

/**
 * Get the currency symbol for a given locale
 */
export function getCurrencySymbol(locale: string): string {
  return currencyConfig[locale as SupportedLocale]?.symbol || '€'
}

/**
 * Get the currency code for a given locale
 */
export function getCurrencyCode(locale: string): string {
  return currencyConfig[locale as SupportedLocale]?.currency || 'EUR'
}

/**
 * Format a price according to locale conventions
 * - en: €299.99 (Irish English format for EUR)
 * - bg: 299,99 € (Bulgarian format for EUR)
 */
export function formatPrice(amount: number, locale: string): string {
  const currency = getCurrencyCode(locale)
  
  // Use en-IE (Irish English) for English locale to get proper EUR formatting
  return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-IE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format price parts for split display (e.g., €29⁹⁹ or 29⁹⁹ €)
 */
export interface PriceParts {
  symbol: string
  wholePart: string
  decimalPart: string
  symbolPosition: 'before' | 'after'
}

export function formatPriceParts(amount: number, locale: string): PriceParts {
  const symbol = '€' // Always EUR
  const isBulgarian = locale === 'bg'
  
  const wholePart = Math.floor(amount).toString()
  const decimalPart = (amount % 1).toFixed(2).slice(2) // Get .XX part without leading dot
  
  return {
    symbol,
    wholePart: isBulgarian ? wholePart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ' ') : wholePart,
    decimalPart,
    symbolPosition: isBulgarian ? 'after' : 'before'
  }
}

/**
 * Format a date according to locale conventions
 */
export function formatDeliveryDate(date: Date, locale: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }
  
  return new Intl.DateTimeFormat(locale === 'bg' ? 'bg-BG' : 'en-US', options).format(date)
}

/**
 * Get an estimated delivery date (e.g., 3 business days from now)
 */
export function getEstimatedDeliveryDate(businessDays: number = 1): Date {
  const date = new Date()
  let addedDays = 0
  
  while (addedDays < businessDays) {
    date.setDate(date.getDate() + 1)
    const dayOfWeek = date.getDay()
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++
    }
  }
  
  return date
}

/**
 * Format a number according to locale conventions
 * - en: 1,000.50
 * - bg: 1 000,50
 */
function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US').format(value)
}
