import 'server-only'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { connection } from "next/server"
import { getLocale } from "next-intl/server"

export type AccountType = 'personal' | 'business'

// Internal types for order management - must match OrdersTable component expectations
interface UserRecord {
  id: string
  email: string
  full_name: string | null
}

interface OrderRecord {
  id: string
  status: string | null
  created_at: string
  shipping_address?: Record<string, unknown> | null
  user_id: string
  user?: UserRecord | null
}

interface ProductRecord {
  id: string
  title: string
  images: string[] | null
  sku: string | null
}

// Tiers that have dashboard access (paid business plans)
// starter = Business Starter (50лв), professional = Business Pro (100лв), enterprise = Business Enterprise (200лв)
export const DASHBOARD_ALLOWED_TIERS = ['starter', 'professional', 'enterprise'] as const
export type DashboardAllowedTier = typeof DASHBOARD_ALLOWED_TIERS[number]

// Subscription status for active plans
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending'

export interface BusinessSubscription {
  id: string
  seller_id: string
  plan_type: string
  status: SubscriptionStatus
  expires_at: string
  plan_name: string
  plan_tier: string
  account_type: AccountType
  price_monthly: number
  features: string[]
}

export interface BusinessSeller {
  id: string
  email: string
  store_name: string
  account_type: AccountType
  is_verified_business: boolean
  business_name: string | null
  tier: string
  avatar_url: string | null
}

export interface BusinessSellerWithSubscription extends BusinessSeller {
  subscription: BusinessSubscription | null
  hasDashboardAccess: boolean
}

type VariantSummary = {
  variantCount: number
  variantStock: number
}

