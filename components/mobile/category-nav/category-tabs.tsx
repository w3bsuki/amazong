"use client"

import { useRef, useEffect } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryShortName } from "@/lib/category-display"
import { CategoryNavItem, TabContent } from "./category-nav-item"
import { useTranslations } from "next-intl"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

export interface CategoryTabsProps {
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

export function CategoryTabs({
  categories,
  activeTab,
  locale,
  headerHeight,
  tabsNavigateToPages,
  onTabChange,
}: CategoryTabsProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tCommon = useTranslations("Common")

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
      {/* Treido: overflow-x-auto no-scrollbar */}
      <div
        ref={tabsContainerRef}
        className="relative flex items-center gap-1.5 overflow-x-auto no-scrollbar px-inset"
        role="tablist"
      >
        {/* "All" Tab */}
        {tabsNavigateToPages ? (
          <CategoryNavItem
            href="/categories"
            isActive={activeTab === "all"}
            variant="tab"
            data-tab="all"
          >
            <TabContent label={allLabel} isActive={activeTab === "all"} />
          </CategoryNavItem>
        ) : (
          <CategoryNavItem
            onClick={() => onTabChange("all")}
            isActive={activeTab === "all"}
            variant="tab"
            data-tab="all"
          >
            <TabContent label={allLabel} isActive={activeTab === "all"} />
          </CategoryNavItem>
        )}

        {/* Category Tabs */}
        {categories.map((cat) => {
          const label = getCategoryShortName(cat, locale)
          const isActive = activeTab === cat.slug

          return tabsNavigateToPages ? (
            <CategoryNavItem
              key={cat.id}
              href={`/categories/${cat.slug}`}
              isActive={isActive}
              variant="tab"
              data-tab={cat.slug}
            >
              <TabContent label={label} isActive={isActive} />
            </CategoryNavItem>
          ) : (
            <CategoryNavItem
              key={cat.id}
              onClick={() => onTabChange(cat.slug)}
              isActive={isActive}
              variant="tab"
              data-tab={cat.slug}
            >
              <TabContent label={label} isActive={isActive} />
            </CategoryNavItem>
          )
        })}
      </div>
    </div>
  )
}
