import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI } from "@/lib/data/products"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "12", 10)
  const category = searchParams.get("category")

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
        is_prime,
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

    const products = (data || []).map((p) => ({
      ...toUI({
        id: p.id,
        title: p.title,
        price: p.price,
        list_price: p.list_price,
        rating: p.rating,
        review_count: p.review_count,
        images: p.images,
        product_images: p.product_images,
        product_attributes: p.product_attributes,
        is_prime: p.is_prime,
        is_boosted: p.is_boosted,
        boost_expires_at: p.boost_expires_at,
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
    console.error("[API] Promoted products exception:", error)
    return NextResponse.json(
      { products: [], hasMore: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
