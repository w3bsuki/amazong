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
