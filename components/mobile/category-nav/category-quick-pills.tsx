"use client"

import { useRef, useEffect } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { getCategoryIcon } from "@/components/shared/category/category-icons"
import { CategoryNavItem } from "./category-nav-item"
import { useTranslations } from "next-intl"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

export interface CategoryQuickPillsProps {
  categories: Category[]
  activeTab: string
  locale: string
  headerHeight: number
  tabsNavigateToPages: boolean
  onTabChange: (slug: string) => void
}

// =============================================================================
// Component
// =============================================================================

export function CategoryQuickPills({
  categories,
  activeTab,
  locale,
  headerHeight,
  tabsNavigateToPages,
  onTabChange,
}: CategoryQuickPillsProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tCommon = useTranslations("Common")
  const tCategories = useTranslations("Categories")

  // Auto-scroll selected tab to left edge
  useEffect(() => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const activeBtn = container.querySelector(
        `[data-tab="${activeTab}"]`
      ) as HTMLElement
      if (activeBtn) {
        const padding = Number.parseFloat(getComputedStyle(container).paddingLeft)
        container.scrollLeft = Math.max(0, activeBtn.offsetLeft - padding)
      }
    }
  }, [activeTab])

  const allLabel = tCommon("all")

  return (
    <div
      className="sticky z-30 bg-background/90 backdrop-blur-md border-b border-border/50"
      style={{ top: headerHeight }}
    >
      <div
        ref={tabsContainerRef}
        className="flex items-center gap-0.5 overflow-x-auto no-scrollbar px-inset py-1"
        role="tablist"
      >
        {/* "All" Pill */}
        {tabsNavigateToPages ? (
          <CategoryNavItem
            href="/categories"
            isActive={activeTab === "all"}
            variant="pill"
            data-tab="all"
          >
            {getCategoryIcon("all", { size: 14 })}
            <span>{allLabel}</span>
          </CategoryNavItem>
        ) : (
          <CategoryNavItem
            onClick={() => onTabChange("all")}
            isActive={activeTab === "all"}
            variant="pill"
            data-tab="all"
          >
            {getCategoryIcon("all", { size: 14 })}
            <span>{allLabel}</span>
          </CategoryNavItem>
        )}

        {/* Category Pills */}
        {categories.map((cat) => {
          const label = tCategories("shortName", { slug: getCategorySlugKey(cat.slug), name: getCategoryName(cat, locale) })
          const isActive = activeTab === cat.slug
          const icon = getCategoryIcon(cat.slug, { size: 14 })

          return tabsNavigateToPages ? (
            <CategoryNavItem
              key={cat.id}
              href={`/categories/${cat.slug}`}
              isActive={isActive}
              variant="pill"
              data-tab={cat.slug}
            >
              {icon}
              <span>{label}</span>
            </CategoryNavItem>
          ) : (
            <CategoryNavItem
              key={cat.id}
              onClick={() => onTabChange(cat.slug)}
              isActive={isActive}
              variant="pill"
              data-tab={cat.slug}
            >
              {icon}
              <span>{label}</span>
            </CategoryNavItem>
          )
        })}
      </div>
    </div>
  )
}
