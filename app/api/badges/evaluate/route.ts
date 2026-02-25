import type { NextRequest } from "next/server"
import { z } from "zod"

import { createRouteJsonHelpers } from "@/lib/api/route-json"

import { logger } from "@/lib/logger"
const BADGE_DEFINITIONS_SELECT =
  "id,account_type,category,code,color,created_at,criteria,description,description_bg,icon,is_active,is_automatic,name,name_bg,tier" as const

const SELLER_STATS_SELECT =
  "seller_id,total_sales,total_listings,average_rating,total_reviews,positive_feedback_pct,follower_count,response_rate_pct,repeat_customer_pct,active_listings,total_revenue,five_star_reviews,response_time_hours,communication_pct,item_described_pct,shipped_on_time_pct,shipping_speed_pct,first_sale_at,last_sale_at,updated_at" as const

const BUYER_STATS_SELECT =
  "user_id,average_rating,conversations_started,disputes_opened,disputes_won,first_purchase_at,last_purchase_at,reviews_written,stores_following,total_orders,total_ratings,total_spent,updated_at,wishlist_count" as const

const USER_VERIFICATION_SELECT =
  "id,user_id,email_verified,phone_verified,id_verified,address_verified,address_verified_at,id_verified_at,id_document_type,phone_number,trust_score,created_at,updated_at" as const

const SELLER_BADGE_CATEGORIES_PERSONAL = [
  "seller_milestone_personal",
  "seller_sales",
  "seller_rating",
  "seller_special",
  "verification",
] as const satisfies readonly string[]

const SELLER_BADGE_CATEGORIES_BUSINESS = [
  "seller_milestone_personal",
  "seller_milestone_business",
  "seller_sales",
  "seller_rating",
  "seller_special",
  "verification",
] as const satisfies readonly string[]

const BUYER_BADGE_CATEGORIES = [
  "buyer_milestone",
  "buyer_rating",
  "buyer_engagement",
  "verification",
  "subscription",
] as const satisfies readonly string[]

const EvaluationContextSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
  z
    .enum(["sale", "review", "listing", "signup", "subscription", "general"])
    .catch("general")
    .default("general")
)

const EvaluationRequestSchema = z
  .object({
    user_id: z.string().trim().uuid().optional(),
    context: EvaluationContextSchema,
  })
  .passthrough()

const BadgeCriteriaSchema = z
  .object({
    account_type: z.string().trim().min(1).optional(),
    min_sales: z.coerce.number().optional(),
    min_listings: z.coerce.number().optional(),
    min_rating: z.coerce.number().optional(),
    min_reviews: z.coerce.number().optional(),
    min_positive_feedback_pct: z.coerce.number().optional(),
    email_verified: z.boolean().optional(),
    phone_verified: z.boolean().optional(),
    id_verified: z.boolean().optional(),
    min_months: z.coerce.number().optional(),
    min_followers: z.coerce.number().optional(),
    min_response_rate: z.coerce.number().optional(),
    min_repeat_customers_pct: z.coerce.number().optional(),
  })
  .passthrough()

const NO_ROWS_ERROR_CODE = "PGRST116"

// Types for badge evaluation
interface BadgeCriteria {
  account_type?: string | undefined
  min_sales?: number | undefined
  min_listings?: number | undefined
  min_rating?: number | undefined
  min_reviews?: number | undefined
  min_positive_feedback_pct?: number | undefined
  email_verified?: boolean | undefined
  phone_verified?: boolean | undefined
  id_verified?: boolean | undefined
  min_months?: number | undefined
  min_followers?: number | undefined
  min_response_rate?: number | undefined
  min_repeat_customers_pct?: number | undefined
}

interface UserStats {
  total_sales?: number | undefined
  total_purchases?: number | undefined
  total_listings?: number | undefined
  average_rating?: number | undefined
  total_reviews?: number | undefined
  reviews_given?: number | undefined
  positive_feedback_pct?: number | undefined
  follower_count?: number | undefined
  response_rate_pct?: number | undefined
  repeat_customer_pct?: number | undefined
  created_at?: string | undefined
}

