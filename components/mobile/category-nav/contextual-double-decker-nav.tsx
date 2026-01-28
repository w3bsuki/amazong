"use client"

import { useEffect, useRef } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { useTranslations } from "next-intl"
import { CaretRight, X } from "@phosphor-icons/react"

// =============================================================================
// CONTEXTUAL DOUBLE-DECKER NAV
//
// Treido-mock “Focus Mode” for deep category browsing:
// - Row 1: Context stack (path back up)
// - Row 2: Options deck (next choices)
//
// Uses our Tailwind v4 tokens + shadcn surfaces (bg-background, border-border).
// Avoids nav-scale animations (Treido: opacity/bg feedback instead).
// =============================================================================

export interface ContextualDoubleDeckerNavProps {
  locale: string
  /** Parent category label (localized upstream) */
  parentLabel?: string | null
  /** Where the parent chip / clear button navigates */
  parentHref?: string | null
  /** Current category label (already localized) */
  currentLabel: string

  /** Next-level choices */
  options: CategoryTreeNode[]
  /** Selected option slug (null = All) */
  activeSlug: string | null
  onSelect: (slug: string | null) => void

  /** Sticky offset under contextual header */
  stickyTop?: number
  /** Whether this nav is sticky (default: true). */
  sticky?: boolean
  className?: string
  
  /** 
   * Optional: When provided, shows an X button that resets directly to root categories.
   * This is useful when user is deeply nested and wants to exit category browsing entirely.
   */
  onResetToRoot?: () => void
  /** 
   * Optional: Href for reset to root (alternative to callback).
   * Defaults to /categories if onResetToRoot is not provided but reset is desired.
   */
  resetToRootHref?: string
}

export function ContextualDoubleDeckerNav({
  locale,
  parentLabel,
  parentHref,
  currentLabel,
  options,
  activeSlug,
  onSelect,
  stickyTop = 40,
  sticky = true,
  className,
  onResetToRoot,
  resetToRootHref,
}: ContextualDoubleDeckerNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("SearchCategories")
  const tCategories = useTranslations("Categories")

  // Auto-scroll active pill into view
  useEffect(() => {
    if (!containerRef.current) return

    const targetSlug = activeSlug ?? "all"
    const activeEl = containerRef.current.querySelector(`[data-slug="${targetSlug}"]`)

    if (activeEl instanceof HTMLElement) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  }, [activeSlug])

  const allLabel = t("all")

  const chipBase = cn(
    "h-7",
    "px-3 rounded-md",
    "text-xs font-medium whitespace-nowrap",
    "border",
    "transition-colors",
    "tap-highlight-transparent",
    "active:opacity-70"
  )
  const chipActiveToken = cn(chipBase, "bg-foreground text-background border-foreground")
  const chipInactiveToken = cn(
    chipBase,
    "bg-card text-muted-foreground border-border",
    "hover:border-foreground/30",
    "active:bg-muted"
  )

  const showContextRow = Boolean(parentLabel) && Boolean(parentHref)
  
  // Determine if we should show reset-to-root functionality
  const showResetToRoot = onResetToRoot || resetToRootHref
  const effectiveResetHref = resetToRootHref || "/categories"

  return (
    <div
      className={cn(
        sticky && "sticky z-40",
        "bg-background",
        "border-b border-border/50",
        className
      )}
      style={sticky ? { top: stickyTop } : undefined}
      aria-label={tCategories("navigationAriaLabel")}
    >
      {/* Row 1: Context Stack (Where Am I) */}
      {showContextRow && (
        <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar bg-surface-subtle border-b border-border/50">
          <Link href={parentHref as string} className={chipInactiveToken} aria-label={tCategories("goToParentCategoryAriaLabel")}>
            {parentLabel}
          </Link>
          <CaretRight size={12} weight="bold" className="text-muted-foreground/50 shrink-0" aria-hidden="true" />
          <div className={cn(chipActiveToken, "flex items-center gap-1.5")}>
            <span className="max-w-40 truncate">{currentLabel}</span>
            <Link
              href={parentHref as string}
              className="-mr-1 rounded-sm p-1 active:opacity-70"
              aria-label={tCategories("clearAndGoBackAriaLabel")}
            >
              <X size={12} weight="bold" className="opacity-60" />
            </Link>
          </div>
          
          {/* Reset to All Categories button - prominent X at end of row */}
          {showResetToRoot && (
            <div className="ml-auto shrink-0 pl-2">
              {onResetToRoot ? (
                <button
                  type="button"
                  onClick={onResetToRoot}
                  className={cn(
                    "size-7 flex items-center justify-center rounded-full",
                    "bg-destructive/10 text-destructive hover:bg-destructive/20",
                    "transition-colors active:scale-95"
                  )}
                  aria-label={tCategories("viewAll")}
                >
                  <X size={14} weight="bold" />
                </button>
              ) : (
                <Link
                  href={effectiveResetHref}
                  className={cn(
                    "size-7 flex items-center justify-center rounded-full",
                    "bg-destructive/10 text-destructive hover:bg-destructive/20",
                    "transition-colors active:scale-95"
                  )}
                  aria-label={tCategories("viewAll")}
                >
                  <X size={14} weight="bold" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Row 2: Options Deck (Where To Go) - Full width for next choices */}
      <div
        ref={containerRef}
        className={cn(
          "px-3 py-2.5",
          "flex items-center gap-2",
          "overflow-x-auto no-scrollbar",
          "bg-background"
        )}
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          data-slug="all"
          onClick={() => onSelect(null)}
          className={activeSlug === null ? chipActiveToken : chipInactiveToken}
          aria-selected={activeSlug === null}
          aria-controls="product-feed"
        >
          {allLabel}
        </button>

        {options.map((opt) => {
          const isActive = activeSlug === opt.slug
          const label = getCategoryName(opt, locale)

          return (
            <button
              key={opt.slug}
              type="button"
              role="tab"
              data-slug={opt.slug}
              onClick={() => onSelect(opt.slug)}
              className={cn(isActive ? chipActiveToken : chipInactiveToken, "snap-center")}
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
