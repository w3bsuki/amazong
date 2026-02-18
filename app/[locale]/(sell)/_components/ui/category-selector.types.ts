import type { Category, CategoryPathItem } from "../../_lib/types"

export interface CategorySelectorProps {
  categories: Category[]
  value: string
  selectedPath?: CategoryPathItem[]
  onChange: (categoryId: string, path: CategoryPathItem[]) => void
  locale?: string
  className?: string
}

export interface FlatCategory extends Category {
  path: CategoryPathItem[]
  fullPath: string
  searchText: string
}

export interface CategoryModalContentProps {
  categories: Category[]
  flatCategories: FlatCategory[]
  value: string
  onSelect: (cat: FlatCategory) => void
  locale: string
  isMobile: boolean
}
