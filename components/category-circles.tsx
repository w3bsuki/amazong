"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url?: string | null
}

// Fallback images for categories
const categoryImages: Record<string, string> = {
  electronics: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&q=80",
  computers: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80",
  gaming: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&q=80",
  "smart-home": "https://images.unsplash.com/photo-1558002038-1055907df827?w=200&q=80",
  home: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
  fashion: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=200&q=80",
  toys: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&q=80",
  sports: "https://images.unsplash.com/photo-1461896836934-afa09e87b19e?w=200&q=80",
  books: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&q=80",
  automotive: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=200&q=80",
  garden: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80",
  health: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=200&q=80",
  baby: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&q=80",
  pets: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&q=80",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80",
  default: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80"
}

function getCategoryImage(slug: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl
  return categoryImages[slug] || categoryImages.default
}

interface CategoryCirclesProps {
  locale?: string
}

export function CategoryCircles({ locale = "en" }: CategoryCirclesProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)
  const [categories, setCategories] = React.useState<Category[]>([])

  // Fetch categories from Supabase
  React.useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories)
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err))
  }, [])

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])

  React.useEffect(() => {
    checkScroll()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScroll)
      window.addEventListener("resize", checkScroll)
      return () => {
        scrollElement.removeEventListener("scroll", checkScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className={cn(
      "relative w-full overflow-hidden",
      // Mobile: White card styling
      "bg-white pt-4 pb-3 border-0 rounded-none",
      // Desktop: Card styling with rounded corners
      "sm:py-5 sm:border sm:border-border sm:rounded-md"
    )}>
      <h2 className={cn(
        "font-bold text-foreground mb-3",
        // Mobile: Clean styling
        "text-base px-4",
        // Desktop: Larger with proper padding
        "sm:text-lg sm:mb-4 sm:px-5"
      )}>
        {locale === "bg" ? "Пазарувай по категория" : "Shop by Category"}
      </h2>
      
      {/* Scrollable Container - Target style with circular images */}
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide snap-x-mandatory scroll-smooth",
          // Mobile: Safe area padding + top padding for ring
          "gap-4 pl-4 py-2 scroll-pl-4",
          // Desktop: Better spacing
          "sm:gap-5 sm:pl-5 sm:py-3 sm:scroll-pl-5"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/search?category=${category.slug}`}
            className={cn(
              "flex flex-col items-center gap-1.5 sm:gap-2.5 min-w-[76px] sm:min-w-[90px] md:min-w-[100px] group snap-start shrink-0",
              "touch-action-manipulation active:scale-95 transition-transform",
              // Add right padding to last item
              index === categories.length - 1 && "mr-4 sm:mr-5"
            )}
          >
            {/* Circle with image */}
            <div
              className={cn(
                "rounded-full flex items-center justify-center overflow-hidden",
                // Mobile: 72px for proper touch target
                "size-[72px] bg-muted border-2 border-border",
                // Desktop: Larger with hover effect
                "sm:size-20 md:size-24",
                "group-hover:border-primary transition-colors"
              )}
            >
              <img 
                src={getCategoryImage(category.slug, category.image_url)} 
                alt={getCategoryName(category)}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Category Name */}
            <span className={cn(
              "font-medium text-center line-clamp-2",
              // Mobile: Compact text
              "text-[11px] text-muted-foreground max-w-[72px]",
              // Desktop: Standard sizing with hover underline
              "sm:text-xs md:text-sm sm:text-foreground sm:max-w-[90px] md:max-w-[100px]",
              "group-hover:text-primary group-hover:underline"
            )}>
              {getCategoryName(category)}
            </span>
          </Link>
        ))}
      </div>

      {/* Left Arrow - Desktop only, always visible when scrollable */}
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-1 top-1/2 -translate-y-1/2 z-10",
          "size-11 bg-white hover:bg-muted rounded-full border border-border shadow-sm",
          "flex items-center justify-center",
          "hidden sm:flex",
          !canScrollLeft && "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll left"
      >
        <CaretLeft size={20} weight="regular" className="text-muted-foreground" />
      </button>

      {/* Right Arrow - Desktop only */}
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-1 top-1/2 -translate-y-1/2 z-10",
          "size-11 bg-white hover:bg-muted rounded-full border border-border shadow-sm",
          "flex items-center justify-center",
          "hidden sm:flex",
          !canScrollRight && "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll right"
      >
        <CaretRight size={20} weight="regular" className="text-muted-foreground" />
      </button>

      {/* Mobile scroll indicator - subtle fade */}
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent pointer-events-none sm:hidden transition-opacity",
          !canScrollRight && "opacity-0"
        )} 
      />
    </div>
  )
}
