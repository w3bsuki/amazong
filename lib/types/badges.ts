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

// =====================================================
// VERIFICATION TYPES
// =====================================================

export interface UserVerification {
  id: string
  user_id: string
  email_verified: boolean | null
  phone_verified: boolean | null
  phone_number: string | null
  id_verified: boolean | null
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

export interface BadgeProgress {
  badge: BadgeDefinition
  progress: number // 0-100
  requirement: string // Human-readable requirement text
  currentValue: number
  targetValue: number
}
