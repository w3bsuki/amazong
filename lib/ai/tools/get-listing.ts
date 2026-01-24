import "server-only"

import { createStaticClient } from "@/lib/supabase/server"
import { normalizeImageUrls } from "@/lib/normalize-image-url"
import type { ListingDetail } from "@/lib/ai/schemas/listings"
import { z } from "zod"

const GetListingInputSchema = z.object({
  id: z.string().min(1),
})

export type GetListingInput = z.infer<typeof GetListingInputSchema>

export async function getListing(input: GetListingInput): Promise<ListingDetail | null> {
  const parsed = GetListingInputSchema.safeParse(input)
  if (!parsed.success) return null

  const supabase = createStaticClient()
  if (!supabase) return null

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
        id,
        title,
        description,
        price,
        images,
        slug,
        seller:profiles(username)
      `,
    )
    .eq("id", parsed.data.id)
    .maybeSingle()

  if (error || !product) return null

  const normalizedImages = Array.isArray(product.images) ? product.images : []

  return {
    id: product.id,
    title: product.title,
    description: product.description ?? null,
    price: product.price,
    images: normalizeImageUrls(normalizedImages),
    slug: product.slug,
    storeSlug: product.seller?.username || null,
  }
}

export const getListingToolInputSchema = GetListingInputSchema

