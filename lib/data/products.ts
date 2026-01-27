import 'server-only'

import { cacheTag, cacheLife } from 'next/cache'
import { connection } from 'next/server'
import { createStaticClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { isBoostActive } from '@/lib/boost/boost-status'
import { getShippingFilter, productShipsToRegion, type ShippingRegion } from '@/lib/shipping'

// =============================================================================
// Types - Minimal, practical types
// =============================================================================

export interface Product {
  id: string
  title: string
  price: number
  seller_id?: string | null
  list_price?: number | null
  is_on_sale?: boolean | null
  sale_percent?: number | null
  sale_end_date?: string | null
  rating?: number | null
  review_count?: number | null
  images: string[] | null
  product_images?: Array<{
    image_url: string
    thumbnail_url?: string | null
    display_order?: number | null
    is_primary?: boolean | null
  }> | null
  /** True if product has an active boost (is_boosted=true AND boost_expires_at > now) */
  is_boosted?: boolean | null
  /** Boost expiration timestamp - used with is_boosted to determine active boost status */
  boost_expires_at?: string | null
  /** @deprecated Legacy field - not used. For promoted listings, use is_boosted + boost_expires_at */
  is_featured?: boolean | null
  created_at?: string | null
  ships_to_bulgaria?: boolean | null
  ships_to_uk?: boolean | null
  ships_to_europe?: boolean | null
  ships_to_usa?: boolean | null
  ships_to_worldwide?: boolean | null
  pickup_only?: boolean | null
  free_shipping?: boolean | null
  category_slug?: string | null
  slug?: string | null
  store_slug?: string | null
  /** 
   * Embedded leaf category with parent chain (up to 4 levels).
   * Supabase nested selects return parents as arrays, but the normalizeCategoryNode
   * function handles both single objects and arrays, so we accept unknown here.
   */
  categories?: {
    id?: string
    slug?: string
    name?: string
    name_bg?: string | null
    icon?: string | null
    parent?: unknown // Supabase returns array[], normalizeCategoryNode handles both
  } | null
  seller_profile?: {
    id?: string | null
    username?: string | null
    display_name?: string | null
    business_name?: string | null
    avatar_url?: string | null
    tier?: string | null
    account_type?: string | null
    is_verified_business?: boolean | null
    // Verification fields from user_verification join
    email_verified?: boolean | null
    phone_verified?: boolean | null
    id_verified?: boolean | null
  } | null
  /** Product attributes - Json from DB, we accept any */
  attributes?: import("@/lib/supabase/database.types").Json | null
  product_attributes?: Array<{
    name: string
    value: string
  }> | null
}

/** UI-ready product format */
export interface UIProduct {
  id: string
  title: string
  price: number
  createdAt?: string | null
  listPrice?: number
  isOnSale?: boolean
  salePercent?: number
  saleEndDate?: string | null
  isBoosted?: boolean
  boostExpiresAt?: string | null
  image: string
  rating: number
  reviews: number
  categorySlug?: string
  /** Root (L0) category slug (e.g. fashion, electronics, automotive) */
  categoryRootSlug?: string
  /** Category path from L0 -> leaf, includes both EN and BG labels */
  categoryPath?: { slug: string; name: string; nameBg?: string | null; icon?: string | null }[]
  slug?: string | null
  storeSlug?: string | null
  sellerId?: string | null
  sellerName?: string | null
  sellerAvatarUrl?: string | null
  sellerTier?: 'basic' | 'premium' | 'business'
  sellerVerified?: boolean
  sellerEmailVerified?: boolean
  sellerPhoneVerified?: boolean
  sellerIdVerified?: boolean
  freeShipping?: boolean

  attributes?: Record<string, string>
  condition?: string
  brand?: string
  make?: string
  model?: string
  year?: string
  location?: string
}

function normalizeCategoryNode(input: unknown): Product['categories'] {
  if (!input) return null

  const node = Array.isArray(input) ? input[0] : input
  if (!node || typeof node !== 'object') return null

  const raw = node as Record<string, unknown>

  const parent = raw.parent
  const normalizedParent = parent ? normalizeCategoryNode(parent) : null

  return {
    ...(typeof raw.id === 'string' ? { id: raw.id } : {}),
    ...(typeof raw.slug === 'string' ? { slug: raw.slug } : {}),
    ...(typeof raw.name === 'string' ? { name: raw.name } : {}),
    ...(typeof raw.name_bg === 'string' || raw.name_bg === null ? { name_bg: raw.name_bg as string | null } : {}),
    ...(typeof raw.icon === 'string' || raw.icon === null ? { icon: raw.icon as string | null } : {}),
    ...(normalizedParent ? { parent: normalizedParent } : {}),
  }
}

/**
 * Maps raw DB row to Product with normalized fields.
 * Extracted to avoid duplication across getProducts/getProductsByCategorySlug.
 */
function mapRowToProduct(p: unknown): Product {
  const row = p as unknown as Record<string, unknown>
  const categories = normalizeCategoryNode(row.categories)
  const seller = (row.seller && typeof row.seller === 'object') ? (row.seller as Record<string, unknown>) : null
  // Extract nested user_verification from seller
  const uv = (seller?.user_verification && typeof seller.user_verification === 'object')
    ? (Array.isArray(seller.user_verification) ? seller.user_verification[0] : seller.user_verification) as Record<string, unknown>
    : null

  const rawProduct = p as unknown as { is_boosted?: boolean | null; boost_expires_at?: string | null }
  const activeBoost = isBoostActive({
    is_boosted: rawProduct.is_boosted ?? null,
    boost_expires_at: rawProduct.boost_expires_at ?? null,
  })

  return {
    ...(p as unknown as Product),
    is_boosted: activeBoost,
    categories,
    category_slug: categories?.slug ?? null,
    store_slug: (typeof seller?.username === 'string') ? (seller.username as string) : null,
    seller_profile: {
      ...(seller as Product['seller_profile']),
      email_verified: uv?.email_verified === true ? true : null,
      phone_verified: uv?.phone_verified === true ? true : null,
      id_verified: uv?.id_verified === true ? true : null,
    },
  } as Product
}

function buildCategoryPath(
  leaf: Product['categories']
): { slug: string; name: string; nameBg?: string | null; icon?: string | null }[] | undefined {
  if (!leaf) return undefined

  const out: { slug: string; name: string; nameBg?: string | null; icon?: string | null }[] = []

  let current: Product['categories'] | null | undefined = leaf
  // Guard against cycles / absurd depth.
  for (let i = 0; i < 8 && current; i++) {
    if (typeof current.slug === 'string' && typeof current.name === 'string') {
      out.push({
        slug: current.slug,
        name: current.name,
        ...(current.name_bg != null ? { nameBg: current.name_bg } : {}),
        ...(current.icon != null ? { icon: current.icon } : {}),
      })
    }
    current = (current.parent as Product['categories'] | null | undefined) ?? null
  }

  out.reverse()
  return out.length ? out : undefined
}

function normalizeAttributeKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replaceAll(/\([^)]*\)/g, '')
    .replaceAll(/[^a-z0-9]+/g, '_')
    .replaceAll(/^_+|_+$/g, '')
}

