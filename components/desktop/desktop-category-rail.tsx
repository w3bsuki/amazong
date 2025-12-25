"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useCategoriesCache, getCategoryName } from "@/hooks/use-categories-cache"
import { getCategoryIcon } from "@/lib/category-icons"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

// Fallback categories if fetch fails
const fallbackCategories = [
  { id: "1", name: "Electronics", name_bg: "Техника", slug: "electronics", image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&auto=format&fit=crop" },
  { id: "2", name: "Fashion", name_bg: "Мода", slug: "fashion", image_url: "https://images.unsplash.com/photo-1445205170230-053b830c6039?q=80&w=500&auto=format&fit=crop" },
  { id: "3", name: "Home", name_bg: "Дом", slug: "home", image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500&auto=format&fit=crop" },
  { id: "4", name: "Beauty", name_bg: "Красота", slug: "beauty", image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop" },
  { id: "5", name: "Gaming", name_bg: "Гейминг", slug: "gaming", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500&auto=format&fit=crop" },
  { id: "6", name: "Sports", name_bg: "Спорт", slug: "sports", image_url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=500&auto=format&fit=crop" },
  { id: "7", name: "Toys", name_bg: "Играчки", slug: "toys", image_url: "https://images.unsplash.com/photo-1566576912902-4b61e3785827?q=80&w=500&auto=format&fit=crop" },
  { id: "8", name: "Books", name_bg: "Книги", slug: "books", image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=500&auto=format&fit=crop" },
] as any[]

interface DesktopCategoryRailProps {
  locale: string
  tone?: "default" | "onBlue"
  showTitle?: boolean
  className?: string
}

export function DesktopCategoryRail({
  locale,
  tone = "default",
  showTitle = true,
  className,
}: DesktopCategoryRailProps) {
  const { categories: fetchedCategories, isLoading } = useCategoriesCache()
  const displayCategories = fetchedCategories.length > 0 ? fetchedCategories : fallbackCategories

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll)
    window.addEventListener("resize", checkScroll)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = 400
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  const isOnBlue = tone === "onBlue"
  const isCompact = isOnBlue && !showTitle
  const itemWidthClass = isCompact ? "w-20" : "w-24"
  const circleSizeClass = isCompact ? "size-20" : "size-24"
  const itemGapClass = isCompact ? "gap-2.5" : "gap-3"
  const railGapClass = isCompact ? "gap-5" : "gap-6"
  const labelClass = isCompact ? "text-xs" : "text-sm"

  return (
    <section
      className={cn("w-full", className)}
      aria-label={locale === "bg" ? "Категории" : "Categories"}
    >
      {(showTitle || canScrollLeft || canScrollRight) && (
        <div className={cn("flex items-center justify-between", showTitle ? "mb-4" : "mb-2")}>
          {showTitle ? (
            <h2
              className={cn(
                "text-2xl font-bold tracking-tight",
                isOnBlue ? "text-white" : "text-foreground"
              )}
            >
              {locale === "bg" ? "Пазарувай по категория" : "Shop by category"}
            </h2>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "size-8 rounded-full border flex items-center justify-center transition-all",
                "active:scale-95",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                isOnBlue
                  ? "border-white/25 text-white hover:bg-white/10"
                  : "border-border text-foreground hover:bg-muted"
              )}
              aria-label="Scroll left"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "size-8 rounded-full border flex items-center justify-center transition-all",
                "active:scale-95",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                isOnBlue
                  ? "border-white/25 text-white hover:bg-white/10"
                  : "border-border text-foreground hover:bg-muted"
              )}
              aria-label="Scroll right"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto no-scrollbar pb-2 scroll-smooth",
          railGapClass,
          isOnBlue ? "-mx-1 px-1" : null
        )}
      >
        {isLoading && fetchedCategories.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 shrink-0">
              <div className={cn("rounded-full bg-muted animate-pulse", circleSizeClass)} />
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            </div>
          ))
        ) : (
          displayCategories.map((cat) => {
            const categoryName = getCategoryName(cat, locale)
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={cn("group flex flex-col items-center shrink-0", itemGapClass, itemWidthClass)}
              >
                <div
                  className={cn(
                    "relative overflow-hidden rounded-full",
                    circleSizeClass,
                    "transition-all duration-300 ease-out",
                    isOnBlue
                      ? cn(
                          "bg-white/95 ring-1 ring-white/25 group-hover:bg-white group-hover:scale-105",
                          isCompact ? "group-hover:ring-2 group-hover:ring-white/30" : "group-hover:ring-4 group-hover:ring-white/30"
                        )
                      : cn(
                          "bg-brand-muted/50 ring-1 ring-border/35 group-hover:bg-brand-muted/70 group-hover:scale-105",
                          isCompact ? "group-hover:ring-2 group-hover:ring-brand/15" : "group-hover:ring-4 group-hover:ring-brand/15"
                        )
                  )}
                >
                  <div className="flex items-center justify-center h-full">
                    <span
                      className={cn(
                        "transition-colors scale-125",
                        isOnBlue ? "text-cta-trust-blue" : "text-brand group-hover:text-brand-dark"
                      )}
                    >
                      {getCategoryIcon(cat.slug, { size: 24, weight: "regular" })}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "font-medium text-center transition-colors line-clamp-2 leading-tight",
                    labelClass,
                    isOnBlue
                      ? "text-white/85 group-hover:text-white"
                      : "text-foreground/80 group-hover:text-foreground"
                  )}
                >
                  {categoryName}
                </span>
              </Link>
            )
          })
        )}
      </div>
    </section>
  )
}
