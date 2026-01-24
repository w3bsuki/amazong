import "server-only"

import { createStaticClient } from "@/lib/supabase/server"
import { normalizeImageUrls } from "@/lib/normalize-image-url"
import type { ListingCard, SearchListingsInput } from "@/lib/ai/schemas/listings"
import { SearchListingsInputSchema } from "@/lib/ai/schemas/listings"

export async function searchListings(input: SearchListingsInput): Promise<ListingCard[]> {
  const parsed = SearchListingsInputSchema.safeParse(input)
  if (!parsed.success) return []

  const supabase = createStaticClient()
  if (!supabase) return []

  const { query, limit } = parsed.data
  const safeLimit = limit ?? 10
  const searchPattern = `%${query}%`

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
        id,
        title,
        price,
        images,
        slug,
        seller:profiles(username)
      `,
    )
    .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
    .limit(safeLimit)
    .order("created_at", { ascending: false })

  if (error) return []

  return (products || []).map((p) => {
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
}

