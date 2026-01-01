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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "12", 10)
  const category = searchParams.get("category")
  const city = searchParams.get("city")
  
  const safeLimit = Math.min(limit, 24)
  const offset = (page - 1) * safeLimit
  const nowIso = new Date().toISOString()
  
  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return NextResponse.json({ 
        products: [], 
        hasMore: false,
        error: "Database unavailable" 
      }, { status: 503 })
    }

    let query = supabase
      .from('products')
      .select(`
        id, 
        title, 
        price, 
        list_price, 
        is_on_sale,
        sale_percent,
        sale_end_date,
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
        seller:profiles(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),
        categories!inner(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon))))
      `, { count: 'exact' })

    // Apply Category Filter
    if (category && category !== 'all') {
      query = query.eq('categories.slug', category)
    }

    // Apply Type-specific Filters and Sorting
    switch (type) {
      case 'promoted':
        query = query.eq('is_boosted', true)
        query = query.order('created_at', { ascending: false })
        break
      
      case 'deals':
        query = query.eq('is_on_sale', true)
          .gt('sale_percent', 0)
          .or(`sale_end_date.is.null,sale_end_date.gt.${nowIso}`)
        query = query.order('created_at', { ascending: false })
        break

      case 'top_rated':
        query = query.gte('rating', 4)
        query = query.order('rating', { ascending: false })
        query = query.order('review_count', { ascending: false })
        break

      case 'most_viewed':
        // Proxy for most viewed: high review count + high rating
        query = query.order('review_count', { ascending: false })
        query = query.order('rating', { ascending: false })
        break

      case 'best_sellers':
        // Proxy for best sellers: high review count + recent
        query = query.order('review_count', { ascending: false })
        query = query.order('created_at', { ascending: false })
        break

      case 'price_low':
        query = query.order('price', { ascending: true })
        break

      case 'nearby':
      case 'near_me':
        if (city && city !== 'undefined' && city !== 'null') {
          query = query.ilike('seller_city', city)
        } else {
          // Default to Sofia for Bulgarian users if no city detected yet
          query = query.ilike('seller_city', 'sofia')
        }
        query = query.order('created_at', { ascending: false })
        break

      case 'newest':
      case 'all':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    const { data, error, count } = await query.range(offset, offset + safeLimit - 1)

    if (error) {
      console.error("[API] Feed products error:", error.message)
      return NextResponse.json({ 
        products: [], 
        hasMore: false,
        error: error.message 
      }, { status: 500 })
    }

    // Transform to UI format - Supabase infers types from the query
    const products = (data || []).map((p) => ({
      ...toUI({
        id: p.id,
        title: p.title,
        price: p.price,
        list_price: p.list_price,
        is_on_sale: p.is_on_sale,
        sale_percent: p.sale_percent,
        sale_end_date: p.sale_end_date,
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
        seller_profile: p.seller ?? null,
      }),
    }))

    const totalCount = count || 0
    const hasMore = offset + products.length < totalCount

    return cachedJsonResponse({
      products,
      hasMore,
      totalCount,
      page,
    })
  } catch (error) {
    console.error("[API] Feed products exception:", error)
    return NextResponse.json({ 
      products: [], 
      hasMore: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}
