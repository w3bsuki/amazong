import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'

// Type for profile with seller fields (seller fields have been merged into profiles)
// Note: Database types may need regeneration to include all new fields
interface ProfileWithSellerFields {
  id: string
  display_name?: string | null
  business_name?: string | null
  username?: string | null
  bio?: string | null
  is_verified_business?: boolean | null
  tier?: string | null
  account_type?: string | null
  created_at: string
  avatar_url?: string | null
  // Fallback fields for compatibility
  full_name?: string | null
}

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
  created_at: string | null
  buyer: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

/**
 * Fetch store info by username or seller ID
 * Note: seller fields are now on profiles table
 * Uses 'use cache' for static caching per Next.js 16 best practices
 */
export async function getStoreInfo(usernameOrId: string): Promise<StoreInfo | null> {
  'use cache'
  cacheTag('stores', `store-${usernameOrId}`)
  cacheLife('products') // Use products cache profile (5 min stale, 5 min revalidate)

  const supabase = createStaticClient()
  if (!supabase) return null

  // Try to find by username first, then by ID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(usernameOrId)
  
  // Select all profile fields - new seller fields may exist on profiles
  let query = supabase
    .from("profiles")
    .select("*")
  
  if (isUUID) {
    query = query.eq("id", usernameOrId)
  } else {
    // Try username field if it exists, otherwise fall through to full_name search
    query = query.or(`username.eq.${usernameOrId},full_name.ilike.${usernameOrId.replace(/-/g, ' ')}`)
  }
  
  const { data: profile, error } = await query.maybeSingle()
  
  if (error || !profile) {
    return null
  }

  return formatStoreInfo(supabase, profile as unknown as ProfileWithSellerFields)
}

async function formatStoreInfo(supabase: ReturnType<typeof createStaticClient>, profile: ProfileWithSellerFields): Promise<StoreInfo | null> {
  if (!supabase) return null
  
  // Fetch product stats
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", profile.id)
  
  // Fetch order item stats (sales)
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

  // Get store name from display_name, business_name, username, or full_name (fallback)
  const storeName = profile.display_name || profile.business_name || profile.username || profile.full_name || 'Unknown Store'
  
  return {
    id: profile.id,
    store_name: storeName,
    store_slug: profile.username || String(storeName).toLowerCase().replace(/\s+/g, '-'),
    description: profile.bio || null,
    verified: Boolean(profile.is_verified_business) || false,
    tier: (profile.tier || 'basic') as StoreInfo['tier'],
    account_type: (profile.account_type || 'personal') as StoreInfo['account_type'],
    created_at: profile.created_at,
    avatar_url: profile.avatar_url || null,
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
 * Cached for improved performance
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
  'use cache'
  cacheTag('products', `store-products-${sellerId}`)
  cacheLife('products')

  const supabase = createStaticClient()
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
 * Cached for improved performance
 */
export async function getSellerFeedback(
  sellerId: string,
  options?: {
    limit?: number
    offset?: number
  }
): Promise<{ feedback: SellerFeedback[]; total: number }> {
  'use cache'
  cacheTag('seller-feedback', `feedback-${sellerId}`)
  cacheLife('products')

  const supabase = createStaticClient()
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
 * Cached for improved performance
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
  stats: {
    total_listings: number | null
    active_listings: number | null
    total_sales: number | null
    average_rating: number | null
    total_reviews: number | null
  } | null
} | null> {
  'use cache'
  cacheTag('store-badges', `badges-${sellerId}`)
  cacheLife('user')

  const supabase = createStaticClient()
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
