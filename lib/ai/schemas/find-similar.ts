import { z } from "zod"

export const FindSimilarRequestSchema = z.object({
  imageUrl: z.string().url().max(2048),
  limit: z.coerce.number().int().min(1).max(20).optional(),
})

export const FindSimilarExtractedSchema = z.object({
  query: z.string().trim().min(2).max(80),
  categoryHint: z.string().trim().min(2).max(120).optional(),
  brandHint: z.string().trim().min(2).max(80).optional(),
  keywords: z.array(z.string().trim().min(2).max(32)).max(12).optional(),
})
