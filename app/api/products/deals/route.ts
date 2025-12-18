import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI } from "@/lib/data/products"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "12", 10)

  const safeLimit = Math.min(limit, 24)
  const offset = (page - 1) * safeLimit

  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return NextResponse.json(
        { products: [], hasMore: false, error: "Database unavailable" },
        { status: 503 }
      )
    }

    // "Deals" = products with a list price set.
    // Note: we can't reliably compare list_price > price server-side with the basic query builder,
    // so we treat list_price presence as the deal signal (and the UI will show the strikethrough).
    const { data, error, count } = await supabase
      .from("products")
      .select(
        `
        id,
        title,
        price,
        seller_id,
        list_price,
        rating,
        review_count,
        images,
        product_images(image_url,thumbnail_url,display_order,is_primary),
        product_attributes(name,value),
        is_prime,
        created_at,
        slug,
        attributes,
        seller:profiles(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),
        categories(slug)
      `,
        { count: "exact" }
      )
      .not("list_price", "is", null)
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
        rating: p.rating,
        review_count: p.review_count,
        images: p.images,
        product_images: p.product_images,
        product_attributes: p.product_attributes,
        is_prime: p.is_prime,
        slug: p.slug,
        store_slug: p.seller?.username ?? null,
        category_slug: p.categories?.slug ?? null,
        attributes: p.attributes,
        seller_profile: p.seller ?? null,
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
    console.error("[API] Deals products exception:", error)
    return NextResponse.json(
      { products: [], hasMore: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