interface UserVerification {
  email_verified?: boolean | null
  phone_verified?: boolean | null
  id_verified?: boolean | null
  address_verified?: boolean | null
  created_at?: string | null
}

interface BadgeDefinitionRow {
  id: string
  code: string
  criteria: unknown
}

interface EvaluationProfileRow {
  id: string
  account_type: string | null
  is_seller: boolean | null
}

interface SellerStatsRow {
  total_sales: number | null
  total_listings: number | null
  average_rating: number | null
  total_reviews: number | null
  positive_feedback_pct: number | null
  follower_count: number | null
  response_rate_pct: number | null
  repeat_customer_pct: number | null
  first_sale_at: string | null
}

interface BuyerStatsRow {
  total_orders: number | null
  average_rating: number | null
  reviews_written: number | null
  first_purchase_at: string | null
}

interface UserVerificationRow {
  email_verified: boolean | null
  phone_verified: boolean | null
  id_verified: boolean | null
  address_verified: boolean | null
  created_at: string | null
}

interface ParsedEvaluationRequest {
  userId: string
  context: string
}

interface EvaluationRequestError {
  error: string
  status: number
}

function parseEvaluationRequestBody(
  body: unknown,
  fallbackUserId: string
): ParsedEvaluationRequest | EvaluationRequestError {
  const parsed = EvaluationRequestSchema.safeParse(body)

  if (!parsed.success) {
    return { error: "Invalid request", status: 400 }
  }

  return {
    userId: parsed.data.user_id ?? fallbackUserId,
    context: parsed.data.context,
  }
}

function isNoRowsError(error: { code?: string } | null): boolean {
  return Boolean(error?.code === NO_ROWS_ERROR_CODE)
}

function parseBadgeCriteria(criteria: unknown): BadgeCriteria | null {
  const parsed = BadgeCriteriaSchema.safeParse(criteria)
  return parsed.success ? parsed.data : null
}

function toSellerUserStats(stats: SellerStatsRow | null): UserStats | null {
  if (!stats) return null

  return {
    total_sales: stats.total_sales ?? undefined,
    total_listings: stats.total_listings ?? undefined,
    average_rating: stats.average_rating ?? undefined,
    total_reviews: stats.total_reviews ?? undefined,
    positive_feedback_pct: stats.positive_feedback_pct ?? undefined,
    follower_count: stats.follower_count ?? undefined,
    response_rate_pct: stats.response_rate_pct ?? undefined,
    repeat_customer_pct: stats.repeat_customer_pct ?? undefined,
    created_at: stats.first_sale_at ?? undefined,
  }
}

function toBuyerUserStats(stats: BuyerStatsRow | null): UserStats | null {
  if (!stats) return null

  return {
    total_purchases: stats.total_orders ?? undefined,
    average_rating: stats.average_rating ?? undefined,
    reviews_given: stats.reviews_written ?? undefined,
    created_at: stats.first_purchase_at ?? undefined,
  }
}

function toUserVerification(verification: UserVerificationRow | null): UserVerification | null {
  if (!verification) return null

  return {
    email_verified: verification.email_verified,
    phone_verified: verification.phone_verified,
    id_verified: verification.id_verified,
    address_verified: verification.address_verified,
    created_at: verification.created_at,
  }
}

function resolveBadgeCategories(params: {
  isSeller: boolean
  accountType: string | null | undefined
}): readonly string[] {
  const { isSeller, accountType } = params

  if (!isSeller) return BUYER_BADGE_CATEGORIES
  if (accountType === "business") return SELLER_BADGE_CATEGORIES_BUSINESS
  return SELLER_BADGE_CATEGORIES_PERSONAL
}

