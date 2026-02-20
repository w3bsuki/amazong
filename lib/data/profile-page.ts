import 'server-only'

import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'
import type { BuyerReview, ProfileProduct, PublicProfile, SellerReview } from '@/lib/types/profile-page'

// =============================================================================
// Profile Page Data Functions - CACHED for Performance
// 
// These functions fetch PUBLIC profile data that can be cached.
// User-specific data (isOwnProfile, isFollowing) must be handled separately.
// =============================================================================

export interface ProfilePageData {
  profile: PublicProfile | null
  products: ProfileProduct[]
  productCount: number
  sellerReviews: SellerReview[]
  sellerReviewCount: number
  buyerReviews: BuyerReview[]
  buyerReviewCount: number
}

/**
 * Fetch all public profile data in ONE cached call.
 * This dramatically reduces database queries and enables caching.
 */
export async function getPublicProfileData(username: string): Promise<ProfilePageData | null> {
  'use cache'
  cacheTag(`profile-${username.toLowerCase()}`)
  cacheLife('user')

  const supabase = createStaticClient()

  // 1. Fetch the profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      display_name,
      avatar_url,
      banner_url,
      bio,
      account_type,
      tier,
      is_seller,
      is_verified_business,
      verified,
      location,
      business_name,
      website_url,
      social_links,
      created_at
    `)
    .ilike("username", username)
    .single()

  if (error || !profile) return null

  // 2. Fetch all related data IN PARALLEL for maximum performance
  const [
    sellerStatsResult,
    buyerStatsResult,
    productsResult,
    sellerReviewsResult,
    buyerReviewsResult,
  ] = await Promise.all([
    // Seller stats
    profile.is_seller
      ? supabase
          .from("seller_stats")
          .select("total_sales, average_rating, follower_count")
          .eq("seller_id", profile.id)
          .single()
      : Promise.resolve({ data: null }),
    
    // Buyer stats
    supabase
      .from("buyer_stats")
      .select("total_orders")
      .eq("user_id", profile.id)
      .single(),
    
    // Products (if seller) - DETERMINISTIC query for ISR caching
    // NOTE: No new Date() here - boost sorting happens post-cache to avoid ISR write storms
    profile.is_seller
      ? (async () => {
          const baseSelect = `
            id,
            title,
            slug,
            price,
            list_price,
            images,
            rating,
            review_count,
            created_at,
            is_boosted,
            boost_expires_at,
            seller_id,
            condition
          `

          // Stable query: just fetch by created_at, include boost fields for post-cache sorting
          const { data, error, count } = await supabase
            .from("products")
            .select(baseSelect, { count: "exact" })
            .eq("seller_id", profile.id)
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(12)

          if (error) return { data: [], count: count ?? 0 }
          return { data: data ?? [], count: count ?? 0 }
        })()
      : Promise.resolve({ data: [], count: 0 }),
    
    // Seller reviews
    profile.is_seller
      ? supabase
          .from("seller_feedback")
          .select(`
            id,
            rating,
            comment,
            item_as_described,
            shipping_speed,
            communication,
            created_at,
            buyer:profiles!seller_feedback_buyer_id_fkey (
              username,
              display_name,
              avatar_url
            )
          `, { count: "exact" })
          .eq("seller_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [], count: 0 }),
    
    // Buyer reviews (only if has orders)
    supabase
      .from("buyer_feedback")
      .select(`
        id,
        rating,
        comment,
        payment_promptness,
        communication,
        created_at,
        seller:profiles!buyer_feedback_seller_id_fkey (
          username,
          display_name,
          avatar_url
        )
      `, { count: "exact" })
      .eq("buyer_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  const sellerStats = sellerStatsResult.data
  const buyerStats = buyerStatsResult.data

  // Transform social_links from Json to Record<string, string>
  const socialLinks = profile.social_links && typeof profile.social_links === 'object' && !Array.isArray(profile.social_links)
    ? profile.social_links as Record<string, string>
    : null

  // Build public profile object
  const publicProfile: PublicProfile = {
    id: profile.id,
    username: profile.username,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url,
    banner_url: profile.banner_url,
    bio: profile.bio,
    account_type: profile.account_type,
    tier: profile.tier,
    is_seller: profile.is_seller,
    is_verified_business: profile.is_verified_business,
    verified: profile.verified,
    location: profile.location,
    business_name: profile.account_type === "business" ? profile.business_name : null,
    website_url: profile.account_type === "business" ? profile.website_url : null,
    social_links: profile.account_type === "business" ? socialLinks : null,
    // NOTE: Using null fallback instead of new Date() to avoid ISR write storms
    created_at: profile.created_at || null,
    total_sales: sellerStats?.total_sales ?? 0,
    average_rating: sellerStats?.average_rating ?? null,
    total_purchases: buyerStats?.total_orders ?? 0,
    follower_count: sellerStats?.follower_count ?? 0,
  }

  return {
    profile: publicProfile,
    products: (productsResult.data || []) as ProfileProduct[],
    productCount: productsResult.count || 0,
    sellerReviews: (sellerReviewsResult.data || []) as SellerReview[],
    sellerReviewCount: sellerReviewsResult.count || 0,
    buyerReviews: (buyerReviewsResult.data || []) as BuyerReview[],
    buyerReviewCount: buyerReviewsResult.count || 0,
  }
}

/**
 * Get basic profile info for metadata generation.
 * Separate cached function for faster metadata generation.
 */
export async function getProfileMetadata(username: string) {
  'use cache'
  cacheTag(`profile-meta-${username.toLowerCase()}`)
  cacheLife('user')

  const supabase = createStaticClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, account_type, is_seller")
    .ilike("username", username)
    .single()

  if (!profile) return null

  // Fetch seller stats if needed
  let sellerStats: { total_sales: number | null; average_rating: number | null } | null = null
  if (profile.is_seller) {
    const { data: stats } = await supabase
      .from("seller_stats")
      .select("total_sales, average_rating")
      .eq("seller_id", profile.id)
      .single()
    sellerStats = stats
  }

  return {
    profile,
    sellerStats,
  }
}
