"use client"

import { useRef } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName } from "@/lib/category-display"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

export interface CategoryL3PillsProps {
  categories: Category[]
  selectedPill: string | null
  locale: string
  isLoading: boolean
  onPillClick: (category: Category) => void
  onAllClick: () => void
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function PillsSkeleton() {
  return (
    <div className="flex gap-1 items-center animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-7 w-14 rounded-full" />
      ))}
    </div>
  )
}

// =============================================================================
// Component
// =============================================================================

export function CategoryL3Pills({
  categories,
  selectedPill,
  locale,
  isLoading,
  onPillClick,
  onAllClick,
}: CategoryL3PillsProps) {
  const pillsContainerRef = useRef<HTMLDivElement>(null)
  const tCommon = useTranslations("Common")

  const allLabel = tCommon("all")

  return (
    <div
      className="bg-background py-1 px-inset overflow-x-auto no-scrollbar border-b border-border/30"
      ref={pillsContainerRef}
    >
      {isLoading ? (
        <PillsSkeleton />
      ) : (
        <div className="flex gap-1 items-center">
          {/* "All" Pill - L3 level (subtle styling, uses h-touch-sm token = 28px) */}
          <button
            onClick={onAllClick}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-compact font-medium whitespace-nowrap border focus-visible:outline-none transition-all",
              selectedPill === null
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border/60 hover:border-foreground/20 hover:text-foreground"
            )}
          >
            {allLabel}
          </button>

          {/* L3 Pills - subtle filter style (uses h-touch-sm token = 28px) */}
          {categories.map((child) => {
            const isSelected = selectedPill === child.slug
            return (
              <button
                key={child.slug}
                onClick={() => onPillClick(child)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-compact font-medium whitespace-nowrap border focus-visible:outline-none transition-all", // Treido: flat, no shadow
                  isSelected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border/60 hover:border-foreground/20 hover:text-foreground"
                )}
              >
                {getCategoryName(child, locale)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
