import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'

// Public profile info (visible to everyone on /u/[username])
export interface PublicProfile {
  id: string
  username: string
  display_name: string | null
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  location: string | null
  website_url: string | null
  social_links: Record<string, string> | null
  account_type: "personal" | "business"
  is_seller: boolean
  verified: boolean
  tier: string
  business_name: string | null
  is_verified_business: boolean
  created_at: string
  // Stats
  total_products: number
  total_sales: number
  average_rating: number
  review_count: number
  positive_feedback_percentage: number
  follower_count: number
}

export interface UserProduct {
  id: string
  title: string
  slug: string
  price: number
  list_price: number | null
  images: string[]
  rating: number
  review_count: number
  created_at: string
  is_boosted: boolean
  is_featured: boolean
}

export interface SellerReview {
  id: string
  buyer_id: string
  seller_id: string
  order_id: string | null
  rating: number
  comment: string | null
  created_at: string | null
  buyer: {
    full_name: string | null
    avatar_url: string | null
    username: string | null
  } | null
}

export interface BuyerReview {
  id: string
  seller_id: string
  buyer_id: string
  order_id: string | null
  rating: number
  comment: string | null
  created_at: string | null
  seller: {
    full_name: string | null
    avatar_url: string | null
    username: string | null
  } | null
}

/**
 * Fetch public profile by username or user ID
 * Uses 'use cache' for static caching per Next.js 16 best practices
 */
export async function getPublicProfile(usernameOrId: string): Promise<PublicProfile | null> {
  'use cache'
  cacheTag('profiles', `profile-${usernameOrId}`)
  cacheLife('user')

  const supabase = createStaticClient()
  if (!supabase) return null

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(usernameOrId)
  
  let query = supabase
    .from("profiles")
    .select(`
      id,
      username,
      display_name,
      full_name,
      bio,
      avatar_url,
      banner_url,
      location,
      website_url,
      social_links,
      account_type,
      is_seller,
      verified,
      tier,
      business_name,
      is_verified_business,
      created_at
    `)
  
  if (isUUID) {
    query = query.eq("id", usernameOrId)
  } else {
    query = query.eq("username", usernameOrId.toLowerCase())
  }
  
  const { data: profile, error } = await query.single()
  
  if (error || !profile) {
    return null
  }

  // Fetch product stats
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", profile.id)
    .eq("status", "active")
  
  // Fetch sales count
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("quantity")
    .eq("seller_id", profile.id)
  
  const totalSales = orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
  
  // Fetch seller feedback stats
  const { data: feedback } = await supabase
    .from("seller_feedback")
    .select("rating")
    .eq("seller_id", profile.id)
  
  let averageRating = 0
  let reviewCount = 0
  let positiveCount = 0
  
  if (feedback && feedback.length > 0) {
    reviewCount = feedback.length
    averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / reviewCount
    positiveCount = feedback.filter(f => f.rating >= 4).length
  }
  
  const positiveFeedbackPercentage = reviewCount > 0 
    ? Math.round((positiveCount / reviewCount) * 100) 
    : 100

  // Fetch follower count
  const { count: followerCount } = await supabase
    .from("store_followers")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", profile.id)

  return {
    id: profile.id,
    username: profile.username || profile.id,
    display_name: profile.display_name,
    full_name: profile.full_name,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    banner_url: profile.banner_url,
    location: profile.location,
    website_url: profile.website_url,
    social_links: profile.social_links as Record<string, string> | null,
    account_type: (profile.account_type || "personal") as "personal" | "business",
    is_seller: profile.is_seller || false,
    verified: profile.verified || false,
    tier: profile.tier || "free",
    business_name: profile.business_name,
    is_verified_business: profile.is_verified_business || false,
    created_at: profile.created_at,
    total_products: productCount || 0,
    total_sales: totalSales,
    average_rating: Math.round(averageRating * 10) / 10,
    review_count: reviewCount,
    positive_feedback_percentage: positiveFeedbackPercentage,
    follower_count: followerCount || 0,
  }
}

