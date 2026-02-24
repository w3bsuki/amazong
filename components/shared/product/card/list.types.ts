export type CategoryPathItem = {
  slug: string
  name: string
  nameBg?: string | null
  icon?: string | null
}

export interface ProductCardListProps {
  id: string
  title: string
  price: number
  image: string
  isBoosted?: boolean
  createdAt?: string | null | undefined
  description?: string | null
  originalPrice?: number | null
  sellerId?: string | null
  sellerName?: string | undefined
  sellerVerified?: boolean
  freeShipping?: boolean
  location?: string | undefined
  slug?: string | null
  username?: string | null
  showWishlist?: boolean
  currentUserId?: string | null
  inStock?: boolean
  className?: string
  condition?: "new" | "like_new" | "used" | "refurbished" | string | undefined
  showBuyerProtection?: boolean
  categorySlug?: string | null
  rootCategorySlug?: string | null
  attributes?: Record<string, unknown>
  categoryPath?: CategoryPathItem[] | undefined
}

export type ProductCardListBadge = {
  key: string
  value: string
}
