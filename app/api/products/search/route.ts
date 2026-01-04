import { createStaticClient } from "@/lib/supabase/server"
import { normalizeImageUrls } from "@/lib/normalize-image-url"
import { NextResponse } from "next/server"
import { cachedJsonResponse } from "@/lib/api/response-helpers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get("q")?.trim()
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query = rawQuery?.slice(0, 80)
    const safeLimit = Math.min(Math.max(Number.isFinite(limit) ? limit : 10, 1), 20)

    if (!query || query.length < 2) {
      return cachedJsonResponse({ products: [] })
    }

    const supabase = createStaticClient()
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
      .limit(safeLimit)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ products: [] })
    }

    // Transform to include storeSlug at top level for easier client consumption
    const transformedProducts = (products || []).map((p) => {
      const normalizedImages = Array.isArray(p.images) ? p.images : []

      return {
        id: p.id,
        title: p.title,
        price: p.price,
        images: normalizeImageUrls(normalizedImages),
        slug: p.slug,
        storeSlug: p.seller?.username || null,
      }
    })

    return cachedJsonResponse({ products: transformedProducts })
  } catch (error) {
    console.error("Search API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}