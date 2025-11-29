"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"
import { useSearchParams } from "next/navigation"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

interface SubcategoryCirclesProps {
  subcategories: Category[]
  currentCategory?: Category | null
  title?: string
  className?: string
  basePath?: string // "/categories" or undefined for "/search?category="
}

// Map category slugs to placeholder images (these would ideally come from the database)
const categoryImages: Record<string, string> = {
  // Gaming subcategories
  "consoles": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80",
  "gaming-accessories": "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=200&q=80",
  "video-games": "https://images.unsplash.com/photo-1493711662062-fa541f7f60d4?w=200&q=80",
  "pc-gaming": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200&q=80",
  "gaming-chairs": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=200&q=80",
  "vr-headsets": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=200&q=80",
  
  // Electronics subcategories
  "smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80",
  "tablets": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80",
  "laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80",
  "headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
  "cameras": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80",
  "tvs": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80",
  "speakers": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&q=80",
  "smartwatches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  "audio": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
  "phones-tablets": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80",
  "tv-home-cinema": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80",
  "wearables": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  
  // Computers subcategories  
  "desktops": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200&q=80",
  "monitors": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80",
  "keyboards": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&q=80",
  "mice": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80",
  "printers": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200&q=80",
  "networking": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80",
  
  // Home & Kitchen
  "appliances": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200&q=80",
  "cookware": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
  "furniture": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80",
  "decor": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&q=80",
  "bedding": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&q=80",
  "lighting": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&q=80",
  
  // Fashion
  "mens-clothing": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&q=80",
  "womens-clothing": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80",
  "shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
  "accessories": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80",
  "jewelry": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80",
  
  // Sports
  "exercise": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80",
  "outdoor": "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=200&q=80",
  "team-sports": "https://images.unsplash.com/photo-1461896836934-afa09e87b19e?w=200&q=80",
  
  // Default fallback
  "default": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80"
}

function getCategoryImage(slug: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl
  return categoryImages[slug] || categoryImages["default"]
}

export function SubcategoryCircles({ 
  subcategories, 
  currentCategory,
  title,
  className,
  basePath
}: SubcategoryCirclesProps) {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  // Build URL - supports both /categories/slug and /search?category=slug
  const buildUrl = (categorySlug: string) => {
    if (basePath) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("category")
      const queryString = params.toString()
      return `${basePath}/${categorySlug}${queryString ? `?${queryString}` : ''}`
    }
    const params = new URLSearchParams(searchParams.toString())
    params.set("category", categorySlug)
    return `/search?${params.toString()}`
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
      const scrollAmount = 280
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  if (subcategories.length === 0) return null

  return (
    <div className={cn("relative w-full", className)}>
      {/* Title - Target style */}
      {title && (
        <h2 className="text-base sm:text-lg font-bold text-foreground mb-4 px-0">
          {title}
        </h2>
      )}
      
      {/* Scrollable Container with circles */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth gap-4 sm:gap-5 py-1 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* "All in Category" circle - first item */}
          {currentCategory && (
            <Link
              href={buildUrl(currentCategory.slug)}
              className={cn(
                "flex flex-col items-center gap-2 min-w-[90px] sm:min-w-[100px] group snap-start shrink-0",
                "touch-action-manipulation"
              )}
            >
              {/* Circle with gradient/icon */}
              <div
                className={cn(
                  "rounded-full flex items-center justify-center overflow-hidden",
                  "size-20 sm:size-[90px] md:size-[100px]",
                  "bg-linear-to-br from-primary to-primary/80",
                  "border-2 border-primary"
                )}
              >
                <span className="text-white text-xs sm:text-sm font-medium text-center px-2">
                  {locale === "bg" ? "Всички" : "All"}
                </span>
              </div>
              
              {/* Label */}
              <span className={cn(
                "text-xs sm:text-sm font-medium text-center text-primary",
                "max-w-[90px] sm:max-w-[100px] line-clamp-2"
              )}>
                {locale === "bg" ? "Всички продукти" : "All Products"}
              </span>
            </Link>
          )}
          
          {/* Subcategory circles */}
          {subcategories.map((subcat, index) => (
            <Link
              key={subcat.id}
              href={buildUrl(subcat.slug)}
              className={cn(
                "flex flex-col items-center gap-2 min-w-[90px] sm:min-w-[100px] group snap-start shrink-0",
                "touch-action-manipulation",
                index === subcategories.length - 1 && "mr-4"
              )}
            >
              {/* Circle with image */}
              <div
                className={cn(
                  "rounded-full flex items-center justify-center overflow-hidden",
                  "size-20 sm:size-[90px] md:size-[100px]",
                  "bg-muted"
                )}
              >
                <img 
                  src={getCategoryImage(subcat.slug, subcat.image_url)} 
                  alt={getCategoryName(subcat)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Category Name - Target style */}
              <span className={cn(
                "text-xs sm:text-sm font-medium text-center text-foreground",
                "group-hover:text-primary group-hover:underline",
                "line-clamp-2",
                "max-w-[90px] sm:max-w-[100px]"
              )}>
                {getCategoryName(subcat)}
              </span>
            </Link>
          ))}
        </div>

        {/* Left Arrow - Desktop only */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-0 top-10 sm:top-[45px] -translate-y-1/2 z-10",
            "size-10 bg-white hover:bg-muted rounded-full border border-border",
            "flex items-center justify-center",
            "hidden md:flex",
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
            "absolute right-0 top-10 sm:top-[45px] -translate-y-1/2 z-10",
            "size-10 bg-white hover:bg-muted rounded-full border border-border",
            "flex items-center justify-center",
            "hidden md:flex",
            !canScrollRight && "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <CaretRight size={20} weight="regular" className="text-muted-foreground" />
        </button>

        {/* Mobile scroll indicator - subtle fade */}
        <div 
          className={cn(
            "absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-background to-transparent pointer-events-none md:hidden transition-opacity",
            !canScrollRight && "opacity-0"
          )} 
        />
      </div>
    </div>
  )
}
