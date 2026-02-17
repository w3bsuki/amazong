export interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

export interface BreadcrumbCategory {
  slug: string
  name: string
  name_bg: string | null
}

export interface CategoryWithSubcategories {
  category: Category
  subs: Category[]
}
