"use client"

import { useCategoriesCache, getCategoryName, getCategoryShortName } from "@/hooks/use-categories-cache"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/category-icons"

// Fallback categories if fetch fails
const fallbackCategories = [
  { id: "1", name: "Electronics", name_bg: "Техника", slug: "electronics", image_url: "/placeholder.svg" },
  { id: "2", name: "Fashion", name_bg: "Мода", slug: "fashion", image_url: "/placeholder.svg" },
  { id: "3", name: "Home", name_bg: "Дом", slug: "home", image_url: "/placeholder.svg" },
  { id: "4", name: "Beauty", name_bg: "Красота", slug: "beauty", image_url: "/placeholder.svg" },
  { id: "5", name: "Gaming", name_bg: "Гейминг", slug: "gaming", image_url: "/placeholder.svg" },
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
      className="w-full"
    >
      <div 
        className="flex overflow-x-auto no-scrollbar gap-2 px-4 py-1 snap-x snap-mandatory scroll-pl-4"
        role="list"
      >
        {isLoading && fetchedCategories.length === 0 ? (
          // Skeleton state
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="size-14 rounded-full bg-muted" />
              <div className="h-2.5 w-10 bg-muted rounded" />
            </div>
          ))
        ) : (
          displayCategories.map((cat) => {
            // Use short name for display, full name for accessibility
            const fullName = getCategoryName(cat, locale)
            const shortName = getCategoryShortName(cat, locale)
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                prefetch={true}
                aria-label={fullName}
                className={cn(
                  "group snap-start shrink-0",
                  "flex flex-col items-center gap-1.5",
                  "touch-action-manipulation",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl",
                )}
                role="listitem"
              >
                {/* Icon Tile - Neutral background, Brand icon, No shadow */}
                <div
                  className={cn(
                    "flex items-center justify-center",
                    "size-14 rounded-full",
                    "bg-secondary border border-border/40",
                    "group-hover:bg-secondary/80 transition-colors"
                  )}
                >
                  <span className="text-primary">
                    {getCategoryIcon(cat.slug, { size: 26, weight: "duotone" })}
                  </span>
                </div>
                {/* Label - Tight leading, slightly larger than tiny */}
                <span className="text-foreground font-medium text-tiny text-center w-14 leading-tight line-clamp-2 break-words">
                  {shortName}
                </span>
              </Link>
            )
          })
        )}
      </div>
    </nav>
  )
}
