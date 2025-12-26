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

interface MobileCategoryRailProps {
  locale: string
}

// Mobile version - Rounded rectangles with images (Premium look like reference)
export function MobileCategoryRail({ locale }: MobileCategoryRailProps) {
  const sectionLabel = locale === "bg" ? "Категории" : "Categories"
  const { categories: fetchedCategories, isLoading } = useCategoriesCache()
  
  const displayCategories = fetchedCategories.length > 0 
    ? fetchedCategories.slice(0, 10) 
    : fallbackCategories

  return (
    <nav 
      aria-label={sectionLabel}
      className="py-0.5"
    >
      <div 
        className="flex overflow-x-auto no-scrollbar gap-2 px-3 py-0.5 snap-x snap-mandatory scroll-pl-3"
        role="list"
      >
        {isLoading && fetchedCategories.length === 0 ? (
          // Skeleton state
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="size-14 rounded-full bg-muted animate-pulse" />
              <div className="h-2.5 w-10 bg-muted animate-pulse rounded" />
            </div>
          ))
        ) : (
          displayCategories.map((cat) => {
            const categoryName = getCategoryName(cat, locale)
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                aria-label={categoryName}
                className={cn(
                  "group snap-start shrink-0",
                  "flex flex-col items-center",
                  "touch-action-manipulation",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full",
                )}
                role="listitem"
              >
                {/* Icon Tile - Consistent, curated look (no random images) */}
                <div
                  className={cn(
                    "flex items-center justify-center",
                    "size-14 rounded-full",
                    "bg-cta-trust-blue ring-1 ring-cta-trust-blue/35",
                    "transition-all duration-200 ease-out",
                    "group-hover:bg-cta-trust-blue-hover group-hover:ring-cta-trust-blue/55",
                    "group-active:scale-[0.96]"
                  )}
                >
                  <span className="text-cta-trust-blue-text transition-colors scale-110">
                    {getCategoryIcon(cat.slug, { size: 24, weight: "regular" })}
                  </span>
                </div>
                {/* Label */}
                <span className="mt-1.5 text-foreground font-semibold text-xs text-center max-w-16 leading-tight line-clamp-1">
                  {categoryName}
                </span>
              </Link>
            )
          })
        )}
      </div>
    </nav>
  )
}

// Alias for backward compatibility - used by tabbed-product-feed
export const CategoryRail = MobileCategoryRail
