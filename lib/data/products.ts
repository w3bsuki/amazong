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
  list_price?: number | null
  rating?: number | null
  review_count?: number | null
  images: string[] | null
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
  /** Product attributes - Json from DB, we accept any */
  attributes?: import("@/lib/supabase/database.types").Json | null
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
    .select('id, title, price, list_price, rating, review_count, images, is_prime, is_boosted, is_featured, created_at, ships_to_bulgaria, ships_to_uk, ships_to_europe, ships_to_usa, ships_to_worldwide, pickup_only, category_id, slug, attributes, seller:profiles(username), categories(slug)')

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
      store_slug: p.seller?.username ?? null
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
  // Type-cast attributes from Json to object
  const attrs = (p.attributes && typeof p.attributes === 'object' && !Array.isArray(p.attributes))
    ? p.attributes as Record<string, unknown>
    : {}
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    listPrice: p.list_price ?? undefined,
    image: p.images?.[0] || '/placeholder.svg',
    rating: p.rating ?? 0,
    reviews: p.review_count ?? 0,
    isPrime: p.is_prime ?? false,
    categorySlug: p.category_slug ?? undefined,
    slug: p.slug,
    storeSlug: p.store_slug,
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
