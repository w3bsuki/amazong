export interface Seller {
  id: string
  store_name: string
  description: string | null
  verified: boolean
  created_at: string
  product_count: number
  total_rating: number | null
  avatar_url: string | null
}

export type SellerQueryResult = {
  id: string
  username: string | null
  display_name: string | null
  business_name: string | null
  bio: string | null
  verified: boolean | null
  created_at: string
  avatar_url: string | null
  products: { id: string; rating: number | null }[]
}
