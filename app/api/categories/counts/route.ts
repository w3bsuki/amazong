import { getCategoryHierarchy, type CategoryWithChildren } from "@/lib/data/categories"
import { createStaticClient } from "@/lib/supabase/server"
import { cacheLife, cacheTag } from "next/cache"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { cachedJsonResponse } from "@/lib/api/response-helpers"
import { logger } from "@/lib/logger"

// This endpoint returns product counts for ALL categories (L0, L1, L2).
// Used for sidebar category navigation to show listing counts

const shouldLogCategoryCountsErrors =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_E2E !== "true"
let hasLoggedCategoryStatsError = false
let hasLoggedCategoryCacheError = false
let hasLoggedCategoryRouteError = false

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

    if (statsError && shouldLogCategoryCountsErrors && !hasLoggedCategoryStatsError) {
      hasLoggedCategoryStatsError = true
      logger.debug("Category counts: Error fetching category_stats", { error: statsError?.message })
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
    if (shouldLogCategoryCountsErrors && !hasLoggedCategoryCacheError) {
      hasLoggedCategoryCacheError = true
      const message = error instanceof Error ? error.message : "Unknown error"
      logger.debug("Category counts: Cache function error", { error: message })
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

    return cachedJsonResponse({ counts: countsMap }, "categories")
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    
    // Log only in development to avoid production noise
    if (shouldLogCategoryCountsErrors && !hasLoggedCategoryRouteError) {
      hasLoggedCategoryRouteError = true
      const message = error instanceof Error ? error.message : "Unknown error"
      logger.debug("Category counts API error", { error: message })
    }
    
    // Return empty counts with success status (graceful degradation)
    // This prevents client-side fetch errors while still indicating no data
    return cachedJsonResponse({ counts: {} }, "shared")
  }
}
