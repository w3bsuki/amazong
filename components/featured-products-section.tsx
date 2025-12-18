"use client"

import { useRef, useState, useCallback } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { ProductCard } from "@/components/ui/product-card"

interface FeaturedProduct {
  id: string
  title: string
  price: number
  listPrice?: number
  image: string
  rating?: number
  reviews?: number
  isPrime?: boolean
  isBoosted?: boolean
  sellerTier?: 'basic' | 'premium' | 'business'
  slug?: string | null
  storeSlug?: string | null
}

interface FeaturedProductsSectionProps {
  title: string
  subtitle?: string
  products: FeaturedProduct[]
  ctaText?: string
  ctaHref?: string
}

export function FeaturedProductsSection({
  title,
  subtitle,
  products,
  ctaText,
  ctaHref,
}: FeaturedProductsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState({ left: false, right: true })

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    setScrollState({
      left: container.scrollLeft > 0,
      right: container.scrollLeft < container.scrollWidth - container.clientWidth - 10,
    })
  }, [])

  const scroll = (direction: "left" | "right") => {
    scrollContainerRef.current?.scrollBy({ 
      left: direction === "left" ? -250 : 250, 
      behavior: "smooth" 
    })
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden md:bg-card md:border md:border-border md:rounded-md">
      {/* Header Section */}
      <div className="flex items-center justify-between px-3 pt-1.5 pb-1 md:block md:text-center md:pt-5 md:pb-3 md:px-4">
        <div className="md:mb-1.5">
          <h2 className="text-base font-semibold text-foreground md:text-xl md:font-semibold md:tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground md:text-sm">{subtitle}</p>
          )}
        </div>
        {ctaText && ctaHref && (
          <Link 
            href={ctaHref} 
            className="text-xs font-medium hover:underline inline-flex items-center gap-0.5 text-brand-blue md:text-sm"
          >
            {ctaText}
            <CaretRight size={14} weight="regular" />
          </Link>
        )}
      </div>

      {/* Products Carousel */}
      <div className="relative overflow-hidden pb-2 md:pb-6">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex",
            "items-center justify-center size-10 bg-white hover:bg-secondary rounded-full border border-border",
            scrollState.left ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <CaretLeft size={20} weight="regular" className="text-foreground" />
        </button>
        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex",
            "items-center justify-center size-10 bg-white hover:bg-secondary rounded-full border border-border",
            scrollState.right ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <CaretRight size={20} weight="regular" className="text-foreground" />
        </button>

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="flex flex-row flex-nowrap gap-2 overflow-x-auto snap-x snap-mandatory scroll-pl-3 px-3 pb-1 no-scrollbar scroll-smooth md:gap-4 md:scroll-pl-6 md:px-6"
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[43%] min-w-[43%] shrink-0 snap-start sm:w-[32%] sm:min-w-[32%] md:w-48 md:min-w-48"
            >
              <ProductCard
                variant="featured"
                index={index}
                {...product}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
