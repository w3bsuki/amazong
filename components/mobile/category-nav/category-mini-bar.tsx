"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useCategoryDrawer } from "./category-drawer-context"
import { getCategoryName } from "@/lib/category-display"
import { CaretRight, X } from "@phosphor-icons/react"

// =============================================================================
// Types
// =============================================================================

export interface CategoryMiniBarProps {
  /** Locale for name display */
  locale: string
  /** Called when the bar is tapped to expand */
  onExpand?: () => void
  /** Called when the X button is tapped */
  onClose?: () => void
  /** Additional class name */
  className?: string
}

// =============================================================================
// Component
// =============================================================================

export function CategoryMiniBar({
  locale,
  onExpand,
  onClose,
  className,
}: CategoryMiniBarProps) {
  const { path, expand, close, snap } = useCategoryDrawer()

  // Only show when collapsed and has path
  if (snap !== "collapsed" || path.length === 0) {
    return null
  }

  const handleExpand = () => {
    expand()
    onExpand?.()
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    close()
    onClose?.()
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 inset-x-0 z-40",
        "bg-background border-t border-border",
        "px-4 py-3 pb-safe-max",
        "flex items-center justify-between gap-3",
        "cursor-pointer",
        "transition-transform duration-200",
        className
      )}
      onClick={handleExpand}
      role="button"
      tabIndex={0}
      aria-label="Expand category drawer"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleExpand()
        }
      }}
    >
      {/* Breadcrumb path */}
      <div className="flex items-center gap-1 overflow-hidden flex-1 min-w-0">
        {path.map((cat, index) => (
          <React.Fragment key={cat.slug}>
            {index > 0 && (
              <CaretRight
                size={12}
                weight="bold"
                className="shrink-0 text-muted-foreground"
              />
            )}
            <span
              className={cn(
                "text-sm truncate",
                index === path.length - 1
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {getCategoryName(cat, locale)}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Expand hint + Close button */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground">Tap to browse</span>
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            "p-1.5 rounded-full",
            "bg-muted hover:bg-accent",
            "transition-colors"
          )}
          aria-label="Clear category selection"
        >
          <X size={14} weight="bold" />
        </button>
      </div>
    </div>
  )
}
