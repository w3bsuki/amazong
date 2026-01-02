import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from "@/lib/supabase/server"

export interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url: string | null
  parent_id: string | null
  display_order?: number | null
}

export const DEFAULT_CATEGORY_IMAGE = "/placeholder.svg"

function getCategoryName(locale: string, category: Category) {
  if (locale === "bg" && category.name_bg) return category.name_bg
  return category.name
}

function getCategoryImageUrl(category: Category) {
  return category.image_url || DEFAULT_CATEGORY_IMAGE
}

/**
 * Fetch all root categories (no parent).
 * CACHED for optimal performance - categories rarely change.
 */
export async function getRootCategories() {
  'use cache'
  cacheTag('categories', 'root-categories')
  cacheLife('categories')

  const supabase = createStaticClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, image_url, parent_id, display_order")
    .is("parent_id", null)
    // Keep ordering consistent with /api/categories and the homepage rail
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })

  return (data || []) as Category[]
}

/**
 * Build a mapping from any category slug to its root category slug.
 * Used for keeping the root category pill active on deep /categories/[slug] pages.
 */
export async function getCategoryRootSlugMap(): Promise<Record<string, string>> {
  'use cache'
  cacheTag('categories', 'category-root-slug-map')
  cacheLife('categories')

  const supabase = createStaticClient()
  if (!supabase) return {}

  const { data } = await supabase
    .from("categories")
    .select("id, slug, parent_id")

  const rows = (data || []) as Array<{ id: string; slug: string; parent_id: string | null }>
  if (rows.length === 0) return {}

  const byId = new Map<string, { id: string; slug: string; parent_id: string | null }>()
  for (const row of rows) byId.set(row.id, row)

  const rootSlugById = new Map<string, string>()

  const resolveRootSlug = (id: string): string => {
    const cached = rootSlugById.get(id)
    if (cached) return cached

    const node = byId.get(id)
    if (!node) return ""

    if (!node.parent_id) {
      rootSlugById.set(id, node.slug)
      return node.slug
    }

    const root = resolveRootSlug(node.parent_id)
    const rootSlug = root || node.slug
    rootSlugById.set(id, rootSlug)
    return rootSlug
  }

  const rootSlugBySlug: Record<string, string> = {}
  for (const row of rows) {
    const rootSlug = resolveRootSlug(row.id)
    if (row.slug) rootSlugBySlug[row.slug] = rootSlug || row.slug
  }

  return rootSlugBySlug
}
