"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { 
  CaretLeft,
  CaretRight,
  Desktop,
  DeviceMobile,
  GameController,
  House,
  TShirt,
  PaintBrush,
  PuzzlePiece,
  Barbell,
  Books,
  Car,
  Plant,
  HeartHalf,
  Baby,
  PawPrint,
  Briefcase,
  ShoppingBag,
  type Icon
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url?: string | null
}

// Category icons mapping using Phosphor Icons
const categoryIcons: Record<string, Icon> = {
  electronics: DeviceMobile,
  computers: Desktop,
  gaming: GameController,
  "smart-home": House,
  home: House,
  fashion: TShirt,
  beauty: PaintBrush,
  toys: PuzzlePiece,
  sports: Barbell,
  books: Books,
  automotive: Car,
  garden: Plant,
  health: HeartHalf,
  baby: Baby,
  pets: PawPrint,
  office: Briefcase,
  default: ShoppingBag
}

function getCategoryIcon(slug: string): Icon {
  return categoryIcons[slug] || categoryIcons.default
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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

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
  }, [checkScroll, categories])

  return (
    <div className={cn(
      "relative w-full overflow-hidden",
      // Mobile: White card styling
      "bg-white pt-4 pb-3 border-0 rounded-none",
      // Desktop: Card styling with rounded corners
      "sm:py-5 sm:border sm:border-border sm:rounded-md"
    )}>
      {/* Header with title, scroll buttons, and See more link */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-foreground text-base sm:text-lg">
            {locale === "bg" ? "Пазарувай по категория" : "Shop by Category"}
          </h2>
          {/* See all - Desktop: next to title */}
          <Link 
            href="/categories" 
            className="hidden sm:flex text-brand-blue hover:underline text-sm font-normal items-center gap-0.5"
          >
            {locale === "bg" ? "Виж всички" : "See all"}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Scroll buttons - Desktop only */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              className={cn(
                "size-8 flex items-center justify-center rounded-full border border-border bg-white hover:bg-muted",
                !canScrollLeft && "opacity-40 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <CaretLeft size={16} weight="regular" className="text-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={cn(
                "size-8 flex items-center justify-center rounded-full border border-border bg-white hover:bg-muted",
                !canScrollRight && "opacity-40 pointer-events-none"
              )}
              aria-label="Scroll right"
            >
              <CaretRight size={16} weight="regular" className="text-foreground" />
            </button>
          </div>
          {/* See all - Mobile only */}
          <Link 
            href="/categories" 
            className="sm:hidden text-brand-blue hover:underline text-xs font-normal flex items-center gap-0.5"
          >
            {locale === "bg" ? "Виж всички" : "See all"}
            <CaretRight size={14} weight="regular" />
          </Link>
        </div>
      </div>
      
      {/* Scrollable Container - Clean icons like eBay */}
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide snap-x-mandatory scroll-smooth",
          // Mobile: Safe area padding
          "gap-4 pl-4 py-2 scroll-pl-4",
          // Desktop: Better spacing
          "sm:gap-5 sm:pl-5 sm:py-3 sm:scroll-pl-5"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category, index) => {
          const IconComponent = getCategoryIcon(category.slug)
          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className={cn(
                "flex flex-col items-center gap-1.5 sm:gap-2 min-w-[72px] sm:min-w-[88px] md:min-w-[96px] group snap-start shrink-0",
                // Add right padding to last item
                index === categories.length - 1 && "mr-4 sm:mr-5"
              )}
            >
              {/* Circle with icon */}
              <div
                className={cn(
                  "rounded-full flex items-center justify-center",
                  // Mobile: Clean circle
                  "size-16 bg-secondary",
                  // Desktop: Larger
                  "sm:size-20 md:size-[88px]"
                )}
              >
                <IconComponent 
                  className="size-7 sm:size-8 md:size-9 text-foreground"
                  weight="regular"
                />
              </div>
              
              {/* Category Name - eBay style: normal weight */}
              <span className={cn(
                "font-normal text-center line-clamp-1",
                // Mobile: Compact text
                "text-[11px] text-muted-foreground max-w-[72px]",
                // Desktop: Standard sizing with hover underline
                "sm:text-xs md:text-sm sm:text-foreground sm:max-w-[88px] md:max-w-[96px]",
                "group-hover:text-link group-hover:underline"
              )}>
                {getCategoryName(category)}
              </span>
            </Link>
          )
        })}
      </div>

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
