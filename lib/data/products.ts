import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'
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
  rating?: number | null
  review_count?: number | null
  images: string[] | null
  product_images?: Array<{
    image_url: string
    thumbnail_url?: string | null
    display_order?: number | null
    is_primary?: boolean | null
  }> | null
  is_prime?: boolean | null
  is_boosted?: boolean | null
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
  listPrice?: number
  image: string
  rating: number
  reviews: number
  isPrime: boolean
  categorySlug?: string
  slug?: string | null
  storeSlug?: string | null
  sellerId?: string | null
  sellerName?: string | null
  sellerAvatarUrl?: string | null
  sellerTier?: 'basic' | 'premium' | 'business'
  sellerVerified?: boolean
  /** Normalized item specifics / attributes for UI rendering */
  attributes?: Record<string, string>
  /** Item condition (new, like-new, good, fair, poor) */
  condition?: string
  /** Brand name */
  brand?: string
  /** Vehicle/Product make (for automotive) */
  make?: string
  /** Vehicle/Product model */
  model?: string
  /** Year (for vehicles, electronics) */
  year?: string
  /** Location (for real estate, services) */
  location?: string
}

function normalizeAttributeKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
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
    .slice()
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
 * Single cached function for all product queries.
 * Optional zone filtering is applied at the DB query level.
 */
export async function getProducts(type: QueryType, limit = 36, zone?: ShippingRegion): Promise<Product[]> {
  'use cache'
  cacheTag('products', type)
  cacheLife('products')

  const supabase = createStaticClient()
  if (!supabase) return []

  // Join categories to get the slug for category-aware badge display
  let query = supabase
    .from('products')
    .select('id, title, price, seller_id, list_price, rating, review_count, images, product_images(image_url,thumbnail_url,display_order,is_primary), product_attributes(name,value), is_prime, is_boosted, is_featured, created_at, ships_to_bulgaria, ships_to_uk, ships_to_europe, ships_to_usa, ships_to_worldwide, pickup_only, category_id, slug, attributes, seller:profiles(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business), categories(slug)')

  // Apply shipping zone filter (WW = show all, so no filter)
  if (zone && zone !== 'WW') {
    const shippingFilter = getShippingFilter(zone)
    if (shippingFilter) {
      query = query.or(shippingFilter)
    }
  }

  switch (type) {
    case 'deals':
    case 'promo':
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
    console.error(`[getProducts:${type}]`, error.message)
    return []
  }

  return (data || [])
    .map((p) => ({
      ...p,
      // Extract category_slug from categories join
      category_slug: p.categories?.slug ?? null,
      // Extract store_slug from profiles join (username is the URL slug)
      store_slug: p.seller?.username ?? null,
      // Keep richer seller info around for UI mapping
      seller_profile: p.seller ?? null
    }))
    .filter((p: Product) => 
      type === 'deals' || type === 'promo' 
        ? (p.list_price ?? 0) > p.price 
        : true
    )
}

/** Fetch single product by ID */
export async function getProductById(id: string): Promise<Product | null> {
  'use cache'
  cacheTag('products', `product-${id}`)
  cacheLife('products')

  const supabase = createStaticClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select('*')
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
export function filterByZone<T extends {
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

  return {
    id: p.id,
    title: p.title,
    price: p.price,
    listPrice: p.list_price ?? undefined,
    image: pickPrimaryImage(p),
    rating: p.rating ?? 0,
    reviews: p.review_count ?? 0,
    isPrime: p.is_prime ?? false,
    categorySlug: p.category_slug ?? undefined,
    slug: p.slug,
    storeSlug: p.store_slug,
    sellerId: p.seller_id ?? p.seller_profile?.id ?? null,
    sellerName: sellerDisplayName,
    sellerAvatarUrl: p.seller_profile?.avatar_url ?? null,
    sellerTier,
    sellerVerified,
    attributes: Object.keys(attrs).length ? attrs : undefined,
    condition: typeof attrs.condition === 'string' ? attrs.condition : undefined,
    brand: typeof attrs.brand === 'string' ? attrs.brand : undefined,
    make: typeof attrs.make === 'string' ? attrs.make : undefined,
    model: typeof attrs.model === 'string' ? attrs.model : undefined,
    year: typeof attrs.year === 'string' ? attrs.year : undefined,
    location: typeof attrs.location === 'string' ? attrs.location : undefined,
  }
}

// =============================================================================
// Legacy Exports - For backward compatibility (remove after migration)
// =============================================================================

export const getGlobalDeals = (limit = 50, zone?: ShippingRegion) => getProducts('deals', limit, zone)
export const getNewestProducts = (limit = 36, zone?: ShippingRegion) => getProducts('newest', limit, zone)
export const getPromoProducts = (limit = 36, zone?: ShippingRegion) => getProducts('promo', limit, zone)
export const getBestSellers = (limit = 36, zone?: ShippingRegion) => getProducts('bestsellers', limit, zone)
export const getFeaturedProducts = (limit = 36, zone?: ShippingRegion) => getProducts('featured', limit, zone)
export const getTopRatedProducts = (limit = 36, zone?: ShippingRegion) => getProducts('bestsellers', limit, zone)

// Alias for backward compatibility
export const filterByShippingZone = filterByZone
export type TransformedProduct = UIProduct
export type Deal = UIProduct
