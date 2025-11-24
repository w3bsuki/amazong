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
    <div className="relative w-full bg-white py-4 px-2 shadow-sm rounded-lg">
      <h2 className="text-lg font-bold text-slate-900 mb-4 px-2">
        {locale === "bg" ? "Пазарувай по категория" : "Shop by Category"}
      </h2>
      
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2",
          !canScrollLeft && "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6 text-slate-700" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-2 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/search?category=${category.slug}`}
            className="flex flex-col items-center gap-2 min-w-[100px] group"
          >
            {/* Circle with gradient and icon */}
            <div
              className={cn(
                "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-4xl",
                "bg-gradient-to-br shadow-md",
                "ring-2 ring-white ring-offset-2 ring-offset-transparent",
                "group-hover:ring-amber-400",
                category.gradient
              )}
            >
              <span>{category.icon}</span>
            </div>
            
            {/* Category Name */}
            <span className="text-xs md:text-sm font-medium text-slate-700 text-center group-hover:text-amber-600 group-hover:underline line-clamp-2 max-w-[90px]">
              {locale === "bg" ? category.name : category.nameEn}
            </span>
          </Link>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2",
          !canScrollRight && "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6 text-slate-700" />
      </button>
    </div>
  )
}
