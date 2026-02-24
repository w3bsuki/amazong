import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { createStaticClient } from "@/lib/supabase/server"
import { normalizeOptionalImageUrl } from "@/lib/normalize-image-url"
import { logger } from "@/lib/logger"
import type {
  CategoryTreeNodeLite,
  CategoryWithChildren,
} from "./types"
import {
  buildCategoryTree,
  buildCategoryTreeLite,
  fetchChildCategoriesLiteBatched,
  type CategoryHierarchyRow,
} from "./tree"

export { getCategoryBySlug, getCategoryContext } from "./context"

function isMissingBrowseableColumnError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false

  const record = error as Record<string, unknown>
  const code = typeof record.code === "string" ? record.code : ""
  const message = typeof record.message === "string" ? record.message : ""
  return code === "42703" && message.includes("is_browseable")
}

/**
 * Fetch category hierarchy starting from root categories.
 *
 * PERFORMANCE OPTIMIZATION (Jan 2026):
 * - Fetches L0 → L1 → L2 only (~3,400 categories, ~60KB gzipped)
 * - L3 categories (~9,700) are lazy-loaded via /api/categories/[parentId]/children
 * - This reduces initial payload by ~80% (from ~400KB to ~60KB)
 *
 * @param slug - Reserved for future use (currently ignored)
 * @param depth - Max depth: 0=L0 only, 1=L0+L1, 2=L0+L1+L2 (default & max)
 * @returns Nested category tree structure (L0 → L1 → L2, no L3)
 */
export async function getCategoryHierarchy(
  _slug?: string | null,
  depth: number = 2,
): Promise<CategoryWithChildren[]> {
  "use cache"
  cacheTag("categories:tree")
  cacheLife("categories")
  try {
    const supabase = createStaticClient()

    // Clamp depth to max 2 (L3 is always lazy-loaded)
    const effectiveDepth = Math.min(depth, 2)

    // Fetch L0 categories (root)
    const buildRootQuery = () =>
      supabase
        .from("categories")
        .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
        .is("parent_id", null)
        .lt("display_order", 9000)
        .order("display_order", { ascending: true })

    let { data: rootCats, error: rootError } = await buildRootQuery().eq("is_browseable", true)
    if (rootError && isMissingBrowseableColumnError(rootError)) {
      ;({ data: rootCats, error: rootError } = await buildRootQuery())
    }

    if (rootError) {
      logger.error("[getCategoryHierarchy] Root query error", rootError)
      return []
    }

    if (!rootCats || rootCats.length === 0) return []

    if (effectiveDepth === 0) {
      return (rootCats || []).map((cat) => ({
        ...cat,
        image_url: normalizeOptionalImageUrl(cat.image_url),
        children: [],
      }))
    }

    // Fetch L1 categories
    const rootIds = rootCats.map((c) => c.id)
    const buildL1Query = () =>
      supabase
        .from("categories")
        .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
        .in("parent_id", rootIds)
        .lt("display_order", 9000)
        .order("display_order", { ascending: true })

    let { data: l1Cats, error: l1Error } = await buildL1Query().eq("is_browseable", true)
    if (l1Error && isMissingBrowseableColumnError(l1Error)) {
      ;({ data: l1Cats, error: l1Error } = await buildL1Query())
    }

    if (l1Error) {
      logger.error("[getCategoryHierarchy] L1 query error", l1Error)
    }

    // Fetch L2 categories if depth >= 2 (batched to avoid large IN clauses)
    const l2Cats: typeof l1Cats = []
    if (effectiveDepth >= 2 && l1Cats && l1Cats.length > 0) {
      const l1Ids = l1Cats.map((c) => c.id)
      const BATCH_SIZE = 50

      // Use Promise.all for parallel fetching
      const batches = []
      for (let i = 0; i < l1Ids.length; i += BATCH_SIZE) {
        batches.push(l1Ids.slice(i, i + BATCH_SIZE))
      }

      const results = await Promise.all(
        batches.map(async (batchIds) => {
          const buildL2Query = () =>
            supabase
              .from("categories")
              .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
              .in("parent_id", batchIds)
              .lt("display_order", 9000)
              .order("display_order", { ascending: true })

          let result = await buildL2Query().eq("is_browseable", true)
          if (result.error && isMissingBrowseableColumnError(result.error)) {
            result = await buildL2Query()
          }

          return result
        }),
      )

      for (const result of results) {
        if (result.data) {
          l2Cats.push(...result.data)
        }
      }
    }

    // NOTE: L3 categories are NOT fetched here.
    // They are lazy-loaded via /api/categories/[parentId]/children when L2 is clicked.
    // This reduces initial payload from ~400KB to ~60KB (13K → 3.4K categories).

    // Combine and build tree (L0 + L1 + L2 only)
    const allCats = [...(rootCats || []), ...(l1Cats || []), ...l2Cats]

    // Create sets for efficient depth lookups
    const rootIdSet = new Set(rootIds)
    const l1Ids = new Set((l1Cats || []).map((c) => c.id))

    const rows: CategoryHierarchyRow[] = allCats.map((cat) => {
      // Calculate depth based on parent membership
      let catDepth = 0
      if (cat.parent_id === null) {
        catDepth = 0 // Root/L0
      } else if (rootIdSet.has(cat.parent_id)) {
        catDepth = 1 // L1 (parent is L0)
      } else if (l1Ids.has(cat.parent_id)) {
        catDepth = 2 // L2 (parent is L1)
      }

      return {
        id: cat.id,
        name: cat.name,
        name_bg: cat.name_bg,
        slug: cat.slug,
        parent_id: cat.parent_id,
        icon: cat.icon,
        image_url: normalizeOptionalImageUrl(cat.image_url),
        display_order: cat.display_order,
        depth: catDepth,
        path: [],
      }
    })

    return buildCategoryTree(rows)
  } catch (error) {
    logger.error("[getCategoryHierarchy] Unexpected error", error)
    return []
  }
}

