import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { createStaticClient } from "@/lib/supabase/server"
import { normalizeOptionalImageUrl } from "@/lib/normalize-image-url"
import { logger } from "@/lib/logger"
import { resolveCategoryAttributesWithClient } from "@/lib/data/category-attributes"
import { getSubcategoriesForBrowse } from "./subcategories"
import type {
  Category,
  CategoryContext,
  CategoryTreeNodeLite,
  CategoryWithChildren,
  CategoryWithParent,
} from "./types"
import {
  buildCategoryTree,
  buildCategoryTreeLite,
  fetchChildCategoriesLiteBatched,
  type CategoryHierarchyRow,
} from "./tree"

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
    const { data: rootCats, error: rootError } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
      .is("parent_id", null)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true })

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
    const rootIds = (rootCats || []).map((c) => c.id)
    const { data: l1Cats, error: l1Error } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
      .in("parent_id", rootIds)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true })

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
        batches.map((batchIds) =>
          supabase
            .from("categories")
            .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
            .in("parent_id", batchIds)
            .lt("display_order", 9000)
            .order("display_order", { ascending: true }),
        ),
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

/**
 * Fetch a single category by slug with its parent.
 * Optimized for page metadata and breadcrumbs.
 *
 * @param slug - Category slug
 * @returns Category with parent or null if not found
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryWithParent | null> {
  "use cache"
  cacheTag(`category:${slug}`)
  cacheLife("categories")

  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id, name, name_bg, slug, parent_id, image_url, icon, display_order,
      parent:parent_id (id, name, name_bg, slug, parent_id, image_url, icon, display_order)
    `)
    .eq("slug", slug)
    .single()

  if (error || !data) {
    logger.error("[getCategoryBySlug] Query error", error)
    return null
  }

  // Supabase returns parent as array for relations, take first element
  const parentData = Array.isArray(data.parent) ? data.parent[0] : data.parent

  return {
    ...data,
    parent: parentData as Category | null,
  }
}

/**
 * Fetch complete category context for sidebar navigation.
 * Includes current category, parent, siblings, children, and filterable attributes.
 *
 * @param slug - Category slug
 * @returns Full category context or null if not found
 */
export async function getCategoryContext(slug: string): Promise<CategoryContext | null> {
  "use cache"
  cacheTag(`category:${slug}`)
  cacheLife("categories")

  const supabase = createStaticClient()

  // Get current category with parent
  const { data: current, error: currentError } = await supabase
    .from("categories")
    .select(`
      id, name, name_bg, slug, parent_id, image_url, icon, display_order,
      parent:parent_id (id, name, name_bg, slug, parent_id, image_url, icon, display_order)
    `)
    .eq("slug", slug)
    .single()

  if (currentError || !current) {
    logger.error("[getCategoryContext] Category not found", currentError)
    return null
  }

  // Fetch siblings, children (DEC-002), and attributes in parallel
  const [siblingsResult, childrenWithCounts, attributesResult] = await Promise.all([
    // Siblings (same parent, exclude hidden)
    current.parent_id
      ? supabase
          .from("categories")
          .select("id, name, name_bg, slug, parent_id, image_url, icon, display_order")
          .eq("parent_id", current.parent_id)
          .lt("display_order", 9999)
          .order("display_order")
          .order("name")
      : supabase
          .from("categories")
          .select("id, name, name_bg, slug, parent_id, image_url, icon, display_order")
          .is("parent_id", null)
          .lt("display_order", 9999)
          .order("display_order")
          .order("name"),

    // Children: fetch ALL, sorting handles curated-first ordering
    // filterForBrowse=false ensures all children show as navigation circles
    getSubcategoriesForBrowse(current.id, false),

    // Filterable attributes (current + inherited by scope)
    resolveCategoryAttributesWithClient(supabase, current.id, {
      includeParents: true,
      includeGlobal: true,
      filterableOnly: true,
    }),
  ])

  const { attributes, ancestorIds } = attributesResult

  for (const id of ancestorIds) {
    cacheTag(`attrs:category:${id}`)
  }
  cacheTag("attrs:global")

  return {
    current: {
      id: current.id,
      name: current.name,
      name_bg: current.name_bg,
      slug: current.slug,
      parent_id: current.parent_id,
      image_url: current.image_url,
      icon: current.icon,
      display_order: current.display_order,
    },
    // Supabase returns parent as array for relations, take first element
    parent: (Array.isArray(current.parent) ? current.parent[0] : current.parent) as Category | null,
    siblings: (siblingsResult.data || []) as Category[],
    // DEC-002: Children filtered/sorted via getSubcategoriesForBrowse (curated + populated)
    children: childrenWithCounts as Category[],
    attributes,
  }
}
