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
      <div className="bg-card rounded-md overflow-hidden h-full flex flex-col border border-border">
        {/* Square Image Container - Fixed aspect ratio */}
        <div className="relative w-full aspect-square bg-secondary p-3 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-contain"
              sizes="180px"
            />
          </div>
        </div>

        {/* Content - Clean and compact */}
        <div className="p-2.5 flex-1 flex flex-col">
          {/* Title - 2 lines max */}
          <h3 className="text-sm font-normal text-foreground line-clamp-2 mb-1.5 leading-snug min-h-9 group-hover:underline">
            {title}
          </h3>

          {/* Rating - Always show even when 0 */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex text-rating">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  weight={i < Math.floor(rating) ? "fill" : "regular"}
                  className={cn(
                    i < Math.floor(rating) ? "" : "text-rating-empty"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{reviews}</span>
          </div>

          {/* Price - Prominent */}
          <div className="mt-auto pt-1">
            <span className="text-sm font-normal text-foreground">{formatPrice(price)}</span>
            <div className="text-xs text-muted-foreground mt-0.5">
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

  // Background color variants - Clean eBay-style
  // Featured/Default use clean white card, Deals uses RED
  const bgStyles = {
    default: "bg-card border border-border",
    featured: "bg-card border border-border",
    deals: "bg-deal",
  }

  return (
    <div className={cn("rounded-md overflow-hidden", bgStyles[variant])}>
      {/* Header Section - eBay style clean */}
      <div className="text-center pt-5 sm:pt-6 pb-3 sm:pb-4 px-4">
        <h2 className={cn(
          "text-xl font-bold mb-1.5 tracking-tight",
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
        <div className="flex justify-center px-3 sm:px-4 pb-2">
          <TabsList className={cn(
            "h-auto p-1 gap-0.5 sm:gap-1 rounded-full flex flex-wrap justify-center sm:flex-nowrap sm:overflow-x-auto no-scrollbar max-w-full",
            variant === "deals" 
              ? "bg-white/20 border border-white/25" 
              : "bg-muted border border-border"
          )}>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-normal rounded-full",
                  variant === "deals" 
                    ? "text-white/80 hover:text-white hover:bg-white/20 data-[state=active]:text-deal data-[state=active]:bg-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary data-[state=active]:text-foreground data-[state=active]:bg-card data-[state=active]:border data-[state=active]:border-border",
                  "whitespace-nowrap min-h-8 sm:min-h-10"
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
                {tab.products.map((product) => (
                  <div
                    key={product.id}
                    className="w-[45%] min-w-[45%] shrink-0 snap-start md:w-44 md:min-w-44 group"
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
