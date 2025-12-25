"use client"

import { useCategoriesCache, getCategoryName } from "@/hooks/use-categories-cache"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/category-icons"

// Fallback categories if fetch fails
const fallbackCategories = [
  { id: "1", name: "Electronics", name_bg: "Техника", slug: "electronics", image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&auto=format&fit=crop" },
  { id: "2", name: "Fashion", name_bg: "Мода", slug: "fashion", image_url: "https://images.unsplash.com/photo-1445205170230-053b830c6039?q=80&w=500&auto=format&fit=crop" },
  { id: "3", name: "Home", name_bg: "Дом", slug: "home", image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500&auto=format&fit=crop" },
  { id: "4", name: "Beauty", name_bg: "Красота", slug: "beauty", image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop" },
  { id: "5", name: "Gaming", name_bg: "Гейминг", slug: "gaming", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500&auto=format&fit=crop" },
] as any[]

interface CategoryRailProps {
  locale: string
  className?: string
  onCategorySelect?: (slug: string) => void
  activeCategory?: string
}

// Shared version - Rounded rectangles with images
export function CategoryRail({ locale, className, onCategorySelect, activeCategory }: CategoryRailProps) {
  const sectionLabel = locale === "bg" ? "Категории" : "Categories"
  const { categories: fetchedCategories, isLoading } = useCategoriesCache()
  
  const displayCategories = fetchedCategories.length > 0 
    ? fetchedCategories.slice(0, 10) 
    : fallbackCategories

  return (
    <nav 
      aria-label={sectionLabel}
      className={cn("py-0.5", className)}
    >
      <div 
        className="flex overflow-x-auto no-scrollbar gap-2.5 px-3 py-0.5 snap-x snap-mandatory scroll-pl-3"
        role="list"
      >
        {isLoading && fetchedCategories.length === 0 ? (
          // Skeleton state
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="size-[72px] rounded-full bg-muted animate-pulse" />
              <div className="h-2.5 w-10 bg-muted animate-pulse rounded" />
            </div>
          ))
        ) : (
          <>
            {/* "All" option for desktop filtering mode */}
            {onCategorySelect && (
              <button
                onClick={() => onCategorySelect("all")}
                className="flex flex-col items-center gap-1.5 shrink-0 snap-start group cursor-pointer"
              >
                <div className={cn(
                  "size-[72px] rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  activeCategory === "all" 
                    ? "border-primary bg-primary/5" 
                    : "border-transparent bg-muted/50 group-hover:bg-muted"
                )}>
                  <span className={cn(
                    "text-2xl font-medium",
                    activeCategory === "all" ? "text-primary" : "text-muted-foreground"
                  )}>
                    ∞
                  </span>
                </div>
                <span className={cn(
                  "text-[11px] font-medium text-center leading-tight max-w-[72px] truncate transition-colors",
                  activeCategory === "all" ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {locale === "bg" ? "Всички" : "All"}
                </span>
              </button>
            )}

            {displayCategories.map((cat) => {
              const categoryName = getCategoryName(cat, locale)
              const isActive = activeCategory === cat.slug

              // If onCategorySelect is provided, behave as a filter button
              if (onCategorySelect) {
                return (
                  <button
                    key={cat.id}
                    onClick={() => onCategorySelect(cat.slug)}
                    className="flex flex-col items-center gap-1.5 shrink-0 snap-start group cursor-pointer"
                  >
                    <div className={cn(
                      "size-[72px] rounded-full p-0.5 transition-all duration-300 border-2",
                      isActive 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-transparent group-hover:border-primary/50"
                    )}>
                      <div className="relative size-full rounded-full overflow-hidden bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={cat.image_url || "/placeholder.svg"} 
                          alt=""
                          className={cn(
                            "size-full object-cover transition-transform duration-500",
                            isActive ? "scale-110" : "group-hover:scale-110"
                          )}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <span className={cn(
                      "text-[11px] font-medium text-center leading-tight max-w-[72px] truncate transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {categoryName}
                    </span>
                  </button>
                )
              }

              // Default link behavior (for mobile nav)
              return (
                <Link 
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex flex-col items-center gap-1.5 shrink-0 snap-start group"
                >
                  <div className="size-[72px] rounded-full p-0.5 border-2 border-transparent group-hover:border-primary/50 transition-all duration-300">
                    <div className="relative size-full rounded-full overflow-hidden bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={cat.image_url || "/placeholder.svg"} 
                        alt=""
                        className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground text-center leading-tight max-w-[72px] truncate transition-colors">
                    {categoryName}
                  </span>
                </Link>
              )
            })}
          </>
        )}
      </div>
    </nav>
  )
}

