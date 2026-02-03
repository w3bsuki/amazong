interface FormatCurrencyOptions {
  locale: string
  maximumFractionDigits?: number
  minimumFractionDigits?: number
}

export function formatCurrency(value: number, options: FormatCurrencyOptions) {
  const { locale, maximumFractionDigits = 0, minimumFractionDigits } = options

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BGN",
    maximumFractionDigits,
    ...(typeof minimumFractionDigits === "number" ? { minimumFractionDigits } : {}),
  }).format(value)
}
