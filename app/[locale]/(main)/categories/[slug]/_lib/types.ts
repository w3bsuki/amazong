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
  slug?: string | null
  sellers?: {
    store_slug: string | null
    display_name: string | null
    business_name: string | null
    avatar_url: string | null
    tier: string | null
    account_type: string | null
    is_verified_business: boolean | null
    id?: string | null
  } | null
  attributes?: Record<string, string> | null
  tags?: string[]
}

export interface CategoryProductFilters {
  minPrice?: string | undefined
  maxPrice?: string | undefined
  tag?: string | undefined
  minRating?: string | undefined
  availability?: string | undefined
  sort?: string | undefined
  attributes?: Record<string, string | string[]> | undefined
}
