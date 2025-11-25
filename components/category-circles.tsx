"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  name: string
  nameEn: string
  slug: string
  icon: string
  gradient: string
}

const categories: Category[] = [
  {
    name: "Електроника",
    nameEn: "Electronics",
    slug: "electronics",
    icon: "📱",
    gradient: "from-blue-500 to-blue-700"
  },
  {
    name: "Компютри",
    nameEn: "Computers",
    slug: "computers",
    icon: "💻",
    gradient: "from-slate-500 to-slate-700"
  },
  {
    name: "Gaming",
    nameEn: "Gaming",
    slug: "gaming",
    icon: "🎮",
    gradient: "from-purple-500 to-purple-700"
  },
  {
    name: "Умен дом",
    nameEn: "Smart Home",
    slug: "smart-home",
    icon: "🏠",
    gradient: "from-teal-500 to-teal-700"
  },
  {
    name: "Дом и кухня",
    nameEn: "Home & Kitchen",
    slug: "home",
    icon: "🍳",
    gradient: "from-orange-500 to-orange-700"
  },
  {
    name: "Мода",
    nameEn: "Fashion",
    slug: "fashion",
    icon: "👗",
    gradient: "from-pink-500 to-pink-700"
  },
  {
    name: "Красота",
    nameEn: "Beauty",
    slug: "beauty",
    icon: "💄",
    gradient: "from-rose-400 to-rose-600"
  },
  {
    name: "Играчки",
    nameEn: "Toys",
    slug: "toys",
    icon: "🧸",
    gradient: "from-yellow-400 to-yellow-600"
  },
  {
    name: "Спорт",
    nameEn: "Sports",
    slug: "sports",
    icon: "⚽",
    gradient: "from-green-500 to-green-700"
  },
  {
    name: "Книги",
    nameEn: "Books",
    slug: "books",
    icon: "📚",
    gradient: "from-amber-600 to-amber-800"
  },
  {
    name: "Автомобили",
    nameEn: "Automotive",
    slug: "automotive",
    icon: "🚗",
    gradient: "from-red-500 to-red-700"
  },
  {
    name: "Градина",
    nameEn: "Garden",
    slug: "garden",
    icon: "🌱",
    gradient: "from-emerald-500 to-emerald-700"
  },
  {
    name: "Здраве",
    nameEn: "Health",
    slug: "health",
    icon: "💊",
    gradient: "from-cyan-500 to-cyan-700"
  },
  {
    name: "Бебета",
    nameEn: "Baby",
    slug: "baby",
    icon: "👶",
    gradient: "from-sky-400 to-sky-600"
  },
  {
    name: "Домашни любимци",
    nameEn: "Pets",
    slug: "pets",
    icon: "🐕",
    gradient: "from-amber-500 to-amber-700"
  },
  {
    name: "Офис",
    nameEn: "Office",
    slug: "office",
    icon: "🖨️",
    gradient: "from-gray-500 to-gray-700"
  },
  {
    name: "Музика",
    nameEn: "Music",
    slug: "music",
    icon: "🎵",
    gradient: "from-violet-500 to-violet-700"
  },
  {
    name: "Филми",
    nameEn: "Movies",
    slug: "movies",
    icon: "🎬",
    gradient: "from-indigo-500 to-indigo-700"
  }
]

interface CategoryCirclesProps {
  locale?: string
}

export function CategoryCircles({ locale = "en" }: CategoryCirclesProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

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
      // Mobile: White card styling to sit cleanly below hero gradient
      "bg-white pt-3 pb-2 border-0 rounded-none",
      // Desktop: Card styling with border
      "sm:py-4 sm:border sm:border-slate-200 sm:rounded"
    )}>
      <h2 className={cn(
        "font-bold text-slate-900 mb-2",
        // Mobile: Proper padding for safe area
        "text-sm px-4",
        // Desktop: Larger with proper padding
        "sm:text-lg sm:mb-4 sm:px-4"
      )}>
        {locale === "bg" ? "Пазарувай по категория" : "Shop by Category"}
      </h2>
      
      {/* Scrollable Container with snap scroll */}
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide snap-x-mandatory",
          // Mobile: Safe area padding on left/right with scroll padding
          "gap-4 pl-4 pb-1 scroll-pl-4",
          // Desktop: More spacing with padding
          "sm:gap-4 sm:pl-4 sm:pb-2 sm:scroll-pl-4"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/search?category=${category.slug}`}
            className={cn(
              "flex flex-col items-center gap-1.5 sm:gap-2.5 min-w-[72px] sm:min-w-[100px] group snap-start tap-transparent shrink-0",
              // Add right padding to last item for safe area
              index === categories.length - 1 && "mr-4 sm:mr-4"
            )}
          >
            {/* Circle with icon - larger touch target on mobile */}
            <div
              className={cn(
                "rounded-full flex items-center justify-center",
                // Mobile: Clean look with subtle border, no shadow
                "size-14 text-xl bg-slate-50 border border-slate-200 shadow-none",
                // Desktop: Larger with border styling
                "sm:size-20 sm:text-3xl md:size-24 md:text-4xl",
                "sm:bg-slate-100 sm:border sm:border-slate-200",
                "group-hover:border-blue-400 group-hover:bg-blue-50",
                "transition-all group-active:scale-95"
              )}
            >
              <span>{category.icon}</span>
            </div>
            
            {/* Category Name */}
            <span className={cn(
              "font-medium text-center group-hover:text-blue-600 group-hover:underline line-clamp-2",
              // Mobile: Smaller text, darker for visibility on light bg
              "text-[11px] text-slate-800 max-w-[72px]",
              // Desktop: Standard sizing
              "sm:text-xs md:text-sm sm:text-slate-700 sm:max-w-[90px]"
            )}>
              {locale === "bg" ? category.name : category.nameEn}
            </span>
          </Link>
        ))}
      </div>

      {/* Left Arrow - Desktop only */}
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-10",
          "h-full w-12 bg-linear-to-r from-white via-white/90 to-transparent",
          "flex items-center justify-start pl-1",
          "transition-opacity",
          "hidden sm:flex",
          !canScrollLeft && "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft className="size-8 text-slate-600 drop-shadow" />
      </button>

      {/* Right Arrow - Desktop only */}
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-10",
          "h-full w-12 bg-linear-to-l from-white via-white/90 to-transparent",
          "flex items-center justify-end pr-1",
          "transition-opacity",
          "hidden sm:flex",
          !canScrollRight && "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll right"
      >
        <ChevronRight className="size-8 text-slate-600 drop-shadow" />
      </button>

      {/* Mobile scroll indicator - subtle fade */}
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-white to-transparent pointer-events-none sm:hidden transition-opacity",
          !canScrollRight && "opacity-0"
        )} 
      />
    </div>
  )
}
