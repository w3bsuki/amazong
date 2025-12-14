/**
 * Badge & Verification Service
 * Core business logic for badge evaluation, trust scores, and stats
 * Version 1.0 | December 2025
 */

import type {
  BadgeDefinition,
  UserBadge,
  BadgeCriteria,
  UserVerification,
  BusinessVerification,
  SellerStats,
  BuyerStats,
  DisplayBadge,
  BadgeProgress,
  SellerProfileBadges,
  BuyerProfileBadges,
  TrustScoreBreakdown,
  BadgeCategory,
} from "@/lib/types/badges"

// =====================================================
// BADGE COLOR MAP
// =====================================================

export const BADGE_COLORS: Record<string, string> = {
  // Verification
  email_verified: "bg-blue-400 text-white",
  phone_verified: "bg-green-400 text-white",
  id_verified: "bg-emerald-500 text-white",
  verified_seller: "bg-blue-500 text-white",
  verified_business: "bg-blue-600 text-white",
  verified_pro: "bg-emerald-600 text-white",
  verified_enterprise: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
  
  // Ratings
  top_rated: "bg-gradient-to-r from-yellow-400 to-amber-500 text-black",
  highly_rated: "bg-amber-500 text-white",
  well_reviewed: "bg-yellow-500 text-black",
  exceptional: "bg-gradient-to-r from-yellow-400 to-amber-500 text-black",
  
  // Milestones - Personal
  new_seller: "bg-gray-400 text-white",
  getting_started: "bg-blue-400 text-white",
  active_seller: "bg-cyan-500 text-white",
  power_seller: "bg-purple-500 text-white",
  super_seller: "bg-orange-500 text-white",
  
  // Milestones - Business
  new_business: "bg-gray-500 text-white",
  emerging_business: "bg-blue-500 text-white",
  growing_business: "bg-indigo-500 text-white",
  established_business: "bg-purple-600 text-white",
  enterprise: "bg-violet-600 text-white",
  
  // Sales
  first_sale: "bg-green-500 text-white",
  first_business_sale: "bg-green-500 text-white",
  rising_star: "bg-yellow-400 text-black",
  trusted_seller: "bg-emerald-500 text-white",
  established_seller: "bg-amber-600 text-white",
  elite_seller: "bg-amber-500 text-white",
  legend: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white",
  
  // Business sales
  active_business: "bg-teal-500 text-white",
  thriving_business: "bg-emerald-500 text-white",
  top_business: "bg-amber-600 text-white",
  market_leader: "bg-amber-500 text-white",
  industry_giant: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white",
  
  // Business ratings
  trusted_business: "bg-yellow-500 text-black",
  preferred_business: "bg-amber-500 text-white",
  premium_business: "bg-amber-600 text-white",
  excellence_award: "bg-gradient-to-r from-yellow-400 to-amber-500 text-black",
  
  // Special
  fast_shipper: "bg-blue-500 text-white",
  quick_responder: "bg-cyan-500 text-white",
  repeat_champion: "bg-purple-500 text-white",
  community_favorite: "bg-pink-500 text-white",
  veteran: "bg-slate-500 text-white",
  
  // Buyer
  new_buyer: "bg-gray-400 text-white",
  first_purchase: "bg-green-500 text-white",
  active_shopper: "bg-blue-500 text-white",
  frequent_buyer: "bg-purple-500 text-white",
  vip_shopper: "bg-violet-500 text-white",
  platinum_buyer: "bg-gradient-to-r from-gray-300 to-gray-400 text-black",
  
  // Buyer ratings
  good_buyer: "bg-yellow-500 text-black",
  great_buyer: "bg-amber-500 text-white",
  excellent_buyer: "bg-amber-600 text-white",
  dream_customer: "bg-gradient-to-r from-pink-400 to-purple-500 text-white",
  
  // Buyer special
  helpful_reviewer: "bg-blue-500 text-white",
  review_expert: "bg-purple-500 text-white",
  loyal_follower: "bg-pink-500 text-white",
  wishlist_pro: "bg-orange-500 text-white",
  
  // Subscription
  starter_plan: "bg-blue-500 text-white",
  professional_plan: "bg-purple-600 text-white",
  enterprise_plan: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
}

