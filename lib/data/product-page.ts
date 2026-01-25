import 'server-only'

import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

type ProductRow = Database["public"]["Tables"]["products"]["Row"]
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]
type SellerStatsRow = Database["public"]["Tables"]["seller_stats"]["Row"]
type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"]
type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"]

type SellerStatsSummary = Pick<
  SellerStatsRow,
  | "seller_id"
  | "average_rating"
  | "total_reviews"
  | "positive_feedback_pct"
  | "follower_count"
  | "total_sales"
  | "response_time_hours"
  | "active_listings"
>

type ProductSeller = Pick<
  ProfileRow,
  "id" | "username" | "display_name" | "avatar_url" | "verified" | "is_seller" | "created_at"
>

type ProductCategory = Pick<
  CategoryRow,
  "id" | "name" | "name_bg" | "slug" | "parent_id" | "icon"
>

type ProductImage = Pick<
  ProductImageRow,
  "id" | "image_url" | "display_order" | "is_primary"
>

export type ProductPageProduct = ProductRow & {
  seller: ProductSeller
  category: ProductCategory | null
  seller_stats: SellerStatsSummary | null
  product_images?: ProductImage[]
  product_variants?: ProductVariantRow[]
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const isUuid = (value: unknown): value is string => typeof value === 'string' && UUID_REGEX.test(value)

const PRODUCT_SELECT =
  'id,title,slug,price,list_price,description,condition,images,attributes,meta_description,rating,review_count,stock,pickup_only,seller_city,seller_id,category_id,view_count,created_at' as const

const SELLER_STATS_SELECT =
  'seller_id,average_rating,total_reviews,positive_feedback_pct,follower_count,total_sales,response_time_hours,active_listings' as const

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
): Promise<ProductPageProduct | null> {
  'use cache'
  cacheLife('products')

  const addEntityTags = (p: { id?: unknown; seller?: { id?: unknown; username?: unknown } } | null) => {
    if (!p) return

    if (typeof p.id === 'string' && p.id) {
      cacheTag(`product:${p.id}`)
    }

    const sellerId = p.seller?.id
    if (typeof sellerId === 'string' && sellerId) {
      cacheTag(`seller-${sellerId}`)
    }

    const sellerUsername = p.seller?.username
    if (typeof sellerUsername === 'string' && sellerUsername) {
      cacheTag(`seller-${sellerUsername}`)
    }
  }

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
  cacheTag(`product:slug:${safeSlug}`, `seller-${safeUsername}`)

  const supabase = createStaticClient()

  // Fetch profile and product in a single optimized query using joins
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      ${PRODUCT_SELECT},
      seller:profiles!products_seller_id_fkey (
        id, username, display_name, avatar_url, verified, is_seller, created_at, last_active
      ),
      category:categories (
        id, name, name_bg, slug, parent_id, icon
      ),
      product_images (
        id, image_url, display_order, is_primary
      ),
      product_variants (
        id,
        name,
        sku,
        stock,
        price_adjustment,
        is_default,
        sort_order
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
      .select("id, username, display_name, avatar_url, verified, is_seller, created_at, last_active")
      .eq("username", safeUsername)
      .maybeSingle()

    const profile = (exactProfile as unknown as ProductSeller | null)
      ?? (
        await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, verified, is_seller, created_at, last_active")
          .ilike("username", safeUsername)
          .maybeSingle()
      ).data as unknown as ProductSeller | null

    if (!profile) return null

    // Canonical lookup by slug
    let fallbackProduct = (
      await supabase
        .from("products")
        .select(PRODUCT_SELECT)
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
          .select(PRODUCT_SELECT)
          .eq("id", safeSlug)
          .eq("seller_id", profile.id)
          .maybeSingle()
      ).data
    }

    if (!fallbackProduct) return null

    let category: ProductCategory | null = null
    if (fallbackProduct.category_id) {
      const { data } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug, parent_id, icon, image_url")
        .eq("id", fallbackProduct.category_id)
        .single()
      category = (data as unknown as ProductCategory | null) ?? null
    }

    const { data: sellerStats } = await supabase
      .from("seller_stats")
      .select(SELLER_STATS_SELECT)
      .eq("seller_id", profile.id)
      .single()

    // Fetch product_images for the fallback path
    const { data: productImages } = await supabase
      .from("product_images")
      .select("id, image_url, display_order, is_primary")
      .eq("product_id", fallbackProduct.id)
      .order("display_order", { ascending: true })

    const enriched: ProductPageProduct = {
      ...(fallbackProduct as ProductRow),
      seller: profile,
      category,
      seller_stats: sellerStats ?? null,
      product_images: productImages ?? [],
      product_variants: (
        (await supabase
          .from("product_variants")
          .select("id,name,sku,stock,price_adjustment,is_default,sort_order")
          .eq("product_id", fallbackProduct.id)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true })
        ).data ?? []
      ) as unknown as ProductVariantRow[],
    }

    addEntityTags(enriched)
    return enriched
  }

  const productWithRelations = product as unknown as (ProductRow & {
    seller: ProductSeller | null
    category: ProductCategory | null
    product_images?: ProductImage[]
    product_variants?: Array<Pick<ProductVariantRow, "id" | "name" | "sku" | "stock" | "price_adjustment" | "is_default" | "sort_order">>
  })

  const seller = productWithRelations.seller
  const sellerId = seller?.id
  if (!sellerId || !seller) return null

  const { data: sellerStats } = await supabase
    .from("seller_stats")
    .select(SELLER_STATS_SELECT)
    .eq("seller_id", sellerId)
    .single()

  const enriched: ProductPageProduct = {
    ...(productWithRelations as ProductRow),
    seller,
    category: productWithRelations.category ?? null,
    seller_stats: sellerStats ?? null,
    product_images: productWithRelations.product_images ?? [],
    product_variants: ([...(productWithRelations.product_variants ?? [])] as Array<
      Pick<ProductVariantRow, "id" | "name" | "sku" | "stock" | "price_adjustment" | "is_default" | "sort_order">
    >)
      .sort((a, b) => {
        const ad = a.is_default ? 0 : 1
        const bd = b.is_default ? 0 : 1
        if (ad !== bd) return ad - bd

        const ao = a.sort_order ?? 999
        const bo = b.sort_order ?? 999
        if (ao !== bo) return ao - bo

        return String(a.name ?? "").localeCompare(String(b.name ?? ""))
      }) as unknown as ProductVariantRow[],
  }

  addEntityTags(enriched)
  return enriched
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
  cacheLife('products')

  const supabase = createStaticClient()

  // In Cache Components mode, never allow implicit string coercion.
  // Avoid Postgres errors when sample/placeholder ids are passed in.
  if (!isUuid(sellerId)) return []

  cacheTag(`seller-products-${sellerId}`)

  const SELLER_PRODUCTS_SELECT =
    'id,title,slug,price,list_price,images,condition' as const

  let query = supabase
    .from("products")
    .select(SELLER_PRODUCTS_SELECT)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (excludeProductId && isUuid(excludeProductId)) {
    query = query.neq("id", excludeProductId)
  }

  const { data } = await query
  return data || []
}

