"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/lib/category-icons"
import { SquaresFour, CaretLeft, CaretRight } from "@phosphor-icons/react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { useTranslations } from "next-intl"

// =============================================================================
// DESKTOP CATEGORY NAV
//
// Circle-based category navigation (like Vinted/OLX):
// - Large prominent circles with icons
// - Label + count below each circle
// - Horizontal scroll with chevron navigation
// - Active state: filled circle with inverted colors
// =============================================================================

interface DesktopCategoryNavProps {
  locale: string
  categories: CategoryTreeNode[]
  activeCategory: string | null
  onCategoryClick: (slug: string | null) => void
  categoryCounts?: Record<string, number>
  className?: string
}

export function DesktopCategoryNav({
  locale,
  categories,
  activeCategory,
  onCategoryClick,
  categoryCounts = {},
  className,
}: DesktopCategoryNavProps) {
  const t = useTranslations("Categories")
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  // Sort categories by display_order
  const sortedCategories = React.useMemo(() => {
    return [...categories].sort((a, b) => {
      const ao = a.display_order ?? 9999
      const bo = b.display_order ?? 9999
      if (ao !== bo) return ao - bo
      return getCategoryName(a, locale).localeCompare(getCategoryName(b, locale))
    })
  }, [categories, locale])

  const isAllActive = !activeCategory

  const totalCount = React.useMemo(() => {
    return sortedCategories.reduce((sum, cat) => sum + (categoryCounts[cat.slug] ?? 0), 0)
  }, [categoryCounts, sortedCategories])

  // Check scroll state
  const updateScrollState = React.useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  React.useEffect(() => {
    updateScrollState()
    const el = scrollContainerRef.current
    if (!el) return
    
    el.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [updateScrollState, sortedCategories])

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current
    if (!el) return
    const scrollAmount = 400
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div className={cn("relative group/nav", className)}>
      {/* Left scroll button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10",
            "size-10 rounded-full bg-background border border-border shadow-lg",
            "flex items-center justify-center",
            "opacity-0 group-hover/nav:opacity-100 transition-opacity",
            "hover:bg-muted focus-visible:opacity-100"
          )}
          aria-label={locale === "bg" ? "Превърти наляво" : "Scroll left"}
        >
          <CaretLeft size={20} weight="bold" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex items-start gap-1 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
        role="navigation"
        aria-label={locale === "bg" ? "Категории" : "Categories"}
      >
        {/* "All" circle */}
        <button
          type="button"
          onClick={() => onCategoryClick(null)}
          className="group/item shrink-0 flex flex-col items-center gap-1.5 w-20 p-1.5 rounded-lg transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {/* Circle */}
          <div className={cn(
            "size-14 rounded-full flex items-center justify-center transition-all",
            "border-2",
            isAllActive
              ? "bg-foreground border-foreground"
              : "bg-muted/60 border-border hover:border-foreground/40"
          )}>
            <SquaresFour
              size={24}
              weight={isAllActive ? "fill" : "duotone"}
              className={isAllActive ? "text-background" : "text-foreground/80"}
            />
          </div>
          {/* Label */}
          <span className={cn(
            "text-xs font-medium text-center leading-tight line-clamp-1",
            isAllActive ? "text-foreground" : "text-muted-foreground group-hover/item:text-foreground"
          )}>
            {t("all")}
          </span>
          {/* Count */}
          {totalCount > 0 && (
            <span className="text-2xs text-muted-foreground tabular-nums -mt-1">
              {formatCount(totalCount)}
            </span>
          )}
        </button>

        {/* Category circles */}
        {sortedCategories.map((cat) => {
          const name = getCategoryName(cat, locale)
          const isActive = activeCategory === cat.slug
          const count = categoryCounts[cat.slug]

          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group/item shrink-0 flex flex-col items-center gap-1.5 w-20 p-1.5 rounded-lg transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Circle */}
              <div className={cn(
                "size-14 rounded-full flex items-center justify-center transition-all",
                "border-2",
                isActive
                  ? "bg-foreground border-foreground"
                  : "bg-muted/60 border-border hover:border-foreground/40"
              )}>
                <span className={isActive ? "text-background" : "text-foreground/80"}>
                  {getCategoryIcon(cat.slug, { size: 24, weight: isActive ? "fill" : "duotone" })}
                </span>
              </div>
              {/* Label */}
              <span className={cn(
                "text-xs font-medium text-center leading-tight line-clamp-1 w-full",
                isActive ? "text-foreground" : "text-muted-foreground group-hover/item:text-foreground"
              )}>
                {name}
              </span>
              {/* Count */}
              {typeof count === "number" && count > 0 && (
                <span className="text-2xs text-muted-foreground tabular-nums -mt-1">
                  {formatCount(count)}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Right scroll button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10",
            "size-10 rounded-full bg-background border border-border shadow-lg",
            "flex items-center justify-center",
            "opacity-0 group-hover/nav:opacity-100 transition-opacity",
            "hover:bg-muted focus-visible:opacity-100"
          )}
          aria-label={locale === "bg" ? "Превърти надясно" : "Scroll right"}
        >
          <CaretRight size={20} weight="bold" />
        </button>
      )}
    </div>
  )
}

/**
 * Format a number as a compact string (e.g., 51089 -> "51K")
 */
function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(count >= 10000000 ? 0 : 1).replace(/\.0$/, "")}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, "")}K`
  }
  return count.toString()
}