// =====================================================
// TRUST SCORE CALCULATION
// =====================================================

export function calculateSellerTrustScore(
  verification: UserVerification | null,
  businessVerification: BusinessVerification | null,
  stats: SellerStats | null,
  accountType: "personal" | "business"
): TrustScoreBreakdown {
  let verificationScore = 0
  let performanceScore = 0
  
  // Verification points (max 40)
  if (verification) {
    if (verification.email_verified) verificationScore += 10
    if (verification.phone_verified) verificationScore += 15
    if (verification.id_verified) verificationScore += 10
    if (verification.address_verified) verificationScore += 5
  }
  
  // Business-specific verification
  if (accountType === "business" && businessVerification) {
    if (businessVerification.vat_verified) verificationScore += 15
    if (businessVerification.registration_verified) verificationScore += 10
    if (businessVerification.bank_verified) verificationScore += 5
    // Cap at 40 for verification
    verificationScore = Math.min(verificationScore, 40)
  }
  
  // Performance points (max 60)
  if (stats) {
    if (stats.total_sales >= 10) performanceScore += 10
    if (stats.total_sales >= 50) performanceScore += 10
    if (stats.average_rating >= 4.0) performanceScore += 10
    if (stats.average_rating >= 4.5) performanceScore += 10
    if (stats.positive_feedback_pct >= 95) performanceScore += 10
    if (stats.shipped_on_time_pct >= 95) performanceScore += 10
  }
  
  const total = Math.min(verificationScore + performanceScore, 100)
  
  return {
    verification: verificationScore,
    performance: performanceScore,
    total,
  }
}

export function calculateBuyerTrustScore(
  verification: UserVerification | null,
  stats: BuyerStats | null
): TrustScoreBreakdown {
  let verificationScore = 0
  let performanceScore = 0
  
  // Verification points (max 30)
  if (verification) {
    if (verification.email_verified) verificationScore += 15
    if (verification.phone_verified) verificationScore += 15
  }
  
  // Performance points (max 70)
  if (stats) {
    if (stats.total_orders >= 1) performanceScore += 20 // Payment verified
    if (stats.total_orders >= 5 && stats.disputes_opened === 0) performanceScore += 25 // Established
    if (stats.total_orders >= 20 && stats.disputes_opened === 0 && stats.average_rating >= 4.5) {
      performanceScore += 25 // Trusted
    }
  }
  
  const total = Math.min(verificationScore + performanceScore, 100)
  
  return {
    verification: verificationScore,
    performance: performanceScore,
    total,
  }
}

// =====================================================
// BADGE CRITERIA EVALUATION
// =====================================================

interface EvaluationContext {
  sellerStats?: SellerStats | null
  buyerStats?: BuyerStats | null
  verification?: UserVerification | null
  businessVerification?: BusinessVerification | null
  accountType?: "personal" | "business"
  subscriptionTier?: string | null
  accountCreatedAt?: string | null
}

