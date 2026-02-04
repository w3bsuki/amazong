/**
 * Price Formatting Utilities
 * 
 * EUR is the base currency since Bulgaria joined the Eurozone on January 1, 2025.
 * All prices are stored and displayed in EUR for consistency.
 */

import { formatCurrencyAmount, formatEurPriceParts } from "./price-formatting"

export const BASE_CURRENCY = 'EUR' as const

export type SupportedCurrency = 'EUR' | 'USD'

interface FormatPriceOptions {
  locale?: string
  currency?: SupportedCurrency
  showSymbol?: boolean
}

/**
 * Locale formatting map for EUR display
 * - Bulgarian: "29,99 €" (symbol after, comma decimal)
 * - English (IE): "€29.99" (symbol before, dot decimal)
 */
/**
 * Format price for display
 * 
 * @param priceInEUR - Price in EUR (base currency)
 * @param options - Formatting options
 * @returns Formatted price string
 * 
 * @example
 * formatPrice(29.99) // "€29.99"
 * formatPrice(29.99, { locale: 'en' }) // "€29.99"
 * formatPrice(29.99, { locale: 'bg' }) // "29,99 €"
 */
export function formatPrice(
  priceInEUR: number,
  options: FormatPriceOptions = {}
): string {
  const {
    locale = 'en',
    currency = BASE_CURRENCY,
    showSymbol = true,
  } = options

  return formatCurrencyAmount(priceInEUR, locale, currency, { showSymbol })
}

/**
 * Format price parts for split display (e.g., Amazon-style €29⁹⁹)
 */
export interface PriceParts {
  symbol: string
  wholePart: string
  decimalPart: string
  symbolPosition: 'before' | 'after'
}

export function formatPriceParts(amount: number, locale: string = 'en'): PriceParts {
  const parts = formatEurPriceParts(amount, locale)
  return {
    symbol: parts.symbol,
    wholePart: parts.wholePart,
    decimalPart: parts.decimalPart,
    symbolPosition: parts.symbolPosition,
  }
}

/**
 * Format price range (for filters, etc.)
 */
export function formatPriceRange(
  min: number,
  max: number,
  locale: string = 'en'
): string {
  return `${formatPrice(min, { locale })} - ${formatPrice(max, { locale })}`
}

/**
 * Format discount display
 * @returns Object with formatted prices and discount percentage
 */
export function formatDiscount(
  currentPrice: number,
  originalPrice: number,
  locale: string = 'en'
) {
  const discountPercent = Math.round((1 - currentPrice / originalPrice) * 100)
  
  return {
    current: formatPrice(currentPrice, { locale }),
    original: formatPrice(originalPrice, { locale }),
    percentage: discountPercent,
  }
}

/**
 * Check if a price should show a discount
 */
export function hasDiscount(originalPrice: number | null | undefined, currentPrice: number): boolean {
  return !!originalPrice && originalPrice > currentPrice
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0) return 0
  return Math.round((1 - currentPrice / originalPrice) * 100)
}
