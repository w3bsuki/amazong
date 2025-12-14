/**
 * Badge Data Fetching Functions
 * 
 * READ operations use 'use cache' for static caching
 * WRITE operations use 'use server' for mutations
 */

import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'
import type {
  BadgeDefinition,
  UserBadge,
  UserVerification,
  BusinessVerification,
  SellerStats,
  BuyerStats,
  SellerFeedback,
  BuyerFeedback,
} from "@/lib/types/badges"

// =====================================================
// BADGE DEFINITIONS - Read operations (cached)
// =====================================================

export async function getAllBadgeDefinitions(): Promise<BadgeDefinition[]> {
  'use cache'
  cacheTag('badges', 'badge-definitions')
  cacheLife('categories') // Badge definitions rarely change
  
  const supabase = createStaticClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("badge_definitions")
    .select("*")
    .eq("is_active", true)
    .order("tier", { ascending: true })

  if (error) {
    console.error("Error fetching badge definitions:", error)
    return []
  }

  // Transform DB row to BadgeDefinition type (criteria is Json in DB)
  return (data || []).map(row => ({
    ...row,
    criteria: (row.criteria || {}) as Record<string, unknown>,
  }))
}

export async function getBadgeDefinitionsByCategory(
  category: string
): Promise<BadgeDefinition[]> {
  'use cache'
  cacheTag('badges', `badge-definitions-${category}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("badge_definitions")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("tier", { ascending: true })

  if (error) {
    console.error("Error fetching badge definitions by category:", error)
    return []
  }

  return (data || []).map(row => ({
    ...row,
    criteria: (row.criteria || {}) as Record<string, unknown>,
  }))
}

export async function getBadgeDefinitionsByAccountType(
  accountType: "personal" | "business" | "buyer"
): Promise<BadgeDefinition[]> {
  'use cache'
  cacheTag('badges', `badge-definitions-${accountType}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("badge_definitions")
    .select("*")
    .or(`account_type.eq.${accountType},account_type.eq.all`)
    .eq("is_active", true)
    .order("tier", { ascending: true })

  if (error) {
    console.error("Error fetching badge definitions by account type:", error)
    return []
  }

  return (data || []).map(row => ({
    ...row,
    criteria: (row.criteria || {}) as Record<string, unknown>,
  }))
}

// =====================================================
// USER BADGES - Read operations (cached)
// =====================================================

export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  'use cache'
  cacheTag('user-badges', `badges-${userId}`)
  cacheLife('user')
  
  const supabase = createStaticClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("user_badges")
    .select(`
      *,
      badge_definition:badge_definitions(*)
    `)
    .eq("user_id", userId)
    .is("revoked_at", null)
    .order("awarded_at", { ascending: false })

  if (error) {
    console.error("Error fetching user badges:", error)
    return []
  }

  // Transform DB rows to UserBadge type
  return (data || []).map(row => {
    const badgeDef = row.badge_definition
    return {
      id: row.id,
      user_id: row.user_id,
      badge_id: row.badge_id,
      awarded_at: row.awarded_at,
      awarded_by: row.awarded_by,
      revoked_at: row.revoked_at,
      revoke_reason: row.revoke_reason,
      metadata: (row.metadata || {}) as Record<string, unknown>,
      badge_definition: badgeDef ? {
        ...badgeDef,
        criteria: (badgeDef.criteria || {}) as Record<string, unknown>,
      } : undefined,
    }
  })
}

export async function getSellerBadges(sellerId: string): Promise<UserBadge[]> {
  // Seller badges are stored with user_id = seller_id (same UUID)
  return getUserBadges(sellerId)
}

// =====================================================
// USER BADGES - Write operations (server actions)
// =====================================================

