import { z } from "zod"

export const ListingCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  images: z.array(z.string()),
  slug: z.string().nullable(),
  storeSlug: z.string().nullable(),
})

export type ListingCard = z.infer<typeof ListingCardSchema>

export const ListingDetailSchema = ListingCardSchema.extend({
  description: z.string().nullable().optional(),
})

export type ListingDetail = z.infer<typeof ListingDetailSchema>

export const SearchListingsInputSchema = z.object({
  query: z.string().trim().min(2).max(80),
  limit: z.coerce.number().int().min(1).max(20).optional(),
})

export type SearchListingsInput = z.infer<typeof SearchListingsInputSchema>

