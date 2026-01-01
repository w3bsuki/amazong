import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI } from "@/lib/data/products"

// Public, query-string keyed endpoint. Align caching with next.config.ts cacheLife.deals
// (stale: 30s, revalidate: 120s) - map to CDN headers conservatively.
const CACHE_TTL_SECONDS = 120
const CACHE_STALE_WHILE_REVALIDATE = 30

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
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "12", 10)

  const safeLimit = Math.min(limit, 24)
  const offset = (page - 1) * safeLimit
  const nowIso = new Date().toISOString()

  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return NextResponse.json(
        { products: [], hasMore: false, error: "Database unavailable" },
        { status: 503 }
      )
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
        seller:profiles(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),
        categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon))))
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

    const products = (data || []).map((p) => ({
      ...toUI({
        id: p.id,
        title: p.title,
        price: p.price,
        seller_id: p.seller_id,
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
    console.error("[API] Deals products exception:", error)
    return NextResponse.json(
      { products: [], hasMore: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
