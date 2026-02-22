export type ListingOverlayBadgeVariant = "promoted" | "discount"

interface ListingOverlayBadgeInput {
  isPromoted: boolean
  discountPercent: number
  minDiscountPercent?: number
}

export function getListingOverlayBadgeVariants({
  isPromoted,
  discountPercent,
  minDiscountPercent = 5,
}: ListingOverlayBadgeInput): ListingOverlayBadgeVariant[] {
  const variants: ListingOverlayBadgeVariant[] = []

  if (isPromoted) {
    variants.push("promoted")
  }

  if (discountPercent >= minDiscountPercent) {
    variants.push("discount")
  }

  return variants
}
