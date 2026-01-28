import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI, normalizeProductRow } from "@/lib/data/products"
import { 
  cachedJsonResponse, 
  dbUnavailableResponse, 
  parsePaginationParams 
} from "@/lib/api/response-helpers"
import { z } from "zod"

const FeedQuerySchema = z.object({
  type: z
    .enum([
      'all',
      'newest',
      'promoted',
      'deals',
      'top_rated',
      'most_viewed',
      'best_sellers',
      'price_low',
      'price_high',
      'free_shipping',
      'ending_soon',
      'nearby',
      'near_me',
    ])
    .optional()
    .default('all'),
  category: z.string().trim().min(1).max(64).optional(),
  city: z.string().trim().min(1).max(80).optional(),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const parsedQuery = FeedQuerySchema.safeParse({
    type: searchParams.get("type") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    city: searchParams.get("city") ?? undefined,
  })

  const type = parsedQuery.success ? parsedQuery.data.type : "all"
  const { page, limit: safeLimit, offset } = parsePaginationParams(searchParams)
  const category = parsedQuery.success ? parsedQuery.data.category : undefined
  const city = parsedQuery.success ? parsedQuery.data.city : undefined
  const nowIso = new Date().toISOString()
  
  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return dbUnavailableResponse()
    }

    const baseSelect = `
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
        is_boosted,
        boost_expires_at,
        created_at, 
        free_shipping,
        seller_city,
        slug,
        attributes,
        seller:profiles(id,username,avatar_url,tier),
        categories!inner(
          id,slug,name,name_bg,icon,
          parent:categories!parent_id(id,slug,name,name_bg,icon,
            parent:categories!parent_id(id,slug,name,name_bg,icon)
          )
        )
      `

    const dealsSelect = `
        id, 
        title, 
        price, 
        list_price, 
        is_on_sale,
        sale_percent,
        sale_end_date,
        effective_discount,
        rating, 
        review_count, 
        images,
        is_boosted,
        boost_expires_at,
        created_at, 
        free_shipping,
        seller_city,
        slug,
        attributes,
        seller:profiles(id,username,avatar_url,tier),
        categories!inner(
          id,slug,name,name_bg,icon,
          parent:categories!parent_id(id,slug,name,name_bg,icon,
            parent:categories!parent_id(id,slug,name,name_bg,icon)
          )
        )
      `

    let query =
      type === "deals"
        ? supabase.from("deal_products").select(dealsSelect, { count: "exact" })
        : supabase.from("products").select(baseSelect, { count: "exact" })

    // Apply Category Filter
    if (category && category !== 'all') {
      query = query.eq('categories.slug', category)
    }

    // Apply Type-specific Filters and Sorting
    switch (type) {
      case 'promoted':
        // Only show products with ACTIVE boosts (not expired) and use fair rotation
        query = query.eq('is_boosted', true)
        query = query.gt('boost_expires_at', nowIso)
        query = query.order('boost_expires_at', { ascending: true }) // Fair rotation: soonest-expiring first
        break
      
      case 'deals':
        query = query
          .order('effective_discount', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
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

      case 'price_high':
        query = query.order('price', { ascending: false })
        break

      case 'free_shipping':
        query = query.eq('free_shipping', true)
        query = query.order('created_at', { ascending: false })
        break

      case 'ending_soon':
        // Sales ending within 7 days, sorted by soonest end
        query = query.eq('is_on_sale', true)
        query = query.gt('sale_end_date', nowIso)
        const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        query = query.lt('sale_end_date', weekFromNow)
        query = query.order('sale_end_date', { ascending: true })
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

    const rows: unknown[] = Array.isArray(data) ? data : []

    // Transform to UI format using shared normalizer (runtime-guarded for view nullability)
    const products = rows
      .filter((row) => {
        if (!row || typeof row !== "object") return false
        const r = row as Record<string, unknown>
        return typeof r.id === "string" && typeof r.title === "string" && typeof r.price === "number"
      })
      .map((row) => toUI(normalizeProductRow(row as Parameters<typeof normalizeProductRow>[0])))

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