/**
 * Category tree for selector UIs that need stable client-side navigation.
 *
 * Used by:
 * - Sell flow (category picker needs L0 → L3 without extra client fetching)
 * - Business dashboard product forms (same selector requirement)
 */
export async function getCategoryTreeDepth3(): Promise<CategoryTreeNodeLite[]> {
  "use cache"
  cacheTag("categories:tree", "categories:sell", "categories:sell:depth:3")
  cacheLife("categories")

  const supabase = createStaticClient()

  const { data: rootCats, error: rootError } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, parent_id, display_order")
    .is("parent_id", null)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })

  if (rootError) {
    logger.error("[getCategoryTreeDepth3] Root query error", rootError)
    return []
  }

  if (!rootCats || rootCats.length === 0) return []

  const rootIds = rootCats.map((c) => c.id)
  const { data: l1Cats, error: l1Error } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, parent_id, display_order")
    .in("parent_id", rootIds)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })

  if (l1Error) {
    logger.error("[getCategoryTreeDepth3] L1 query error", l1Error)
  }

  const l1Ids = (l1Cats || []).map((c) => c.id)
  const l2Cats = await fetchChildCategoriesLiteBatched(supabase, l1Ids, {
    batchSize: 100,
    concurrency: 4,
    label: "L2",
  })

  const l2Ids = l2Cats.map((c) => c.id)
  const l3Cats = await fetchChildCategoriesLiteBatched(supabase, l2Ids, {
    batchSize: 100,
    concurrency: 4,
    label: "L3",
  })

  // Fetch child counts for L3 categories to know which have L4 children
  const l3Ids = l3Cats.map((c) => c.id)
  const childCountMap = new Map<string, number>()

  if (l3Ids.length > 0) {
    // Query to get count of children for each L3 category
    const BATCH_SIZE = 200
    for (let i = 0; i < l3Ids.length; i += BATCH_SIZE) {
      const batchIds = l3Ids.slice(i, i + BATCH_SIZE)
      const { data: childCounts, error: countError } = await supabase
        .from("categories")
        .select("parent_id")
        .in("parent_id", batchIds)
        .lt("display_order", 9000)

      if (!countError && childCounts) {
        // Count children per parent
        for (const row of childCounts) {
          if (row.parent_id) {
            childCountMap.set(row.parent_id, (childCountMap.get(row.parent_id) || 0) + 1)
          }
        }
      }
    }
  }

  const allCats = [...rootCats, ...(l1Cats || []), ...l2Cats, ...l3Cats]
  return buildCategoryTreeLite(allCats, childCountMap)
}
