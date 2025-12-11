import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'

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
  images?: string[] | null
  is_prime?: boolean | null
  is_boosted?: boolean | null
  is_featured?: boolean | null
  created_at?: string | null
  ships_to_bulgaria?: boolean | null
  ships_to_europe?: boolean | null
  ships_to_usa?: boolean | null
  ships_to_worldwide?: boolean | null
  category_slug?: string | null
  slug?: string | null
  store_slug?: string | null
  /** Product attributes (condition, brand, model, etc.) */
  attributes?: Record<string, string> | null
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
 * Zone filtering happens client-side to maximize cache hits.
 */
export async function getProducts(type: QueryType, limit = 36): Promise<Product[]> {
  'use cache'
  cacheTag('products', type)
  cacheLife('products')

  const supabase = createStaticClient()
  if (!supabase) return []

  // Join categories to get the slug for category-aware badge display
  let query = supabase
    .from('products')
    .select('id, title, price, list_price, rating, review_count, images, is_prime, is_boosted, is_featured, created_at, ships_to_bulgaria, ships_to_europe, ships_to_usa, ships_to_worldwide, category_id, slug, attributes, sellers(store_slug), categories(slug)')

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
      query = query
        .or('is_boosted.eq.true,is_featured.eq.true')
        .order('created_at', { ascending: false })
      break
  }

  const { data, error } = await query.limit(limit)
  if (error) {
    console.error(`[getProducts:${type}]`, error.message)
    return []
  }

  return (data || [])
    .map((p: any) => ({
      ...p,
      // Extract category_slug from categories join
      category_slug: p.categories?.slug ?? null,
      // Extract store_slug from sellers join
      store_slug: p.sellers?.store_slug ?? null
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

export type ShippingZone = 'BG' | 'EU' | 'US' | 'WW'

/** Filter products by shipping zone (client-side) */
export function filterByZone<T extends Partial<Product>>(
  products: T[],
  zone: ShippingZone,
  limit = 12
): T[] {
  return products
    .filter(p => {
      if (zone === 'BG') return p.ships_to_bulgaria || p.ships_to_europe || p.ships_to_worldwide
      if (zone === 'EU') return p.ships_to_europe || p.ships_to_worldwide
      if (zone === 'US') return p.ships_to_usa || p.ships_to_worldwide
      return p.ships_to_worldwide
    })
    .slice(0, limit)
}

/** Transform to UI format */
export function toUI(p: Product): UIProduct {
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
    condition: p.attributes?.condition,
    brand: p.attributes?.brand,
    make: p.attributes?.make,
    model: p.attributes?.model,
    year: p.attributes?.year,
    location: p.attributes?.location,
  }
}

// =============================================================================
// Legacy Exports - For backward compatibility (remove after migration)
// =============================================================================

export const getGlobalDeals = (limit = 50) => getProducts('deals', limit)
export const getNewestProducts = (limit = 36) => getProducts('newest', limit)
export const getPromoProducts = (limit = 36) => getProducts('promo', limit)
export const getBestSellers = (limit = 36) => getProducts('bestsellers', limit)
export const getFeaturedProducts = (limit = 36) => getProducts('featured', limit)
export const getTopRatedProducts = (limit = 36) => getProducts('bestsellers', limit)

// Alias for backward compatibility
export const filterByShippingZone = filterByZone
export type TransformedProduct = UIProduct
export type Deal = UIProduct