/**
 * Fetch user's products (listings)
 * Cached for improved performance
 */
export async function getUserProducts(
  userId: string,
  options?: {
    limit?: number
    offset?: number
    orderBy?: "created_at" | "price" | "rating"
    ascending?: boolean
    status?: "active" | "draft" | "all"
  }
): Promise<{ products: UserProduct[]; total: number }> {
  'use cache'
  cacheTag('products', `user-products-${userId}`)
  cacheLife('products')

  const supabase = createStaticClient()
  if (!supabase) return { products: [], total: 0 }
  
  const {
    limit = 12,
    offset = 0,
    orderBy = "created_at",
    ascending = false,
    status = "active"
  } = options || {}
  
  let query = supabase
    .from("products")
    .select(`
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
      is_featured,
      status
    `, { count: "exact" })
    .eq("seller_id", userId)
  
  if (status !== "all") {
    query = query.eq("status", status)
  }
  
  const { data: products, error, count } = await query
    .order(orderBy, { ascending })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error("Error fetching user products:", error)
    return { products: [], total: 0 }
  }
  
  return {
    products: (products || []).map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug || p.id,
      price: p.price,
      list_price: p.list_price,
      images: p.images || [],
      rating: p.rating || 0,
      review_count: p.review_count || 0,
      created_at: p.created_at,
      is_boosted: p.is_boosted || false,
      is_featured: p.is_featured || false,
    })),
    total: count || 0
  }
}

/**
 * Fetch reviews about a seller (from buyers)
 * Cached for improved performance
 */
export async function getSellerReviews(
  sellerId: string,
  options?: {
    limit?: number
    offset?: number
  }
): Promise<{ reviews: SellerReview[]; total: number }> {
  'use cache'
  cacheTag('seller-reviews', `reviews-${sellerId}`)
  cacheLife('products')

  const supabase = createStaticClient()
  if (!supabase) return { reviews: [], total: 0 }
  
  const { limit = 10, offset = 0 } = options || {}
  
  const { data: feedback, error, count } = await supabase
    .from("seller_feedback")
    .select(`
      id,
      buyer_id,
      seller_id,
      order_id,
      rating,
      comment,
      created_at,
      buyer:profiles!seller_feedback_buyer_id_fkey (
        full_name,
        avatar_url,
        username
      )
    `, { count: "exact" })
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error("Error fetching seller reviews:", error)
    return { reviews: [], total: 0 }
  }
  
  return {
    reviews: (feedback || []).map(f => {
      const buyerData = f.buyer as unknown
      const buyer = Array.isArray(buyerData) 
        ? (buyerData[0] as { full_name: string | null; avatar_url: string | null; username: string | null } | undefined)
        : (buyerData as { full_name: string | null; avatar_url: string | null; username: string | null } | null)
      return {
        id: f.id,
        buyer_id: f.buyer_id,
        seller_id: f.seller_id,
        order_id: f.order_id,
        rating: f.rating,
        comment: f.comment,
        created_at: f.created_at,
        buyer: buyer ? {
          full_name: buyer.full_name,
          avatar_url: buyer.avatar_url,
          username: buyer.username,
        } : null,
      }
    }),
    total: count || 0
  }
}

/**
 * Fetch reviews about a buyer (from sellers)
 * Cached for improved performance
 */
