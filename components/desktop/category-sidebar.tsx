"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/lib/category-icons"
import {
  CaretDown,
  CaretRight,
  CaretUp,
  ArrowLeft,
  SquaresFour,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

// =============================================================================
// TYPES
// =============================================================================

export interface CategoryPath {
  slug: string
  name: string
}

export interface CompactCategorySidebarProps {
  categories: CategoryTreeNode[]
  locale: string
  selectedPath: CategoryPath[]
  onCategorySelect: (path: CategoryPath[], category: CategoryTreeNode | null) => void
  categoryCounts: Record<string, number>
}

// =============================================================================
// COMPACT CATEGORY SIDEBAR - Replaces full-height drill-down
// =============================================================================

export function CompactCategorySidebar({
  categories,
  locale,
  selectedPath,
  onCategorySelect,
  categoryCounts,
}: CompactCategorySidebarProps) {
  const tCommon = useTranslations("Common")
  const tCategories = useTranslations("Categories")

  const [viewLevel, setViewLevel] = useState(0)
  const [currentL0, setCurrentL0] = useState<CategoryTreeNode | null>(null)
  const [currentL1, setCurrentL1] = useState<CategoryTreeNode | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const initialVisibleCount = 12

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Sync with selected path
  useEffect(() => {
    if (selectedPath.length === 0) {
      setViewLevel(0)
      setCurrentL0(null)
      setCurrentL1(null)
    } else if (selectedPath.length >= 1) {
      const l0 = categories.find((c) => c.slug === selectedPath[0]?.slug)
      if (l0) {
        setCurrentL0(l0)
        setViewLevel(1)
        if (selectedPath.length >= 2) {
          const l1 = l0.children?.find((c) => c.slug === selectedPath[1]?.slug)
          if (l1) {
            setCurrentL1(l1)
            setViewLevel(2)
          }
        }
      }
    }
  }, [selectedPath, categories])

  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  const currentItems = useMemo(() => {
    if (viewLevel === 0) return categories.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    if (viewLevel === 1 && currentL0?.children) return currentL0.children.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    if (viewLevel === 2 && currentL1?.children) return currentL1.children.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    return []
  }, [viewLevel, currentL0, currentL1, categories])

  const visibleItems = useMemo(() => {
    if (isExpanded || currentItems.length <= initialVisibleCount) return currentItems
    return currentItems.slice(0, initialVisibleCount)
  }, [currentItems, isExpanded, initialVisibleCount])

  const hiddenCount = currentItems.length - visibleItems.length

  const headerCategory = viewLevel === 2 ? currentL1 : viewLevel === 1 ? currentL0 : null

  const handleBack = () => {
    if (viewLevel === 2) {
      setViewLevel(1)
      setCurrentL1(null)
      if (currentL0) {
        onCategorySelect([{ slug: currentL0.slug, name: getCategoryName(currentL0, locale) }], currentL0)
      }
    } else if (viewLevel === 1) {
      setViewLevel(0)
      setCurrentL0(null)
      onCategorySelect([], null)
    }
  }

  const handleItemClick = (item: CategoryTreeNode) => {
    const hasChildren = item.children && item.children.length > 0
    
    if (viewLevel === 0) {
      setCurrentL0(item)
      const path = [{ slug: item.slug, name: getCategoryName(item, locale) }]
      if (hasChildren) setViewLevel(1)
      onCategorySelect(path, item)
    } else if (viewLevel === 1 && currentL0) {
      setCurrentL1(item)
      const path = [
        { slug: currentL0.slug, name: getCategoryName(currentL0, locale) },
        { slug: item.slug, name: getCategoryName(item, locale) },
      ]
      if (hasChildren) setViewLevel(2)
      onCategorySelect(path, item)
    } else if (viewLevel === 2 && currentL0 && currentL1) {
      const path = [
        { slug: currentL0.slug, name: getCategoryName(currentL0, locale) },
        { slug: currentL1.slug, name: getCategoryName(currentL1, locale) },
        { slug: item.slug, name: getCategoryName(item, locale) },
      ]
      onCategorySelect(path, item)
    }
  }

  const isSelected = (slug: string) => {
    if (selectedPath.length === 0) return false
    return selectedPath[selectedPath.length - 1]?.slug === slug
  }

  const itemBase = "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors text-left min-h-9"
  const itemActive = cn(itemBase, "bg-foreground text-background font-medium")
  const itemInactive = cn(itemBase, "text-muted-foreground hover:bg-muted hover:text-foreground")

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="px-3 py-2.5 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          {tCategories("title")}
        </h2>
      </div>

      <nav className="p-1.5 space-y-0.5">
        {/* Back button */}
        {viewLevel > 0 && (
          <button type="button" onClick={handleBack} className={itemInactive}>
            <ArrowLeft size={18} weight="bold" className="shrink-0" />
            <span className="flex-1 truncate">
              {viewLevel === 1
                ? tCommon("allCategories")
                : currentL0 ? getCategoryName(currentL0, locale) : ""}
            </span>
          </button>
        )}

        {/* "All" at L0 */}
        {viewLevel === 0 && (
          <button
            type="button"
            onClick={() => onCategorySelect([], null)}
            className={selectedPath.length === 0 ? itemActive : itemInactive}
          >
            <SquaresFour size={20} weight={selectedPath.length === 0 ? "fill" : "regular"} className="shrink-0" />
            <span className="flex-1">{tCommon("all")}</span>
            <span className="text-xs tabular-nums opacity-70">
              {isMounted && totalCount > 0 ? totalCount : "—"}
            </span>
          </button>
        )}

        {/* Header category when drilled */}
        {viewLevel > 0 && headerCategory && (
          <button type="button" onClick={() => {}} className={itemActive}>
            <SquaresFour size={18} weight="fill" className="shrink-0" />
            <span className="flex-1 truncate">
              {tCategories("allIn", { category: getCategoryName(headerCategory, locale) })}
            </span>
            {isMounted && categoryCounts[headerCategory.slug] !== undefined && (
              <span className="text-xs tabular-nums opacity-70">{categoryCounts[headerCategory.slug]}</span>
            )}
          </button>
        )}

        {/* Items */}
        {visibleItems.map((item) => {
          const name = getCategoryName(item, locale)
          const count = categoryCounts[item.slug]
          const hasChildren = item.children && item.children.length > 0
          const selected = isSelected(item.slug)

          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => handleItemClick(item)}
              className={selected ? itemActive : itemInactive}
            >
              {viewLevel === 0 && (
                <span className={selected ? "text-background" : "text-muted-foreground"}>
                  {getCategoryIcon(item.slug, { size: 20, weight: selected ? "fill" : "regular" })}
                </span>
              )}
              <span className="flex-1 truncate">{name}</span>
              {isMounted && typeof count === "number" && (
                <span className="text-xs tabular-nums opacity-70">{count}</span>
              )}
              {hasChildren && (
                <CaretRight size={14} weight="bold" className={cn("shrink-0", selected ? "text-background/70" : "text-muted-foreground/50")} />
              )}
            </button>
          )
        })}

        {/* Show more */}
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-1.5 py-2 mt-1 text-xs font-medium rounded-md bg-foreground text-background hover:bg-foreground/90"
          >
            {isExpanded ? (
              <>
                <CaretUp size={14} weight="bold" />
                {tCategories("showLessShort")}
              </>
            ) : (
              <>
                <CaretDown size={14} weight="bold" />
                {tCategories("moreCount", { count: hiddenCount })}
              </>
            )}
          </button>
        )}
      </nav>
    </div>
  )
}
