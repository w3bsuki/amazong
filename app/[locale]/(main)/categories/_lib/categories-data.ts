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

export function getCategoryName(locale: string, category: Category) {
  if (locale === "bg" && category.name_bg) return category.name_bg
  return category.name
}

export function getCategoryImageUrl(category: Category) {
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
