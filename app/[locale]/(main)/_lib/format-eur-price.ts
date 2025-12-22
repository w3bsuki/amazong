export function formatEurPrice(
  locale: string,
  price: number,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
): string {
  const numberFormatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "EUR",
    ...(options?.minimumFractionDigits !== undefined
      ? { minimumFractionDigits: options.minimumFractionDigits }
      : {}),
    ...(options?.maximumFractionDigits !== undefined
      ? { maximumFractionDigits: options.maximumFractionDigits }
      : {}),
  }

  return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", numberFormatOptions).format(price)
}