export function evaluateBadgeCriteria(
  criteria: BadgeCriteria,
  context: EvaluationContext
): { met: boolean; progress: number; currentValue: number; targetValue: number } {
  const { sellerStats, buyerStats, verification, businessVerification, subscriptionTier, accountCreatedAt } = context
  
  let allCriteriaMet = true
  let totalProgress = 0
  let criteriaCount = 0
  let currentValue = 0
  let targetValue = 0
  
  // Listing criteria
  if (criteria.min_listings !== undefined) {
    const value = sellerStats?.active_listings ?? 0
    currentValue = value
    targetValue = criteria.min_listings
    const met = value >= criteria.min_listings
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_listings) * 100, 99)
    criteriaCount++
  }
  
  if (criteria.max_listings !== undefined) {
    const value = sellerStats?.active_listings ?? 0
    const met = value <= criteria.max_listings
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : 0
    criteriaCount++
  }
  
  // Sales criteria
  if (criteria.min_sales !== undefined) {
    const value = sellerStats?.total_sales ?? 0
    currentValue = value
    targetValue = criteria.min_sales
    const met = value >= criteria.min_sales
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_sales) * 100, 99)
    criteriaCount++
  }
  
  // Rating criteria
  if (criteria.min_rating !== undefined) {
    const value = sellerStats?.average_rating ?? buyerStats?.average_rating ?? 0
    currentValue = value
    targetValue = criteria.min_rating
    const met = value >= criteria.min_rating
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_rating) * 100, 99)
    criteriaCount++
  }
  
  if (criteria.min_reviews !== undefined) {
    const value = sellerStats?.total_reviews ?? 0
    currentValue = value
    targetValue = criteria.min_reviews
    const met = value >= criteria.min_reviews
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_reviews) * 100, 99)
    criteriaCount++
  }
  
  // Order criteria (buyers)
  if (criteria.min_orders !== undefined) {
    const value = buyerStats?.total_orders ?? 0
    currentValue = value
    targetValue = criteria.min_orders
    const met = value >= criteria.min_orders
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_orders) * 100, 99)
    criteriaCount++
  }
  
  if (criteria.max_orders !== undefined) {
    const value = buyerStats?.total_orders ?? 0
    const met = value <= criteria.max_orders
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : 0
    criteriaCount++
  }
  
  // Engagement criteria
  if (criteria.min_reviews_written !== undefined) {
    const value = buyerStats?.reviews_written ?? 0
    currentValue = value
    targetValue = criteria.min_reviews_written
    const met = value >= criteria.min_reviews_written
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_reviews_written) * 100, 99)
    criteriaCount++
  }
  
  if (criteria.min_stores_following !== undefined) {
    const value = buyerStats?.stores_following ?? 0
    currentValue = value
    targetValue = criteria.min_stores_following
    const met = value >= criteria.min_stores_following
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_stores_following) * 100, 99)
    criteriaCount++
  }
  
  if (criteria.min_wishlist_count !== undefined) {
    const value = buyerStats?.wishlist_count ?? 0
    currentValue = value
    targetValue = criteria.min_wishlist_count
    const met = value >= criteria.min_wishlist_count
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_wishlist_count) * 100, 99)
    criteriaCount++
  }
  
  if (criteria.min_followers !== undefined) {
    const value = sellerStats?.follower_count ?? 0
    currentValue = value
    targetValue = criteria.min_followers
    const met = value >= criteria.min_followers
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_followers) * 100, 99)
    criteriaCount++
  }
  
  // Performance criteria
  if (criteria.min_shipped_on_time_pct !== undefined) {
    const value = sellerStats?.shipped_on_time_pct ?? 0
    currentValue = value
    targetValue = criteria.min_shipped_on_time_pct
    const met = value >= criteria.min_shipped_on_time_pct
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_shipped_on_time_pct) * 100, 99)
    criteriaCount++
  }
  
  if (criteria.max_response_time_hours !== undefined) {
    const value = sellerStats?.response_time_hours ?? Infinity
    currentValue = value
    targetValue = criteria.max_response_time_hours
    const met = value <= criteria.max_response_time_hours
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : 0
    criteriaCount++
  }
  
  if (criteria.min_repeat_customer_pct !== undefined) {
    const value = sellerStats?.repeat_customer_pct ?? 0
    currentValue = value
    targetValue = criteria.min_repeat_customer_pct
    const met = value >= criteria.min_repeat_customer_pct
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.min_repeat_customer_pct) * 100, 99)
    criteriaCount++
  }
  
  // Account age criteria
  if (criteria.min_account_age_years !== undefined && accountCreatedAt) {
    const accountAge = (Date.now() - new Date(accountCreatedAt).getTime()) / (1000 * 60 * 60 * 24 * 365)
    currentValue = Math.floor(accountAge * 10) / 10
    targetValue = criteria.min_account_age_years
    const met = accountAge >= criteria.min_account_age_years
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((accountAge / criteria.min_account_age_years) * 100, 99)
    criteriaCount++
  }
  
  // Verification criteria
  if (criteria.email_verified !== undefined) {
    const met = verification?.email_verified === criteria.email_verified
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : 0
    criteriaCount++
  }
  
  if (criteria.phone_verified !== undefined) {
    const met = verification?.phone_verified === criteria.phone_verified
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : 0
    criteriaCount++
  }
  
  if (criteria.id_verified !== undefined) {
    const met = verification?.id_verified === criteria.id_verified
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : 0
    criteriaCount++
  }
  
  if (criteria.vat_verified !== undefined) {
    const met = businessVerification?.vat_verified === criteria.vat_verified
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : 0
    criteriaCount++
  }
  
  if (criteria.registration_verified !== undefined) {
    const met = businessVerification?.registration_verified === criteria.registration_verified
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : 0
    criteriaCount++
  }
  
  if (criteria.verification_level !== undefined) {
    const value = businessVerification?.verification_level ?? 0
    currentValue = value
    targetValue = criteria.verification_level
    const met = value >= criteria.verification_level
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : Math.min((value / criteria.verification_level) * 100, 99)
    criteriaCount++
  }
  
  // Subscription criteria
  if (criteria.subscription_tier !== undefined) {
    const met = subscriptionTier === criteria.subscription_tier
    allCriteriaMet = allCriteriaMet && met
    totalProgress += met ? 100 : 0
    criteriaCount++
  }
  
  const progress = criteriaCount > 0 ? Math.round(totalProgress / criteriaCount) : 0
  
  return { met: allCriteriaMet, progress, currentValue, targetValue }
}