export async function getBuyerReviews(
  buyerId: string,
  options?: {
    limit?: number
    offset?: number
  }
): Promise<{ reviews: BuyerReview[]; total: number }> {
  'use cache'
  cacheTag('buyer-reviews', `reviews-${buyerId}`)
  cacheLife('products')

  const supabase = createStaticClient()
  if (!supabase) return { reviews: [], total: 0 }
  
  const { limit = 10, offset = 0 } = options || {}
  
  const { data: feedback, error, count } = await supabase
    .from("buyer_feedback")
    .select(`
      id,
      seller_id,
      buyer_id,
      order_id,
      rating,
      comment,
      created_at,
      seller:profiles!buyer_feedback_seller_id_fkey (
        full_name,
        avatar_url,
        username
      )
    `, { count: "exact" })
    .eq("buyer_id", buyerId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error("Error fetching buyer reviews:", error)
    return { reviews: [], total: 0 }
  }
  
  return {
    reviews: (feedback || []).map(f => {
      const sellerData = f.seller as unknown
      const seller = Array.isArray(sellerData) 
        ? (sellerData[0] as { full_name: string | null; avatar_url: string | null; username: string | null } | undefined)
        : (sellerData as { full_name: string | null; avatar_url: string | null; username: string | null } | null)
      return {
        id: f.id,
        seller_id: f.seller_id,
        buyer_id: f.buyer_id,
        order_id: f.order_id,
        rating: f.rating,
        comment: f.comment,
        created_at: f.created_at,
        seller: seller ? {
          full_name: seller.full_name,
          avatar_url: seller.avatar_url,
          username: seller.username,
        } : null,
      }
    }),
    total: count || 0
  }
}

/**
 * Get profile badge data
 * Cached for improved performance
 */
export async function getProfileBadgeData(userId: string): Promise<{
  badges: Array<{
    code: string
    name: string
    name_bg: string | null
    icon: string | null
    color: string | null
    description: string | null
    tier: number
    category: string
  }>
  verification: {
    email_verified: boolean | null
    phone_verified: boolean | null
    id_verified: boolean | null
    trust_score: number | null
  } | null
  businessVerification: {
    vat_verified: boolean | null
    registration_verified: boolean | null
    verification_level: number | null
  } | null
  sellerStats: {
    total_listings: number | null
    active_listings: number | null
    total_sales: number | null
    average_rating: number | null
    total_reviews: number | null
  } | null
} | null> {
  'use cache'
  cacheTag('profile-badges', `badges-${userId}`)
  cacheLife('user')

  const supabase = createStaticClient()
  if (!supabase) return null

  // Fetch badges
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select(`
      badge_definitions (
        code,
        name,
        name_bg,
        icon,
        color,
        description,
        tier,
        category
      )
    `)
    .eq("user_id", userId)
    .is("revoked_at", null)

  // Fetch verification
  const { data: verification } = await supabase
    .from("user_verification")
    .select("email_verified, phone_verified, id_verified, trust_score")
    .eq("user_id", userId)
    .single()

  // Fetch business verification
  const { data: businessVerification } = await supabase
    .from("business_verification")
    .select("vat_verified, registration_verified, verification_level")
    .eq("seller_id", userId)
    .single()

  // Fetch seller stats
  const { data: sellerStats } = await supabase
    .from("seller_stats")
    .select("total_listings, active_listings, total_sales, average_rating, total_reviews")
    .eq("seller_id", userId)
    .single()

  // Process badges
  type BadgeDef = {
    code: string
    name: string
    name_bg: string | null
    icon: string | null
    color: string | null
    description: string | null
    tier: number
    category: string
  }
  
  const processedBadges: BadgeDef[] = []
  
  for (const ub of userBadges || []) {
    const badgeDef = ub.badge_definitions
    if (!badgeDef) continue
    
    const def = Array.isArray(badgeDef) ? badgeDef[0] : badgeDef
    if (def && typeof def === "object" && "code" in def) {
      processedBadges.push({
        code: String(def.code || ""),
        name: String(def.name || ""),
        name_bg: def.name_bg ? String(def.name_bg) : null,
        icon: def.icon ? String(def.icon) : null,
        color: def.color ? String(def.color) : null,
        description: def.description ? String(def.description) : null,
        tier: typeof def.tier === "number" ? def.tier : 0,
        category: String(def.category || ""),
      })
    }
  }
  
  processedBadges.sort((a, b) => b.tier - a.tier)

  return {
    badges: processedBadges,
    verification,
    businessVerification,
    sellerStats,
  }
}

