import type { CategoryTreeNode } from "@/lib/data/categories/types"

export interface DesktopHomeProduct {
  id: string
  title: string
  price: number
  listPrice?: number
  isOnSale?: boolean
  salePercent?: number
  saleEndDate?: string | null
  createdAt?: string | null
  image: string
  rating?: number
  reviews?: number
  slug?: string | null
  storeSlug?: string | null
  sellerId?: string | null
  sellerName?: string | null
  sellerAvatarUrl?: string | null
  sellerTier?: "basic" | "premium" | "business"
  sellerVerified?: boolean
  location?: string
  condition?: string
  isBoosted?: boolean
  boostExpiresAt?: string | null
  tags?: string[]
  categoryRootSlug?: string
  categoryPath?: { slug: string; name: string; nameBg?: string | null; icon?: string | null }[]
  attributes?: Record<string, unknown>
}

export interface DesktopHomeProps {
  locale: string
  categories: CategoryTreeNode[]
  initialProducts?: DesktopHomeProduct[]
  promotedProducts?: DesktopHomeProduct[]
}