async function getVariantSummaryByProductId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productIds: string[]
): Promise<Map<string, VariantSummary>> {
  if (productIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from('product_variants')
    .select('product_id, stock')
    .in('product_id', productIds)

  if (error || !data) return new Map()

  const summary = new Map<string, VariantSummary>()
  for (const row of data) {
    const productId = row.product_id as string
    const stock = Number(row.stock ?? 0)

    const existing = summary.get(productId)
    if (existing) {
      existing.variantCount += 1
      existing.variantStock += stock
    } else {
      summary.set(productId, { variantCount: 1, variantStock: stock })
    }
  }
  return summary
}

/**
 * Verifies the current user is authenticated and has a business seller account.
 * MUST be called in server components only.
 * 
 * @param redirectTo - Where to redirect non-business users (default: /account)
 * @returns The business seller if verified
 * @throws Redirects to login or account if not authorized
 */
export async function requireBusinessSeller(redirectTo: string = "/account"): Promise<BusinessSeller> {
  const locale = await getLocale()
  const supabase = await createClient()
  
  // Check if user is authenticated via Supabase auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    // User not authenticated - redirect to login
    return redirect({ href: "/auth/login", locale })
  }
  
  const userId = user.id
  const userEmail = user.email

  // Check profile for account type and seller status
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      id, 
      username,
      display_name,
      account_type, 
      is_verified_business, 
      business_name, 
      tier,
      avatar_url,
      is_seller
    `)
    .eq('id', userId)
    .single()
  
  if (profileError || !profile) {
    // No profile - redirect to login
    return redirect({ href: "/auth/login", locale })
  }
  
  if (profile.account_type !== 'business') {
    // Personal account - redirect to regular account
    return redirect({ href: redirectTo, locale })
  }

  // Must be an activated seller (completed seller onboarding) before accessing business seller routes.
  // This prevents non-sellers who selected a business intent at signup from entering dashboard flows.
  if (!profile.is_seller) {
    return redirect({ href: "/sell", locale })
  }
  
  return {
    id: profile.id,
    email: userEmail || '',
    store_name: profile.display_name || profile.business_name || profile.username || 'Business',
    account_type: profile.account_type as AccountType,
    is_verified_business: profile.is_verified_business ?? false,
    business_name: profile.business_name,
    tier: profile.tier ?? 'free',
    avatar_url: profile.avatar_url ?? null,
  }
}

/**
 * Gets the active subscription for a seller.
 * Returns null if no active subscription exists.
 */
export async function getActiveSubscription(sellerId: string): Promise<BusinessSubscription | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== sellerId) return null
  
  // First get the subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select(`
      id,
      seller_id,
      plan_type,
      status,
      expires_at
    `)
    .eq('seller_id', sellerId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (!subscription) return null
  
  // Then get the matching plan details separately (no FK relation exists)
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('name, tier, account_type, price_monthly, features')
    .eq('tier', subscription.plan_type)
    .eq('account_type', 'business')
    .single()
  
  return {
    id: subscription.id,
    seller_id: subscription.seller_id,
    plan_type: subscription.plan_type,
    status: subscription.status as SubscriptionStatus,
    expires_at: subscription.expires_at,
    plan_name: plan?.name || 'Unknown',
    plan_tier: plan?.tier || subscription.plan_type,
    account_type: (plan?.account_type || 'business') as AccountType,
    price_monthly: plan?.price_monthly || 0,
    features: (plan?.features as string[]) || [],
  }
}

/**
 * Checks if a seller has dashboard access (paid business subscription).
 * Dashboard access requires:
 * 1. Business account type
 * 2. Active subscription with starter, professional or enterprise tier
 */
export function hasDashboardAccess(tier: string, subscription: BusinessSubscription | null): boolean {
  // Free tier business accounts don't get dashboard access
  if (tier === 'free') return false
  
  // Must have an allowed tier (starter, professional, enterprise)
  if (!DASHBOARD_ALLOWED_TIERS.includes(tier as DashboardAllowedTier)) {
    return false
  }
  
  // Must have active subscription 
  // (getActiveSubscription already filters for status='active' and expires_at > now)
  if (!subscription) {
    return false
  }
  
  return true
}

/**
 * Verifies the current user has business account AND active paid subscription.
 * Used for dashboard routes that require subscription.
 * 
 * @param upgradeRedirect - Where to redirect users without subscription (default: /dashboard/upgrade)
 * @returns The business seller with subscription info
 * @throws Redirects to upgrade page if no active paid subscription
 */
export async function requireDashboardAccess(
  upgradeRedirect: string = "/dashboard/upgrade"
): Promise<BusinessSellerWithSubscription> {
  await connection()
  const locale = await getLocale()
  
  // First verify they have a business account
  const seller = await requireBusinessSeller("/account")
  
  // Then check their subscription status
  const subscription = await getActiveSubscription(seller.id)
  const hasAccess = hasDashboardAccess(seller.tier, subscription)
  
  if (!hasAccess) {
    // No paid subscription - redirect to upgrade page
    redirect({ href: upgradeRedirect, locale })
  }
  
  return {
    ...seller,
    subscription,
    hasDashboardAccess: true,
  }
}

/**
 * Gets business seller info with subscription status (no redirect).
 * Useful for checking subscription status without forcing redirect.
 */
async function getBusinessSellerWithSubscription(
  sellerId: string
): Promise<BusinessSellerWithSubscription | null> {
  await connection()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== sellerId) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      id, 
      username,
      display_name,
      account_type, 
      is_verified_business, 
      business_name, 
      tier,
      avatar_url,
      email
    `)
    .eq('id', sellerId)
    .single()
  
  if (!profile || profile.account_type !== 'business') {
    return null
  }

  const subscription = await getActiveSubscription(sellerId)
  const hasAccess = hasDashboardAccess(profile.tier ?? 'free', subscription)

  return {
    id: profile.id,
    email: profile.email || '',
    store_name: profile.display_name || profile.business_name || profile.username || 'Business',
    account_type: profile.account_type as AccountType,
    is_verified_business: profile.is_verified_business ?? false,
    business_name: profile.business_name,
    tier: profile.tier ?? 'free',
    avatar_url: profile.avatar_url ?? null,
    subscription,
    hasDashboardAccess: hasAccess,
  }
}

/**
 * Checks if current user has a business account without redirecting.
 * Useful for conditional UI rendering.
 */
async function isBusinessAccount(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .single()
    
    return profile?.account_type === 'business'
  } catch {
    return false
  }
}