function collectEarnedBadges(params: {
  badges: BadgeDefinitionRow[] | null
  existingBadgeIds: Set<string>
  stats: UserStats | null
  verification: UserVerification | null
  accountType: string | null | undefined
}): Array<{ badge_id: string; badge_code: string }> {
  const { badges, existingBadgeIds, stats, verification, accountType } = params
  const newBadges: Array<{ badge_id: string; badge_code: string }> = []

  for (const badge of badges || []) {
    if (existingBadgeIds.has(badge.id)) continue

    const criteria = parseBadgeCriteria(badge.criteria)
    if (!criteria) continue

    const earned = stats
      ? evaluateCriteria(criteria, stats, verification, accountType ?? undefined)
      : verification
        ? evaluateCriteria(criteria, {}, verification, "personal")
        : false

    if (earned) {
      newBadges.push({ badge_id: badge.id, badge_code: badge.code })
    }
  }

  return newBadges
}

function meetsMinimum(value: number, minimum: number | undefined): boolean {
  return minimum === undefined || value >= minimum
}

function meetsVerificationRequirement(
  required: boolean | undefined,
  actual: boolean | null | undefined
): boolean {
  return !required || Boolean(actual)
}

function meetsMinMonths(minMonths: number | undefined, createdAt: string | null | undefined): boolean {
  if (minMonths === undefined) return true
  if (!createdAt) return false

  const monthsSince = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (30 * 24 * 60 * 60 * 1000)
  )
  return monthsSince >= minMonths
}

/**
 * POST /api/badges/evaluate
 * Evaluates and awards badges to a user based on their current stats
 *
 * Body: { user_id: string, context?: "sale" | "review" | "listing" | "signup" | "subscription" }
 */
export async function POST(request: NextRequest) {
  const { supabase, noStore: json } = createRouteJsonHelpers(request)

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return json({ error: "Unauthorized" }, { status: 401 })
    }

    let body: unknown = {}
    try {
      body = await request.json()
    } catch {
      return json({ error: "Invalid JSON" }, { status: 400 })
    }

    const parsedRequest = parseEvaluationRequestBody(body, user.id)
    if ("error" in parsedRequest) {
      return json({ error: parsedRequest.error }, { status: parsedRequest.status })
    }
    const { userId, context } = parsedRequest

    // Security: Only allow users to evaluate their own badges unless admin
    // For now, only self-evaluation is allowed
    if (userId !== user.id) {
      return json({ error: "Forbidden" }, { status: 403 })
    }

    // Get the user's profile (seller fields are now on profiles)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, account_type, is_seller")
      .eq("id", userId)
      .single<EvaluationProfileRow>()

    if (profileError && !isNoRowsError(profileError)) {
      logger.error("Failed to fetch profile:", profileError)
      return json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    // Get applicable badge definitions based on context
    let badgeQuery = supabase
      .from("badge_definitions")
      .select(BADGE_DEFINITIONS_SELECT)
      .eq("is_active", true)

    const accountType = profile?.account_type ?? null
    const isSeller = profile?.is_seller === true

    const badgeCategories = resolveBadgeCategories({ isSeller, accountType })
    badgeQuery = badgeQuery.in("category", badgeCategories)

    const { data: badges, error: badgesError } = await badgeQuery

    if (badgesError) {
      logger.error("Failed to fetch badge definitions:", badgesError)
      return json({ error: "Failed to fetch badges" }, { status: 500 })
    }

    // Get user's current badges
    const { data: existingBadges, error: existingBadgesError } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId)

    if (existingBadgesError) {
      logger.error("Failed to fetch existing user badges:", existingBadgesError)
      return json({ error: "Failed to fetch existing badges" }, { status: 500 })
    }

    const existingBadgeIds = new Set((existingBadges ?? []).map((badge) => badge.badge_id))

    // Get stats based on user type
    let stats: UserStats | null = null

    if (isSeller) {
      // Get seller stats
      const { data: sellerStats, error: sellerStatsError } = await supabase
        .from("seller_stats")
        .select(SELLER_STATS_SELECT)
        .eq("seller_id", userId)
        .single<SellerStatsRow>()

      if (sellerStatsError && !isNoRowsError(sellerStatsError)) {
        logger.error("Failed to fetch seller stats:", sellerStatsError)
        return json({ error: "Failed to fetch seller stats" }, { status: 500 })
      }

      stats = toSellerUserStats(sellerStats)
    } else {
      // Get buyer stats
      const { data: buyerStats, error: buyerStatsError } = await supabase
        .from("buyer_stats")
        .select(BUYER_STATS_SELECT)
        .eq("user_id", userId)
        .single<BuyerStatsRow>()

      if (buyerStatsError && !isNoRowsError(buyerStatsError)) {
        logger.error("Failed to fetch buyer stats:", buyerStatsError)
        return json({ error: "Failed to fetch buyer stats" }, { status: 500 })
      }

      stats = toBuyerUserStats(buyerStats)
    }

    // Get verification status
    const { data: verificationRow, error: verificationError } = await supabase
      .from("user_verification")
      .select(USER_VERIFICATION_SELECT)
      .eq("user_id", userId)
      .single<UserVerificationRow>()

    if (verificationError && !isNoRowsError(verificationError)) {
      logger.error("Failed to fetch user verification:", verificationError)
      return json({ error: "Failed to fetch verification" }, { status: 500 })
    }

    const badgeRows: BadgeDefinitionRow[] = (badges ?? [])
      .filter((badge) => typeof badge.id === "string" && typeof badge.code === "string")
      .map((badge) => ({
        id: badge.id,
        code: badge.code,
        criteria: badge.criteria,
      }))

    const newBadges = collectEarnedBadges({
      badges: badgeRows,
      existingBadgeIds,
      stats,
      verification: toUserVerification(verificationRow),
      accountType: isSeller ? accountType : null,
    })
    const awardedBadges: string[] = []

    // Award new badges
    if (newBadges.length > 0) {
      const badgesToInsert = newBadges.map((badge) => ({
        user_id: userId,
        badge_id: badge.badge_id,
        earned_at: new Date().toISOString(),
        awarded_by: "system",
        reason: `Auto-awarded from ${context} event`,
      }))

      const { error: insertError } = await supabase.from("user_badges").insert(badgesToInsert)

      if (insertError) {
        logger.error("Failed to insert badges:", insertError)
        return json({ error: "Failed to award badges" }, { status: 500 })
      }

      awardedBadges.push(...newBadges.map((badge) => badge.badge_code))
    }

    return json({
      success: true,
      awarded: awardedBadges,
      total_awarded: awardedBadges.length,
    })
  } catch (error) {
    logger.error("Badge evaluation error:", error)
    return json({ error: "Internal server error" }, { status: 500 })
  }
}
/**
 * Evaluate badge criteria against user stats
 */