/**
 * Check if a user is following another user
 * This requires the current user's auth context - NOT cached
 * Must be called from a component that can access cookies
 */
export async function isFollowing(followerId: string, targetId: string): Promise<boolean> {
  // Note: This function requires auth context, importing createClient dynamically
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return false

  const { data } = await supabase
    .from("store_followers")
    .select("id")
    .eq("follower_id", followerId)
    .eq("seller_id", targetId)
    .single()

  return !!data
}

/**
 * Follow/unfollow a user
 * Server Action - requires auth context
 */
export async function toggleFollow(targetId: string): Promise<{ following: boolean; error?: string }> {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  if (!supabase) return { following: false, error: "Not authenticated" }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { following: false, error: "Not authenticated" }

  // Check current state
  const { data: existing } = await supabase
    .from("store_followers")
    .select("id")
    .eq("follower_id", user.id)
    .eq("seller_id", targetId)
    .single()

  if (existing) {
    // Unfollow
    await supabase
      .from("store_followers")
      .delete()
      .eq("id", existing.id)
    return { following: false }
  } else {
    // Follow
    const { error } = await supabase
      .from("store_followers")
      .insert({ follower_id: user.id, seller_id: targetId })
    
    if (error) return { following: false, error: error.message }
    return { following: true }
  }
}

/**
 * List all members (for /members directory)
 * Cached for improved performance
 */
export async function listMembers(options?: {
  limit?: number
  offset?: number
  filter?: "all" | "sellers" | "buyers" | "business"
  sortBy?: "active" | "rating" | "sales" | "purchases" | "newest"
  search?: string
}): Promise<{ members: PublicProfile[]; total: number }> {
  'use cache'
  cacheTag('members')
  cacheLife('products')

  const supabase = createStaticClient()
  if (!supabase) return { members: [], total: 0 }

  const {
    limit = 20,
    offset = 0,
    filter = "all",
    sortBy = "active",
    search
  } = options || {}

  let query = supabase
    .from("profiles")
    .select(`
      id,
      username,
      display_name,
      full_name,
      bio,
      avatar_url,
      banner_url,
      location,
      website_url,
      social_links,
      account_type,
      is_seller,
      verified,
      tier,
      business_name,
      is_verified_business,
      created_at
    `, { count: "exact" })
    .not("username", "is", null)

  // Apply filters
  if (filter === "sellers") {
    query = query.eq("is_seller", true)
  } else if (filter === "business") {
    query = query.eq("account_type", "business")
  }

  // Apply search
  if (search) {
    query = query.or(`username.ilike.%${search}%,display_name.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  // Apply sorting
  if (sortBy === "newest") {
    query = query.order("created_at", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data: profiles, error, count } = await query
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error listing members:", error)
    return { members: [], total: 0 }
  }

  // For now return basic profile info - stats would require additional queries
  return {
    members: (profiles || []).map(p => ({
      id: p.id,
      username: p.username || p.id,
      display_name: p.display_name,
      full_name: p.full_name,
      bio: p.bio,
      avatar_url: p.avatar_url,
      banner_url: p.banner_url,
      location: p.location,
      website_url: p.website_url,
      social_links: p.social_links as Record<string, string> | null,
      account_type: (p.account_type || "personal") as "personal" | "business",
      is_seller: p.is_seller || false,
      verified: p.verified || false,
      tier: p.tier || "free",
      business_name: p.business_name,
      is_verified_business: p.is_verified_business || false,
      created_at: p.created_at,
      // Stats - would need separate queries, returning 0 for now
      total_products: 0,
      total_sales: 0,
      average_rating: 0,
      review_count: 0,
      positive_feedback_percentage: 100,
      follower_count: 0,
    })),
    total: count || 0
  }
}
