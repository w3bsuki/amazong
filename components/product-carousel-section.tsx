"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { ProductCard } from "@/components/ui/product-card"

export interface CarouselProduct {
  id: string
  title: string
  price: number
  listPrice?: number
  image: string
  rating?: number
  reviews?: number
  createdAt?: string
  slug?: string | null
  storeSlug?: string | null
  sellerId?: string | null
  sellerName?: string | null
  sellerAvatarUrl?: string | null
  sellerTier?: 'basic' | 'premium' | 'business'
  sellerVerified?: boolean
  location?: string
}

interface ProductCarouselSectionProps {
  title: string
  products: CarouselProduct[]
  ctaText?: string
  ctaHref?: string
  emptyMessage?: string
  /** Visual style variant */
  variant?: "default" | "highlighted"
}

/**
 * ProductCarouselSection
 * 
 * Reusable horizontal scroll product carousel for desktop.
 * Shows 6 products visible at a time with scroll arrows.
 * Trendyol/Amazon-style section layout.
 */
export function ProductCarouselSection({
  title,
  products,
  ctaText,
  ctaHref,
  emptyMessage = "No products available",
  variant = "default",
}: ProductCarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const checkScrollability = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    
    setCanScrollLeft(container.scrollLeft > 5)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 5)
  }, [])

  useEffect(() => {
    checkScrollability()
    const container = scrollRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollability)
      window.addEventListener("resize", checkScrollability)
    }
    return () => {
      container?.removeEventListener("scroll", checkScrollability)
      window.removeEventListener("resize", checkScrollability)
    }
  }, [checkScrollability, products])

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return
    
    // Scroll by approximately 3 card widths
    const cardWidth = 220
    const scrollAmount = cardWidth * 3
    
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  if (products.length === 0) {
    return (
      <section className={cn(
        "rounded-xl border border-border overflow-hidden",
        variant === "highlighted" ? "bg-card" : "bg-card"
      )}>
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        <div className="px-5 py-8 text-center text-muted-foreground">
          {emptyMessage}
        </div>
      </section>
    )
  }

  return (
    <section 
      className={cn(
        "rounded-xl border border-border overflow-hidden",
        variant === "highlighted" ? "bg-card" : "bg-card"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {ctaText && ctaHref && (
          <Link
            href={ctaHref}
            className="text-sm font-medium text-link hover:text-link-hover hover:underline inline-flex items-center gap-1 transition-colors"
          >
            {ctaText}
            <CaretRight size={14} weight="bold" />
          </Link>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-10",
            "size-10 rounded-full bg-card shadow-lg border border-border",
            "flex items-center justify-center",
            "text-foreground hover:bg-muted transition-all duration-200",
            "disabled:opacity-0 disabled:pointer-events-none",
            canScrollLeft && isHovering ? "opacity-100" : "opacity-0"
          )}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <CaretLeft size={20} weight="bold" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-10",
            "size-10 rounded-full bg-card shadow-lg border border-border",
            "flex items-center justify-center",
            "text-foreground hover:bg-muted transition-all duration-200",
            "disabled:opacity-0 disabled:pointer-events-none",
            canScrollRight && isHovering ? "opacity-100" : "opacity-0"
          )}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <CaretRight size={20} weight="bold" />
        </button>

        {/* Products Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-5 py-4 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div key={product.id} className="shrink-0 w-[200px]">
              <ProductCard
                id={product.id}
                title={product.title}
                price={product.price}
                listPrice={product.listPrice}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
                slug={product.slug}
                storeSlug={product.storeSlug}
                sellerId={product.sellerId || undefined}
                sellerName={(product.sellerName || product.storeSlug) || undefined}
                sellerAvatarUrl={product.sellerAvatarUrl || null}
                sellerTier={product.sellerTier}
                sellerVerified={product.sellerVerified}
                location={product.location}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
