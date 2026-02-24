import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { createStaticClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import { resolveCategoryAttributesWithClient } from "@/lib/data/category-attributes"
import { getSubcategoriesForBrowse } from "./subcategories"
import type { Category, CategoryContext, CategoryWithParent } from "./types"

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

  const { attributes: rawAttributes, ancestorIds } = attributesResult
  const isLeafCategory = childrenWithCounts.length === 0
  const attributes = isLeafCategory
    ? rawAttributes.filter((attribute) => attribute.category_id === current.id || attribute.category_id === null)
    : []

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
