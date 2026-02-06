export interface ProductCardData {
  id: string
  title: string
  price: number
  image: string

  createdAt?: string | null
  originalPrice?: number | null
  isOnSale?: boolean
  salePercent?: number

  categoryRootSlug?: string
  categoryPath?: Array<{ slug: string; name: string; nameBg?: string | null; icon?: string | null }>
  attributes?: Record<string, unknown>

  images?: string[]
  description?: string | null

  sellerId?: string | null
  sellerName?: string | undefined
  sellerAvatarUrl?: string | null
  sellerVerified?: boolean
  sellerEmailVerified?: boolean
  sellerPhoneVerified?: boolean
  sellerIdVerified?: boolean

  freeShipping?: boolean

  slug?: string | null
  username?: string | null

  inStock?: boolean
  rating?: number
  reviews?: number
  soldCount?: number
  favoritesCount?: number
  condition?: "new" | "like_new" | "used" | "refurbished" | string
  location?: string

  isBoosted?: boolean
  boostExpiresAt?: string | null
}

export interface ProductCardViewConfig {
  showQuickAdd?: boolean
  showWishlist?: boolean
  showSeller?: boolean
  disableQuickView?: boolean
  appearance?: "card" | "tile"
  media?: "square" | "landscape"
  density?: "default" | "compact"
  titleLines?: 1 | 2
  uiVariant?: "default" | "home"
  radius?: "xl" | "2xl"
}