// =====================================================
// BADGE GROUPING & DISPLAY
// =====================================================

export function toDisplayBadge(badge: BadgeDefinition, locale: "en" | "bg" = "en"): DisplayBadge {
  return {
    code: badge.code,
    name: locale === "bg" && badge.name_bg ? badge.name_bg : badge.name,
    icon: badge.icon || "🏅",
    color: badge.color || BADGE_COLORS[badge.code] || "bg-gray-500 text-white",
    description: locale === "bg" && badge.description_bg ? badge.description_bg : badge.description || "",
    tier: badge.tier,
    category: badge.category,
  }
}

export function groupSellerBadges(
  badges: UserBadge[],
  locale: "en" | "bg" = "en"
): SellerProfileBadges {
  const result: SellerProfileBadges = {
    verification: [],
    rating: [],
    milestone: [],
    special: [],
    subscription: null,
  }
  
  for (const badge of badges) {
    if (!badge.badge_definition || badge.revoked_at) continue
    
    const displayBadge = toDisplayBadge(badge.badge_definition, locale)
    
    switch (badge.badge_definition.category) {
      case "verification":
        result.verification.push(displayBadge)
        break
      case "seller_rating":
        result.rating.push(displayBadge)
        break
      case "seller_milestone":
        result.milestone.push(displayBadge)
        break
      case "seller_special":
        result.special.push(displayBadge)
        break
      case "subscription":
        // Only keep highest tier subscription badge
        if (!result.subscription || displayBadge.tier > result.subscription.tier) {
          result.subscription = displayBadge
        }
        break
    }
  }
  
  // Sort by tier (highest first)
  result.verification.sort((a, b) => b.tier - a.tier)
  result.rating.sort((a, b) => b.tier - a.tier)
  result.milestone.sort((a, b) => b.tier - a.tier)
  result.special.sort((a, b) => b.tier - a.tier)
  
  return result
}

export function groupBuyerBadges(
  badges: UserBadge[],
  locale: "en" | "bg" = "en"
): BuyerProfileBadges {
  const result: BuyerProfileBadges = {
    verification: [],
    milestone: [],
    rating: [],
    special: [],
  }
  
  for (const badge of badges) {
    if (!badge.badge_definition || badge.revoked_at) continue
    
    const displayBadge = toDisplayBadge(badge.badge_definition, locale)
    
    switch (badge.badge_definition.category) {
      case "verification":
        result.verification.push(displayBadge)
        break
      case "buyer_milestone":
        result.milestone.push(displayBadge)
        break
      case "buyer_rating":
        result.rating.push(displayBadge)
        break
      case "buyer_special":
        result.special.push(displayBadge)
        break
    }
  }
  
  // Sort by tier (highest first)
  result.verification.sort((a, b) => b.tier - a.tier)
  result.milestone.sort((a, b) => b.tier - a.tier)
  result.rating.sort((a, b) => b.tier - a.tier)
  result.special.sort((a, b) => b.tier - a.tier)
  
  return result
}

// =====================================================
// BADGE PRIORITY FOR DISPLAY
// =====================================================

