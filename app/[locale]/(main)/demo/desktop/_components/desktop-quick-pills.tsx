"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import type { CategoryTreeNode } from "@/lib/category-tree"

// =============================================================================
// DESKTOP QUICK PILLS
//
// Horizontal row of L3 subcategory pills shown when user drills into L2.
// Similar to mobile SubcategoryPills but styled for desktop context.
// =============================================================================

interface DesktopQuickPillsProps {
  /** L3 subcategories to display */
  subcategories: CategoryTreeNode[]
  /** Currently selected L3 slug (null = all within L2) */
  activeSlug: string | null
  /** Current locale */
  locale: string
  /** Called when pill is selected */
  onSelect: (slug: string | null) => void
  /** Additional CSS classes */
  className?: string
}

export function DesktopQuickPills({
  subcategories,
  activeSlug,
  locale,
  onSelect,
  className,
}: DesktopQuickPillsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll active pill into view
  useEffect(() => {
    if (!containerRef.current) return

    const targetSlug = activeSlug ?? "all"
    const activeEl = containerRef.current.querySelector(`[data-slug="${targetSlug}"]`)

    if (activeEl instanceof HTMLElement) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [activeSlug])

  // Don't render if no subcategories
  if (!subcategories || subcategories.length === 0) {
    return null
  }

  const allLabel = locale === "bg" ? "Всички" : "All"

  // Pill styles
  const pillBase = cn(
    "h-8 px-3.5 rounded-full",
    "text-sm font-medium whitespace-nowrap",
    "border transition-all shrink-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
  )

  const pillActive = cn(pillBase, "bg-foreground text-background border-foreground")
  
  const pillInactive = cn(
    pillBase,
    "bg-background text-muted-foreground border-border/60",
    "hover:border-foreground/30 hover:text-foreground hover:bg-muted/30"
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1",
        className
      )}
      role="tablist"
      aria-label={locale === "bg" ? "Подкатегории" : "Subcategories"}
    >
      {/* "All" pill */}
      <button
        type="button"
        role="tab"
        data-slug="all"
        onClick={() => onSelect(null)}
        className={activeSlug === null ? pillActive : pillInactive}
        aria-selected={activeSlug === null}
      >
        {allLabel}
      </button>

      {/* Subcategory pills */}
      {subcategories
        .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
        .map((sub) => {
          const isActive = activeSlug === sub.slug
          const label = getCategoryName(sub, locale)

          return (
            <button
              key={sub.slug}
              type="button"
              role="tab"
              data-slug={sub.slug}
              onClick={() => onSelect(sub.slug)}
              className={isActive ? pillActive : pillInactive}
              aria-selected={isActive}
            >
              {label}
            </button>
          )
        })}
    </div>
  )
}

export type { DesktopQuickPillsProps }
