import { createClient } from "@/lib/supabase/server"
import { NextResponse, connection } from "next/server"

// Get one featured product per subcategory for mega-menu
export async function GET(request: Request) {
  await connection()
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")
    
    if (!parentId) {
      return NextResponse.json({ error: "parentId is required" }, { status: 400 })
    }

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get all subcategory IDs for this parent
    const { data: subcategories } = await supabase
      .from("categories")
      .select("id, slug")
      .eq("parent_id", parentId)

    if (!subcategories || subcategories.length === 0) {
      return NextResponse.json({ products: {} })
    }

    // For each subcategory, get one product
    const subcategoryIds = subcategories.map(s => s.id)
    
    // Use a raw query to get one product per subcategory using DISTINCT ON
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        id,
        title,
        price,
        list_price,
        images,
        rating,
        slug,
        category_id
      `)
      .in("category_id", subcategoryIds)
      .order("rating", { ascending: false })
      .order("review_count", { ascending: false })
    
    if (error) {
      console.error("Products query error:", error)
      return NextResponse.json({ products: {} })
    }

    // Group by category_id and take only the first (best rated) product per category
    const productsByCategory: Record<string, any> = {}
    
    if (products) {
      for (const product of products) {
        const catId = product.category_id
        if (!productsByCategory[catId]) {
          productsByCategory[catId] = {
            id: product.id,
            title: product.title,
            price: product.price,
            list_price: product.list_price,
            image: product.images?.[0] || null,
            rating: product.rating,
            slug: product.slug
          }
        }
      }
    }

    return NextResponse.json({ products: productsByCategory })
  } catch (error: any) {
    console.error("Categories Products API Error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
