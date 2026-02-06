"use client"

import type { CategoryTreeNode } from "@/lib/category-tree"
import { CategoryTabs } from "./category-tabs"
import { CategoryQuickPills } from "./category-quick-pills"

type Category = CategoryTreeNode

export type CategoryNavBarVariant = "tabs" | "pills"

export interface CategoryNavBarProps {
  variant: CategoryNavBarVariant
  categories: Category[]
  activeTab: string
  locale: string
  headerHeight: number
  tabsNavigateToPages: boolean
  onTabChange: (slug: string) => void
}

export function CategoryNavBar({ variant, ...props }: CategoryNavBarProps) {
  if (variant === "pills") {
    return <CategoryQuickPills {...props} />
  }

  return <CategoryTabs {...props} />
}