/**
 * Gets the current user's seller info including account type.
 * Returns null if user is not a seller.
 */
async function getSellerInfo() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        id, 
        username,
        display_name,
        account_type, 
        is_verified_business, 
        business_name, 
        tier,
        avatar_url,
        is_seller
      `)
      .eq('id', user.id)
      .single()
    
    if (!profile) return null
    
    return {
      id: profile.id,
      store_name: profile.display_name || profile.business_name || profile.username || 'Seller',
      account_type: profile.account_type,
      is_verified_business: profile.is_verified_business,
      business_name: profile.business_name,
      tier: profile.tier,
      avatar_url: profile.avatar_url,
      is_seller: profile.is_seller,
    }
  } catch {
    return null
  }
}

/**
 * Gets business dashboard statistics for a seller
 * Uses the seller's ID to fetch their specific data
 */
export async function getBusinessDashboardStats(sellerId: string) {
  // Mark as dynamic and satisfy Next.js current-time access rules.
  await connection()
  
  const supabase = await createClient()
  
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  
  // Total products
  const productsResult = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('seller_id', sellerId)

  // Total orders (as seller) - last 30 days
  const ordersResult = await supabase
    .from('order_items')
    .select('id, quantity, price_at_purchase', { count: 'exact' })
    .eq('seller_id', sellerId)

  // Recent orders (last 7 days) - no joins
  const { data: recentOrderItems } = await supabase
    .from('order_items')
    .select('id, quantity, price_at_purchase, order_id, product_id')
    .eq('seller_id', sellerId)
    .limit(10)

  // Fetch related products and orders for recent orders
  const productIds = recentOrderItems?.map(i => i.product_id).filter(Boolean) || []
  const orderIds = recentOrderItems?.map(i => i.order_id).filter(Boolean) || []
  const [{ data: products = [] }, { data: orders = [] }] = await Promise.all([
    productIds.length ? supabase.from('products').select('id, title, images').in('id', productIds) : Promise.resolve({ data: [] }),
    orderIds.length ? supabase.from('orders').select('id, created_at').in('id', orderIds) : Promise.resolve({ data: [] })
  ])
  const productsMap = new Map((products || []).map(p => [p.id, p]))
  const ordersMap = new Map((orders || []).map(o => [o.id, o]))
  const recentOrders = (recentOrderItems || []).map(item => ({
    ...item,
    product: productsMap.get(item.product_id) || null,
    order: ordersMap.get(item.order_id) || null,
  }))

  // Recent products (last 7 days)
  const recentProductsResult = await supabase
    .from('products')
    .select('id, title, price, created_at, images, status')
    .eq('seller_id', sellerId)
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: false })
    .limit(10)

  // Seller stats (rating, reviews, sales)
  const sellerStatsResult = await supabase
    .from('seller_stats')
    .select('average_rating, total_reviews, total_sales')
    .eq('seller_id', sellerId)
    .single()

  // Products count for views approximation
  const viewsResult = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('seller_id', sellerId)
  
  // Calculate revenue from orders
  const revenue = ordersResult.data?.reduce((sum, item) => 
    sum + (Number((item as { price_at_purchase: number }).price_at_purchase) * (item as { quantity: number }).quantity), 0) || 0
  
  // Calculate total views (approximation - views column doesn't exist yet)
  const totalViews = (viewsResult.count || 0) * 10

  const liveActivity = {
    currentVisitors: 0,
    recentViews: Math.floor(totalViews * 0.01),
    cartAdds: 0,
  }
  
  return {
    totals: {
      products: productsResult.count || 0,
      orders: ordersResult.count || 0,
      revenue,
      views: totalViews,
      rating: Number(sellerStatsResult.data?.average_rating) || 0,
      totalReviews: sellerStatsResult.data?.total_reviews || 0,
      totalSales: sellerStatsResult.data?.total_sales || 0,
    },
    recent: {
      orders: recentOrders,
      products: recentProductsResult.data || [],
    },
    liveActivity,
  }
}

/**
 * Gets products for the business dashboard with pagination and filters
 */
export async function getBusinessProducts(
  sellerId: string,
  options: {
    page?: number
    limit?: number
    status?: string
    search?: string
    category?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}
) {
  await connection()
  
  const supabase = await createClient()
  
  const {
    page = 1,
    limit = 50,
    status,
    search,
    category,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options
  
  let query = supabase
    .from('products')
    .select(`
      id,
      title,
      price,
      list_price,
      cost_price,
      sku,
      barcode,
      stock,
      track_inventory,
      status,
      weight,
      weight_unit,
      condition,
      images,
      rating,
      review_count,
      created_at,
      updated_at,
      category_id
    `, { count: 'exact' })
    .eq('seller_id', sellerId)
  
  // Apply filters
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,sku.ilike.%${search}%`)
  }
  
  if (category) {
    query = query.eq('category_id', category)
  }
  
  // Apply sorting and pagination
  query = query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range((page - 1) * limit, page * limit - 1)
  
  const { data, count, error } = await query

  const productIds = (data || []).map((p) => p.id)
  const variantsSummary = await getVariantSummaryByProductId(supabase, productIds)

  // Fetch categories for products
  const categoryIds = (data || []).map(p => p.category_id).filter((id): id is string => id !== null)
  let categories: { id: string; name: string; slug: string }[] = []
  if (categoryIds.length) {
    const { data: cats } = await supabase.from('categories').select('id, name, slug').in('id', categoryIds)
    categories = cats || []
  }
  const categoriesMap = new Map(categories.map(c => [c.id, c]))
  const productsWithCategories = (data || []).map(p => ({
    ...p,
    stock: (() => {
      const summary = variantsSummary.get(p.id)
      return summary && summary.variantStock > 0 ? summary.variantStock : p.stock
    })(),
    variant_count: variantsSummary.get(p.id)?.variantCount ?? 0,
    category: p.category_id ? categoriesMap.get(p.category_id) ?? null : null,
  }))

  return {
    products: productsWithCategories,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
    error,
  }
}

