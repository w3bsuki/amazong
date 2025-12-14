/**
 * Badge & Verification System Types
 * Version 1.0 | December 2025
 */

// =====================================================
// BADGE DEFINITIONS
// =====================================================

export type BadgeCategory =
  | "seller_milestone"
  | "seller_rating"
  | "seller_special"
  | "buyer_milestone"
  | "buyer_rating"
  | "buyer_special"
  | "verification"
  | "subscription"

export type BadgeAccountType = "personal" | "business" | "buyer" | "all"

export interface BadgeCriteria {
  // Listing criteria
  min_listings?: number
  max_listings?: number
  // Sales criteria
  min_sales?: number
  max_sales?: number
  // Rating criteria
  min_rating?: number
  min_reviews?: number
  min_ratings?: number
  // Order criteria (for buyers)
  min_orders?: number
  max_orders?: number
  // Engagement criteria
  min_reviews_written?: number
  min_stores_following?: number
  min_wishlist_count?: number
  min_followers?: number
  min_conversations?: number
  // Performance criteria
  min_shipped_on_time_pct?: number
  max_response_time_hours?: number
  min_repeat_customer_pct?: number
  min_account_age_years?: number
  // Verification criteria
  email_verified?: boolean
  phone_verified?: boolean
  id_verified?: boolean
  vat_verified?: boolean
  registration_verified?: boolean
  verification_level?: number
  // Subscription criteria
  subscription_tier?: "starter" | "professional" | "enterprise"
}

export interface BadgeDefinition {
  id: string
  code: string
  name: string
  name_bg: string | null
  description: string | null
  description_bg: string | null
  category: BadgeCategory
  account_type: BadgeAccountType | null
  icon: string | null
  color: string | null
  tier: number
  is_automatic: boolean
  is_active: boolean
  criteria: BadgeCriteria
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  awarded_at: string
  awarded_by: string | null
  revoked_at: string | null
  revoke_reason: string | null
  metadata: Record<string, unknown>
  // Joined badge definition
  badge_definition?: BadgeDefinition
}

// =====================================================
// VERIFICATION TYPES
// =====================================================

export type IdDocumentType = "passport" | "id_card" | "drivers_license"

export interface UserVerification {
  id: string
  user_id: string
  email_verified: boolean
  phone_verified: boolean
  phone_number: string | null
  id_verified: boolean
  id_document_type: IdDocumentType | null
  id_verified_at: string | null
  address_verified: boolean
  address_verified_at: string | null
  trust_score: number
  created_at: string
  updated_at: string
}

export interface BusinessVerification {
  id: string
  seller_id: string
  legal_name: string | null
  vat_number: string | null
  eik_number: string | null
  vat_verified: boolean
  vat_verified_at: string | null
  registration_doc_url: string | null
  registration_verified: boolean
  registration_verified_at: string | null
  verified_by: string | null
  bank_verified: boolean
  bank_verified_at: string | null
  verification_level: number
  verification_notes: string | null
  created_at: string
  updated_at: string
}

// =====================================================
// STATS TYPES
// =====================================================

export interface SellerStats {
  seller_id: string
  total_listings: number
  active_listings: number
  total_sales: number
  total_revenue: number
  average_rating: number
  total_reviews: number
  five_star_reviews: number
  positive_feedback_pct: number
  item_described_pct: number
  shipping_speed_pct: number
  communication_pct: number
  follower_count: number
  response_time_hours: number | null
  response_rate_pct: number
  shipped_on_time_pct: number
  repeat_customer_pct: number
  first_sale_at: string | null
  last_sale_at: string | null
  updated_at: string
}

export interface BuyerStats {
  user_id: string
  total_orders: number
  total_spent: number
  average_rating: number
  total_ratings: number
  reviews_written: number
  stores_following: number
  wishlist_count: number
  conversations_started: number
  disputes_opened: number
  disputes_won: number
  first_purchase_at: string | null
  last_purchase_at: string | null
  updated_at: string
}

// =====================================================
// FEEDBACK TYPES
// =====================================================

export interface SellerFeedback {
  id: string
  buyer_id: string
  seller_id: string
  order_id: string | null
  rating: number
  comment: string | null
  item_as_described: boolean
  shipping_speed: boolean
  communication: boolean
  buyer_response: string | null
  buyer_response_at: string | null
  created_at: string
  updated_at: string
  // Joined data
  buyer?: {
    full_name: string | null
    avatar_url: string | null
  }
}

export interface BuyerFeedback {
  id: string
  seller_id: string
  buyer_id: string
  order_id: string | null
  rating: number
  comment: string | null
  payment_promptness: boolean
  communication: boolean
  reasonable_expectations: boolean
  seller_response: string | null
  seller_response_at: string | null
  created_at: string
  updated_at: string
  // Joined data
  seller?: {
    store_name: string
    store_slug: string | null
  }
}

// =====================================================
// DISPLAY TYPES (for UI components)
// =====================================================

export interface DisplayBadge {
  code: string
  name: string
  icon: string
  color: string
  description: string
  tier: number
  category: BadgeCategory
}

export interface TrustScoreBreakdown {
  verification: number
  performance: number
  total: number
}

export interface BadgeProgress {
  badge: BadgeDefinition
  progress: number // 0-100
  requirement: string // Human-readable requirement text
  currentValue: number
  targetValue: number
}

export interface SellerProfileBadges {
  verification: DisplayBadge[]
  rating: DisplayBadge[]
  milestone: DisplayBadge[]
  special: DisplayBadge[]
  subscription: DisplayBadge | null
}

export interface BuyerProfileBadges {
  verification: DisplayBadge[]
  milestone: DisplayBadge[]
  rating: DisplayBadge[]
  special: DisplayBadge[]
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface BadgeEvaluationResult {
  awarded: BadgeDefinition[]
  revoked: BadgeDefinition[]
  progress: BadgeProgress[]
}

export interface VerificationStatus {
  user: UserVerification | null
  business: BusinessVerification | null
  trustScore: number
  level: number // 0-5
  levelName: string
}