function buildAttributesMap(p: Product): Record<string, string> {
  const map: Record<string, string> = {}

  // products.attributes jsonb (fast filtering source)
  const raw = (p.attributes && typeof p.attributes === 'object' && !Array.isArray(p.attributes))
    ? (p.attributes as Record<string, unknown>)
    : {}

  for (const [k, v] of Object.entries(raw)) {
    if (v == null) continue
    const key = normalizeAttributeKey(k)
    if (!key) continue
    if (typeof v === 'string') map[key] = v
    else if (typeof v === 'number' || typeof v === 'boolean') map[key] = String(v)
  }

  // product_attributes rows (canonical item specifics)
  for (const row of p.product_attributes ?? []) {
    if (!row?.name || !row?.value) continue
    const key = normalizeAttributeKey(row.name)
    if (!key) continue
    // Prefer explicit row values over jsonb when both exist
    map[key] = row.value
  }

  // Aliases / common synonyms for UI
  if (!map.condition && map.fashion_condition) map.condition = map.fashion_condition
  if (!map.year && map.model_year) map.year = map.model_year
  if (!map.mileage_km && map.mileage) map.mileage_km = map.mileage
  if (!map.mileage && map.mileage_km) map.mileage = map.mileage_km
  if (!map.size && map.clothing_size) map.size = map.clothing_size

  return map
}

