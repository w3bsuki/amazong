/**
 * Price Formatting Utilities
 * 
 * EUR is the base currency since Bulgaria joined the Eurozone on January 1, 2025.
 * All prices are stored and displayed in EUR for consistency.
 */

import { formatCurrencyAmount, formatEurPriceParts, type PriceParts } from "./price-formatting"

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

export type FormattedPriceParts = PriceParts

/**
 * Format price parts for split display (e.g. symbol + whole + decimals)
 */
export function formatPriceParts(amount: number, locale: string): FormattedPriceParts {
  return formatEurPriceParts(amount, locale)
}

/**
 * Format an inclusive price range for display.
 */
export function formatPriceRange(minPrice: number, maxPrice: number, locale = 'en'): string {
  return `${formatPrice(minPrice, { locale })} - ${formatPrice(maxPrice, { locale })}`
}

interface FormattedDiscount {
  percentage: number
  amountSaved: number
  originalFormatted: string
  currentFormatted: string
}

/**
 * Format discount details for UI badges/labels.
 */
export function formatDiscount(
  currentPrice: number,
  originalPrice: number,
  locale = 'en',
): FormattedDiscount {
  return {
    percentage: getDiscountPercentage(originalPrice, currentPrice),
    amountSaved: Math.max(0, originalPrice - currentPrice),
    originalFormatted: formatPrice(originalPrice, { locale }),
    currentFormatted: formatPrice(currentPrice, { locale }),
  }
}
