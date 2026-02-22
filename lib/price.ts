export type PriceParts = {
  symbol: string
  wholePart: string
  decimalPart: string
  symbolPosition: "before" | "after"
}

export const BASE_CURRENCY = "EUR" as const

const localeMap: Record<string, string> = {
  bg: "bg-BG",
  en: "en-IE",
  de: "de-DE",
}

export function resolveCurrencyFormattingLocale(locale: string): string {
  const language = locale.toLowerCase().split("-")[0] ?? "en"
  return localeMap[language] ?? "en-IE"
}

export function formatCurrencyAmount(
  amount: number,
  locale: string,
  currency: string,
  options: {
    showSymbol?: boolean
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  } = {}
): string {
  const {
    showSymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options

  return new Intl.NumberFormat(resolveCurrencyFormattingLocale(locale), {
    style: showSymbol ? "currency" : "decimal",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

export function formatPrice(
  amount: number,
  options: {
    locale?: string
    showSymbol?: boolean
  } = {}
): string {
  const { locale = "en", showSymbol = true } = options
  return formatCurrencyAmount(amount, locale, BASE_CURRENCY, { showSymbol })
}

export function formatPriceParts(amount: number, locale: string): PriceParts {
  const isBulgarian = locale.toLowerCase().split("-")[0] === "bg"
  const symbol = "€"
  const wholePart = Math.floor(amount).toString()
  const decimalPart = (amount % 1).toFixed(2).slice(2)

  return {
    symbol,
    wholePart: isBulgarian
      ? wholePart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, " ")
      : wholePart,
    decimalPart,
    symbolPosition: isBulgarian ? "after" : "before",
  }
}

export function hasDiscount(originalPrice: number | null | undefined, currentPrice: number): boolean {
  return !!originalPrice && originalPrice > currentPrice
}

export function getDiscountPercentage(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0) return 0
  return Math.round((1 - currentPrice / originalPrice) * 100)
}