function pickPrimaryImage(p: Product): string {
  const fromTable = (p.product_images ?? [])
    .filter((img) => !!img?.image_url)
    .sort((a, b) => {
      const ap = a.is_primary ? 1 : 0
      const bp = b.is_primary ? 1 : 0
      if (ap !== bp) return bp - ap
      const ao = a.display_order ?? 0
      const bo = b.display_order ?? 0
      return ao - bo
    })

  if (fromTable.length) return fromTable[0]!.image_url
  return p.images?.[0] || '/placeholder.svg'
}

// =============================================================================
// Core Cached Queries - Simple, DRY
// =============================================================================

type QueryType = 'deals' | 'newest' | 'bestsellers' | 'featured' | 'promo'

/**
 * Sort products with active boosts first, then by secondary criteria.
 * This runs OUTSIDE cache boundaries to avoid ISR write storms from new Date().
 * Per Vercel docs: "Ensure you're not using new Date() in the ISR output"
 */
export function sortWithBoostPriority<T extends { is_boosted?: boolean | null; boost_expires_at?: string | null }>(
  products: T[],
  now: Date = new Date()
): T[] {
  return [...products].sort((a, b) => {
    const aActive = isBoostActive(a, now)
    const bActive = isBoostActive(b, now)
    
    // Active boosts first
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    
    // Among active boosts, sort by expiry (soonest first for fair rotation)
    if (aActive && bActive) {
      const aExp = new Date(a.boost_expires_at!).getTime()
      const bExp = new Date(b.boost_expires_at!).getTime()
      return aExp - bExp
    }
    
    // Non-boosted products keep their original order
    return 0
  })
}

/**
 * Fetch products with stable ordering for caching.
 * NO new Date() inside - deterministic output for ISR.
 * Caller should use sortWithBoostPriority() after if boost ordering needed.
 */
async function fetchProductsStable<T>(
  makeQuery: () => any,
  {
    limit,
    applySecondaryOrder,
  }: {
    limit: number
    applySecondaryOrder: (q: any) => any
  }
): Promise<{ data: T[]; error: unknown | null }> {
  // Stable query: order by secondary criteria only, include boost fields for post-cache sorting
  const query = applySecondaryOrder(makeQuery())
  const { data, error } = await query.limit(limit)
  
  if (error) return { data: [], error }
  return { data: (data || []) as T[], error: null }
}

/**
 * Cached category query.
 * Mirrors `getProducts` but filters by `categories.slug`.
 */
