import 'server-only'

import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from "@/lib/supabase/server"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const isUuid = (value: unknown): value is string => typeof value === 'string' && UUID_REGEX.test(value)

/**
 * Fetch product by seller username + product slug.
 * Returns the product row enriched with `seller` (profile) and `category`.
 * 
 * CACHED: Uses 'use cache' with product-specific tags for proper cache invalidation.
 * This is public data that doesn't depend on auth - safe to cache.
 */
export async function fetchProductByUsernameAndSlug(
  username: string,
  productSlug: string
) {
  'use cache'
  cacheTag('products', 'product')
  cacheLife('products')

  // In Next.js Cache Components mode, cached functions may be invoked with
  // non-serializable/temporary references if something goes wrong upstream.
  // Never coerce unknown values to string (would call toString and crash).
  if (typeof username !== 'string' || typeof productSlug !== 'string') {
    return null
  }

  const safeUsername = username.trim()
  const safeSlug = productSlug.trim()
  if (!safeUsername || !safeSlug) return null

  // Add granular tags for precise invalidation.
  cacheTag(`product-${safeSlug}`, `seller-${safeUsername}`)

  const supabase = createStaticClient()
  if (!supabase) return null

  // Fetch profile and product in a single optimized query using joins
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      *,
      seller:profiles!products_seller_id_fkey (
        id, username, display_name, avatar_url, verified, is_seller, created_at
      ),
      category:categories (
        id, name, name_bg, slug, parent_id, icon, image_url
      )
    `)
    .eq("slug", safeSlug)
    // IMPORTANT: filter using the embedded relation alias (seller), not the base table name.
    // Using "profiles.username" can silently return no rows, causing the UI to fall back to sample/preview.
    .eq("seller.username", safeUsername)
    .maybeSingle()

  if (productError || !product) {
    // Fallback: Try the two-step approach if join fails
    const { data: exactProfile } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, verified, is_seller, created_at")
      .eq("username", safeUsername)
      .maybeSingle()

    const profile = exactProfile
      ?? (
        await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, verified, is_seller, created_at")
          .ilike("username", safeUsername)
          .maybeSingle()
      ).data

    if (!profile) return null

    // Canonical lookup by slug
    let fallbackProduct = (
      await supabase
        .from("products")
        .select("*")
        .eq("slug", safeSlug)
        .eq("seller_id", profile.id)
        .maybeSingle()
    ).data

    // Robust fallback: if the URL uses a UUID (or slug is missing), allow resolving by id.
    // This preserves the username/product URL shape while keeping old or incomplete rows accessible.
    if (!fallbackProduct && isUuid(safeSlug)) {
      fallbackProduct = (
        await supabase
          .from("products")
          .select("*")
          .eq("id", safeSlug)
          .eq("seller_id", profile.id)
          .maybeSingle()
      ).data
    }

    if (!fallbackProduct) return null

    let category = null
    if (fallbackProduct.category_id) {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("id", fallbackProduct.category_id)
        .single()
      category = data
    }

    const { data: sellerStats } = await supabase
      .from("seller_stats")
      .select("*")
      .eq("seller_id", profile.id)
      .single()

    return { ...fallbackProduct, seller: profile, category, seller_stats: sellerStats ?? null }
  }

  const sellerId = (product as any)?.seller?.id as string | undefined
  const { data: sellerStats } = sellerId
    ? await supabase
        .from("seller_stats")
        .select("*")
        .eq("seller_id", sellerId)
        .single()
    : { data: null as any }

  return { ...(product as any), seller_stats: sellerStats ?? null }
}

/**
 * Fetch products from a specific seller.
 * 
 * CACHED: Uses 'use cache' with seller-specific tags.
 * This is public product data - safe to cache.
 */
export async function fetchSellerProducts(
  sellerId: string,
  excludeProductId?: string,
  limit = 10
) {
  'use cache'
  cacheTag('products', 'seller-products')
  cacheLife('products')

  const supabase = createStaticClient()
  if (!supabase) return []

  // In Cache Components mode, never allow implicit string coercion.
  // Avoid Postgres errors when sample/placeholder ids are passed in.
  if (!isUuid(sellerId)) return []

  cacheTag(`seller-products-${sellerId}`)

  let query = supabase
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (excludeProductId && isUuid(excludeProductId)) {
    query = query.neq("id", excludeProductId)
  }

  const { data } = await query
  return data || []
}

