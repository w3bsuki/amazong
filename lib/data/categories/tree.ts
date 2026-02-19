import { logger } from "@/lib/logger"
import type { createStaticClient } from "@/lib/supabase/server"
import type { CategoryTreeNodeLite, CategoryWithChildren } from "./types"

export interface CategoryHierarchyRow {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  depth: number
  path: string[]
  image_url: string | null
  icon: string | null
  display_order: number | null
}

/**
 * Transform flat RPC results into nested tree structure
 */
export function buildCategoryTree(rows: CategoryHierarchyRow[]): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>()
  const rootCategories: CategoryWithChildren[] = []

  // Filter out deprecated/hidden categories (display_order >= 9000)
  const activeRows = rows.filter((row) => (row.display_order ?? 0) < 9000)

  // First pass: create all category objects
  for (const row of activeRows) {
    categoryMap.set(row.id, {
      id: row.id,
      name: row.name,
      name_bg: row.name_bg,
      slug: row.slug,
      parent_id: row.parent_id,
      icon: row.icon,
      image_url: row.image_url,
      display_order: row.display_order,
      children: [],
    })
  }

  // Second pass: build tree structure
  for (const row of activeRows) {
    const category = categoryMap.get(row.id)
    if (!category) continue

    if (row.parent_id && categoryMap.has(row.parent_id)) {
      const parent = categoryMap.get(row.parent_id)
      if (!parent) continue
      parent.children = parent.children || []
      parent.children.push(category)
    } else if (row.depth === 0) {
      rootCategories.push(category)
    }
  }

  // Sort children by display_order, then by name
  function sortChildren(cats: CategoryWithChildren[]): CategoryWithChildren[] {
    cats.sort((a, b) => {
      const orderA = a.display_order ?? 999
      const orderB = b.display_order ?? 999
      if (orderA !== orderB) return orderA - orderB
      return a.name.localeCompare(b.name)
    })
    for (const cat of cats) {
      if (cat.children && cat.children.length > 0) {
        sortChildren(cat.children)
      }
    }
    return cats
  }

  return sortChildren(rootCategories)
}

export type RawCategoryTreeNodeLite = Omit<CategoryTreeNodeLite, "children" | "has_children"> & {
  has_children?: boolean
}

export function buildCategoryTreeLite(
  categories: RawCategoryTreeNodeLite[],
  childCountMap?: Map<string, number>,
): CategoryTreeNodeLite[] {
  const categoryMap = new Map<string, CategoryTreeNodeLite>()
  const roots: CategoryTreeNodeLite[] = []

  const activeCategories = categories.filter((row) => (row.display_order ?? 0) < 9000)

  for (const cat of activeCategories) {
    const dbChildCount = childCountMap?.get(cat.id) ?? 0
    categoryMap.set(cat.id, {
      ...cat,
      children: [],
      // has_children is true if DB says there are children OR if already marked
      has_children: cat.has_children ?? dbChildCount > 0,
    })
  }

  for (const cat of activeCategories) {
    const node = categoryMap.get(cat.id)
    if (!node) continue

    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      categoryMap.get(cat.parent_id)?.children.push(node)
    } else if (!cat.parent_id) {
      roots.push(node)
    }
  }

  function sortChildren(nodes: CategoryTreeNodeLite[]) {
    nodes.sort((a, b) => {
      const orderA = a.display_order ?? 999
      const orderB = b.display_order ?? 999
      if (orderA !== orderB) return orderA - orderB
      return a.name.localeCompare(b.name)
    })

    for (const node of nodes) {
      // Ensure has_children is true if there are loaded children
      if (node.children.length > 0) {
        node.has_children = true
        sortChildren(node.children)
      }
    }
  }

  sortChildren(roots)
  return roots
}

export async function fetchChildCategoriesLiteBatched(
  supabase: ReturnType<typeof createStaticClient>,
  parentIds: string[],
  {
    batchSize,
    concurrency,
    label,
  }: { batchSize: number; concurrency: number; label: string },
): Promise<RawCategoryTreeNodeLite[]> {
  if (parentIds.length === 0) return []

  const batches: Array<{ index: number; ids: string[] }> = []
  for (let i = 0; i < parentIds.length; i += batchSize) {
    batches.push({ index: i / batchSize, ids: parentIds.slice(i, i + batchSize) })
  }

  const out: RawCategoryTreeNodeLite[] = []
  for (let start = 0; start < batches.length; start += concurrency) {
    const chunk = batches.slice(start, start + concurrency)
    const chunkResults = await Promise.all(
      chunk.map(async ({ index, ids }) => {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, name_bg, slug, parent_id, display_order")
          .in("parent_id", ids)
          .lt("display_order", 9000)
          .order("display_order", { ascending: true })

        if (error) {
          logger.error(`[fetchChildCategoriesLiteBatched] ${label} query error (batch ${index})`, error)
          return []
        }
        return data || []
      }),
    )

    for (const part of chunkResults) out.push(...part)
  }

  return out
}
