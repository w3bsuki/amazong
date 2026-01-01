import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI, normalizeProductRow } from "@/lib/data/products"
import { 
  cachedJsonResponse, 
  dbUnavailableResponse, 
  parsePaginationParams 
} from "@/lib/api/response-helpers"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "all"
  const { page, limit: safeLimit, offset } = parsePaginationParams(searchParams)
  const category = searchParams.get("category")
  const city = searchParams.get("city")
  const nowIso = new Date().toISOString()
  
  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return dbUnavailableResponse()
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

    // Transform to UI format using shared normalizer
    const products = (data || []).map((p) => toUI(normalizeProductRow(p)))

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