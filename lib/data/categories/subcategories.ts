import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { createStaticClient } from "@/lib/supabase/server"
import { normalizeOptionalImageUrl } from "@/lib/normalize-image-url"
import { logger } from "@/lib/logger"
import type { CategoryWithCount } from "./types"

/**
 * Fetch subcategories with their product counts from category_stats.
 * Used for buyer browse UX to filter out empty categories.
 *
 * @param parentId - Parent category UUID (null for root categories)
 * @param populatedOnly - If true, only return categories with products (default: false)
 * @returns Array of subcategories with subtree_product_count
 */
export async function getSubcategoriesWithCounts(
  parentId: string | null,
  populatedOnly: boolean = false,
): Promise<CategoryWithCount[]> {
  "use cache"
  cacheTag(`subcategories:${parentId || "root"}:counts`)
  cacheLife("categories")

  const supabase = createStaticClient()

  // 2-query merge approach: avoids PostgREST relationship issues with materialized views
  // Query 1: Get categories by parent
  let catQuery = supabase
    .from("categories")
    .select("id, name, name_bg, slug, parent_id, image_url, icon, display_order")
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })

  if (parentId) {
    catQuery = catQuery.eq("parent_id", parentId)
  } else {
    catQuery = catQuery.is("parent_id", null)
  }

  const { data: categories, error: catError } = await catQuery

  if (catError) {
    logger.error("[getSubcategoriesWithCounts] Categories query error", catError)
    return []
  }

  if (!categories || categories.length === 0) {
    return []
  }

  // Query 2: Get counts for these category IDs from category_stats (materialized view)
  const categoryIds = categories.map((c) => c.id)

  const { data: statsRaw, error: statsError } = await supabase
    .from("category_stats")
    .select("category_id, subtree_product_count")
    .in("category_id", categoryIds)

  if (statsError) {
    logger.error("[getSubcategoriesWithCounts] Stats query error", statsError)
    // Fallback: return categories with 0 counts rather than failing completely
  }

  const stats = statsRaw ?? []

  // Build lookup map for counts
  const countMap = new Map<string, number>()
  for (const stat of stats) {
    if (!stat.category_id) continue
    countMap.set(stat.category_id, stat.subtree_product_count ?? 0)
  }

  // Merge categories with counts
  const result: CategoryWithCount[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    name_bg: cat.name_bg,
    slug: cat.slug,
    parent_id: cat.parent_id,
    image_url: normalizeOptionalImageUrl(cat.image_url),
    icon: cat.icon,
    display_order: cat.display_order,
    subtree_product_count: countMap.get(cat.id) ?? 0,
  }))

  // Filter for populated only if requested
  if (populatedOnly) {
    return result.filter((cat) => cat.subtree_product_count > 0)
  }

  return result
}

/**
 * Get subcategories ordered by curated first, then by product count.
 * Implements DEC-002 ordering: display_order > 0 first, then by subtree_product_count DESC.
 *
 * @param parentId - Parent category UUID (null for root categories)
 * @param filterForBrowse - If true, only shows populated OR curated categories (for homepage).
 *                          If false (recommended for category pages), returns ALL children.
 * @returns Array of subcategories sorted by curated then popularity
 */
export async function getSubcategoriesForBrowse(
  parentId: string | null,
  filterForBrowse: boolean = false,
): Promise<CategoryWithCount[]> {
  "use cache"
  cacheLife("categories")
  cacheTag(`subcategories:${parentId || "root"}:counts`)
  if (parentId) cacheTag(`category-children:${parentId}`)
  cacheTag("categories:tree")

  // Always fetch all counts (we filter in TS for flexibility)
  const subcats = await getSubcategoriesWithCounts(parentId, false)

  // Only filter when explicitly requested (e.g., homepage browse)
  // Category pages should show ALL children for navigation
  const visible = filterForBrowse
    ? subcats.filter((cat) => {
        const isCurated = (cat.display_order ?? 0) > 0 && (cat.display_order ?? 9999) < 9000
        const isPopulated = cat.subtree_product_count > 0
        return isPopulated || isCurated
      })
    : subcats

  // Sort: curated (display_order > 0 && display_order < 9000) first, then by product count DESC
  return visible.sort((a, b) => {
    const aCurated = (a.display_order ?? 0) > 0 && (a.display_order ?? 9999) < 9000
    const bCurated = (b.display_order ?? 0) > 0 && (b.display_order ?? 9999) < 9000

    // Curated categories first
    if (aCurated && !bCurated) return -1
    if (!aCurated && bCurated) return 1

    // Within curated: sort by display_order
    if (aCurated && bCurated) {
      return (a.display_order ?? 999) - (b.display_order ?? 999)
    }

    // Within non-curated: sort by product count DESC, then by name ASC for consistency
    if (b.subtree_product_count !== a.subtree_product_count) {
      return b.subtree_product_count - a.subtree_product_count
    }
    return a.name.localeCompare(b.name)
  })
}
