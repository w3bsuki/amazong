"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/lib/category-icons"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { ArrowLeft, SquaresFour, CaretRight } from "@phosphor-icons/react"

// =============================================================================
// TYPES
// =============================================================================

export interface CategoryPath {
  slug: string
  name: string
}

interface DesktopCategorySidebarProps {
  /** L0 categories with children (L1, L2) pre-loaded */
  categories: CategoryTreeNode[]
  /** Current locale for i18n */
  locale: string
  /** Currently selected category path [L0?, L1?, L2?] */
  selectedPath: CategoryPath[]
  /** Callback when user selects a category */
  onCategorySelect: (path: CategoryPath[], category: CategoryTreeNode | null) => void
  /** Category counts by slug */
  categoryCounts?: Record<string, number>
  /** Additional CSS classes */
  className?: string
}

// =============================================================================
// DESKTOP CATEGORY SIDEBAR — FULL REPLACE PATTERN
//
// Instead of nested drill-down with shrinking fonts, each level takes over
// the full sidebar real estate:
//
// L0 View: [All] [Fashion] [Electronics] [Home] ...
// Click Fashion → [← Back] [Fashion header] [Men] [Women] [Kids] ...
// Click Men → [← Fashion] [Men header] [Shoes] [Tops] [Bottoms] ...
//
// This keeps all items at readable size regardless of depth.
// =============================================================================

