import { getCategoryHierarchy, type CategoryWithChildren } from "@/lib/data/categories"

export type CategoryNode = CategoryWithChildren

export async function getBusinessDashboardCategories(): Promise<CategoryNode[]> {
  return getCategoryHierarchy(null, 1)
}
