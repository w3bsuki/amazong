import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI } from "@/lib/data/products"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "12", 10)
  const category = searchParams.get("category")
  
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
    let query = supabase
      .from('products')
      .select(`
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
        seller:profiles(username),
        categories!inner(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon,parent:categories(id,slug,name,name_bg,icon))))
      `, { count: 'exact' })

    if (category) {
      query = query.eq('categories.slug', category)
    }

    const { data, error, count } = await query
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
        is_boosted: (p as any).is_boosted,
        boost_expires_at: (p as any).boost_expires_at,
        slug: p.slug,
        store_slug: p.seller?.username ?? null,
        category_slug: p.categories?.slug ?? null,
        categories: (p as any).categories ?? null,
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
