"use server"

import { createClient } from "@/lib/supabase/server"

export interface StoreInfo {
  id: string
  store_name: string
  store_slug: string
  description: string | null
  verified: boolean
  tier: "basic" | "premium" | "business"
  created_at: string
  avatar_url: string | null
  total_products: number
  total_sales: number
  average_rating: number
  review_count: number
  positive_feedback_percentage: number
  follower_count: number
  account_type: "personal" | "business"
}

export interface StoreProduct {
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

export interface SellerFeedback {
  id: string
  buyer_id: string
  seller_id: string
  order_id: string | null
  rating: number
  comment: string | null
  created_at: string
  buyer: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

/**
 * Fetch store info by store slug or seller ID
 */
export async function getStoreInfo(storeSlugOrId: string): Promise<StoreInfo | null> {
  const supabase = await createClient()
  if (!supabase) return null

  // Try to find by store_slug first, then by ID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeSlugOrId)
  
  let query = supabase
    .from("sellers")
    .select(`
      id,
      store_name,
      store_slug,
      description,
      verified,
      tier,
      account_type,
      created_at,
      profiles!sellers_id_fkey (
        avatar_url
      )
    `)
  
  if (isUUID) {
    query = query.eq("id", storeSlugOrId)
  } else {
    query = query.eq("store_slug", storeSlugOrId)
  }
  
  const { data: seller, error } = await query.single()
  
  if (error || !seller) {
    // Fallback: try by store_name if slug doesn't exist
    if (!isUUID) {
      const { data: sellerByName } = await supabase
        .from("sellers")
        .select(`
          id,
          store_name,
          store_slug,
          description,
          verified,
          tier,
          account_type,
          created_at,
          profiles!sellers_id_fkey (
            avatar_url
          )
        `)
        .ilike("store_name", storeSlugOrId.replace(/-/g, ' '))
        .single()
      
      if (sellerByName) {
        return formatStoreInfo(supabase, sellerByName)
      }
    }
    return null
  }

  return formatStoreInfo(supabase, seller)
}

async function formatStoreInfo(supabase: Awaited<ReturnType<typeof createClient>>, seller: any): Promise<StoreInfo | null> {
  if (!supabase) return null
  
  // Fetch product stats
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", seller.id)
  
  // Fetch order item stats (sales)
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("quantity")
    .eq("seller_id", seller.id)
  
  const totalSales = orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
  
  // Fetch seller feedback stats
  const { data: feedback } = await supabase
    .from("seller_feedback")
    .select("rating")
    .eq("seller_id", seller.id)
  
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
    .eq("seller_id", seller.id)

  return {
    id: seller.id,
    store_name: seller.store_name,
    store_slug: seller.store_slug || seller.store_name.toLowerCase().replace(/\s+/g, '-'),
    description: seller.description,
    verified: seller.verified || false,
    tier: seller.tier || 'basic',
    account_type: seller.account_type || 'personal',
    created_at: seller.created_at,
    avatar_url: seller.profiles?.avatar_url || null,
    total_products: productCount || 0,
    total_sales: totalSales,
    average_rating: Math.round(averageRating * 10) / 10,
    review_count: reviewCount,
    positive_feedback_percentage: positiveFeedbackPercentage,
    follower_count: followerCount || 0,
  }
}

/**
 * Fetch store products with pagination
 */
export async function getStoreProducts(
  sellerId: string,
  options?: {
    limit?: number
    offset?: number
    orderBy?: 'created_at' | 'price' | 'rating'
    ascending?: boolean
  }
): Promise<{ products: StoreProduct[]; total: number }> {
  const supabase = await createClient()
  if (!supabase) return { products: [], total: 0 }
  
  const {
    limit = 12,
    offset = 0,
    orderBy = 'created_at',
    ascending = false
  } = options || {}
  
  const { data: products, error, count } = await supabase
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
      is_featured
    `, { count: 'exact' })
    .eq("seller_id", sellerId)
    .order(orderBy, { ascending })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error("Error fetching store products:", error)
    return { products: [], total: 0 }
  }
  
  return {
    products: (products || []).map(p => ({
      ...p,
      slug: p.slug || p.id,
      images: p.images || [],
      rating: p.rating || 0,
      review_count: p.review_count || 0,
      is_boosted: p.is_boosted || false,
      is_featured: p.is_featured || false,
    })),
    total: count || 0
  }
}

/**
 * Fetch seller feedback/reviews
 */
export async function getSellerFeedback(
  sellerId: string,
  options?: {
    limit?: number
    offset?: number
  }
): Promise<{ feedback: SellerFeedback[]; total: number }> {
  const supabase = await createClient()
  if (!supabase) return { feedback: [], total: 0 }
  
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
      profiles!seller_feedback_buyer_id_fkey (
        full_name,
        avatar_url
      )
    `, { count: 'exact' })
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error("Error fetching seller feedback:", error)
    return { feedback: [], total: 0 }
  }
  
