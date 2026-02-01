export interface UIProduct {
  id: string
  title: string
  price: number
  createdAt?: string | null
  listPrice?: number
  isOnSale?: boolean
  salePercent?: number
  saleEndDate?: string | null
  isBoosted?: boolean
  boostExpiresAt?: string | null
  image: string
  rating: number
  reviews: number
  categorySlug?: string
  /** Root (L0) category slug (e.g. fashion, electronics, automotive) */
  categoryRootSlug?: string
  /** Category path from L0 -> leaf, includes both EN and BG labels */
  categoryPath?: { slug: string; name: string; nameBg?: string | null; icon?: string | null }[]
  slug?: string | null
  storeSlug?: string | null
  sellerId?: string | null
  sellerName?: string | null
  sellerAvatarUrl?: string | null
  sellerTier?: 'basic' | 'premium' | 'business'
  sellerVerified?: boolean
  sellerEmailVerified?: boolean
  sellerPhoneVerified?: boolean
  sellerIdVerified?: boolean
  freeShipping?: boolean

  attributes?: Record<string, string>
  condition?: string
  brand?: string
  make?: string
  model?: string
  year?: string
  location?: string
}
