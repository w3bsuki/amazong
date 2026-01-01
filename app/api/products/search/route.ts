import { createStaticClient } from "@/lib/supabase/server"
import { normalizeImageUrls } from "@/lib/normalize-image-url"
import { NextResponse } from "next/server"

// Public, query-string keyed endpoint. Align caching with next.config.ts cacheLife.products
const CACHE_TTL_SECONDS = 300
const CACHE_STALE_WHILE_REVALIDATE = 60

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
        product_images(image_url,thumbnail_url,display_order,is_primary),
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
      const productImages = p.product_images

      const normalizedImages = Array.isArray(p.images) && p.images.length > 0
        ? p.images
        : (productImages || [])
            .filter((img) => !!img?.image_url)
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

    return cachedJsonResponse({ products: transformedProducts })
  } catch (error) {
    console.error("Search API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}