  return {
    feedback: (feedback || []).map(f => {
      // Supabase returns profiles as array for foreign key relations
      const profilesData = f.profiles as unknown
      const profile = Array.isArray(profilesData) 
        ? (profilesData[0] as { full_name: string | null; avatar_url: string | null } | undefined)
        : (profilesData as { full_name: string | null; avatar_url: string | null } | null)
      return {
        id: f.id,
        buyer_id: f.buyer_id,
        seller_id: f.seller_id,
        order_id: f.order_id,
        rating: f.rating,
        comment: f.comment,
        created_at: f.created_at,
        buyer: profile ? {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        } : null,
      }
    }),
    total: count || 0
  }
}

/**
 * Get store badge data including badges, verification, and trust score
 */
export async function getStoreBadgeData(sellerId: string): Promise<{
  badges: Array<{
    code: string
    name: string
    name_bg: string | null
    icon: string | null
    color: string | null
    description: string | null
    description_bg: string | null
    tier: number
    category: string
  }>
  verification: {
    email_verified: boolean
    phone_verified: boolean
    id_verified: boolean
    trust_score: number
  } | null
  businessVerification: {
    vat_verified: boolean
    registration_verified: boolean
    verification_level: number
  } | null
  stats: {
    total_listings: number
    active_listings: number
    total_sales: number
    average_rating: number
    total_reviews: number
  } | null
} | null> {
  const supabase = await createClient()
  if (!supabase) return null

  // Fetch badges with their definitions
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select(`
      badge_id,
      badge_definitions (
        code,
        name,
        name_bg,
        icon,
        color,
        description,
        description_bg,
        tier,
        category
      )
    `)
    .eq("user_id", sellerId)
    .is("revoked_at", null)

  // Fetch verification
  const { data: verification } = await supabase
    .from("user_verification")
    .select("email_verified, phone_verified, id_verified, trust_score")
    .eq("user_id", sellerId)
    .single()

  // Fetch business verification
  const { data: businessVerification } = await supabase
    .from("business_verification")
    .select("vat_verified, registration_verified, verification_level")
    .eq("seller_id", sellerId)
    .single()

  // Fetch seller stats
  const { data: stats } = await supabase
    .from("seller_stats")
    .select("total_listings, active_listings, total_sales, average_rating, total_reviews")
    .eq("seller_id", sellerId)
    .single()

  // Process badges - extract from join and flatten
  // badge_definitions may come back as array or single object depending on Supabase client version
  type BadgeDef = {
    code: string
    name: string
    name_bg: string | null
    icon: string | null
    color: string | null
    description: string | null
    description_bg: string | null
    tier: number
    category: string
  }
  
  const processedBadges: BadgeDef[] = []
  
  for (const ub of userBadges || []) {
    const badgeDef = ub.badge_definitions
    if (!badgeDef) continue
    
    // Handle both array and single object cases
    const def = Array.isArray(badgeDef) ? badgeDef[0] : badgeDef
    if (def && typeof def === "object" && "code" in def) {
      processedBadges.push({
        code: String(def.code || ""),
        name: String(def.name || ""),
        name_bg: def.name_bg ? String(def.name_bg) : null,
        icon: def.icon ? String(def.icon) : null,
        color: def.color ? String(def.color) : null,
        description: def.description ? String(def.description) : null,
        description_bg: def.description_bg ? String(def.description_bg) : null,
        tier: typeof def.tier === "number" ? def.tier : 0,
        category: String(def.category || ""),
      })
    }
  }
  
  // Sort by tier descending (higher tier = more prestigious)
  processedBadges.sort((a, b) => (b.tier ?? 0) - (a.tier ?? 0))

  return {
    badges: processedBadges,
    verification,
    businessVerification,
    stats,
  }
}
