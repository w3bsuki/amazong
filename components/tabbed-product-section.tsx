"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight, Star } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"

interface Product {
  id: string
  title: string
  price: number
  image: string
  rating?: number
  reviews?: number
  isPrime?: boolean
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

// Compact Product Card for carousels - Target style
function CompactProductCard({ id, title, price, image, rating = 4.5, reviews = 0 }: Product) {
  const locale = useLocale()
  const t = useTranslations('Product')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 2)
  const formattedDate = new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'numeric', day: 'numeric' }).format(deliveryDate)

  return (
    <Link href={`/product/${id}`} className="block h-full group">
      <div className="bg-white rounded-md overflow-hidden h-full flex flex-col border border-border hover:border-link">
        {/* Square Image Container - Fixed aspect ratio */}
        <div className="relative w-full aspect-square bg-secondary p-4 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-contain mix-blend-multiply"
              sizes="180px"
            />
          </div>
        </div>

        {/* Content - Clean and compact */}
        <div className="p-3 flex-1 flex flex-col bg-white">
          {/* Title - 2 lines max */}
          <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 mb-2 leading-snug min-h-10 group-hover:text-link">
            {title}
          </h3>

          {/* Rating - Clean compact style */}
          {reviews > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex text-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    weight={i < Math.floor(rating) ? "fill" : "regular"}
                    className={cn(
                      i < Math.floor(rating) ? "" : "text-rating-empty"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">{reviews}</span>
            </div>
          )}

          {/* Price - Prominent */}
          <div className="mt-auto pt-1">
            <span className="text-base sm:text-lg font-bold text-foreground">{formatPrice(price)}</span>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {t('delivery')} {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
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

  // Background color variants - using theme colors
  // Featured uses dark header-bg, Deals uses RED
  const bgStyles = {
    default: "bg-linear-to-b from-header-bg to-header-bg-secondary",
    featured: "bg-linear-to-b from-header-bg to-header-bg-secondary",
    deals: "bg-deal",
  }

  return (
    <div className={cn("rounded-md overflow-hidden", bgStyles[variant])}>
      {/* Header Section - Target style centered */}
      <div className="text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 tracking-tight">
          {title}
        </h2>
        {ctaText && ctaHref && (
          <Link 
            href={ctaHref} 
            className="text-white/70 hover:text-white text-xs sm:text-sm underline underline-offset-4 inline-flex items-center gap-1"
          >
            {ctaText}
            <CaretRight size={12} weight="regular" />
          </Link>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue={tabs[0]?.id} className="w-full">
        {/* Tab List - Responsive pills */}
        <div className="flex justify-center px-3 sm:px-4 pb-2">
          <TabsList className="bg-white/15 backdrop-blur-sm h-auto p-1 sm:p-1.5 gap-0.5 sm:gap-1 rounded-full border border-white/20 flex flex-wrap justify-center sm:flex-nowrap sm:overflow-x-auto no-scrollbar shadow-lg max-w-full">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "px-3 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm font-semibold rounded-full",
                  "text-white/80 hover:text-white hover:bg-white/20",
                  variant === "deals" 
                    ? "data-[state=active]:text-deal data-[state=active]:bg-white data-[state=active]:shadow-md"
                    : "data-[state=active]:text-header-bg data-[state=active]:bg-white data-[state=active]:shadow-md",
                  "whitespace-nowrap min-h-9 sm:min-h-11 touch-action-manipulation"
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
            className="mt-0 pt-4 sm:pt-5 pb-6 sm:pb-8"
          >
            <div className="relative">
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
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-pl-4 px-4 pb-2 no-scrollbar scroll-smooth md:gap-4 md:scroll-pl-6 md:px-6"
              >
                {tab.products.map((product) => (
                  <div
                    key={product.id}
                    className="w-[42vw] min-w-[42vw] shrink-0 snap-start md:w-44 md:min-w-44 group"
                  >
                    <CompactProductCard {...product} />
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
