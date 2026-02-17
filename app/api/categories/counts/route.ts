import { getCategoryHierarchy, type CategoryWithChildren } from "@/lib/data/categories"
import { createStaticClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cacheLife, cacheTag } from "next/cache"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"

// This endpoint returns product counts for ALL categories (L0, L1, L2).
// Used for sidebar category navigation to show listing counts

// Cache for 1 hour, stale for 5 min (counts don't need to be real-time)
const CACHE_TTL_SECONDS = 3600
const CACHE_STALE_WHILE_REVALIDATE = 300
const shouldLogCategoryCountsErrors =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_E2E !== "true"

interface CategoryCount {
  slug: string
  count: number
}

interface FlatCategoryRef {
  id: string
  slug: string
}

function flattenCategories(nodes: CategoryWithChildren[]): FlatCategoryRef[] {
  const out: FlatCategoryRef[] = []
  const stack = [...nodes]

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) continue

    out.push({ id: current.id, slug: current.slug })

    if (current.children && current.children.length > 0) {
      for (const child of current.children) {
        stack.push(child)
      }
    }
  }

  return out
}

/**
 * Get product counts for all categories.
 * Reads category scope from canonical hierarchy (L0→L2) and merges stats by category_id.
 * Always returns all active scoped categories; missing stats fallback to 0.
 */
async function getCategoryCountsCached(): Promise<CategoryCount[]> {
  'use cache'
  cacheTag('categories:counts')
  cacheLife('categories')

  try {
    const scopedHierarchy = await getCategoryHierarchy(null, 2)
    if (!scopedHierarchy || scopedHierarchy.length === 0) {
      return []
    }

    const scopedCategories = flattenCategories(scopedHierarchy)
    if (scopedCategories.length === 0) {
      return []
    }

    const supabase = createStaticClient()
    const categoryIds = scopedCategories.map((cat) => cat.id)

    const { data: stats, error: statsError } = await supabase
      .from('category_stats')
      .select('category_id, subtree_product_count')
      .in('category_id', categoryIds)

    if (statsError && shouldLogCategoryCountsErrors) {
      console.debug("Category counts: Error fetching category_stats:", statsError?.message)
    }

    const countByCategoryId = new Map<string, number>()
    for (const row of stats ?? []) {
      if (!row.category_id) continue
      countByCategoryId.set(row.category_id, row.subtree_product_count ?? 0)
    }

    return scopedCategories.map((cat) => ({
      slug: cat.slug,
      count: countByCategoryId.get(cat.id) ?? 0,
    }))
  } catch (error) {
    // Allow prerender interruptions to propagate
    if (isNextPrerenderInterrupted(error)) throw error
    
    // Log only in development
    if (shouldLogCategoryCountsErrors) {
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
    if (shouldLogCategoryCountsErrors) {
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
