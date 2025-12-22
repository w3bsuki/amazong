"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { ProductCard } from "@/components/shared/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"

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
  /** Optional icon to display next to the title */
  icon?: React.ReactNode
  /** Optional tabs for filtering */
  tabs?: { id: string; label: string }[]
  activeTabId?: string
  onTabChange?: (id: string) => void
  isLoading?: boolean
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
  icon,
  tabs,
  activeTabId,
  onTabChange,
  isLoading = false,
}: ProductCarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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

  if (products.length === 0 && !isLoading) {
    return (
      <section className={cn(
        "rounded-xl border border-border overflow-hidden",
        variant === "highlighted" ? "bg-card" : "bg-card"
      )}>
        <div className="px-5 pt-4 pb-2">
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
        "rounded-xl border border-border/60 overflow-hidden shadow-xs",
        variant === "highlighted" ? "bg-card" : "bg-card"
      )}
    >
      {/* Header - Refined Typography with optional icon and trust-blue accent */}
      <div className={cn(
        "px-5 pt-5 pb-3 flex items-center border-b border-border/40",
        variant === "highlighted" ? "bg-cta-trust-blue/5" : "bg-muted/5"
      )}>
        <div className="flex items-center gap-3 min-w-fit">
          {icon && (
            <div className="size-10 rounded-xl bg-background border border-border/60 flex items-center justify-center text-cta-trust-blue shadow-xs">
              {icon}
            </div>
          )}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-foreground/90 leading-tight">{title}</h2>
          </div>
        </div>

        {/* Tabs in the middle - Centered */}
        {tabs && tabs.length > 0 && (
          <div className="hidden lg:flex flex-1 justify-center px-4">
            <div className="flex items-center gap-1 p-1 rounded-full bg-muted/40 border border-border/50">
              {tabs.map((tab) => {
                const isActive = activeTabId === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        
        <div className={cn(
          "flex items-center gap-4 ml-auto",
          !tabs && "ml-auto"
        )}>
          {ctaText && ctaHref && (
            <Link
              href={ctaHref}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              {ctaText}
              <CaretRight size={12} weight="bold" />
            </Link>
          )}

          {/* Navigation Buttons - Moved to Header */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "size-8 rounded-full border border-border flex items-center justify-center transition-all",
                "hover:bg-muted active:scale-95",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
              aria-label="Scroll left"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "size-8 rounded-full border border-border flex items-center justify-center transition-all",
                "hover:bg-muted active:scale-95",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
              aria-label="Scroll right"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Products Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-5 pt-2 pb-4 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[200px] space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
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
            ))
          )}
        </div>
      </div>
    </section>
  )
}