/**
 * Gets orders for the business dashboard
 */
export async function getBusinessOrders(
  sellerId: string,
  options: {
    page?: number
    limit?: number
    status?: string
    search?: string
    dateFrom?: string
    dateTo?: string
  } = {}
) {
  await connection()
  
  const supabase = await createClient()
  
  const {
    page = 1,
    limit = 50,
    // status,
    // search,
    // dateFrom,
    // dateTo,
  } = options
  
  let query = supabase
    .from('order_items')
    .select('id, quantity, price_at_purchase, order_id, product_id, seller_id', { count: 'exact' })
    .eq('seller_id', sellerId)
  
  // Apply filters (only on order_items fields)
  // (If you want to filter by order status, do it after fetching orders below)
  // (If you want to filter by product title, do it after fetching products below)

  // Apply sorting and pagination
  query = query
    .range((page - 1) * limit, page * limit - 1)

  const { data, count, error } = await query

  // Fetch related orders and products
  const orderIds = Array.from(new Set((data || []).map((i) => i.order_id).filter(Boolean)))
  const productIds = Array.from(new Set((data || []).map((i) => i.product_id).filter(Boolean)))
  let orders: OrderRecord[] = []
  let products: ProductRecord[] = []
  if (orderIds.length) {
    const { data: o } = await supabase.from('orders').select('id, status, created_at, user_id').in('id', orderIds)
    orders = (o || []) as OrderRecord[]
  }
  if (productIds.length) {
    const { data: p } = await supabase.from('products').select('id, title, images, sku').in('id', productIds)
    products = (p || []) as ProductRecord[]
  }
  // Fetch users for orders
  const userIds = Array.from(new Set((orders || []).map((o) => o.user_id).filter(Boolean)))
  let users: UserRecord[] = []
  if (userIds.length) {
    const { data: u } = await supabase.from('profiles').select('id, email, full_name').in('id', userIds)
    users = (u || []) as UserRecord[]
  }
  const ordersMap = new Map(orders.map(o => [o.id, o]))
  const productsMap = new Map(products.map(p => [p.id, p]))
  const usersMap = new Map(users.map(u => [u.id, u]))
  // Compose final orders array - include user inside order object for component compatibility
  const ordersWithDetails = (data || []).map(item => {
    const orderBase = ordersMap.get(item.order_id)
    const product = productsMap.get(item.product_id) || null
    const user = orderBase ? usersMap.get(orderBase.user_id) || null : null
    // Nest user inside order for component compatibility
    const order = orderBase ? { ...orderBase, shipping_address: null, user } : null
    return {
      ...item,
      order,
      product,
      user,
    }
  })

  return {
    orders: ordersWithDetails,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
    error,
  }
}

