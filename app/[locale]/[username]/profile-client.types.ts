import type { FollowSellerActions } from "./_components/follow-seller-button"
import type {
  BuyerReview,
  ProfileProduct,
  PublicProfile,
  ReviewPerson,
  SellerReview,
} from "@/lib/types/profile-page"

export type { BuyerReview, ProfileProduct, PublicProfile, ReviewPerson, SellerReview }

export interface PublicProfileClientProps {
  profile: PublicProfile
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
