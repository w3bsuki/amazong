"use client"

import { cn } from "@/lib/utils"
import { X, CaretRight, House } from "@phosphor-icons/react"
import type { CategoryPath } from "./desktop-category-sidebar"

// =============================================================================
// DESKTOP BREADCRUMB ROW
//
// Shows current category path as clickable breadcrumbs:
// Home > Fashion > Men > Shoes
// Each crumb navigates back to that level.
// X button clears all filters.
// =============================================================================

interface DesktopBreadcrumbRowProps {
  /** Current category path [L0, L1?, L2?] */
  path: CategoryPath[]
  /** Current locale */
  locale: string
  /** Navigate to a specific path depth (0 = Home/All) */
  onNavigate: (depth: number) => void
  /** Clear all category selection */
  onClear: () => void
  /** Total results count */
  resultCount?: number
  /** Additional CSS classes */
  className?: string
}

export function DesktopBreadcrumbRow({
  path,
  locale,
  onNavigate,
  onClear,
  resultCount,
  className,
}: DesktopBreadcrumbRowProps) {
  // Don't render if no path
  if (path.length === 0) {
    return null
  }

  const homeLabel = locale === "bg" ? "Начало" : "Home"
  const listingsLabel = locale === "bg" ? "обяви" : "listings"

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {/* Home crumb */}
      <button
        type="button"
        onClick={() => onNavigate(0)}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <House size={14} weight="regular" />
        <span>{homeLabel}</span>
      </button>

      {/* Path crumbs */}
      {path.map((crumb, index) => {
        const isLast = index === path.length - 1

        return (
          <span key={crumb.slug} className="inline-flex items-center gap-2">
            <CaretRight size={12} weight="bold" className="text-muted-foreground/50" />
            
            {isLast ? (
              // Last crumb: pill style with X button
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground text-background text-sm font-medium">
                <span>{crumb.name}</span>
                <button
                  type="button"
                  onClick={onClear}
                  className="hover:opacity-70 transition-opacity"
                  aria-label={locale === "bg" ? "Изчисти филтър" : "Clear filter"}
                >
                  <X size={14} weight="bold" />
                </button>
              </span>
            ) : (
              // Intermediate crumb: clickable text
              <button
                type="button"
                onClick={() => onNavigate(index + 1)}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
              >
                {crumb.name}
              </button>
            )}
          </span>
        )
      })}

      {/* Results count (right-aligned) */}
      {typeof resultCount === "number" && (
        <span className="ml-auto text-sm text-muted-foreground whitespace-nowrap">
          {resultCount.toLocaleString()} {listingsLabel}
        </span>
      )}
    </div>
  )
}

export type { DesktopBreadcrumbRowProps }
