import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI } from "@/lib/data/products"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "12", 10)
  
  // Cap limit to prevent abuse
  const safeLimit = Math.min(limit, 24)
  const offset = (page - 1) * safeLimit
  
  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return NextResponse.json({ 
        products: [], 
        hasMore: false,
        error: "Database unavailable" 
      }, { status: 503 })
    }

    // Query newest products with pagination
    const { data, error, count } = await supabase
      .from('products')
      .select(`
        id, 
        title, 
        price, 
        list_price, 
        rating, 
        review_count, 
        images, 
        is_prime, 
        created_at, 
        slug,
        attributes,
        sellers(store_slug),
        categories(slug)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + safeLimit - 1)

    if (error) {
      console.error("[API] Newest products error:", error.message)
      return NextResponse.json({ 
        products: [], 
        hasMore: false,
        error: error.message 
      }, { status: 500 })
    }

    // Transform to UI format
    const products = (data || []).map((p: any) => ({
      ...toUI({
        id: p.id,
        title: p.title,
        price: p.price,
        list_price: p.list_price,
        rating: p.rating,
        review_count: p.review_count,
        images: p.images,
        is_prime: p.is_prime,
        slug: p.slug,
        store_slug: p.sellers?.store_slug ?? null,
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
    console.error("[API] Newest products exception:", error)
    return NextResponse.json({ 
      products: [], 
      hasMore: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}
