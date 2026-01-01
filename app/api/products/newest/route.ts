import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI } from "@/lib/data/products"

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase RPC + nested selects need runtime typing
    let productRows: any[] = []
    let totalCount = 0

    if (category) {
      // =================================================================
      // HIERARCHICAL CATEGORY QUERY
      // Uses category_ancestors array with GIN index for fast containment
      // queries. Returns ALL products where the category is in their
      // ancestor chain (Fashion -> Men -> Clothing -> T-shirts).
      // =================================================================
      
      // Get products from the optimized RPC function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- RPC function may not be in generated types
      const { data: rpcProducts, error: rpcError } = await (supabase.rpc as any)(
        'get_products_in_category',
        { p_category_slug: category, p_limit: safeLimit, p_offset: offset }
      )
      
      if (rpcError) {
        console.error("[API] get_products_in_category error:", rpcError.message)
        return NextResponse.json({ 
          products: [], 
          hasMore: false,
          error: rpcError.message 
        }, { status: 500 })
      }

      // Get total count for pagination
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- RPC function may not be in generated types
      const { data: countResult } = await (supabase.rpc as any)(
        'count_products_in_category',
        { p_category_slug: category }
      )
      totalCount = typeof countResult === 'number' ? countResult : 0

      // If we got products, fetch full data with relations
      const products = Array.isArray(rpcProducts) ? rpcProducts : []
      if (products.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- RPC result shape
        const productIds = products.map((p: { id: string }) => p.id)
        
        const { data: fullProducts, error: fullError } = await supabase
          .from('products')
          .select(`
            id, 
            title, 
            price, 
            list_price, 
            rating, 
            review_count, 
            images, 
            product_images(image_url,thumbnail_url,display_order,is_primary),
            product_attributes(name,value),
            is_boosted,
            boost_expires_at,
            created_at, 
            slug,
            attributes,
            seller:profiles(username),
            categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon))))
          `)
          .in('id', productIds)
          .order('created_at', { ascending: false })

        if (fullError) {
          console.error("[API] Full products fetch error:", fullError.message)
        } else {
          productRows = fullProducts || []
        }
      }
    } else {
      // =================================================================
      // ALL PRODUCTS (no category filter)
      // Simple query with pagination
      // =================================================================
      const { data, error, count } = await supabase
        .from('products')
        .select(`
          id, 
          title, 
          price, 
          list_price, 
          rating, 
          review_count, 
          images, 
          product_images(image_url,thumbnail_url,display_order,is_primary),
          product_attributes(name,value),
          is_boosted,
          boost_expires_at,
          created_at, 
          slug,
          attributes,
          seller:profiles(username),
          categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon))))
        `, { count: 'exact' })
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

      productRows = data || []
      totalCount = count || 0
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
        attributes: p.attributes,
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
