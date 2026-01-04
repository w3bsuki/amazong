"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryName, type CategoryDisplay } from "@/lib/category-display"
import { getCategoryIcon } from "@/lib/category-icons"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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
] as const satisfies CategoryDisplay[]

interface DesktopCategoryRailProps {
  locale: string
  categories: CategoryDisplay[]
  tone?: "default" | "onBlue"
  showTitle?: boolean
  className?: string
  hrefForCategory?: (slug: string) => string
}

export function DesktopCategoryRail({
  locale,
  categories,
  tone = "default",
  showTitle = true,
  className,
  hrefForCategory,
}: DesktopCategoryRailProps) {
  const displayCategories = categories.length > 0 ? categories : fallbackCategories

  const railRef = React.useRef<HTMLDivElement | null>(null)

  const getRailItems = React.useCallback(() => {
    const root = railRef.current
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLAnchorElement>('a[data-rail-item="true"]'))
  }, [])

  const handleItemFocus = React.useCallback((e: React.FocusEvent<HTMLAnchorElement>) => {
    // Keep focused item visible when tabbing through a horizontally scrollable rail.
    e.currentTarget.scrollIntoView({ block: "nearest", inline: "center" })
  }, [])

  const handleItemKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLAnchorElement>) => {
    // Add optional arrow-key navigation without changing default tab order.
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return

    const items = getRailItems()
    if (items.length === 0) return

    const current = e.currentTarget
    const idx = items.indexOf(current)
    if (idx < 0) return

    const delta = e.key === "ArrowRight" ? 1 : -1
    const next = items[idx + delta]
    if (!next) return

    e.preventDefault()
    next.focus()
  }, [getRailItems])

  const isOnBlue = tone === "onBlue"
  // When we hide the title (home page usage), keep the rail visually compact.
  const isCompact = !showTitle
  // Bulgarian labels are often 2+ words; give them enough width to wrap.
  const itemWidthClass = isCompact ? "w-20" : "w-24"
  const circleSizeClass = isCompact ? "size-16" : "size-20"
  const labelClass = isCompact ? "text-xs" : "text-sm"

  return (
    <section
      className={cn("w-full", className)}
      aria-label={locale === "bg" ? "Категории" : "Categories"}
    >
      {showTitle && (
        <div className={cn("flex items-center justify-between", showTitle ? "mb-4" : "mb-2")}>
          <h2
            className={cn(
              "text-2xl font-bold tracking-tight",
              isOnBlue ? "text-cta-trust-blue-text" : "text-foreground"
            )}
          >
            {locale === "bg" ? "Пазарувай по категория" : "Shop by category"}
          </h2>
        </div>
      )}

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 5,
          dragFree: true,
        }}
        className="w-full"
      >
        <div ref={railRef} className="flex items-center gap-2">
          <CarouselPrevious 
            variant="outline" 
            className={cn(
              "static translate-y-0 shrink-0",
              isOnBlue 
                ? "border-cta-trust-blue-text/20 bg-cta-trust-blue-text/10 text-cta-trust-blue-text hover:bg-cta-trust-blue-text/20 hover:text-cta-trust-blue-text disabled:opacity-30" 
                : "border-border/70 bg-background text-foreground hover:bg-muted disabled:opacity-30"
            )} 
            aria-label={locale === "bg" ? "Скролирай категориите наляво" : "Scroll categories left"}
          >
            <CaretLeft size={16} weight="bold" />
          </CarouselPrevious>
          
          <CarouselContent className="-ml-3 select-none py-2">
            {displayCategories.map((cat) => {
              const categoryName = getCategoryName(cat, locale)
              const href = hrefForCategory ? hrefForCategory(cat.slug) : `/categories/${cat.slug}`
              return (
                <CarouselItem key={cat.slug} className="pl-3 basis-auto shrink-0">
                  <Link
                    href={href}
                    title={categoryName}
                    data-rail-item="true"
                    className={cn(
                      "group flex flex-col items-center shrink-0",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      itemWidthClass
                    )}
                    onFocus={handleItemFocus}
                    onKeyDown={handleItemKeyDown}
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-full",
                        circleSizeClass,
                        isOnBlue
                          ? "bg-cta-trust-blue-text/12 ring-1 ring-cta-trust-blue-text/25 group-hover:bg-cta-trust-blue-text/18"
                          : "bg-brand ring-1 ring-brand/35 group-hover:bg-brand-dark"
                      )}
                    >
                      <div className="flex items-center justify-center h-full">
                        <span
                          className={cn(
                            isOnBlue
                              ? "text-cta-trust-blue-text"
                              : "text-primary-foreground"
                          )}
                        >
                          {getCategoryIcon(cat.slug, { size: 24, weight: "regular" })}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "font-medium text-center line-clamp-2 leading-tight mt-2",
                        labelClass
                      )}
                    >
                      <span
                        className={cn(
                          isOnBlue
                            ? "text-cta-trust-blue-text/85 group-hover:text-cta-trust-blue-text group-hover:underline"
                            : "text-foreground/80 group-hover:text-primary group-hover:underline"
                        )}
                      >
                        {categoryName}
                      </span>
                    </span>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          <CarouselNext 
            variant="outline" 
            className={cn(
              "static translate-y-0 shrink-0",
              isOnBlue 
                ? "border-cta-trust-blue-text/20 bg-cta-trust-blue-text/10 text-cta-trust-blue-text hover:bg-cta-trust-blue-text/20 hover:text-cta-trust-blue-text disabled:opacity-30" 
                : "border-border/70 bg-background text-foreground hover:bg-muted disabled:opacity-30"
            )} 
            aria-label={locale === "bg" ? "Скролирай категориите надясно" : "Scroll categories right"}
          >
            <CaretRight size={16} weight="bold" />
          </CarouselNext>
        </div>
      </Carousel>
    </section>
  )
}
