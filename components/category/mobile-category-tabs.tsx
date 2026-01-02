"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSelectedLayoutSegment, useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url: string | null
}

interface MobileCategoryTabsProps {
  categories: Category[]
  locale: string
  /** Maps any category slug to its root category slug (optional). */
  rootSlugBySlug?: Record<string, string>
}

export function MobileCategoryTabs({ categories, locale, rootSlugBySlug }: MobileCategoryTabsProps) {
  const selectedSegment = useSelectedLayoutSegment()
  const router = useRouter()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [pendingSlug, setPendingSlug] = React.useState<string | null>(null)

  const activeRootSlug = React.useMemo(() => {
    if (!selectedSegment) return null
    return rootSlugBySlug?.[selectedSegment] ?? selectedSegment
  }, [rootSlugBySlug, selectedSegment])

  // Clear pending state when navigation completes
  React.useEffect(() => {
    setPendingSlug(null)
  }, [selectedSegment])

  // Scroll active tab into view on mount/change
  React.useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    // On /categories (index) keep the scroll position at the start.
    if (!selectedSegment) {
      container.scrollTo({ left: 0, behavior: "auto" })
      return
    }

    const slugToScroll = activeRootSlug ?? selectedSegment
    const activeTab = container.querySelector(`[data-slug="${slugToScroll}"]`) as HTMLElement | null
    if (!activeTab) return

    // More reliable than scrollIntoView for horizontal tab bars:
    // center the active pill inside the scroll container.
    const targetLeft = activeTab.offsetLeft - (container.clientWidth - activeTab.clientWidth) / 2
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    })
  }, [activeRootSlug, selectedSegment])

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) return cat.name_bg
    return cat.name
  }

  // Handle pill click - instant visual feedback + router navigation
  const handlePillClick = React.useCallback((slug: string | null) => {
    const targetSlug = slug
    const currentSlug = selectedSegment

    // Skip if already on this category
    if (targetSlug === currentSlug || (targetSlug === null && !currentSlug)) return

    // Instant visual feedback
    setPendingSlug(targetSlug)

    // Navigate without scroll reset
    const path = targetSlug ? `/${locale}/categories/${targetSlug}` : `/${locale}/categories`
    router.push(path, { scroll: false })
  }, [locale, router, selectedSegment])

  // Determine which slug is visually active (pending takes priority for instant feedback)
  const visuallyActiveSlug = pendingSlug !== null ? pendingSlug : activeRootSlug

  return (
    <div className="w-full bg-background border-b border-border/40 sticky top-[52px] z-30">
      <div 
        ref={scrollRef}
        className="relative flex items-center gap-1.5 overflow-x-auto no-scrollbar px-(--page-inset) py-1.5"
        role="tablist"
      >
        {/* "All" Pill - Compact quick pill */}
        <button
          type="button"
          onClick={() => handlePillClick(null)}
          data-slug="all"
          role="tab"
          aria-selected={!visuallyActiveSlug}
          className={cn(
            // Compact pill - 28px height, tight padding, WCAG 2.2 AA compliant (min 24px)
            "shrink-0 h-7 px-3 rounded-full text-xs font-medium",
            "inline-flex items-center justify-center",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "transition-colors duration-100",
            !visuallyActiveSlug
              ? "bg-primary text-primary-foreground"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {locale === 'bg' ? 'Всички' : 'All'}
        </button>

        {categories.map((cat) => {
          const isActive = visuallyActiveSlug === cat.slug
          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => handlePillClick(cat.slug)}
              data-slug={cat.slug}
              role="tab"
              aria-selected={isActive}
              className={cn(
                // Compact pill - 28px height, tight padding, WCAG 2.2 AA compliant (min 24px)
                "shrink-0 h-7 px-3 rounded-full text-xs font-medium",
                "inline-flex items-center justify-center",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "transition-colors duration-100",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {getCategoryName(cat)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
