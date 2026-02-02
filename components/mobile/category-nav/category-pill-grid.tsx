"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon, getCategoryColor } from "@/lib/category-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Check } from "@phosphor-icons/react"

// =============================================================================
// Types
// =============================================================================

export interface CategoryPillGridProps {
  /** Categories to display as pills */
  categories: CategoryTreeNode[]
  /** Currently selected category slug (if any) */
  selectedSlug?: string | null
  /** Locale for name display */
  locale: string
  /** Called when a pill is tapped */
  onSelect: (category: CategoryTreeNode) => void
  /** Loading state */
  isLoading?: boolean
  /** Number of loading skeletons to show */
  skeletonCount?: number
  /** Additional class name */
  className?: string
}

// =============================================================================
// Component
// =============================================================================

export function CategoryPillGrid({
  categories,
  selectedSlug,
  locale,
  onSelect,
  isLoading = false,
  skeletonCount = 6,
  className,
}: CategoryPillGridProps) {
  if (isLoading) {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((category) => {
        const isSelected = selectedSlug === category.slug
        const colors = getCategoryColor(category.slug)
        const icon = getCategoryIcon(category.slug, { size: 16, weight: "bold" })
        const name = getCategoryName(category, locale)

        return (
          <button
            key={category.slug}
            type="button"
            onClick={() => onSelect(category)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-full",
              "text-sm font-medium",
              "border transition-all duration-150",
              "active:scale-95",
              isSelected
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:border-foreground/50"
            )}
            aria-pressed={isSelected}
          >
            {/* Show icon for unselected, checkmark for selected */}
            {isSelected ? (
              <Check size={16} weight="bold" className="shrink-0" />
            ) : (
              <span className={cn("shrink-0", colors.text)}>{icon}</span>
            )}
            <span className="truncate max-w-32">{name}</span>
          </button>
        )
      })}
    </div>
  )
}
