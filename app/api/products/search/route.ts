import { createStaticClient } from "@/lib/supabase/server"
import { fetchQuickSearchProducts } from "@/lib/data/products/api-search"
import { cachedJsonResponse, dbUnavailableResponse, errorResponse } from "@/lib/api/response-helpers"
import { z } from "zod"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"

import { logger } from "@/lib/logger"
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
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid query", 400, { products: [], hasMore: false })
    }

    const query = parsed.data.q
    const safeLimit = parsed.data.limit ?? 10

    const supabase = createStaticClient()
    if (!supabase) {
      return dbUnavailableResponse({ products: [], hasMore: false })
    }

    const result = await fetchQuickSearchProducts({ supabase, query, limit: safeLimit })
    if (!result.ok) {
      logger.error("Search error:", result.error)
      return errorResponse("Failed to search products", 500, { products: [], hasMore: false })
    }

    return cachedJsonResponse({ products: result.products })
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    logger.error("Search API Error:", error)
    return errorResponse("Internal server error", 500, { products: [], hasMore: false })
  }
}
