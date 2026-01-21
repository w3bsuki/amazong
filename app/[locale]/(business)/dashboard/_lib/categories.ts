import { getCategoryTreeDepth3, type CategoryTreeNodeLite } from "@/lib/data/categories"

export type CategoryNode = CategoryTreeNodeLite

export async function getBusinessDashboardCategories(): Promise<CategoryNode[]> {
  return getCategoryTreeDepth3()
}