function evaluateCriteria(
  criteria: BadgeCriteria | null | undefined,
  stats: UserStats | null,
  verification: UserVerification | null,
  accountType?: string
): boolean {
  if (!criteria) return false

  // Account type check
  if (criteria.account_type && criteria.account_type !== accountType) {
    return false
  }

  const checks = [
    meetsMinimum(stats?.total_sales || stats?.total_purchases || 0, criteria.min_sales),
    meetsMinimum(stats?.total_listings || 0, criteria.min_listings),
    meetsMinimum(stats?.average_rating || 0, criteria.min_rating),
    meetsMinimum(stats?.total_reviews || stats?.reviews_given || 0, criteria.min_reviews),
    meetsMinimum(stats?.positive_feedback_pct || 0, criteria.min_positive_feedback_pct),
    meetsMinimum(stats?.follower_count || 0, criteria.min_followers),
    meetsMinimum(stats?.response_rate_pct || 0, criteria.min_response_rate),
    meetsMinimum(stats?.repeat_customer_pct || 0, criteria.min_repeat_customers_pct),
    meetsVerificationRequirement(criteria.email_verified, verification?.email_verified),
    meetsVerificationRequirement(criteria.phone_verified, verification?.phone_verified),
    meetsVerificationRequirement(criteria.id_verified, verification?.id_verified),
    meetsMinMonths(criteria.min_months, stats?.created_at || verification?.created_at),
  ]

  return checks.every(Boolean)
}
