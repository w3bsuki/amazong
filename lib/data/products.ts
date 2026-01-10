import 'server-only'

import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
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
  is_boosted?: boolean | null
  boost_expires_at?: string | null
  is_featured?: boolean | null
  created_at?: string | null
  ships_to_bulgaria?: boolean | null
  ships_to_uk?: boolean | null
  ships_to_europe?: boolean | null
  ships_to_usa?: boolean | null
  ships_to_worldwide?: boolean | null
  pickup_only?: boolean | null
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

  const supabase = createStaticClient()

  // OPTIMIZED: Flat category join - no 4-level nesting!
  // Use getCategoryPath() separately when breadcrumbs are needed.
  let query = supabase
    .from('products')
    .select(
      'id, title, price, seller_id, list_price, is_on_sale, sale_percent, sale_end_date, rating, review_count, images, is_boosted, is_featured, created_at, ships_to_bulgaria, ships_to_uk, ships_to_europe, ships_to_usa, ships_to_worldwide, pickup_only, category_id, slug, seller:profiles(id,username,avatar_url,tier), categories!inner(id,slug,name,name_bg,icon)'
    )
    .eq('categories.slug', categorySlug)
    .order('created_at', { ascending: false })

  // Apply shipping zone filter (WW = show all, so no filter)
  if (zone && zone !== 'WW') {
    const shippingFilter = getShippingFilter(zone)
    if (shippingFilter) {
      query = query.or(shippingFilter)
    }
  }

  const { data, error } = await query.limit(limit)
  if (error) {
    logger.error(`[getProductsByCategorySlug:${categorySlug}] Supabase error`, error)
    return []
  }

  return (data || []).map((p) => {
    const row = p as unknown as Record<string, unknown>
    const categories = normalizeCategoryNode(row.categories)
    const seller = (row.seller && typeof row.seller === 'object') ? (row.seller as Record<string, unknown>) : null

    return {
      ...(p as unknown as Product),
      categories,
      category_slug: categories?.slug ?? null,
      store_slug: (typeof seller?.username === 'string') ? (seller.username as string) : null,
      seller_profile: (row.seller as Product['seller_profile']) ?? null,
    } as Product
  })
}

/**
 * Single cached function for all product queries.
 * Optional zone filtering is applied at the DB query level.
 */
export async function getProducts(type: QueryType, limit = 36, zone?: ShippingRegion): Promise<Product[]> {
  'use cache'
  cacheTag('products:list', `products:type:${type}`)
  cacheLife('products')

  const supabase = createStaticClient()

  // OPTIMIZED: Flat category join - no 4-level nesting!
  // Use getCategoryPath() separately when breadcrumbs are needed.
  let query = supabase
    .from('products')
    .select('id, title, price, seller_id, list_price, is_on_sale, sale_percent, sale_end_date, rating, review_count, images, is_boosted, is_featured, created_at, ships_to_bulgaria, ships_to_uk, ships_to_europe, ships_to_usa, ships_to_worldwide, pickup_only, category_id, slug, seller:profiles(id,username,avatar_url,tier), categories(id,slug,name,name_bg,icon)')

  // Apply shipping zone filter (WW = show all, so no filter)
  if (zone && zone !== 'WW') {
    const shippingFilter = getShippingFilter(zone)
    if (shippingFilter) {
      query = query.or(shippingFilter)
    }
  }

  switch (type) {
    case 'deals':
      // Truth semantics: deals are explicitly marked on-sale.
      query = query.eq('is_on_sale', true).gt('sale_percent', 0)
      break
    case 'promo':
      // Legacy "promo" uses compare-at pricing.
      query = query.not('list_price', 'is', null).gt('list_price', 0)
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'bestsellers':
      query = query.order('review_count', { ascending: false })
      break
    case 'featured':
      // Only show products with active (non-expired) boosts
      query = query
        .eq('is_boosted', true)
        .gt('boost_expires_at', new Date().toISOString())
        .order('boost_expires_at', { ascending: true }) // Fair rotation
      break
  }

  const { data, error } = await query.limit(limit)
  if (error) {
    logger.error(`[getProducts:${type}] Supabase error`, error)
    return []
  }

  return (data || [])
    .map((p) => {
      const row = p as unknown as Record<string, unknown>
      const categories = normalizeCategoryNode(row.categories)
      const seller = (row.seller && typeof row.seller === 'object') ? (row.seller as Record<string, unknown>) : null

      return {
        ...(p as unknown as Product),
        categories,
        category_slug: categories?.slug ?? null,
        store_slug: (typeof seller?.username === 'string') ? (seller.username as string) : null,
        seller_profile: (row.seller as Product['seller_profile']) ?? null,
      } as Product
    })
    .filter((p) =>
      type === 'deals' || type === 'promo'
        ? (p.list_price ?? 0) > p.price
        : true
    )
}

/** Fetch single product by ID */
async function getProductById(id: string): Promise<Product | null> {
  'use cache'
  cacheTag(`product:${id}`)
  cacheLife('products')

  const supabase = createStaticClient()

  const productSelect =
    'id,title,price,seller_id,category_id,slug,description,condition,brand_id,images,is_boosted,boost_expires_at,is_featured,is_on_sale,list_price,sale_percent,sale_end_date,rating,review_count,pickup_only,ships_to_bulgaria,ships_to_uk,ships_to_europe,ships_to_usa,ships_to_worldwide,created_at,updated_at,status,stock,tags,seller_city,listing_type,meta_title,meta_description,barcode,cost_price,sku,track_inventory,weight,weight_unit,attributes' as const

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
    product_images: p.product_images ?? null,
    product_attributes: p.product_attributes ?? null,
    is_boosted: p.is_boosted ?? null,
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
const getFeaturedProducts = (limit = 36, zone?: ShippingRegion) => getProducts('featured', limit, zone)
