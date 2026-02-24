export interface SellerProfileData {
  id: string
  name: string
  username: string | null
  avatarUrl: string | null
  verified: boolean
  rating: number | null
  reviewCount: number | null
  positivePercent?: number | null
  totalSales: number | null
  responseTimeHours: number | null
  followers?: number | null
  listingsCount?: number | null
  joinedAt: string | null
  joinedYear?: string | null
  bio?: string | null
}

export interface SellerProduct {
  id: string
  title: string
  price: number
  originalPrice?: number | null
  image?: string | null
  slug?: string | null
  storeSlug?: string | null
}
