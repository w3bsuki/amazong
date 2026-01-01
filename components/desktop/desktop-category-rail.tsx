"use client"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useCategoriesCache, getCategoryName } from "@/hooks/use-categories-cache"
import type { Category } from "@/hooks/use-categories-cache"
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
] as const satisfies Category[]

interface DesktopCategoryRailProps {
  locale: string
  tone?: "default" | "onBlue"
  showTitle?: boolean
  className?: string
  hrefForCategory?: (slug: string) => string
}

export function DesktopCategoryRail({
  locale,
  tone = "default",
  showTitle = true,
  className,
  hrefForCategory,
}: DesktopCategoryRailProps) {
  const { categories: fetchedCategories, isLoading } = useCategoriesCache()
  const displayCategories = fetchedCategories.length > 0 ? fetchedCategories : fallbackCategories

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
        <div className="flex items-center gap-2">
          <CarouselPrevious 
            variant="outline" 
            className={cn(
              "static translate-y-0 shrink-0",
              isOnBlue 
                ? "border-cta-trust-blue-text/20 bg-cta-trust-blue-text/10 text-cta-trust-blue-text hover:bg-cta-trust-blue-text/20 hover:text-cta-trust-blue-text disabled:opacity-30" 
                : "border-border/70 bg-background text-foreground hover:bg-muted disabled:opacity-30"
            )} 
          >
            <CaretLeft size={16} weight="bold" />
          </CarouselPrevious>
          
          <CarouselContent className="-ml-3 select-none py-2">
            {isLoading && fetchedCategories.length === 0 ? (
              Array.from({ length: 15 }).map((_, i) => (
                <CarouselItem key={i} className="pl-3 basis-auto shrink-0">
                  <div className="flex flex-col items-center gap-3 shrink-0 w-20">
                    <div className={cn("rounded-full bg-muted", circleSizeClass)} />
                    <div className="h-4 w-16 bg-muted rounded" />
                  </div>
                </CarouselItem>
              ))
            ) : (
              displayCategories.map((cat) => {
                const categoryName = getCategoryName(cat, locale)
                const href = hrefForCategory ? hrefForCategory(cat.slug) : `/categories/${cat.slug}`
                return (
                  <CarouselItem key={cat.slug} className="pl-3 basis-auto shrink-0">
                    <Link
                      href={href}
                      title={categoryName}
                      className={cn("group flex flex-col items-center shrink-0", itemWidthClass)}
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
              })
            )}
          </CarouselContent>

          <CarouselNext 
            variant="outline" 
            className={cn(
              "static translate-y-0 shrink-0",
              isOnBlue 
                ? "border-cta-trust-blue-text/20 bg-cta-trust-blue-text/10 text-cta-trust-blue-text hover:bg-cta-trust-blue-text/20 hover:text-cta-trust-blue-text disabled:opacity-30" 
                : "border-border/70 bg-background text-foreground hover:bg-muted disabled:opacity-30"
            )} 
          >
            <CaretRight size={16} weight="bold" />
          </CarouselNext>
        </div>
      </Carousel>
    </section>
  )
}
