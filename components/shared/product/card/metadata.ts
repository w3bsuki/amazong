import type { QuickViewProduct } from "@/components/providers/drawer-context"
import { isBoostActiveNow } from "@/lib/boost/boost-status"
import { getCategoryName } from "@/lib/category-display"
import { getListingOverlayBadgeVariants } from "@/lib/ui/badge-intent"

import type { ProductCardData } from "./types"

export function getProductUrl(
  username: string | null | undefined,
  slug: string | null | undefined,
  id: string
): string {
  if (!username) return "#"
  return `/${username}/${slug || id}`
}

export function getDiscountPercent(
  price: number,
  originalPrice: number | null | undefined,
  salePercent: number | undefined
): number {
  const hasDiscount = Boolean(originalPrice && originalPrice > price)
  if (!hasDiscount) return salePercent ?? 0
  return Math.round((((originalPrice ?? 0) - price) / (originalPrice ?? 1)) * 100)
}

export function getRootCategoryLabel(
  categoryPath: ProductCardData["categoryPath"],
  locale: string
): string | null {
  const rootCategory = categoryPath?.[0]
  if (!rootCategory) return null

  const fallbackName = rootCategory.name?.trim()
  if (!fallbackName) return null

  const localizedName = getCategoryName(
    {
      id: rootCategory.slug || fallbackName,
      slug: rootCategory.slug || fallbackName,
      name: fallbackName,
      name_bg: rootCategory.nameBg ?? null,
    },
    locale
  ).trim()

  return localizedName || fallbackName
}

export function getOverlayBadgeVariants(params: {
  isBoosted: boolean | undefined
  boostExpiresAt: string | null | undefined
  discountPercent: number
}) {
  const { isBoosted, boostExpiresAt, discountPercent } = params
  const isBoostedActive = isBoosted
    ? boostExpiresAt
      ? isBoostActiveNow({ is_boosted: true, boost_expires_at: boostExpiresAt })
      : true
    : false

  return getListingOverlayBadgeVariants({
    isPromoted: isBoostedActive,
    discountPercent,
    minDiscountPercent: 5,
  })
}

interface QuickViewPayloadInput {
  id: string
  title: string
  price: number
  image: string
  images?: string[] | undefined
  originalPrice?: number | null | undefined
  description?: string | null | undefined
  categoryPath?: ProductCardData["categoryPath"] | undefined
  condition?: ProductCardData["condition"] | undefined
  location?: ProductCardData["location"] | undefined
  freeShipping?: boolean | undefined
  rating?: number | undefined
  reviews?: number | undefined
  inStock?: boolean | undefined
  slug?: string | null | undefined
  username?: string | null | undefined
  sellerId?: string | null | undefined
  sellerName?: string | undefined
  sellerAvatarUrl?: string | null | undefined
  sellerVerified?: boolean | undefined
  includeFreeShipping?: boolean | undefined
}

export function buildQuickViewProduct(input: QuickViewPayloadInput): QuickViewProduct {
  const quickView: QuickViewProduct = {
    id: input.id,
    title: input.title,
    price: input.price,
    image: input.image,
  }

  if (typeof window !== "undefined") {
    quickView.sourceScrollY = window.scrollY
  }
  if (input.images) quickView.images = input.images
  if (input.originalPrice != null) quickView.originalPrice = input.originalPrice
  if (input.description != null) quickView.description = input.description
  if (input.categoryPath) quickView.categoryPath = input.categoryPath
  if (input.condition != null) quickView.condition = input.condition
  if (input.location != null) quickView.location = input.location
  if (input.includeFreeShipping && input.freeShipping !== undefined) quickView.freeShipping = input.freeShipping
  if (input.rating !== undefined) quickView.rating = input.rating
  if (input.reviews !== undefined) quickView.reviews = input.reviews
  if (input.inStock !== undefined) quickView.inStock = input.inStock
  if (input.slug != null) quickView.slug = input.slug
  if (input.username != null) quickView.username = input.username
  if (input.sellerId != null) quickView.sellerId = input.sellerId
  if (input.sellerName != null) quickView.sellerName = input.sellerName
  if (input.sellerAvatarUrl != null) quickView.sellerAvatarUrl = input.sellerAvatarUrl
  if (input.sellerVerified !== undefined) quickView.sellerVerified = input.sellerVerified

  return quickView
}
