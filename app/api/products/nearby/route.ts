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
  const city = (searchParams.get("city") || "").trim()
  const category = searchParams.get("category")

  // No city selected -> return empty (tab should prompt user to pick one)
  if (!city) {
    return cachedJsonResponse({ products: [], hasMore: false, totalCount: 0, page })
  }

  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return dbUnavailableResponse()
    }

    let query = supabase
      .from("products")
      .select(
        `
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
        slug,
        seller:profiles(id,username,avatar_url,tier),
        categories!inner(id,slug,name,name_bg,icon)
      `,
        { count: "exact" }
      )
      // seller_city in DB stores the city value (e.g. "sofia"); use ilike for case-insensitive exact match
      .ilike("seller_city", city)

    if (category) {
      query = query.eq("categories.slug", category)
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + safeLimit - 1)

    if (error) {
      console.error("[API] Nearby products error:", error.message)
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
    console.error("[API] Nearby products exception:", error)
    return NextResponse.json(
      { products: [], hasMore: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
