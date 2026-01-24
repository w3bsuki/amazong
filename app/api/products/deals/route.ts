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

  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return dbUnavailableResponse()
    }

    // Canonical Deals semantics live in the `deal_products` view.
    const { data, error, count } = await supabase
      .from("deal_products")
      .select(
        `
        id,
        title,
        price,
        seller_id,
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
        slug,
        seller:profiles(id,username,avatar_url,tier),
        categories(id,slug,name,name_bg,icon)
      `,
        { count: "exact" }
      )
      .order("effective_discount", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + safeLimit - 1)

    if (error) {
      console.error("[API] Deals products error:", error.message)
      return NextResponse.json(
        { products: [], hasMore: false, error: error.message },
        { status: 500 }
      )
    }

    const rows = (data || []).filter((row): row is typeof row & { id: string; title: string; price: number } => (
      typeof row?.id === "string"
      && typeof row?.title === "string"
      && typeof row?.price === "number"
    ))

    const products = rows.map((p) => toUI(normalizeProductRow(p)))

    const totalCount = count || 0
    const hasMore = offset + products.length < totalCount

    return cachedJsonResponse({
      products,
      hasMore,
      totalCount,
      page,
    }, "deals")
  } catch (error) {
    console.error("[API] Deals products exception:", error)
    return NextResponse.json(
      { products: [], hasMore: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
