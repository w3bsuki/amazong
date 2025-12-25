export function formatCurrencyBGN(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BGN",
    maximumFractionDigits: 2,
  }).format(value)
}
