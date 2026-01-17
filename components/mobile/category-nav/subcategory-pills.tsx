"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import type { CategoryTreeNode } from "@/lib/category-tree"

// =============================================================================
// SUBCATEGORY PILLS
//
// Vinted-style horizontal pill strip for subcategory filtering:
// - "All" pill always first
// - Horizontal scroll with no visible scrollbar
// - Active pill: solid foreground/background
// - Inactive pill: bordered, muted
// - Auto-scroll active pill into view
//
// Height: ~36px (vs ~80px circles = 44px saved)
// =============================================================================

interface SubcategoryPillsProps {
  /** Subcategories to display as pills */
  subcategories: CategoryTreeNode[]
  /** Currently active subcategory slug (null = "All") */
  activeSlug: string | null
  /** Current locale for i18n */
  locale: string
  /** Called when a pill is selected (null = "All") */
  onSelect: (slug: string | null) => void
  /** Sticky position top offset (e.g., 44 for after contextual header) */
  stickyTop?: number
  /** Additional CSS classes */
  className?: string
}

export function SubcategoryPills({
  subcategories,
  activeSlug,
  locale,
  onSelect,
  stickyTop = 44,
  className,
}: SubcategoryPillsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll active pill into view on mount and when activeSlug changes
  useEffect(() => {
    if (!containerRef.current) return

    const targetSlug = activeSlug ?? "all"
    const activeEl = containerRef.current.querySelector(
      `[data-slug="${targetSlug}"]`
    )

    if (activeEl instanceof HTMLElement) {
      // Smooth scroll into view, centered horizontally
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [activeSlug])

  const allLabel = locale === "bg" ? "всички" : "All"

  // Base pill styles (shared)
  const pillBase = cn(
    "h-8 px-3.5 rounded-full", // Treido: h-8, generic px
    "text-compact font-medium whitespace-nowrap", // Treido: text-compact
    "border transition-all shrink-0", // Treido: Flat
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
  )

  // Active pill styles
  const pillActive = cn(
    pillBase,
    "bg-foreground text-background border-foreground" // Black bg, White text
  )

  // Inactive pill styles
  const pillInactive = cn(
    pillBase,
    "bg-background text-muted-foreground border-border/60", // White bg, light gray border
    "hover:border-foreground/20 hover:text-foreground",
    "active:opacity-90 active:bg-muted/30" // Treido: active opacity effect
  )

  return (
    <div
      className={cn(
        "sticky z-30",
        "bg-background border-b border-border/50",
        className
      )}
      style={{ top: stickyTop }}
    >
      <div
        ref={containerRef}
        className="flex items-center gap-1.5 px-inset py-2 overflow-x-auto no-scrollbar"
        role="tablist"
        aria-label={locale === "bg" ? "Подкатегории" : "Subcategories"}
      >
        {/* "All" pill - always first */}
        <button
          type="button"
          role="tab"
          data-slug="all"
          onClick={() => onSelect(null)}
          className={activeSlug === null ? pillActive : pillInactive}
          aria-selected={activeSlug === null}
          aria-controls="product-feed"
        >
          {allLabel}
        </button>

        {/* Subcategory pills */}
        {subcategories.map((sub) => {
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
              aria-controls="product-feed"
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export type { SubcategoryPillsProps }
