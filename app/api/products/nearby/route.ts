import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI } from "@/lib/data/products"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "12", 10)
  const city = (searchParams.get("city") || "").trim()
  const category = searchParams.get("category")

  const safeLimit = Math.min(limit, 24)
  const offset = (page - 1) * safeLimit

  // No city selected -> return empty (tab should prompt user to pick one)
  if (!city) {
    return NextResponse.json({ products: [], hasMore: false, totalCount: 0, page })
  }

  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return NextResponse.json(
        { products: [], hasMore: false, error: "Database unavailable" },
        { status: 503 }
      )
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
        product_images(image_url,thumbnail_url,display_order,is_primary),
        product_attributes(name,value),
        is_boosted,
        boost_expires_at,
        created_at,
        slug,
        attributes,
        seller:profiles(username),
        categories!inner(slug)
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

    const products = (data || []).map((p) => ({
      ...toUI({
        id: p.id,
        title: p.title,
        price: p.price,
        list_price: p.list_price,
        is_on_sale: (p as any).is_on_sale,
        sale_percent: (p as any).sale_percent,
        sale_end_date: (p as any).sale_end_date,
        rating: p.rating,
        review_count: p.review_count,
        images: p.images,
        product_images: p.product_images,
        product_attributes: p.product_attributes,
        is_boosted: (p as any).is_boosted,
        boost_expires_at: (p as any).boost_expires_at,
        slug: p.slug,
        store_slug: p.seller?.username ?? null,
        category_slug: p.categories?.slug ?? null,
        attributes: p.attributes,
      }),
    }))

    const totalCount = count || 0
    const hasMore = offset + products.length < totalCount

    return NextResponse.json({
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
