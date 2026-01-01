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

type BadgeAccountType = "personal" | "business" | "buyer" | "all"

interface BadgeCriteria {
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
  // DB returns string, we accept it broadly for compatibility
  category: string
  account_type: string | null
  icon: string | null
  color: string | null
  tier: number | null
  is_automatic: boolean | null
  is_active: boolean | null
  criteria: Record<string, unknown>
  created_at: string | null
}

interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  awarded_at: string | null
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

type IdDocumentType = "passport" | "id_card" | "drivers_license"

export interface UserVerification {
  id: string
  user_id: string
  email_verified: boolean | null
  phone_verified: boolean | null
  phone_number: string | null
  id_verified: boolean | null
  // DB returns string, but we validate against IdDocumentType
  id_document_type: string | null
  id_verified_at: string | null
  address_verified: boolean | null
  address_verified_at: string | null
  trust_score: number | null
  created_at: string | null
  updated_at: string | null
}

export interface BusinessVerification {
  id: string
  seller_id: string
  legal_name: string | null
  vat_number: string | null
  eik_number: string | null
  vat_verified: boolean | null
  vat_verified_at: string | null
  registration_doc_url: string | null
  registration_verified: boolean | null
  registration_verified_at: string | null
  verified_by: string | null
  bank_verified: boolean | null
  bank_verified_at: string | null
  verification_level: number | null
  verification_notes: string | null
  created_at: string | null
  updated_at: string | null
}

// =====================================================
// STATS TYPES
// =====================================================

interface SellerStats {
  seller_id: string
  total_listings: number | null
  active_listings: number | null
  total_sales: number | null
  total_revenue: number | null
  average_rating: number | null
  total_reviews: number | null
  five_star_reviews: number | null
  positive_feedback_pct: number | null
  item_described_pct: number | null
  shipping_speed_pct: number | null
  communication_pct: number | null
  follower_count: number | null
  response_time_hours: number | null
  response_rate_pct: number | null
  shipped_on_time_pct: number | null
  repeat_customer_pct: number | null
  first_sale_at: string | null
  last_sale_at: string | null
  updated_at: string | null
}

interface BuyerStats {
  user_id: string
  total_orders: number | null
  total_spent: number | null
  average_rating: number | null
  total_ratings: number | null
  reviews_written: number | null
  stores_following: number | null
  wishlist_count: number | null
  conversations_started: number | null
  disputes_opened: number | null
  disputes_won: number | null
  first_purchase_at: string | null
  last_purchase_at: string | null
  updated_at: string | null
}

// =====================================================
// FEEDBACK TYPES
// =====================================================

interface SellerFeedback {
  id: string
  buyer_id: string
  seller_id: string
  order_id: string | null
  rating: number
  comment: string | null
  item_as_described: boolean | null
  shipping_speed: boolean | null
  communication: boolean | null
  buyer_response: string | null
  buyer_response_at: string | null
  created_at: string | null
  updated_at: string | null
  // Joined data
  buyer?: {
    full_name: string | null
    avatar_url: string | null
  }
}

interface BuyerFeedback {
  id: string
  seller_id: string
  buyer_id: string
  order_id: string | null
  rating: number
  comment: string | null
  payment_promptness: boolean | null
  communication: boolean | null
  reasonable_expectations: boolean | null
  seller_response: string | null
  seller_response_at: string | null
  created_at: string | null
  updated_at: string | null
  // Joined data from profiles
  seller?: {
    display_name: string | null
    username: string | null
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

interface TrustScoreBreakdown {
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

interface SellerProfileBadges {
  verification: DisplayBadge[]
  rating: DisplayBadge[]
  milestone: DisplayBadge[]
  special: DisplayBadge[]
  subscription: DisplayBadge | null
}

interface BuyerProfileBadges {
  verification: DisplayBadge[]
  milestone: DisplayBadge[]
  rating: DisplayBadge[]
  special: DisplayBadge[]
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

interface BadgeEvaluationResult {
  awarded: BadgeDefinition[]
  revoked: BadgeDefinition[]
  progress: BadgeProgress[]
}

interface VerificationStatus {
  user: UserVerification | null
  business: BusinessVerification | null
  trustScore: number
  level: number // 0-5
  levelName: string
}
