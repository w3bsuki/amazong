"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { ProductCard } from "@/components/shared/product/product-card"

interface Product {
  id: string
  title: string
  price: number
  image: string
  rating?: number
  reviews?: number
  isPrime?: boolean
  slug?: string | null
  storeSlug?: string | null
}

interface TabCategory {
  id: string
  label: string
  products: Product[]
}

interface TabbedProductSectionProps {
  title: string
  tabs: TabCategory[]
  ctaText?: string
  ctaHref?: string
  variant?: "default" | "featured" | "deals"
}

export function TabbedProductSection({
  title,
  tabs,
  ctaText,
  ctaHref,
  variant = "default",
}: TabbedProductSectionProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const checkScrollability = React.useCallback(() => {
    const container = scrollContainerRef.current
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      )
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = direction === "left" ? -250 : 250
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  // Background color variants - Clean eBay-style
  // Featured/Default use clean white card, Deals uses RED
  const bgStyles = {
    default: "bg-card border border-border",
    featured: "bg-card border border-border",
    deals: "bg-deal",
  }

  return (
    <div className={cn("overflow-hidden", variant === "deals" ? "rounded-md bg-deal" : "")}>
      {/* Header Section - eBay style clean */}
      <div className="text-center pt-4 sm:pt-6 pb-2 sm:pb-4 px-4">
        <h2 className={cn(
          "text-lg sm:text-xl font-bold mb-1 tracking-tight",
          variant === "deals" ? "text-white" : "text-foreground"
        )}>
          {title}
        </h2>
        {ctaText && ctaHref && (
          <Link 
            href={ctaHref} 
            className={cn(
              "text-sm font-normal hover:underline underline-offset-4 inline-flex items-center gap-1",
              variant === "deals" ? "text-white/80 hover:text-white" : "text-brand-blue hover:text-brand-blue-dark"
            )}
          >
            {ctaText}
            <CaretRight size={12} weight="regular" />
          </Link>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue={tabs[0]?.id} className="w-full">
        {/* Tab List - Clean eBay-style pills */}
        <div className="flex justify-center px-3 sm:px-4 pb-1">
          <TabsList className={cn(
            "h-auto p-0.5 gap-0.5 sm:gap-1 rounded-full flex flex-wrap justify-center sm:flex-nowrap sm:overflow-x-auto no-scrollbar max-w-full",
            variant === "deals" 
              ? "bg-white/20 border border-white/25" 
              : "bg-muted border border-border"
          )}>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "px-3 sm:px-5 h-touch-xs text-2xs sm:text-sm font-semibold rounded-full",
                  variant === "deals" 
                    ? "text-white/80 hover:text-white hover:bg-white/20 data-[state=active]:text-deal data-[state=active]:bg-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary data-[state=active]:text-cta-trust-blue-text data-[state=active]:bg-cta-trust-blue",
                  "whitespace-nowrap"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content - Product Carousel */}
        {tabs.map((tab) => (
          <TabsContent 
            key={tab.id} 
            value={tab.id} 
            className="mt-0 pt-3 sm:pt-4 pb-4 sm:pb-6 overflow-hidden"
          >
            <div className="relative overflow-hidden">
              {/* Scroll Buttons - Cleaner design */}
              <button
                onClick={() => scroll("left")}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex",
                  "items-center justify-center size-10 bg-white hover:bg-secondary rounded-full border border-border",
                  canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
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
                  canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                aria-label="Scroll right"
              >
                <CaretRight size={20} weight="regular" className="text-foreground" />
              </button>

              {/* Products Container - Horizontal scroll with exactly 2 visible on mobile */}
              <div
                ref={scrollContainerRef}
                onScroll={checkScrollability}
                className="flex flex-row flex-nowrap gap-3 overflow-x-auto snap-x snap-mandatory scroll-pl-4 px-4 pb-2 no-scrollbar scroll-smooth md:gap-4 md:scroll-pl-6 md:px-6"
              >
                {tab.products.map((product, index) => (
                  <div
                    key={product.id}
                    className="w-[43%] min-w-[43%] shrink-0 snap-start sm:w-[32%] sm:min-w-[32%] md:w-48 md:min-w-48 group"
                  >
                    <ProductCard
                      index={index}
                      {...product}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
