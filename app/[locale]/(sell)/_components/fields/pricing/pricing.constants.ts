export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
}

export const CURRENCIES = [{ value: "EUR", label: "EUR (€)" }]

export interface PriceSuggestion {
  low: number
  median: number
  high: number
  currency: string
  count: number
}
