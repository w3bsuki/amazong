import type { CategoryTreeNode } from "@/lib/data/categories/types"

export interface ScopeCategory {
  id: string
  slug: string
  parent_id: string | null
  name: string
  name_bg: string | null
  icon?: string | null
  image_url?: string | null
}

export interface FilterSubcategory {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

export function toScopedCategoryList(categories: CategoryTreeNode[]): ScopeCategory[] {
  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    parent_id: category.parent_id ?? null,
    name: category.name,
    name_bg: category.name_bg ?? null,
    icon: category.icon ?? null,
    image_url: category.image_url ?? null,
  }))
}

export function toFilterSubcategories(railCategories: ScopeCategory[]): FilterSubcategory[] {
  return railCategories.map((category) => ({
    id: category.id,
    name: category.name,
    name_bg: category.name_bg,
    slug: category.slug,
  }))
}