export function getTopBadgesForDisplay(
  badges: UserBadge[],
  limit: number = 3,
  locale: "en" | "bg" = "en"
): DisplayBadge[] {
  // Priority order: verification > rating > subscription > milestone > special
  const priorityOrder: Record<BadgeCategory, number> = {
    verification: 5,
    seller_rating: 4,
    buyer_rating: 4,
    subscription: 3,
    seller_milestone: 2,
    buyer_milestone: 2,
    seller_special: 1,
    buyer_special: 1,
  }
  
  const sortedBadges = badges
    .filter(b => b.badge_definition && !b.revoked_at)
    .sort((a, b) => {
      const priorityA = priorityOrder[a.badge_definition!.category] || 0
      const priorityB = priorityOrder[b.badge_definition!.category] || 0
      if (priorityA !== priorityB) return priorityB - priorityA
      return b.badge_definition!.tier - a.badge_definition!.tier
    })
    .slice(0, limit)
  
  return sortedBadges.map(b => toDisplayBadge(b.badge_definition!, locale))
}

// =====================================================
// PROGRESS CALCULATION
// =====================================================

export function getNextBadgeProgress(
  currentBadges: UserBadge[],
  allBadges: BadgeDefinition[],
  context: EvaluationContext,
  accountType: "personal" | "business" | "buyer",
  locale: "en" | "bg" = "en"
): BadgeProgress | null {
  const earnedCodes = new Set(
    currentBadges
      .filter(b => !b.revoked_at)
      .map(b => b.badge_definition?.code)
      .filter(Boolean)
  )
  
  // Filter badges that apply to this account type and aren't earned
  const availableBadges = allBadges.filter(badge => {
    if (earnedCodes.has(badge.code)) return false
    if (!badge.is_active || !badge.is_automatic) return false
    
    // Check account type compatibility
    if (badge.account_type === "all") return true
    if (badge.account_type === accountType) return true
    
    return false
  })
  
  // Find the badge with highest progress
  let bestProgress: BadgeProgress | null = null
  let bestProgressValue = 0
  
  for (const badge of availableBadges) {
    const { met, progress, currentValue, targetValue } = evaluateBadgeCriteria(badge.criteria, {
      ...context,
      accountType: accountType === "buyer" ? undefined : accountType,
    })
    
    if (!met && progress > bestProgressValue) {
      bestProgressValue = progress
      bestProgress = {
        badge,
        progress,
        currentValue,
        targetValue,
        requirement: generateRequirementText(badge, currentValue, targetValue, locale),
      }
    }
  }
  
  return bestProgress
}

function generateRequirementText(
  badge: BadgeDefinition,
  currentValue: number,
  targetValue: number,
  locale: "en" | "bg"
): string {
  const remaining = Math.max(0, targetValue - currentValue)
  
  if (badge.criteria.min_sales !== undefined) {
    return locale === "bg"
      ? `${remaining} още продажби`
      : `${remaining} more sales needed`
  }
  
  if (badge.criteria.min_listings !== undefined) {
    return locale === "bg"
      ? `${remaining} още обяви`
      : `${remaining} more listings needed`
  }
  
  if (badge.criteria.min_orders !== undefined) {
    return locale === "bg"
      ? `${remaining} още поръчки`
      : `${remaining} more orders needed`
  }
  
  if (badge.criteria.min_reviews !== undefined || badge.criteria.min_ratings !== undefined) {
    return locale === "bg"
      ? `${remaining} още отзива`
      : `${remaining} more reviews needed`
  }
  
  if (badge.criteria.min_rating !== undefined) {
    return locale === "bg"
      ? `Нужен рейтинг ${targetValue}+`
      : `Need ${targetValue}+ rating`
  }
  
  if (badge.criteria.min_followers !== undefined) {
    return locale === "bg"
      ? `${remaining} още последователи`
      : `${remaining} more followers needed`
  }
  
  if (badge.criteria.min_reviews_written !== undefined) {
    return locale === "bg"
      ? `${remaining} още ревюта`
      : `${remaining} more reviews to write`
  }
  
  return locale === "bg" ? "Продължавайте!" : "Keep going!"
}
