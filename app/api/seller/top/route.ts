import { createStaticClient } from "@/lib/supabase/server"
import { logError } from "@/lib/logger"
import { cachedJsonResponse, noStoreJson } from "@/lib/api/response-helpers"

const PRERENDER_FETCH_REJECTION_MESSAGE =
  "During prerendering, fetch() rejects when the prerender is complete."

/**
 * GET /api/seller/top
 *
 * Returns top sellers sorted by product count (max 20).
 * Used by the category browse drawer's sellers tab.
 * Cached via static client (anon, no cookies).
 */

export interface TopSeller {
  id: string
  username: string | null
  store_name: string
  description: string | null
  verified: boolean
  product_count: number
  total_rating: number | null
  avatar_url: string | null
}

interface SellerQueryRow {
  id: string
  username: string | null
  display_name: string | null
  business_name: string | null
  bio: string | null
  verified: boolean | null
  avatar_url: string | null
  products: { id: string; rating: number | null }[]
}

function isExpectedPrerenderFetchRejection(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes(PRERENDER_FETCH_REJECTION_MESSAGE)
  }

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>
    const details = [record.message, record.details, record.hint]
      .filter((value): value is string => typeof value === "string")
      .join(" ")
    return details.includes(PRERENDER_FETCH_REJECTION_MESSAGE)
  }

  return false
}

export async function GET() {
  try {
    const supabase = createStaticClient()

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
          id,
          username,
          display_name,
          business_name,
          bio,
          verified,
          avatar_url,
          products (
            id,
            rating
          )
        `,
      )
      .eq("is_seller", true)
      .not("username", "is", null)
      .order("verified", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      if (!isExpectedPrerenderFetchRejection(error)) {
        logError("[api/seller/top] Supabase query failed", error)
      }
      return noStoreJson({ sellers: [] }, { status: 500 })
    }

    const rows = (data ?? []) as SellerQueryRow[]

    const sellers: TopSeller[] = rows
      .map((row) => {
        const products = row.products ?? []
        const validRatings = products.filter((p) => p.rating != null && p.rating > 0)
        const avgRating =
          validRatings.length > 0
            ? validRatings.reduce((sum, p) => sum + (p.rating ?? 0), 0) / validRatings.length
            : null

        return {
          id: row.id,
          username: row.username,
          store_name: row.display_name ?? row.business_name ?? row.username ?? "Unknown",
          description: row.bio,
          verified: row.verified ?? false,
          product_count: products.length,
          total_rating: avgRating,
          avatar_url: row.avatar_url ?? null,
        }
      })
      .sort((a, b) => b.product_count - a.product_count)
      .slice(0, 20)

    return cachedJsonResponse({ sellers }, "categories")
  } catch (err) {
    if (!isExpectedPrerenderFetchRejection(err)) {
      logError("[api/seller/top] Unexpected error", err instanceof Error ? err : new Error(String(err)))
    }
    return noStoreJson({ sellers: [] }, { status: 500 })
  }
}
