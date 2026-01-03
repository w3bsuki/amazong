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
  const nowIso = new Date().toISOString()

  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return dbUnavailableResponse()
    }

    // Truth semantics: "Deals" are explicitly marked as on sale.
    // A deal is active when is_on_sale=true, sale_percent>0, and sale_end_date is null or in the future.
    const { data, error, count } = await supabase
      .from("products")
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
        categories(id,slug,name,name_bg,icon)
      `,
        { count: "exact" }
      )
      .eq("is_on_sale", true)
      .gt("sale_percent", 0)
      .or(`sale_end_date.is.null,sale_end_date.gt.${nowIso}`)
      .order("created_at", { ascending: false })
      .range(offset, offset + safeLimit - 1)

    if (error) {
      console.error("[API] Deals products error:", error.message)
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
    }, "deals")
  } catch (error) {
    console.error("[API] Deals products exception:", error)
    return NextResponse.json(
      { products: [], hasMore: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
