import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Types for badge evaluation
interface BadgeCriteria {
  account_type?: string
  min_sales?: number
  min_listings?: number
  min_rating?: number
  min_reviews?: number
  min_positive_feedback_pct?: number
  email_verified?: boolean
  phone_verified?: boolean
  id_verified?: boolean
  min_months?: number
  min_followers?: number
  min_response_rate?: number
  min_repeat_customers_pct?: number
}

interface UserStats {
  total_sales?: number
  total_purchases?: number
  total_listings?: number
  average_rating?: number
  total_reviews?: number
  reviews_given?: number
  positive_feedback_pct?: number
  follower_count?: number
  response_rate_pct?: number
  repeat_customer_pct?: number
  created_at?: string
}

interface UserVerification {
  email_verified?: boolean | null
  phone_verified?: boolean | null
  id_verified?: boolean | null
  address_verified?: boolean | null
  created_at?: string | null
}

/**
 * POST /api/badges/evaluate
 * Evaluates and awards badges to a user based on their current stats
 * 
 * Body: { user_id: string, context?: "sale" | "review" | "listing" | "signup" | "subscription" }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await request.json()
    const userId = body.user_id || user.id
    const context = body.context || "general"
    
    // Security: Only allow users to evaluate their own badges unless admin
    // For now, only self-evaluation is allowed
    if (userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    // Get the user's profile (seller fields are now on profiles)
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, account_type")
      .eq("id", userId)
      .single()
    
    // Get applicable badge definitions based on context
    const BADGE_DEFINITIONS_SELECT =
      "id,account_type,category,code,color,created_at,criteria,description,description_bg,icon,is_active,is_automatic,name,name_bg,tier" as const

    const SELLER_STATS_SELECT =
      "seller_id,total_sales,total_listings,average_rating,total_reviews,positive_feedback_pct,follower_count,response_rate_pct,repeat_customer_pct,active_listings,total_revenue,five_star_reviews,response_time_hours,communication_pct,item_described_pct,shipped_on_time_pct,shipping_speed_pct,first_sale_at,last_sale_at,updated_at" as const

    const BUYER_STATS_SELECT =
      "user_id,average_rating,conversations_started,disputes_opened,disputes_won,first_purchase_at,last_purchase_at,reviews_written,stores_following,total_orders,total_ratings,total_spent,updated_at,wishlist_count" as const

    const USER_VERIFICATION_SELECT =
      "id,user_id,email_verified,phone_verified,id_verified,address_verified,address_verified_at,id_verified_at,id_document_type,phone_number,trust_score,created_at,updated_at" as const

    let badgeQuery = supabase
      .from("badge_definitions")
      .select(BADGE_DEFINITIONS_SELECT)
      .eq("is_active", true)
    
    if (profile) {
      // Seller badges
      if (profile.account_type === "business") {
        badgeQuery = badgeQuery.in("category", [
          "seller_milestone_personal", 
          "seller_milestone_business",
          "seller_sales",
          "seller_rating",
          "seller_special",
          "verification"
        ])
      } else {
        badgeQuery = badgeQuery.in("category", [
          "seller_milestone_personal",
          "seller_sales",
          "seller_rating",
          "seller_special",
          "verification"
        ])
      }
    } else {
      // Buyer badges only
      badgeQuery = badgeQuery.in("category", [
        "buyer_milestone",
        "buyer_rating",
        "buyer_engagement",
        "verification",
        "subscription"
      ])
    }
    
    const { data: badges, error: badgesError } = await badgeQuery
    
    if (badgesError) {
      console.error("Failed to fetch badge definitions:", badgesError)
      return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 })
    }
    
    // Get user's current badges
    const { data: existingBadges } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId)
    
    const existingBadgeIds = new Set((existingBadges || []).map(b => b.badge_id))
    
    // Get stats based on user type
    let stats: UserStats | null = null
    
    if (profile) {
      // Get seller stats
      const { data: sellerStats } = await supabase
        .from("seller_stats")
        .select(SELLER_STATS_SELECT)
        .eq("seller_id", profile.id)
        .single()
      
      stats = sellerStats as UserStats | null
    } else {
      // Get buyer stats
      const { data: buyerStats } = await supabase
        .from("buyer_stats")
        .select(BUYER_STATS_SELECT)
        .eq("user_id", userId)
        .single()
      
      stats = buyerStats as UserStats | null
    }
    
    // Get verification status
    const { data: verification } = await supabase
      .from("user_verification")
      .select(USER_VERIFICATION_SELECT)
      .eq("user_id", userId)
      .single()
    
    // Evaluate each badge
    const awardedBadges: string[] = []
    const newBadges: { badge_id: string; badge_code: string }[] = []
    
    for (const badge of badges || []) {
      // Skip if already has this badge
      if (existingBadgeIds.has(badge.id)) continue
      
      // Evaluate criteria
      const criteria = badge.criteria as BadgeCriteria
      let earned = false
      
      if (stats) {
        earned = evaluateCriteria(criteria, stats, verification, profile?.account_type ?? undefined)
      } else if (verification) {
        // Verification-only badges for new users
        earned = evaluateCriteria(criteria, {}, verification, "personal")
      }
      
      if (earned) {
        newBadges.push({ badge_id: badge.id, badge_code: badge.code })
      }
    }
    
    // Award new badges
    if (newBadges.length > 0) {
      const badgesToInsert = newBadges.map(b => ({
        user_id: userId,
        badge_id: b.badge_id,
        earned_at: new Date().toISOString(),
        awarded_by: "system",
        reason: `Auto-awarded from ${context} event`,
      }))
      
      const { error: insertError } = await supabase
        .from("user_badges")
        .insert(badgesToInsert)
      
      if (insertError) {
        console.error("Failed to insert badges:", insertError)
        return NextResponse.json({ error: "Failed to award badges" }, { status: 500 })
      }
      
      awardedBadges.push(...newBadges.map(b => b.badge_code))
    }
    
    return NextResponse.json({
      success: true,
      awarded: awardedBadges,
      total_awarded: awardedBadges.length,
    })
    
  } catch (error) {
    console.error("Badge evaluation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
  
  // Minimum sales
  if (criteria.min_sales !== undefined) {
    const totalSales = stats?.total_sales || stats?.total_purchases || 0
    if (totalSales < criteria.min_sales) return false
  }
  
  // Minimum listings
  if (criteria.min_listings !== undefined && (stats?.total_listings || 0) < criteria.min_listings) return false
  
  // Minimum rating
  if (criteria.min_rating !== undefined && (stats?.average_rating || 0) < criteria.min_rating) return false
  
  // Minimum reviews
  if (criteria.min_reviews !== undefined) {
    const reviews = stats?.total_reviews || stats?.reviews_given || 0
    if (reviews < criteria.min_reviews) return false
  }
  
  // Minimum positive feedback percentage
  if (criteria.min_positive_feedback_pct !== undefined && (stats?.positive_feedback_pct || 0) < criteria.min_positive_feedback_pct) return false
  
  // Email verification
  if (criteria.email_verified && !verification?.email_verified) return false
  
  // Phone verification
  if (criteria.phone_verified && !verification?.phone_verified) return false
  
  // ID verification
  if (criteria.id_verified && !verification?.id_verified) return false
  
  // Minimum months as member
  if (criteria.min_months !== undefined) {
    const createdAt = stats?.created_at || verification?.created_at
    if (createdAt) {
      const monthsSince = Math.floor(
        (Date.now() - new Date(createdAt).getTime()) / (30 * 24 * 60 * 60 * 1000)
      )
      if (monthsSince < criteria.min_months) return false
    } else {
      return false
    }
  }
  
  // Minimum follower count
  if (criteria.min_followers !== undefined && (stats?.follower_count || 0) < criteria.min_followers) return false
  
  // Minimum response rate
  if (criteria.min_response_rate !== undefined && (stats?.response_rate_pct || 0) < criteria.min_response_rate) return false
  
  // Minimum repeat customers percentage
  if (criteria.min_repeat_customers_pct !== undefined && (stats?.repeat_customer_pct || 0) < criteria.min_repeat_customers_pct) return false
  
  // All criteria passed
  return true
}