/**
 * Gets inventory data for stock management
 */
export async function getBusinessInventory(
  sellerId: string,
  options: {
    page?: number
    limit?: number
    stockLevel?: 'all' | 'low' | 'out' | 'in'
  } = {}
) {
  await connection()
  
  const supabase = await createClient()
  
  const { page = 1, limit = 50, stockLevel = 'all' } = options
  
  let query = supabase
    .from('products')
    .select(`
      id,
      title,
      sku,
      stock,
      images,
      price,
      status
    `, { count: 'exact' })
    .eq('seller_id', sellerId)
  
  // Apply stock level filter
  if (stockLevel === 'low') {
    query = query.gt('stock', 0).lte('stock', 10)
  } else if (stockLevel === 'out') {
    query = query.eq('stock', 0)
  } else if (stockLevel === 'in') {
    query = query.gt('stock', 10)
  }
  
  query = query
    .order('stock', { ascending: true })
    .range((page - 1) * limit, page * limit - 1)
  
  const { data, count, error } = await query

  const productIds = (data || []).map((p) => p.id)
  const variantsSummary = await getVariantSummaryByProductId(supabase, productIds)

  const products = (data || []).map((p) => {
    const summary = variantsSummary.get(p.id)
    const totalStock = summary && summary.variantStock > 0 ? summary.variantStock : p.stock
    return {
      ...p,
      stock: totalStock,
      variant_count: summary?.variantCount ?? 0,
    }
  })
  
  // Get stock summary
  const { data: stockBaseRows } = await supabase
    .from('products')
    .select('id, stock')
    .eq('seller_id', sellerId)

  const baseProductIds = (stockBaseRows || []).map((p) => p.id)
  const allVariantsSummary = await getVariantSummaryByProductId(supabase, baseProductIds)

  const computedStocks = (stockBaseRows || []).map((p) => {
    const summary = allVariantsSummary.get(p.id)
    return summary && summary.variantStock > 0 ? summary.variantStock : (p.stock || 0)
  })

  const totalStock = computedStocks.reduce((sum, s) => sum + s, 0)
  const lowStockCount = computedStocks.filter((s) => s > 0 && s <= 10).length
  const outOfStockCount = computedStocks.filter((s) => s === 0).length
  
  return {
    products,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
    summary: {
      totalStock,
      lowStockCount,
      outOfStockCount,
      totalProducts: stockBaseRows?.length || 0,
    },
    error,
  }
}

/**
 * Gets counts for pending tasks shown on dashboard
 */
export async function getPendingTasksCount(sellerId: string) {
  await connection()
  
  const supabase = await createClient()
  
  // Get date 7 days ago for "recent" reviews
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const [unfulfilledResult, lowStockResult, recentReviewsResult] = await Promise.all([
    // Count unfulfilled orders (pending status)
    supabase
      .from('order_items')
      .select('id', { count: 'exact', head: true })
      .eq('seller_id', sellerId)
      .in('order.status', ['pending', 'paid']),
    
    // Count low stock products
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('seller_id', sellerId)
      .gt('stock', 0)
      .lte('stock', 10),
    
    // Count recent reviews on seller's products (last 7 days)
    supabase
      .from('reviews')
      .select('id, products!inner(seller_id)', { count: 'exact', head: true })
      .eq('products.seller_id', sellerId)
      .gte('created_at', sevenDaysAgo.toISOString()),
  ])
  
  return {
    unfulfilled: unfulfilledResult.count || 0,
    lowStock: lowStockResult.count || 0,
    recentReviews: recentReviewsResult.count || 0,
  }
}

