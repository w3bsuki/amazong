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
 * Uses category_ancestors array for efficient counting.
 * Fetches L0, L1, L2 categories based on parent_id hierarchy.
 * Returns empty array on failure (graceful degradation).
 */
async function getCategoryCountsCached(): Promise<CategoryCount[]> {
  'use cache'
  cacheTag('categories:counts')
  cacheLife('categories')

  try {
    const supabase = createStaticClient()

    // Get all categories - we'll filter by hierarchy depth
    // L0: parent_id is null
    // L1: parent's parent_id is null  
    // L2: grandparent's parent_id is null
    const { data: allCats, error: catsError } = await supabase
      .from("categories")
      .select("id, slug, parent_id")
      .lt("display_order", 9000)
      .order("display_order", { ascending: true })

    if (catsError || !allCats) {
      // Log only in development to avoid noise in production
      if (process.env.NODE_ENV === "development") {
        console.debug("Category counts: Error fetching categories:", catsError?.message)
      }
      return []
    }

    // Build parent lookup for depth calculation
    const parentMap = new Map(allCats.map(c => [c.id, c.parent_id]))
    
    // Calculate depth for each category
    const getDepth = (id: string): number => {
      let depth = 0
      let currentId: string | null = id
      while (currentId && parentMap.has(currentId)) {
        const parentId = parentMap.get(currentId)
        if (!parentId) break
        depth++
        currentId = parentId
      }
      return depth
    }

    // Filter to L0, L1, L2 only (depth 0, 1, 2)
    const catsToCount = allCats.filter(cat => getDepth(cat.id) <= 2)

    // Count products for each category
    // Products have category_ancestors array containing all ancestor category IDs
    const counts = await Promise.all(
      catsToCount.map(async (cat) => {
        try {
          const { count, error: countError } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .contains('category_ancestors', [cat.id])
          
          if (countError) {
            // Silent failure for individual category counts
            return { slug: cat.slug, count: 0 }
          }

          return { 
            slug: cat.slug, 
            count: count ?? 0 
          }
        } catch {
          return { slug: cat.slug, count: 0 }
        }
      })
    )

    return counts
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
