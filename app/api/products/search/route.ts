import { createClient } from "@/lib/supabase/server"
import { normalizeImageUrls } from "@/lib/normalize-image-url"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
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
        product_images(image_url,thumbnail_url,display_order,is_primary),
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
    const transformedProducts = (products || []).map((p) => {
      const productImages = (p as any).product_images as
        | Array<{ image_url: string; display_order?: number | null; is_primary?: boolean | null }>
        | null

      const normalizedImages = Array.isArray(p.images) && p.images.length > 0
        ? p.images
        : (productImages || [])
            .filter((img) => !!img?.image_url)
            .slice()
            .sort((a, b) => {
              const ap = a.is_primary ? 1 : 0
              const bp = b.is_primary ? 1 : 0
              if (ap !== bp) return bp - ap
              const ao = a.display_order ?? 0
              const bo = b.display_order ?? 0
              return ao - bo
            })
            .map((img) => img.image_url)

      return {
        id: p.id,
        title: p.title,
        price: p.price,
        images: normalizeImageUrls(normalizedImages),
        slug: p.slug,
        storeSlug: p.seller?.username || null,
      }
    })

    return NextResponse.json({ products: transformedProducts })
  } catch (error) {
    console.error("Search API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}