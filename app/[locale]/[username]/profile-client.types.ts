import type { FollowSellerActions } from "./_components/follow-seller-button"

export interface ProfileProduct {
  id: string
  title: string
  slug: string | null
  price: number
  list_price: number | null
  images: string[] | null
  rating: number | null
  review_count: number | null
  created_at: string
  is_boosted: boolean | null
  seller_id: string | null
  condition: string | null
}

export interface ReviewPerson {
  username: string | null
  display_name: string | null
  avatar_url: string | null
}

export interface SellerReview {
  id: string
  rating: number
  comment: string | null
  item_as_described: boolean | null
  shipping_speed: boolean | null
  communication: boolean | null
  created_at: string
  buyer: ReviewPerson | null
}

export interface BuyerReview {
  id: string
  rating: number
  comment: string | null
  payment_promptness: boolean | null
  communication: boolean | null
  created_at: string
  seller: ReviewPerson | null
}

export interface PublicProfileClientProps {
  profile: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
    banner_url: string | null
    bio: string | null
    account_type: string | null
    tier?: string | null
    is_seller: boolean | null
    is_verified_business: boolean | null
    verified?: boolean | null
    location: string | null
    business_name: string | null
    website_url: string | null
    social_links: Record<string, string> | null
    total_sales: number
    total_purchases: number
    average_rating?: number | null
    follower_count?: number
    created_at: string | null
  }
  products: ProfileProduct[]
  productCount: number
  sellerReviews: SellerReview[]
  sellerReviewCount: number
  buyerReviews: BuyerReview[]
  buyerReviewCount: number
  isOwnProfile: boolean
  isFollowing: boolean
  locale: string
  followActions?: FollowSellerActions
}
