/**
 * Currency formatting utilities for locale-aware price display
 * EUR is the standard currency for Treido EU marketplace
 * - Bulgarian locale: 29,99 € (symbol after, comma decimal)
 * - English locale: €29.99 (symbol before, dot decimal)
 */

import { formatCurrencyAmount, formatEurPriceParts } from "./price-formatting"

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
  return formatCurrencyAmount(amount, locale, getCurrencyCode(locale), { showSymbol: true })
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
  const parts = formatEurPriceParts(amount, locale)
  return {
    symbol: parts.symbol,
    wholePart: parts.wholePart,
    decimalPart: parts.decimalPart,
    symbolPosition: parts.symbolPosition,
  }
}
