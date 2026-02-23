import type { CategoryTreeNode } from "@/lib/data/categories/types"

export type BrowseTab = "listings" | "sellers"

export interface DrawerSeller {
  id: string
  username: string | null
  store_name: string
  description: string | null
  verified: boolean
  product_count: number
  total_rating: number | null
  avatar_url: string | null
}

export interface CategoryBrowseDrawerProps {
  /** Locale for name display */
  locale: string
  /** Callback to fetch children lazily */
  fetchChildren?: (parentId: string) => Promise<CategoryTreeNode[]>
}
