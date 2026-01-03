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
  const { page, limit: safeLimit, offset } = parsePaginationParams(searchParams)
  const category = searchParams.get("category")

  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return dbUnavailableResponse()
    }

    // Query only products with ACTIVE boosts (not expired)
    let query = supabase
      .from("products")
      .select(
        `
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
        seller:profiles(id,username,avatar_url,tier),
        categories!inner(id,slug,name,name_bg,icon)
      `,
        { count: "exact" }
      )
      .eq("is_boosted", true)
      .gt("boost_expires_at", new Date().toISOString()) // Only non-expired boosts

    if (category) {
      query = query.eq('categories.slug', category)
    }

    const { data, error, count } = await query
      .order("boost_expires_at", { ascending: true }) // Show soonest-expiring first (fair rotation)
      .range(offset, offset + safeLimit - 1)

    if (error) {
      console.error("[API] Promoted products error:", error.message)
      return NextResponse.json(
        { products: [], hasMore: false, error: error.message },
        { status: 500 }
      )
    }

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
    console.error("[API] Promoted products exception:", error)
    return NextResponse.json(
      { products: [], hasMore: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