/**
 * Gets setup progress for the onboarding checklist
 * Returns which setup steps have been completed
 */
export async function getSetupProgress(sellerId: string) {
  await connection()
  
  const supabase = await createClient()
  
  const [profileResult, productsResult, shippingResult, payoutResult] = await Promise.all([
    // Get profile details for setup completion
    supabase
      .from('profiles')
      .select('bio, avatar_url, username')
      .eq('id', sellerId)
      .single(),
    
    // Check if seller has any products
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('seller_id', sellerId)
      .limit(1),

    // Check if seller has configured shipping settings
    supabase
      .from('seller_shipping_settings')
      .select('is_configured')
      .eq('seller_id', sellerId)
      .maybeSingle(),

    // Check seller payout status (Stripe Connect)
    supabase
      .from('seller_payout_status')
      .select('details_submitted, charges_enabled, payouts_enabled')
      .eq('seller_id', sellerId)
      .maybeSingle(),
  ])
  
  const profile = profileResult.data

  const hasShippingSetup = !shippingResult.error && Boolean(shippingResult.data?.is_configured)
  const payout = payoutResult.error ? null : payoutResult.data
  const hasPaymentSetup = Boolean(payout?.details_submitted && payout?.charges_enabled && payout?.payouts_enabled)
  
  return {
    hasProducts: (productsResult.count || 0) > 0,
    hasDescription: Boolean(profile?.bio && profile.bio.length > 10),
    hasLogo: Boolean(profile?.avatar_url),
    hasUsername: Boolean(profile?.username),
    hasShippingSetup,
    hasPaymentSetup,
  }
}

/**
 * Gets customers data for the customers page
 */
