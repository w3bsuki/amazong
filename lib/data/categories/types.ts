import type { AttributeType, CategoryAttribute } from "@/lib/types/categories"

export type { AttributeType, CategoryAttribute }

export type CategoryDisplay = {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url?: string | null
  icon?: string | null
}

export type CategoryTreeNode = CategoryDisplay & {
  parent_id?: string | null
  display_order?: number | null
  children?: CategoryTreeNode[]
}

export interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url: string | null
  icon: string | null
  display_order: number | null
}

export interface CategoryWithParent extends Category {
  parent: Category | null
}

export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[]
}

export interface CategoryTreeNodeLite {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  display_order: number | null
  children: CategoryTreeNodeLite[]
  /** True if this category has children in DB (may not be loaded in tree) */
  has_children: boolean
}

export interface CategoryContext {
  current: Category
  parent: Category | null
  siblings: Category[]
  children: Category[]
  attributes: CategoryAttribute[]
}

export interface CategoryWithCount extends Category {
  subtree_product_count: number
}
