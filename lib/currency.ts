/**
 * Currency formatting utilities for locale-aware price display
 * Supports Bulgarian (EUR) and English (USD) locales
 */

export type SupportedLocale = 'en' | 'bg'

/**
 * Currency configuration per locale
 */
const currencyConfig: Record<SupportedLocale, { currency: string; symbol: string }> = {
  en: { currency: 'USD', symbol: '$' },
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
 * - en: $299.99
 * - bg: 299,99 €
 */
export function formatPrice(amount: number, locale: string): string {
  const currency = getCurrencyCode(locale)
  
  return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format price parts for Amazon-style display (split dollars/cents)
 */
export interface PriceParts {
  symbol: string
  wholePart: string
  decimalPart: string
  symbolPosition: 'before' | 'after'
}

export function formatPriceParts(amount: number, locale: string): PriceParts {
  const symbol = getCurrencySymbol(locale)
  const isEuro = locale === 'bg'
  
  const wholePart = Math.floor(amount).toString()
  const decimalPart = (amount % 1).toFixed(2).slice(2) // Get .XX part without leading dot
  
  return {
    symbol,
    wholePart: isEuro ? wholePart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ' ') : wholePart,
    decimalPart,
    symbolPosition: isEuro ? 'after' : 'before'
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
export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US').format(value)
}
