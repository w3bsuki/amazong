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

export const ListingTextGenerationSchema = z.object({
  title: z.string().trim().min(5).max(80),
  description: z.string().trim().min(50).max(2000),
  tags: z.array(z.string().trim().min(1).max(32)).min(3).max(10),
})

export type ListingTextGeneration = z.infer<typeof ListingTextGenerationSchema>
