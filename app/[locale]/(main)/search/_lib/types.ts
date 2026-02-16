export type BrowseMode = "listings" | "sellers"

export type SellerSortKey = "products" | "rating" | "newest"

export interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

export interface Product {
  id: string
  title: string
  price: number
  list_price: number | null
  images: string[]
  rating: number | null
  review_count: number | null
  category_id: string | null
  image_url?: string | null
  tags?: string[]
  slug?: string | null
  store_slug?: string | null
  is_boosted?: boolean
  profiles?: {
    id: string | null
    username: string | null
    display_name: string | null
    business_name: string | null
    avatar_url: string | null
    tier: string | null
    account_type: string | null
    is_verified_business: boolean | null
  } | null
  attributes?: Record<string, string> | null
  categories?: { slug: string } | null
}

export interface SellerSearchFilters {
  sellerSort: SellerSortKey
  sellerVerified: boolean
  sellerMinRating?: number | undefined
  sellerMinListings?: number | undefined
  city?: string | undefined
  nearby?: boolean | undefined
}

export interface SellerResultCard {
  id: string
  username: string | null
  store_name: string
  description: string | null
  verified: boolean
  created_at: string
  product_count: number
  total_rating: number | null
  avatar_url: string | null
}

export interface SearchProductFilters {
  minPrice?: string | undefined
  maxPrice?: string | undefined
  tag?: string | undefined
  minRating?: string | undefined
  deals?: string | undefined
  promoted?: string | undefined
  nearby?: string | undefined
  city?: string | undefined
  verified?: string | undefined
  availability?: string | undefined
  sort?: string | undefined
  attributes?: Record<string, string | string[]> | undefined
}