/**
 * Fetch favorites count for a product.
 * Counts how many users have this product in their wishlists.
 * 
 * CACHED: Uses 'use cache' with product-specific tags.
 */
export async function fetchProductFavoritesCount(productId: string): Promise<number> {
  'use cache'
  cacheLife('products')
  
  if (!isUuid(productId)) return 0
  
  cacheTag(`product:${productId}`, `product-favorites:${productId}`)
  
  const supabase = createStaticClient()
  
  const { count, error } = await supabase
    .from("wishlists")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId)
  
  if (error) return 0
  return count ?? 0
}

/**
 * Hero spec returned from database RPC.
 * Up to 4 key attributes shown prominently on product pages.
 */
export interface HeroSpec {
  label: string
  value: string
  priority: number
  unit_suffix: string | null
}

/**
 * Fetch hero specs for a product from the database.
 * Uses the `get_hero_specs` RPC which:
 * 1. Looks up the product's category
 * 2. Gets hero spec definitions from category_attributes (walking up hierarchy)
 * 3. Extracts values from the product's attributes JSONB
 * 
 * CACHED: Uses 'use cache' with product and category tags.
 */
export async function fetchProductHeroSpecs(
  productId: string,
  locale: string = 'en'
): Promise<HeroSpec[]> {
  'use cache'
  cacheLife('products')
  
  if (!isUuid(productId)) return []
  
  cacheTag(`product:${productId}`, `product-hero-specs:${productId}`)
  
  const supabase = createStaticClient()
  
  const { data, error } = await supabase
    .rpc('get_hero_specs', {
      p_product_id: productId,
      p_locale: locale
    })
  
  if (error || !Array.isArray(data)) return []
  
  return data.map(spec => ({
    label: String(spec.label ?? ''),
    value: String(spec.value ?? ''),
    priority: Number(spec.priority ?? 0),
    unit_suffix: spec.unit_suffix ? String(spec.unit_suffix) : null
  }))
}

