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

export type SellerVerificationBadgeVariant =
  | "verified-business"
  | "verified-personal"
  | null

interface SellerVerificationBadgeInput {
  isVerified: boolean
  isBusiness: boolean
}

export function getSellerVerificationBadgeVariant({
  isVerified,
  isBusiness,
}: SellerVerificationBadgeInput): SellerVerificationBadgeVariant {
  if (!isVerified) return null
  return isBusiness ? "verified-business" : "verified-personal"
}
