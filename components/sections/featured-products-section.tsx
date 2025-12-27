"use client"

import { useRef, useState, useCallback } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { ProductCard } from "@/components/shared/product/product-card"

interface FeaturedProduct {
  id: string
  title: string
  price: number
  listPrice?: number
  image: string
  rating?: number
  reviews?: number
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
  /** Optional icon to display next to the title */
  icon?: React.ReactNode
}

export function FeaturedProductsSection({
  title,
  subtitle,
  products,
  ctaText,
  ctaHref,
  icon,
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
    <div className="overflow-hidden md:bg-card md:border md:border-border md:rounded-md shadow-xs">
      {/* Header Section */}
      <div className={cn(
        "flex items-center justify-between px-3 pt-1.5 pb-1 md:pt-5 md:pb-3 md:px-5",
        "md:bg-cta-trust-blue/5 md:border-b md:border-border/40"
      )}>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="hidden md:flex size-10 rounded-xl bg-background border border-border/60 items-center justify-center text-cta-trust-blue shadow-xs">
              {icon}
            </div>
          )}
          <div className="md:mb-0">
            <h2 className="text-base font-semibold text-foreground md:text-xl md:font-bold md:tracking-tight leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground md:text-sm">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {ctaText && ctaHref && (
            <Link 
              href={ctaHref} 
              className="text-xs font-medium hover:underline inline-flex items-center gap-0.5 text-brand-blue md:text-sm md:font-semibold md:uppercase md:tracking-wider md:text-muted-foreground md:hover:text-primary md:transition-colors"
            >
              {ctaText}
              <CaretRight size={14} weight="regular" className="md:hidden" />
              <CaretRight size={12} weight="bold" className="hidden md:block" />
            </Link>
          )}

          {/* Navigation Buttons - Moved to Header */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              disabled={!scrollState.left}
              className={cn(
                "size-8 rounded-full border border-border flex items-center justify-center transition-colors",
                "hover:bg-muted",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
              aria-label="Scroll left"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!scrollState.right}
              className={cn(
                "size-8 rounded-full border border-border flex items-center justify-center transition-colors",
                "hover:bg-muted",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
              aria-label="Scroll right"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Carousel */}
      <div className="relative overflow-hidden pb-2 md:pb-6">
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
