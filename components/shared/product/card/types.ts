export interface ProductCardData {
  id: string
  title: string
  price: number
  image: string

  createdAt?: string | null
  originalPrice?: number | null
  isOnSale?: boolean
  salePercent?: number

  categoryRootSlug?: string | undefined
  categoryPath?: Array<{ slug: string; name: string; nameBg?: string | null; icon?: string | null }> | undefined

  images?: string[]
  description?: string | null

  sellerId?: string | null
  sellerName?: string | undefined
  sellerAvatarUrl?: string | null
  sellerTier?: "basic" | "premium" | "business" | undefined
  sellerVerified?: boolean

  freeShipping?: boolean

  slug?: string | null
  username?: string | null

  inStock?: boolean
  rating?: number
  reviews?: number
  soldCount?: number
  condition?: "new" | "like_new" | "used" | "refurbished" | string | undefined
  location?: string | undefined

  isBoosted?: boolean
  boostExpiresAt?: string | null
}

export interface ProductCardBaseProps extends ProductCardData {
  className?: string
  currentUserId?: string | null
  index?: number
  titleLines?: 1 | 2
  showWishlist?: boolean
  showWishlistAction?: boolean
  showPromotedBadge?: boolean
  disableQuickView?: boolean
}

export type MobileProductCardLayout = "feed" | "rail"