export async function getBusinessCustomers(
  sellerId: string,
  options: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}
) {
  await connection()
  
  const supabase = await createClient()
  
  const {
    page = 1,
    limit = 50,
    search,
    sortBy = 'total_spent',
    sortOrder = 'desc'
  } = options
  
  // Get unique customers who have ordered from this seller
  // This aggregates order data by customer
  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`
      quantity,
      price_at_purchase,
      order:orders!inner(
        user_id,
        created_at,
        user:profiles(id, email, full_name, avatar_url, created_at)
      )
    `)
    .eq('seller_id', sellerId)
  
  if (!orderItems) {
    return { customers: [], total: 0 }
  }
  
  // Aggregate by customer
  const customerMap = new Map<string, {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    total_orders: number
    total_spent: number
    first_order: string
    last_order: string
  }>()
  
  for (const item of orderItems as unknown as Array<{
    quantity: number
    price_at_purchase: number
    order: { user_id: string; created_at: string; user: { id: string; email: string; full_name: string | null; avatar_url: string | null; created_at: string } | null }
  }>) {
    const order = item.order
    if (!order?.user) continue
    
    const user = order.user
    if (!user?.id) continue
    
    const existing = customerMap.get(user.id)
    const orderTotal = Number(item.price_at_purchase) * item.quantity
    const orderDate = order.created_at
    
    if (existing) {
      existing.total_orders += 1
      existing.total_spent += orderTotal
      if (orderDate > existing.last_order) {
        existing.last_order = orderDate
      }
      if (orderDate < existing.first_order) {
        existing.first_order = orderDate
      }
    } else {
      customerMap.set(user.id, {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        total_orders: 1,
        total_spent: orderTotal,
        first_order: orderDate,
        last_order: orderDate,
      })
    }
  }
  
  let customers = [...customerMap.values()]
  
  // Apply search filter
  if (search) {
    const query = search.toLowerCase()
    customers = customers.filter(c => 
      c.email?.toLowerCase().includes(query) ||
      c.full_name?.toLowerCase().includes(query)
    )
  }
  
  // Sort
  customers.sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'total_spent':
        comparison = a.total_spent - b.total_spent
        break
      case 'total_orders':
        comparison = a.total_orders - b.total_orders
        break
      case 'last_order':
        comparison = new Date(a.last_order).getTime() - new Date(b.last_order).getTime()
        break
      default:
        comparison = (a.full_name || '').localeCompare(b.full_name || '')
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })
  
  const total = customers.length
  const paginatedCustomers = customers.slice((page - 1) * limit, page * limit)
  
  return {
    customers: paginatedCustomers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Calculate performance score from stats (server-safe version)
 */
export function calculatePerformanceScoreServer(stats: {
  orders: number
  products: number
  views: number
  rating: number
  revenue: number
}) {
  const metrics = [
    {
      id: "conversion",
      label: "Conversion Rate",
      value: stats.orders > 0 && stats.views > 0 
        ? Number(((stats.orders / stats.views) * 100).toFixed(1))
        : 0,
      target: 3,
      unit: "%",
      trend: "up" as const,
      trendValue: 12,
      description: "Percentage of visitors who made a purchase",
    },
    {
      id: "rating",
      label: "Customer Rating",
      value: stats.rating || 0,
      target: 5,
      trend: "neutral" as const,
      description: "Average rating from customer reviews",
    },
    {
      id: "listings",
      label: "Active Listings",
      value: stats.products,
      target: 20,
      trend: "up" as const,
      trendValue: 5,
      description: "Number of products listed in your store",
    },
    {
      id: "orders",
      label: "Orders (30d)",
      value: stats.orders,
      target: 50,
      trend: stats.orders > 10 ? "up" as const : "neutral" as const,
      trendValue: stats.orders > 10 ? 8 : 0,
      description: "Number of orders in the last 30 days",
    },
  ]
  
  // Calculate overall score (weighted average)
  const weights: Record<string, number> = { conversion: 30, rating: 25, listings: 20, orders: 25 }
  let totalScore = 0
  
  for (const metric of metrics) {
    const progress = Math.min((metric.value / metric.target) * 100, 100)
    const weight = weights[metric.id] || 25
    totalScore += (progress * weight) / 100
  }
  
  return {
    overallScore: Math.round(totalScore),
    metrics,
  }
}

type ActivityType = "order" | "product" | "review" | "customer" | "milestone"

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  href?: string
  meta?: {
    amount?: number
    status?: string
    image?: string
    rating?: number
  }
}

/**
 * Transform orders/products into activity items (server-safe version)
 */
export function transformToActivityItemsServer(
  orders: Array<{
    id: string
    quantity: number
    price_at_purchase: number
    product?: { title: string; images?: string[] | null } | { title: string; images?: string[] | null }[] | null
    order?: { id: string; created_at: string } | null
  }>,
  products: Array<{
    id: string
    title: string
    created_at: string
    images?: string[] | null
    status?: string | null
  }>
): ActivityItem[] {
  const activities: ActivityItem[] = []
  
  // Transform orders
  for (const orderItem of orders) {
    const product = Array.isArray(orderItem.product) ? orderItem.product[0] : orderItem.product
    // Use created_at from order relation, fallback to now
    const timestamp = orderItem.order?.created_at ?? new Date().toISOString()
    activities.push({
      id: `order-${orderItem.id}`,
      type: "order",
      title: "New order received",
      description: product?.title || "Order item",
      timestamp,
      href: `/dashboard/orders/${orderItem.order?.id ?? orderItem.id}`,
      meta: {
        amount: Number(orderItem.price_at_purchase) * orderItem.quantity,
        status: "Unfulfilled",
        ...(product?.images?.[0] ? { image: product.images[0] } : {}),
      },
    })
  }
  
  // Transform products
  for (const product of products) {
    activities.push({
      id: `product-${product.id}`,
      type: "product",
      title: "Product listed",
      description: product.title,
      timestamp: product.created_at,
      href: `/dashboard/products/${product.id}`,
      meta: {
        status: product.status || "Active",
        ...(product.images?.[0] ? { image: product.images[0] } : {}),
      },
    })
  }
  
  // Sort by timestamp (newest first)
  activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  
  return activities.slice(0, 10)
}