export async function getProductsByCategorySlug(
  categorySlug: string,
  limit = 18,
  zone?: ShippingRegion
): Promise<Product[]> {
  'use cache'
  cacheTag('products:list', `products:category:${categorySlug}`)
  cacheLife('products')
  try {
    const supabase = createStaticClient()
    // NOTE: NO new Date() here - would cause ISR write storm per Vercel docs

    // Note: is_featured is a legacy field - we use is_boosted + boost_expires_at for promoted listings
    const productSelect =
      `id, title, price, seller_id, list_price, is_on_sale, sale_percent, sale_end_date, rating, review_count, images, is_boosted, boost_expires_at, created_at, ships_to_bulgaria, ships_to_uk, ships_to_europe, ships_to_usa, ships_to_worldwide, pickup_only, free_shipping, category_id, slug, 
     seller:profiles!seller_id(id,username,avatar_url,tier,account_type,is_verified_business,user_verification(email_verified,phone_verified,id_verified)), 
     categories!inner(id,slug,name,name_bg,icon)`

    const makeBaseQuery = () => {
      // OPTIMIZED: Flat category join - no 4-level nesting!
      // Use getCategoryPath() separately when breadcrumbs are needed.
      // Note: user_verification joins to profiles via user_id, and we join profiles via seller_id
      let q = supabase
        .from('products')
        .select(productSelect)
        .eq('categories.slug', categorySlug)

      // Apply shipping zone filter (WW = show all, so no filter)
      if (zone && zone !== 'WW') {
        const shippingFilter = getShippingFilter(zone)
        if (shippingFilter) {
          q = q.or(shippingFilter)
        }
      }

      return q
    }

    const { data, error } = await fetchProductsStable(makeBaseQuery, {
      limit,
      applySecondaryOrder: (q) => q.order('created_at', { ascending: false }),
    })

    if (error) {
      logger.error(`[getProductsByCategorySlug:${categorySlug}] Supabase error`, error)
      return []
    }

    // Map to Product type - boost sorting happens post-cache by caller if needed
    return (data || []).map(mapRowToProduct)
  } catch (error) {
    logger.error(`[getProductsByCategorySlug:${categorySlug}] Unexpected error`, error)
    return []
  }
}

/**
 * Single cached function for all product queries.
 * Optional zone filtering is applied at the DB query level.
 */
