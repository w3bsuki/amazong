import { createStaticClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cacheLife, cacheTag } from "next/cache"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"

// This endpoint returns product counts for ALL categories (L0, L1, L2)
// Used for sidebar category navigation to show listing counts

// Cache for 1 hour, stale for 5 min (counts don't need to be real-time)
const CACHE_TTL_SECONDS = 3600
const CACHE_STALE_WHILE_REVALIDATE = 300

interface CategoryCount {
  slug: string
  count: number
}

/**
 * Get product counts for all categories.
 * Reads from `category_stats` (view backed by a materialized view) for speed.
 * Filters to L0, L1, L2 categories using the precomputed `depth`.
 * Returns empty array on failure (graceful degradation).
 */
async function getCategoryCountsCached(): Promise<CategoryCount[]> {
  'use cache'
  cacheTag('categories:counts')
  cacheLife('categories')

  try {
    const supabase = createStaticClient()

    const { data: stats, error: statsError } = await supabase
      .from('category_stats')
      .select('slug, depth, subtree_product_count')
      .lte('depth', 2)

    if (statsError || !stats) {
      if (process.env.NODE_ENV === "development") {
        console.debug("Category counts: Error fetching category_stats:", statsError?.message)
      }
      return []
    }

    return stats
      .filter((row) => typeof row.slug === "string")
      .map((row) => ({
        slug: row.slug as string,
        count: row.subtree_product_count ?? 0,
      }))
  } catch (error) {
    // Allow prerender interruptions to propagate
    if (isNextPrerenderInterrupted(error)) throw error
    
    // Log only in development
    if (process.env.NODE_ENV === "development") {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.debug("Category counts: Cache function error:", message)
    }
    return []
  }
}

export async function GET() {
  try {
    const counts = await getCategoryCountsCached()
    
    // Convert to map for easier client-side lookup
    const countsMap = Object.fromEntries(
      counts.map(c => [c.slug, c.count])
    )

    return NextResponse.json(
      { counts: countsMap },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
          'CDN-Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
          'Vercel-CDN-Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
        }
      }
    )
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    
    // Log only in development to avoid production noise
    if (process.env.NODE_ENV === "development") {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.debug("Category Counts API Error:", message)
    }
    
    // Return empty counts with success status (graceful degradation)
    // This prevents client-side fetch errors while still indicating no data
    return NextResponse.json(
      { counts: {} },
      {
        headers: {
          // Shorter cache for error responses - allow quick retry
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        }
      }
    )
  }
}
