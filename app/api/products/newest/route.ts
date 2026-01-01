import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI } from "@/lib/data/products"
import type { Database } from "@/lib/supabase/database.types"

// Type for the nested select with relations
interface ProductRowWithRelations {
  id: string
  title: string
  price: number
  list_price: number | null
  rating: number | null
  review_count: number | null
  images: string[] | null
  product_images: Array<{
    image_url: string
    thumbnail_url: string | null
    display_order: number | null
    is_primary: boolean | null
  }> | null
  product_attributes: Array<{ name: string; value: string }> | null
  is_boosted: boolean | null
  boost_expires_at: string | null
  created_at: string
  slug: string | null
  attributes: Record<string, unknown> | null
  category_ancestors: string[] | null
  seller: { username: string | null } | null
  categories: {
    id: string
    slug: string
    name: string
    name_bg: string | null
    icon: string | null
    parent: {
      id: string
      slug: string
      name: string
      name_bg: string | null
      icon: string | null
      parent: {
        id: string
        slug: string
        name: string
        name_bg: string | null
        icon: string | null
        parent: {
          id: string
          slug: string
          name: string
          name_bg: string | null
          icon: string | null
        } | null
      } | null
    } | null
  } | null
}

// Public, query-string keyed endpoint. Align caching with next.config.ts cacheLife.products
const CACHE_TTL_SECONDS = 300
const CACHE_STALE_WHILE_REVALIDATE = 60

function cachedJsonResponse(data: unknown, init?: ResponseInit) {
  const res = NextResponse.json(data, init)
  res.headers.set(
    "Cache-Control",
    `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`
  )
  res.headers.set("CDN-Cache-Control", `public, max-age=${CACHE_TTL_SECONDS}`)
  res.headers.set("Vercel-CDN-Cache-Control", `public, max-age=${CACHE_TTL_SECONDS}`)
  return res
}

/**
 * GET /api/products/newest
 * 
 * Fetch newest products with hierarchical category filtering.
 * When filtering by category, returns ALL products in that category
 * AND all its descendants (L0 -> L1 -> L2 -> L3 -> L4).
 * 
 * Uses the optimized `category_ancestors` GIN index for O(1) lookups.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "12", 10)
  const category = searchParams.get("category")
  
  // Cap limit to prevent abuse
  const safeLimit = Math.min(limit, 24)
  const offset = (page - 1) * safeLimit
  
  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return NextResponse.json({ 
        products: [], 
        hasMore: false,
        error: "Database unavailable" 
      }, { status: 503 })
    }

    let productRows: ProductRowWithRelations[] = []
    let totalCount = 0

    // Common select fields for product queries
    // Note: category_ancestors exists in DB but may not be in generated types
    const productSelect = `
      id, 
      title, 
      price, 
      list_price, 
      rating, 
      review_count, 
      images,
      category_ancestors, 
      product_images(image_url,thumbnail_url,display_order,is_primary),
      product_attributes(name,value),
      is_boosted,
      boost_expires_at,
      created_at, 
      slug,
      attributes,
      seller:profiles(username),
      categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon))))
    `

    if (category) {
      // =================================================================
      // HIERARCHICAL CATEGORY QUERY
      // Uses category_ancestors array with GIN index for fast containment
      // queries. Returns ALL products where the category is in their
      // ancestor chain (Fashion -> Men -> Clothing -> T-shirts).
      // =================================================================
      
      // Step 1: Get category UUID from slug
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .limit(1)
        .maybeSingle()
      
      if (categoryError) {
        console.error("[API] Category lookup error:", categoryError.message)
        return NextResponse.json({ 
          products: [], 
          hasMore: false,
          error: categoryError.message 
        }, { status: 500 })
      }

      if (!categoryData) {
        // Category not found - return empty
        return cachedJsonResponse({
          products: [],
          hasMore: false,
          totalCount: 0,
          page,
        })
      }

      // Step 2: Query products using .filter() with raw PostgREST syntax
      // 'cs' = contains operator (@>), works with array columns
      // This uses the GIN index on category_ancestors for efficient lookups
      const { data, error, count } = await supabase
        .from('products')
        .select(productSelect, { count: 'exact' })
        .filter('category_ancestors', 'cs', `{${categoryData.id}}`)
        .order('created_at', { ascending: false })
        .range(offset, offset + safeLimit - 1)

      if (error) {
        console.error("[API] Products by category error:", error.message)
        return NextResponse.json({ 
          products: [], 
          hasMore: false,
          error: error.message 
        }, { status: 500 })
      }

      productRows = (data ?? []) as unknown as ProductRowWithRelations[]
      totalCount = count ?? 0
    } else {
      // =================================================================
      // ALL PRODUCTS (no category filter)
      // Simple query with pagination
      // =================================================================
      const { data, error, count } = await supabase
        .from('products')
        .select(productSelect, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + safeLimit - 1)

      if (error) {
        console.error("[API] Newest products error:", error.message)
        return NextResponse.json({ 
          products: [], 
          hasMore: false,
          error: error.message 
        }, { status: 500 })
      }

      productRows = (data ?? []) as unknown as ProductRowWithRelations[]
      totalCount = count ?? 0
    }

    // Transform to UI format
    const products = productRows.map((p) => ({
      ...toUI({
        id: p.id,
        title: p.title,
        price: p.price,
        list_price: p.list_price,
        rating: p.rating,
        review_count: p.review_count,
        images: p.images,
        product_images: p.product_images,
        product_attributes: p.product_attributes,
        is_boosted: p.is_boosted,
        boost_expires_at: p.boost_expires_at,
        slug: p.slug,
        store_slug: p.seller?.username ?? null,
        category_slug: p.categories?.slug ?? null,
        categories: p.categories ?? null,
        attributes: p.attributes as import("@/lib/supabase/database.types").Json | null,
      }),
    }))

    const hasMore = offset + products.length < totalCount

    return cachedJsonResponse({
      products,
      hasMore,
      totalCount,
      page,
    })
  } catch (error) {
    console.error("[API] Newest products exception:", error)
    return NextResponse.json({ 
      products: [], 
      hasMore: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}