export async function getProducts(type: QueryType, limit = 36, zone?: ShippingRegion): Promise<Product[]> {
  'use cache'
  cacheTag('products:list', `products:type:${type}`)
  cacheLife('products')
  try {
    const supabase = createStaticClient()
    // NOTE: NO new Date() here - would cause ISR write storm per Vercel docs

    // Note: is_featured is a legacy field - we use is_boosted + boost_expires_at for promoted listings
    const productSelect = `id, title, price, seller_id, list_price, is_on_sale, sale_percent, sale_end_date, rating, review_count, images, is_boosted, boost_expires_at, created_at, ships_to_bulgaria, ships_to_uk, ships_to_europe, ships_to_usa, ships_to_worldwide, pickup_only, free_shipping, category_id, slug, 
      seller:profiles!seller_id(id,username,avatar_url,tier,account_type,is_verified_business,user_verification(email_verified,phone_verified,id_verified)), 
      categories(id,slug,name,name_bg,icon)`

    const makeBaseQuery = () => {
      // OPTIMIZED: Flat category join - no 4-level nesting!
      // Use getCategoryPath() separately when breadcrumbs are needed.
      // Note: user_verification joins to profiles via user_id, and we join profiles via seller_id
      let q: any =
        type === 'deals'
          ? supabase.from('deal_products').select(productSelect)
          : supabase.from('products').select(productSelect)

      // Apply shipping zone filter (WW = show all, so no filter)
      if (zone && zone !== 'WW') {
        const shippingFilter = getShippingFilter(zone)
        if (shippingFilter) {
          q = q.or(shippingFilter)
        }
      }

      // Apply type filters (but no boost ordering here)
      switch (type) {
        case 'deals':
          // Canonical semantics live in the `deal_products` view.
          break
        case 'promo':
          // Legacy "promo" uses compare-at pricing.
          q = q.not('list_price', 'is', null).gt('list_price', 0)
          break
        case 'featured':
          // Include boosted products - active filtering happens post-cache
          // to avoid ISR write storms from new Date()
          q = q.eq('is_boosted', true).not('boost_expires_at', 'is', null)
          break
      }

      return q
    }

    type ProductListQuery = ReturnType<typeof makeBaseQuery>

    const applySecondaryOrder = (q: ProductListQuery) => {
      switch (type) {
        case 'newest':
          return q.order('created_at', { ascending: false })
        case 'bestsellers':
          return q.order('review_count', { ascending: false })
        case 'deals':
          // Prefer the biggest savings first (view computes effective_discount).
          return q
            .order('effective_discount', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
        case 'featured':
          // Fair rotation of active boosts
          return q.order('boost_expires_at', { ascending: true })
        default:
          return q
      }
    }

    // All types use stable fetch - no new Date() in cache
    // Boost priority sorting happens post-cache by caller if needed
    const { data, error } =
      type === 'featured' || type === 'newest'
        ? await applySecondaryOrder(makeBaseQuery()).limit(limit)
        : await fetchProductsStable(makeBaseQuery, {
            limit,
            applySecondaryOrder,
          })

    if (error) {
      logger.error(`[getProducts:${type}] Supabase error`, error)
      return []
    }

    // Map to Product type
    // NOTE: For 'featured' type, caller must filter expired boosts post-cache using isBoostActive()
    // This keeps the cache deterministic (no new Date() in output)
    return (data || [])
      .map(mapRowToProduct)
      .filter((p: Product) =>
        type === 'deals' || type === 'promo'
          ? (p.list_price ?? 0) > p.price
          : true
      )
  } catch (error) {
    logger.error(`[getProducts:${type}] Unexpected error`, error)
    return []
  }
}

/** Fetch single product by ID */
async function getProductById(id: string): Promise<Product | null> {
  'use cache'
  cacheTag(`product:${id}`)
  cacheLife('products')

  const supabase = createStaticClient()

  // Note: is_featured is a legacy field - we use is_boosted + boost_expires_at for promoted listings
  const productSelect =
    'id,title,price,seller_id,category_id,slug,description,condition,brand_id,images,is_boosted,boost_expires_at,is_on_sale,list_price,sale_percent,sale_end_date,rating,review_count,pickup_only,ships_to_bulgaria,ships_to_uk,ships_to_europe,ships_to_usa,ships_to_worldwide,free_shipping,created_at,updated_at,status,stock,tags,seller_city,listing_type,meta_title,meta_description,track_inventory,weight,weight_unit,attributes' as const

  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// =============================================================================
// Utilities
// =============================================================================

export type ShippingZone = 'BG' | 'UK' | 'EU' | 'US' | 'WW'

/** 
 * Filter products by shipping zone.
 * Can be used server-side or client-side.
 */
function filterByZone<T extends {
  ships_to_bulgaria?: boolean | null
  ships_to_uk?: boolean | null
  ships_to_europe?: boolean | null
  ships_to_usa?: boolean | null
  ships_to_worldwide?: boolean | null
  pickup_only?: boolean | null
}>(
  products: T[],
  zone: ShippingZone,
  limit?: number
): T[] {
  if (zone === 'WW') return limit ? products.slice(0, limit) : products

  const filtered = products.filter(p => productShipsToRegion(p, zone as ShippingRegion))
  return limit ? filtered.slice(0, limit) : filtered
}

/**
 * Normalize raw Supabase query row to Product type.
 * This helper reduces duplication across API routes by handling the
 * common field mapping (seller -> seller_profile, categories.slug -> category_slug, etc.)
 */
export function normalizeProductRow(p: {
  id: string
  title: string
  price: number
  created_at?: string | null
  seller_id?: string | null
  list_price?: number | null
  is_on_sale?: boolean | null
  sale_percent?: number | null
  sale_end_date?: string | null
  rating?: number | null
  review_count?: number | null
  images?: string[] | null
  free_shipping?: boolean | null
  product_images?: Array<{
    image_url: string
    thumbnail_url?: string | null
    display_order?: number | null
    is_primary?: boolean | null
  }> | null
  product_attributes?: Array<{ name: string; value: string }> | null
  is_boosted?: boolean | null
  boost_expires_at?: string | null
  slug?: string | null
  attributes?: unknown
  seller?: {
    id?: string | null
    username?: string | null
    display_name?: string | null
    business_name?: string | null
    avatar_url?: string | null
    tier?: string | null
    account_type?: string | null
    is_verified_business?: boolean | null
  } | null
  categories?: {
    id?: string
    slug?: string
    name?: string
    name_bg?: string | null
    icon?: string | null
    parent?: unknown
  } | null
}): Product {
  const activeBoost = isBoostActive({
    is_boosted: p.is_boosted ?? null,
    boost_expires_at: p.boost_expires_at ?? null,
  })

  const result: Product = {
    id: p.id,
    title: p.title,
    price: p.price,
    created_at: p.created_at ?? null,
    seller_id: p.seller_id ?? null,
    list_price: p.list_price ?? null,
    is_on_sale: p.is_on_sale ?? null,
    sale_percent: p.sale_percent ?? null,
    sale_end_date: p.sale_end_date ?? null,
    rating: p.rating ?? null,
    review_count: p.review_count ?? null,
    images: p.images ?? null,
    free_shipping: p.free_shipping ?? null,
    product_images: p.product_images ?? null,
    product_attributes: p.product_attributes ?? null,
    is_boosted: activeBoost,
    boost_expires_at: p.boost_expires_at ?? null,
    slug: p.slug ?? null,
    store_slug: p.seller?.username ?? null,
    category_slug: p.categories?.slug ?? null,
    categories: p.categories ?? null,
    seller_profile: p.seller ?? null,
  }
  // Handle optional attributes separately to satisfy exactOptionalPropertyTypes
  const attrs = p.attributes
  if (attrs != null) {
    (result as { attributes: typeof attrs }).attributes = attrs
  }
  return result
}

/** Transform to UI format */
export function toUI(p: Product): UIProduct {
  const attrs = buildAttributesMap(p)
  const sellerDisplayName = p.seller_profile?.display_name || p.seller_profile?.business_name || p.seller_profile?.username || null
  const rawTier = (p.seller_profile?.tier || '').toLowerCase()
  const accountType = (p.seller_profile?.account_type || '').toLowerCase()  
  const sellerTier: UIProduct['sellerTier'] =
    accountType === 'business' ? 'business' :
    rawTier === 'premium' ? 'premium' :
    rawTier === 'business' ? 'business' :
    'basic'
  const sellerVerified = Boolean(p.seller_profile?.is_verified_business)

  const categoryPath = buildCategoryPath(p.categories)
  const categoryRootSlug = categoryPath?.[0]?.slug

  return {
    id: p.id,
    title: p.title,
    price: p.price,
    ...(typeof p.created_at === "string" ? { createdAt: p.created_at } : {}),
    ...(typeof p.list_price === "number" ? { listPrice: p.list_price } : {}),
    ...(typeof p.is_on_sale === "boolean" ? { isOnSale: p.is_on_sale } : {}),
    ...(typeof p.sale_percent === "number" ? { salePercent: p.sale_percent } : {}),
    saleEndDate: p.sale_end_date ?? null,
    isBoosted: Boolean(p.is_boosted),
    boostExpiresAt: p.boost_expires_at ?? null,
    image: pickPrimaryImage(p),
    rating: p.rating ?? 0,
    reviews: p.review_count ?? 0,
    ...(p.category_slug ? { categorySlug: p.category_slug } : {}),
    ...(categoryRootSlug ? { categoryRootSlug } : {}),
    ...(categoryPath ? { categoryPath } : {}),
    slug: p.slug ?? null,
    storeSlug: p.store_slug ?? null,
    sellerId: p.seller_id ?? p.seller_profile?.id ?? null,
    sellerName: sellerDisplayName,
    sellerAvatarUrl: p.seller_profile?.avatar_url ?? null,
    sellerTier,
    sellerVerified,
    sellerEmailVerified: p.seller_profile?.email_verified ?? false,
    sellerPhoneVerified: p.seller_profile?.phone_verified ?? false,
    sellerIdVerified: p.seller_profile?.id_verified ?? false,
    freeShipping: Boolean(p.free_shipping),
    ...(Object.keys(attrs).length ? { attributes: attrs } : {}),
    ...(typeof attrs.condition === "string" ? { condition: attrs.condition } : {}),
    ...(typeof attrs.brand === "string" ? { brand: attrs.brand } : {}),
    ...(typeof attrs.make === "string" ? { make: attrs.make } : {}),
    ...(typeof attrs.model === "string" ? { model: attrs.model } : {}),
    ...(typeof attrs.year === "string" ? { year: attrs.year } : {}),
    ...(typeof attrs.location === "string" ? { location: attrs.location } : {}),
  }
}

/** Transform Product array to CarouselProduct format for carousel sections */
function toCarouselProducts(products: Product[], options?: { isBoosted?: boolean }): {
  id: string
  title: string
  price: number
  listPrice?: number
  isBoosted?: boolean
  image: string
  rating?: number
  reviews?: number
  slug?: string | null
  storeSlug?: string | null
  location?: string
}[] {
  return products.map((p) => {
    const ui = toUI(p)
    const isBoosted = Boolean(options?.isBoosted ?? ui.isBoosted)
    return {
      id: ui.id,
      title: ui.title,
      price: ui.price,
      ...(ui.listPrice !== undefined ? { listPrice: ui.listPrice } : {}),
      isBoosted,
      image: ui.image,
      rating: ui.rating,
      reviews: ui.reviews,
      slug: ui.slug ?? null,
      storeSlug: ui.storeSlug ?? null,
      ...(ui.location ? { location: ui.location } : {}),
    }
  })
}

// =============================================================================
// Legacy Exports - For backward compatibility (remove after migration)
// =============================================================================

const getGlobalDeals = (limit = 50, zone?: ShippingRegion) => getProducts('deals', limit, zone)
export const getNewestProducts = (limit = 36, zone?: ShippingRegion) => getProducts('newest', limit, zone)
const getPromoProducts = (limit = 36, zone?: ShippingRegion) => getProducts('promo', limit, zone)
const getBestSellers = (limit = 36, zone?: ShippingRegion) => getProducts('bestsellers', limit, zone)

// =============================================================================
// Homepage Curated Sections - Fetchers for category rows
// =============================================================================

/**
 * Get products currently on sale (deals/promo).
 * Used for "Today's Offers" section on homepage.
 */
export async function getDealsProducts(limit = 10, zone?: ShippingRegion): Promise<Product[]> {
  return getProducts('deals', limit, zone)
}

/**
 * Get products for a specific root category (L0).
 * Used for category-specific homepage sections like "Trending in Fashion".
 */
export async function getCategoryRowProducts(
  categorySlug: string,
  limit = 10,
  zone?: ShippingRegion
): Promise<Product[]> {
  return getProductsByCategorySlug(categorySlug, limit, zone)
}

/**
 * Get products with active boosts (is_boosted=true AND boost_expires_at > now).
 * Uses fair rotation: ORDER BY boost_expires_at ASC (soonest-expiring first).
 * 
 * IMPORTANT: The cache returns ALL boosted products (including expired).
 * This wrapper filters expired boosts OUTSIDE the cache to avoid ISR write storms.
 * Uses connection() to signal dynamic rendering before new Date().
 */
export async function getBoostedProducts(limit = 36, zone?: ShippingRegion): Promise<Product[]> {
  // Get cached products (may include expired boosts)
  const products = await getProducts('featured', limit * 2, zone) // Fetch extra to account for expired
  
  // Signal dynamic rendering before using new Date() (Next.js 16 Cache Components)
  await connection()
  const now = new Date()
  const activeBoosts = products.filter(p => isBoostActive(p, now))
  
  return activeBoosts.slice(0, limit)
}
