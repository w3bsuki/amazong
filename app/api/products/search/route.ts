import { createStaticClient } from "@/lib/supabase/server"
import { normalizeImageUrls } from "@/lib/normalize-image-url"
import { NextResponse } from "next/server"
import { cachedJsonResponse } from "@/lib/api/response-helpers"
import { z } from "zod"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"

const SearchQuerySchema = z.object({
  q: z.string().trim().min(2).max(80),
  limit: z.coerce.number().int().min(1).max(20).optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = SearchQuerySchema.safeParse({
      q: searchParams.get("q"),
      limit: searchParams.get("limit") ?? undefined,
    })

    if (!parsed.success) {
      return cachedJsonResponse({ products: [] })
    }

    const query = parsed.data.q
    const safeLimit = parsed.data.limit ?? 10

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
      // Public browsing surfaces must not show non-active listings.
      // Temporary legacy allowance: status can be NULL for older rows.
      .or("status.eq.active,status.is.null")
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
    if (isNextPrerenderInterrupted(error)) throw error
    console.error("Search API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
