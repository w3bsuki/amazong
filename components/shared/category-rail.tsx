"use client"

import { useCategoriesCache, getCategoryName, getCategoryShortName } from "@/hooks/use-categories-cache"
import { CategoryCircle } from "@/components/shared/category/category-circle"

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
      {/* 
        Safe area padding using Tailwind v4 container spacing.
        Matches the standard page content margins for visual consistency.
      */}
      <div className="overflow-hidden">
        <div 
          className="flex overflow-x-auto no-scrollbar gap-2 py-1.5 snap-x snap-mandatory px-4 scroll-px-4"
          role="list"
        >
          {isLoading && fetchedCategories.length === 0 ? (
            // Skeleton state
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="size-12 rounded-full bg-muted" />
                <div className="h-2.5 w-10 bg-muted rounded" />
              </div>
            ))
          ) : (
            displayCategories.map((cat) => {
              // Use short name for display, full name for accessibility
              const fullName = getCategoryName(cat, locale)
              const shortName = getCategoryShortName(cat, locale)
              return (
                <CategoryCircle
                  key={cat.slug}
                  category={cat}
                  href={`/categories/${cat.slug}`}
                  prefetch={true}
                  ariaLabel={fullName}
                  circleClassName="size-12"
                  fallbackIconSize={24}
                  fallbackIconWeight="duotone"
                  variant="rail"
                  label={shortName}
                  labelClassName="text-foreground font-medium text-tiny text-center w-12 leading-tight truncate"
                  className="rounded-md"
                  role={"listitem" as any}
                />
              )
            })
          )}
        </div>
      </div>
    </nav>
  )
}
