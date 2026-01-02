"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useSelectedLayoutSegment } from "next/navigation"

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
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const activeRootSlug = React.useMemo(() => {
    if (!selectedSegment) return null
    return rootSlugBySlug?.[selectedSegment] ?? selectedSegment
  }, [rootSlugBySlug, selectedSegment])

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

  return (
    <div className="w-full bg-background border-b border-border/40 sticky top-[52px] z-30">
      <div 
        ref={scrollRef}
        className="relative flex items-center gap-3 overflow-x-auto no-scrollbar px-(--page-inset)"
        role="tablist"
      >
        {/* "All" Tab - Text style like homepage */}
        <Link
          href="/categories"
          prefetch={true}
          data-slug="all"
          role="tab"
          aria-selected={!selectedSegment}
          className={cn(
            "shrink-0 py-3 text-sm relative",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "transition-colors",
            !selectedSegment
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="relative inline-flex flex-col items-center">
            <span className={cn(
              "transition-[font-weight] duration-100",
              !selectedSegment ? "font-bold" : "font-medium"
            )}>
              {locale === 'bg' ? 'Всички' : 'All'}
            </span>
            <span className="font-bold invisible h-0 overflow-hidden" aria-hidden="true">
              {locale === 'bg' ? 'Всички' : 'All'}
            </span>
            {!selectedSegment && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
          </span>
        </Link>

        {categories.map((cat) => {
          const isActive = activeRootSlug === cat.slug
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              data-slug={cat.slug}
              prefetch={true}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "shrink-0 py-3 text-sm relative",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="relative inline-flex flex-col items-center">
                <span className={cn(
                  "transition-[font-weight] duration-100",
                  isActive ? "font-bold" : "font-medium"
                )}>
                  {getCategoryName(cat)}
                </span>
                <span className="font-bold invisible h-0 overflow-hidden" aria-hidden="true">
                  {getCategoryName(cat)}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