export async function awardBadge(
  userId: string,
  badgeId: string,
  awardedBy?: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "No database connection" }

  const { error } = await supabase
    .from("user_badges")
    .upsert({
      user_id: userId,
      badge_id: badgeId,
      awarded_at: new Date().toISOString(),
      awarded_by: awardedBy || null,
      metadata: (metadata || {}) as unknown as import("@/lib/supabase/database.types").Json,
      revoked_at: null,
      revoke_reason: null,
    }, {
      onConflict: "user_id,badge_id",
    })

  if (error) {
    console.error("Error awarding badge:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function revokeBadge(
  userId: string,
  badgeId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "No database connection" }

  const { error } = await supabase
    .from("user_badges")
    .update({
      revoked_at: new Date().toISOString(),
      revoke_reason: reason,
    })
    .eq("user_id", userId)
    .eq("badge_id", badgeId)

  if (error) {
    console.error("Error revoking badge:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =====================================================
// VERIFICATION - Read operations (cached)
// =====================================================

export async function getUserVerification(userId: string): Promise<UserVerification | null> {
  'use cache'
  cacheTag('verification', `user-verification-${userId}`)
  cacheLife('user')
  
  const supabase = createStaticClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("user_verification")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user verification:", error)
    return null
  }

  return data || null
}

export async function getBusinessVerification(sellerId: string): Promise<BusinessVerification | null> {
  'use cache'
  cacheTag('verification', `business-verification-${sellerId}`)
  cacheLife('user')
  
  const supabase = createStaticClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("business_verification")
    .select("*")
    .eq("seller_id", sellerId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching business verification:", error)
    return null
  }

  return data || null
}

// =====================================================
// VERIFICATION - Write operations (server actions)
// =====================================================

export async function upsertUserVerification(
  userId: string,
  updates: Partial<UserVerification>
): Promise<{ success: boolean; error?: string }> {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "No database connection" }

  const { error } = await supabase
    .from("user_verification")
    .upsert({
      user_id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id",
    })

  if (error) {
    console.error("Error upserting user verification:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function upsertBusinessVerification(
  sellerId: string,
  updates: Partial<BusinessVerification>
): Promise<{ success: boolean; error?: string }> {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "No database connection" }

  const { error } = await supabase
    .from("business_verification")
    .upsert({
      seller_id: sellerId,
      ...updates,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "seller_id",
    })

  if (error) {
    console.error("Error upserting business verification:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =====================================================
// STATS - Read operations (cached)
// =====================================================

export async function getSellerStats(sellerId: string): Promise<SellerStats | null> {
  'use cache'
  cacheTag('seller-stats', `stats-${sellerId}`)
  cacheLife('products')
  
  const supabase = createStaticClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("seller_stats")
    .select("*")
    .eq("seller_id", sellerId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching seller stats:", error)
    return null
  }

  return data || null
}

export async function getBuyerStats(userId: string): Promise<BuyerStats | null> {
  'use cache'
  cacheTag('buyer-stats', `stats-${userId}`)
  cacheLife('products')
  
  const supabase = createStaticClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("buyer_stats")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching buyer stats:", error)
    return null
  }

  return data || null
}

// =====================================================
// STATS - Write operations (server actions)
// =====================================================

export async function upsertSellerStats(
  sellerId: string,
  stats: Partial<SellerStats>
): Promise<{ success: boolean; error?: string }> {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "No database connection" }

  const { error } = await supabase
    .from("seller_stats")
    .upsert({
      seller_id: sellerId,
      ...stats,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "seller_id",
    })

  if (error) {
    console.error("Error upserting seller stats:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function upsertBuyerStats(
  userId: string,
  stats: Partial<BuyerStats>
): Promise<{ success: boolean; error?: string }> {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "No database connection" }

  const { error } = await supabase
    .from("buyer_stats")
    .upsert({
      user_id: userId,
      ...stats,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id",
    })

  if (error) {
    console.error("Error upserting buyer stats:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =====================================================
// FEEDBACK - Read operations (cached)
// =====================================================

export async function getSellerFeedbackList(
  sellerId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ feedback: SellerFeedback[]; total: number }> {
  'use cache'
  cacheTag('seller-feedback', `feedback-list-${sellerId}`)
  cacheLife('products')
  
  const supabase = createStaticClient()
  if (!supabase) return { feedback: [], total: 0 }

  const { limit = 10, offset = 0 } = options || {}

  const { data, error, count } = await supabase
    .from("seller_feedback")
    .select(`
      *,
      buyer:profiles!seller_feedback_buyer_id_fkey(full_name, avatar_url)
    `, { count: "exact" })
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching seller feedback:", error)
    return { feedback: [], total: 0 }
  }

  return {
    feedback: data || [],
    total: count || 0,
  }
}

export async function getBuyerFeedbackList(
  buyerId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ feedback: BuyerFeedback[]; total: number }> {
  'use cache'
  cacheTag('buyer-feedback', `feedback-list-${buyerId}`)
  cacheLife('products')
  
  const supabase = createStaticClient()
  if (!supabase) return { feedback: [], total: 0 }

  const { limit = 10, offset = 0 } = options || {}

  const { data, error, count } = await supabase
    .from("buyer_feedback")
    .select(`
      *,
      seller:profiles!buyer_feedback_seller_id_fkey(display_name, username)
    `, { count: "exact" })
    .eq("buyer_id", buyerId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching buyer feedback:", error)
    return { feedback: [], total: 0 }
  }

  return {
    feedback: data || [],
    total: count || 0,
  }
}

// =====================================================
// FEEDBACK - Write operations (server actions)
// =====================================================

export async function submitSellerFeedback(
  feedback: {
    buyer_id: string
    seller_id: string
    order_id?: string
    rating: number
    comment?: string
    item_as_described?: boolean
    shipping_speed?: boolean
    communication?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "No database connection" }

  const { error } = await supabase
    .from("seller_feedback")
    .insert({
      ...feedback,
      item_as_described: feedback.item_as_described ?? true,
      shipping_speed: feedback.shipping_speed ?? true,
      communication: feedback.communication ?? true,
    })

  if (error) {
    console.error("Error submitting seller feedback:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function submitBuyerFeedback(
  feedback: {
    seller_id: string
    buyer_id: string
    order_id?: string
    rating: number
    comment?: string
    payment_promptness?: boolean
    communication?: boolean
    reasonable_expectations?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "No database connection" }

  const { error } = await supabase
    .from("buyer_feedback")
    .insert({
      ...feedback,
      payment_promptness: feedback.payment_promptness ?? true,
      communication: feedback.communication ?? true,
      reasonable_expectations: feedback.reasonable_expectations ?? true,
    })

  if (error) {
    console.error("Error submitting buyer feedback:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =====================================================
// COMBINED DATA FOR PROFILES
// =====================================================

export interface SellerProfileData {
  badges: UserBadge[]
  stats: SellerStats | null
  verification: UserVerification | null
  businessVerification: BusinessVerification | null
  accountType: "personal" | "business"
}

export async function getSellerProfileData(sellerId: string): Promise<SellerProfileData | null> {
  'use cache'
  cacheTag('seller-profile-data', `seller-profile-${sellerId}`)
  cacheLife('user')
  
  const supabase = createStaticClient()
  if (!supabase) return null

  // Get profile to determine account type
  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type, is_seller")
    .eq("id", sellerId)
    .single()

  if (!profile) return null

  const accountType = (profile.account_type as "personal" | "business") || "personal"

  // Fetch all data in parallel
  const [badges, stats, verification, businessVerification] = await Promise.all([
    getSellerBadges(sellerId),
    getSellerStats(sellerId),
    getUserVerification(sellerId),
    accountType === "business" ? getBusinessVerification(sellerId) : Promise.resolve(null),
  ])

  return {
    badges,
    stats,
    verification,
    businessVerification,
    accountType,
  }
}

export interface BuyerProfileData {
  badges: UserBadge[]
  stats: BuyerStats | null
  verification: UserVerification | null
}

export async function getBuyerProfileData(userId: string): Promise<BuyerProfileData | null> {
  'use cache'
  cacheTag('buyer-profile-data', `buyer-profile-${userId}`)
  cacheLife('user')
  
  const supabase = createStaticClient()
  if (!supabase) return null

  // Fetch all data in parallel
  const [badges, stats, verification] = await Promise.all([
    getUserBadges(userId),
    getBuyerStats(userId),
    getUserVerification(userId),
  ])

  return {
    badges,
    stats,
    verification,
  }
}
