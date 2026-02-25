import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { createStaticClient } from "@/lib/supabase/server"
import { normalizeOptionalImageUrl } from "@/lib/normalize-image-url"
import type { CategoryWithChildren } from "./types"
import {
  buildCategoryTree,
  type CategoryHierarchyRow,
} from "./tree"

import { logger } from "@/lib/logger"
export { getCategoryBySlug, getCategoryContext, getCategoryContextById } from "./context"

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
