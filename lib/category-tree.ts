import type { CategoryDisplay } from "@/lib/category-display"

export type CategoryTreeNode = CategoryDisplay & {
  parent_id?: string | null
  display_order?: number | null
  children?: CategoryTreeNode[]
}