export function DesktopCategorySidebar({
  categories,
  locale,
  selectedPath,
  onCategorySelect,
  categoryCounts = {},
  className,
}: DesktopCategorySidebarProps) {
  // Current view level: 0 = L0 list, 1 = L1 list, 2 = L2 list
  const [viewLevel, setViewLevel] = useState(0)
  // Which L0 is currently showing its children
  const [currentL0, setCurrentL0] = useState<CategoryTreeNode | null>(null)
  // Which L1 is currently showing its children
  const [currentL1, setCurrentL1] = useState<CategoryTreeNode | null>(null)

  // Sync view state with selected path
  useEffect(() => {
    if (selectedPath.length === 0) {
      setViewLevel(0)
      setCurrentL0(null)
      setCurrentL1(null)
    } else if (selectedPath.length === 1) {
      const l0 = categories.find((c) => c.slug === selectedPath[0]?.slug)
      if (l0) {
        setCurrentL0(l0)
        setViewLevel(1)
        setCurrentL1(null)
      }
    } else if (selectedPath.length >= 2) {
      const l0 = categories.find((c) => c.slug === selectedPath[0]?.slug)
      if (l0) {
        setCurrentL0(l0)
        const l1 = l0.children?.find((c) => c.slug === selectedPath[1]?.slug)
        if (l1) {
          setCurrentL1(l1)
          setViewLevel(2)
        } else {
          setViewLevel(1)
        }
      }
    }
  }, [selectedPath, categories])

  // Get total count
  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  // Current items to display based on view level
  const currentItems = useMemo(() => {
    if (viewLevel === 0) {
      return categories.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    }
    if (viewLevel === 1 && currentL0?.children) {
      return currentL0.children.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    }
    if (viewLevel === 2 && currentL1?.children) {
      return currentL1.children.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    }
    return []
  }, [viewLevel, currentL0, currentL1, categories])

  // Current header category (the one we're viewing children of)
  const headerCategory = viewLevel === 2 ? currentL1 : viewLevel === 1 ? currentL0 : null

  // Back button label
  const backLabel = useMemo(() => {
    if (viewLevel === 2 && currentL0) {
      return getCategoryName(currentL0, locale)
    }
    if (viewLevel === 1) {
      return locale === "bg" ? "Всички категории" : "All Categories"
    }
    return null
  }, [viewLevel, currentL0, locale])

  // Handle back navigation
  const handleBack = () => {
    if (viewLevel === 2) {
      // Go back to L1 view
      setViewLevel(1)
      setCurrentL1(null)
      if (currentL0) {
        const path: CategoryPath[] = [{ slug: currentL0.slug, name: getCategoryName(currentL0, locale) }]
        onCategorySelect(path, currentL0)
      }
    } else if (viewLevel === 1) {
      // Go back to L0 view
      setViewLevel(0)
      setCurrentL0(null)
      setCurrentL1(null)
      onCategorySelect([], null)
    }
  }

  // Handle "All" click (clear everything)
  const handleClearAll = () => {
    setViewLevel(0)
    setCurrentL0(null)
    setCurrentL1(null)
    onCategorySelect([], null)
  }

  // Handle item click
  const handleItemClick = (item: CategoryTreeNode) => {
    const hasChildren = item.children && item.children.length > 0

    if (viewLevel === 0) {
      // Clicking L0 category
      setCurrentL0(item)
      const path: CategoryPath[] = [{ slug: item.slug, name: getCategoryName(item, locale) }]
      
      if (hasChildren) {
        // Has L1 children → drill into L1 view
        setViewLevel(1)
        onCategorySelect(path, item)
      } else {
        // No children → select and stay
        onCategorySelect(path, item)
      }
    } else if (viewLevel === 1 && currentL0) {
      // Clicking L1 category
      setCurrentL1(item)
      const path: CategoryPath[] = [
        { slug: currentL0.slug, name: getCategoryName(currentL0, locale) },
        { slug: item.slug, name: getCategoryName(item, locale) },
      ]
      
      if (hasChildren) {
        // Has L2 children → drill into L2 view
        setViewLevel(2)
        onCategorySelect(path, item)
      } else {
        // No children → select and stay at L1 view
        onCategorySelect(path, item)
      }
    } else if (viewLevel === 2 && currentL0 && currentL1) {
      // Clicking L2 category (leaf or has L3)
      const path: CategoryPath[] = [
        { slug: currentL0.slug, name: getCategoryName(currentL0, locale) },
        { slug: currentL1.slug, name: getCategoryName(currentL1, locale) },
        { slug: item.slug, name: getCategoryName(item, locale) },
      ]
      onCategorySelect(path, item)
    }
  }

  // Check if item is currently selected (leaf of path)
  const isSelected = (slug: string) => {
    if (selectedPath.length === 0) return false
    return selectedPath[selectedPath.length - 1]?.slug === slug
  }

  // Base button styles
  const itemBase = cn(
    "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
  )

  const itemActive = cn(itemBase, "bg-foreground text-background font-medium")
  
  const itemInactive = cn(
    itemBase,
    "text-muted-foreground hover:bg-muted hover:text-foreground"
  )

  return (
    <div className={cn("rounded-md bg-card", className)}>
      <nav className="p-2 space-y-0.5">
          
          {/* Back Button (when drilled in) */}
          {viewLevel > 0 && backLabel && (
            <button
              type="button"
              onClick={handleBack}
              className={cn(
                itemBase,
                "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <ArrowLeft size={18} weight="bold" className="shrink-0" />
              <span className="flex-1 truncate">{backLabel}</span>
            </button>
          )}

          {/* "All" Button (only at L0 level) */}
          {viewLevel === 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className={selectedPath.length === 0 ? itemActive : itemInactive}
            >
              <SquaresFour size={20} weight={selectedPath.length === 0 ? "fill" : "regular"} className="shrink-0" />
              <span className="flex-1">{locale === "bg" ? "Всички" : "All"}</span>
              <span className="text-xs tabular-nums opacity-70">{totalCount || "—"}</span>
            </button>
          )}

          {/* "All in [Category] (count)" Button - primary item when drilled in */}
          {viewLevel > 0 && headerCategory && (
            <button
              type="button"
              onClick={() => {
                // Select current header category (show all within it)
                if (viewLevel === 1 && currentL0) {
                  const path: CategoryPath[] = [{ slug: currentL0.slug, name: getCategoryName(currentL0, locale) }]
                  onCategorySelect(path, currentL0)
                } else if (viewLevel === 2 && currentL0 && currentL1) {
                  const path: CategoryPath[] = [
                    { slug: currentL0.slug, name: getCategoryName(currentL0, locale) },
                    { slug: currentL1.slug, name: getCategoryName(currentL1, locale) },
                  ]
                  onCategorySelect(path, currentL1)
                }
              }}
              className={cn(itemBase, "bg-foreground text-background font-medium")}
            >
              <SquaresFour size={18} weight="fill" className="shrink-0" />
              <span className="flex-1 truncate">
                {locale === "bg" ? "Всички в " : "All in "}{getCategoryName(headerCategory, locale)}
              </span>
              {typeof categoryCounts[headerCategory.slug] === "number" && (
                <span className="text-xs tabular-nums opacity-70">
                  {categoryCounts[headerCategory.slug]}
                </span>
              )}
            </button>
          )}

          {/* Category Items */}
          {currentItems.map((item) => {
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
                {/* Icon only at L0 level */}
                {viewLevel === 0 && (
                  <span className={selected ? "text-background" : "text-muted-foreground"}>
                    {getCategoryIcon(item.slug, { size: 20, weight: selected ? "fill" : "regular" })}
                  </span>
                )}
                
                <span className="flex-1 truncate">{name}</span>
                
                {/* Count */}
                {typeof count === "number" && (
                  <span className="text-xs tabular-nums opacity-70">{count}</span>
                )}
                
                {/* Chevron if has children */}
                {hasChildren && (
                  <CaretRight 
                    size={14} 
                    weight="bold" 
                    className={cn(
                      "shrink-0",
                      selected ? "text-background/70" : "text-muted-foreground/50"
                    )} 
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>
  )
}

export type { DesktopCategorySidebarProps }
