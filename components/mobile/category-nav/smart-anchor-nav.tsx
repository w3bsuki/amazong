"use client"

import { useEffect, useRef } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { ArrowLeft } from "@phosphor-icons/react"

// =============================================================================
// SMART ANCHOR NAVIGATION
//
// Treido-mock "Morphing Row" pattern for deep category browsing:
// - Single row that transforms based on navigation depth
// - Black "anchor" pill with back arrow when drilled down
// - White sibling pills for next-level options
//
// State 0 (Root):     [Women] [Men] [Kids]
// State 1 (L1):       [← Women] [Shoes] [Clothing] [Bags]
// State 2 (L2):       [← Shoes] [Sneakers] [Boots] [Sandals]
//
// Uses our Tailwind v4 tokens (bg-foreground, text-background, etc.)
// =============================================================================

export interface SmartAnchorNavProps {
  locale: string
  /**
   * The "anchor" - represents current context (where we drilled into)
   * When null, we're at root level showing all top-level options
   */
  anchor: {
    label: string
    href: string
  } | null
  /**
   * Sibling options to display (next level choices)
   */
  options: CategoryTreeNode[]
  /**
   * Currently selected option slug (for leaf-level highlighting)
   */
  activeSlug?: string | null
  /**
   * Callback when an option is selected
   */
  onSelect?: (slug: string) => void
  /**
   * Whether options are links (vs buttons with onSelect)
   */
  asLinks?: boolean
  /**
   * Base path for link construction (e.g., "/en/categories")
   */
  basePath?: string
  /**
   * Sticky position offset
   */
  stickyTop?: number
  /**
   * Whether nav is sticky (default: true)
   */
  sticky?: boolean
  className?: string
}

export function SmartAnchorNav({
  locale,
  anchor,
  options,
  activeSlug,
  onSelect,
  asLinks = true,
  basePath = "",
  stickyTop = 48,
  sticky = true,
  className,
}: SmartAnchorNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll container to start when anchor changes (new drill-down)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0
    }
  }, [anchor?.label])

  // Auto-scroll active option into view
  useEffect(() => {
    if (!containerRef.current || !activeSlug) return

    const activeEl = containerRef.current.querySelector(`[data-slug="${activeSlug}"]`)
    if (activeEl instanceof HTMLElement) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  }, [activeSlug])

  // === Styles ===
  // Anchor pill: solid foreground with inverted text - Treido style
  const anchorStyles = cn(
    "shrink-0 h-8 pl-3 pr-4",
    "bg-foreground text-background",
    "rounded-full",
    "flex items-center gap-1.5",
    "text-compact font-bold",
    "active:opacity-90 transition-colors",
    "tap-highlight-transparent"
  )

  // Sibling pill base
  const pillBase = cn(
    "shrink-0 h-8 px-4",
    "rounded-full",
    "text-compact font-semibold",
    "whitespace-nowrap",
    "border transition-all duration-200",
    "tap-highlight-transparent",
    "flex items-center justify-center" // Ensure content is centered
  )

  // Sibling pill: inactive (outlined) - Treido: card bg, muted text, border
  const pillInactive = cn(
    pillBase,
    "bg-background text-muted-foreground border-border",
    "hover:border-foreground/30",
    "active:bg-muted"
  )

  // Sibling pill: active (for leaf selection) - keep it subtle (anchor is the only black pill)
  const pillActive = cn(
    pillBase,
    "bg-muted text-foreground border-foreground/30"
  )

  const renderOption = (opt: CategoryTreeNode) => {
    const label = getCategoryName(opt, locale)
    const isActive = activeSlug === opt.slug
    const pillClass = isActive ? pillActive : pillInactive

    if (asLinks && basePath) {
      return (
        <Link
          key={opt.id}
          href={`${basePath}/${opt.slug}`}
          data-slug={opt.slug}
          className={pillClass}
        >
          {label}
        </Link>
      )
    }

    return (
      <button
        key={opt.id}
        type="button"
        data-slug={opt.slug}
        onClick={() => onSelect?.(opt.slug)}
        className={pillClass}
      >
        {label}
      </button>
    )
  }

  return (
    <div
      className={cn(
        sticky && "sticky z-40",
        "bg-background/95 backdrop-blur-xl", // Improved blur
        "border-b border-border/60",
        className
      )}
      style={sticky ? { top: stickyTop } : undefined}
      aria-label={locale === "bg" ? "Навигация по категории" : "Category navigation"}
    >
      <div
        ref={containerRef}
        className="flex items-center px-inset h-(--spacing-nav-row) gap-1.5 overflow-x-auto no-scrollbar"
      >
        {/* === ANCHOR (only when drilled down) === */}
        {anchor && (
          <Link
            href={anchor.href}
            className={anchorStyles}
            aria-label={locale === "bg" ? "Назад към " + anchor.label : "Back to " + anchor.label}
          >
            <ArrowLeft size={14} weight="bold" className="shrink-0" />
            <span className="max-w-28 truncate">{anchor.label}</span>
          </Link>
        )}

        {/* === SIBLING OPTIONS === */}
        {options.map(renderOption)}
      </div>
    </div>
  )
}

export type { SmartAnchorNavProps as SmartAnchorNavPropsType }
