import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { connection } from "next/server"

export async function GET(request: Request) {
  await connection()
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.trim()
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] })
    }

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Use ILIKE for flexible search (supports Cyrillic/Bulgarian)
    const searchPattern = `%${query}%`
    
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        id,
        title,
        price,
        images,
        slug,
        seller:profiles(username)
      `)
      .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
      .limit(limit)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ products: [] })
    }

    // Transform to include storeSlug at top level for easier client consumption
    const transformedProducts = (products || []).map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      images: p.images,
      slug: p.slug,
      storeSlug: p.seller?.username || null,
    }))

    return NextResponse.json({ products: transformedProducts })
  } catch (error) {
    console.error("Search API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
