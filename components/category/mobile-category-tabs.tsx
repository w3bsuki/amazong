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
    <div className="w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border sticky top-[52px] z-30">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-2 gap-2 items-center snap-x snap-mandatory scroll-pl-2"
      >
        {/* "All" Link */}
        <Link
          href="/categories"
          data-slug="all"
          className={cn(
            "flex items-center justify-center px-4 h-[32px] rounded-full border transition-all whitespace-nowrap shrink-0 snap-start",
            !selectedSegment 
              ? "bg-foreground text-background border-foreground font-medium" 
              : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
          )}
        >
           <span className="text-xs">
             {locale === 'bg' ? 'Всички' : 'All'}
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
              className={cn(
                "flex items-center justify-center px-4 h-[32px] rounded-full border transition-all whitespace-nowrap shrink-0 snap-start",
                isActive
                  ? "bg-foreground text-background border-foreground font-medium" 
                  : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
              )}
            >
              <span className="text-xs">
                {getCategoryName(cat)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
