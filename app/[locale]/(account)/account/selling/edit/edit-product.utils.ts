interface SaleDiscountArgs {
  isOnSale: boolean
  originalPrice: string
  price: string
}

export function calculateSaleDiscount({ isOnSale, originalPrice, price }: SaleDiscountArgs): number {
  if (!isOnSale || !originalPrice || !price) return 0

  const originalValue = Number.parseFloat(originalPrice)
  const currentValue = Number.parseFloat(price)

  if (originalValue <= 0 || currentValue >= originalValue) return 0
  return Math.round(((originalValue - currentValue) / originalValue) * 100)
}

export function toSaleEndDateIso(saleEndDateLocal: string): string | null {
  if (!saleEndDateLocal) return null

  const date = new Date(saleEndDateLocal)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}
