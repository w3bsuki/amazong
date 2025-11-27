"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Star, Clock, Zap } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"

interface Deal {
  id: string
  title: string
  price: number
  listPrice: number
  image: string
  rating?: number
  reviews?: number
}

interface DealCategory {
  id: string
  label: string
  deals: Deal[]
}

interface DealsSectionProps {
  title: string
  tabs: DealCategory[]
  ctaText?: string
  ctaHref?: string
}

// Compact Deal Card for carousels - Target style with discount
function CompactDealCard({ id, title, price, listPrice, image, rating = 4.5, reviews = 0 }: Deal) {
  const locale = useLocale()
  const t = useTranslations('Product')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  const discountPercent = Math.round((1 - price / listPrice) * 100)

  return (
    <Link href={`/product/${id}`} className="block h-full group">
      <div className="bg-white rounded-md overflow-hidden h-full flex flex-col border border-border hover:border-brand-deal">
        {/* Square Image Container with Discount Badge */}
        <div className="relative w-full aspect-square bg-secondary p-4 flex items-center justify-center overflow-hidden">
          {/* Discount Badge - More prominent */}
          <div className="absolute top-2 left-2 z-10 bg-brand-deal text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Zap className="size-3" />
            -{discountPercent}%
          </div>
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

        {/* Content - Compact */}
        <div className="p-3 flex-1 flex flex-col bg-white">
          {/* Deal Badge */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="bg-brand-deal-light text-brand-deal-text font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
              {t('deal')}
            </span>
          </div>

          {/* Title - 2 lines max */}
          <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 mb-2 leading-snug min-h-10 group-hover:text-brand-deal transition-colors">
            {title}
          </h3>

          {/* Rating - Compact */}
          {reviews > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex text-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3",
                      i < Math.floor(rating) ? "fill-current" : "text-rating-empty fill-rating-empty"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">{reviews}</span>
            </div>
          )}

          {/* Price - With strikethrough */}
          <div className="mt-auto pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-brand-deal">{formatPrice(price)}</span>
              <span className="text-xs text-muted-foreground line-through">{formatPrice(listPrice)}</span>
            </div>
            <div className="text-[10px] text-brand-success font-semibold mt-1 flex items-center gap-1">
              <Clock className="size-3" />
              {locale === 'bg' ? `Спестявате ${formatPrice(listPrice - price)}` : `Save ${formatPrice(listPrice - price)}`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function DealsSection({
  title,
  tabs,
  ctaText,
  ctaHref,
}: DealsSectionProps) {
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

  return (
    <div className="rounded-md overflow-hidden bg-linear-to-br from-brand-deal via-brand-deal to-brand-deal/80">
      {/* Header Section - Target style with icon */}
      <div className="text-center pt-6 sm:pt-8 pb-3 sm:pb-4 px-4">
        <div className="inline-flex items-center gap-2 mb-1.5">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>
        {ctaText && ctaHref && (
          <div>
            <Link 
              href={ctaHref} 
              className="text-white/70 hover:text-white text-xs sm:text-sm underline underline-offset-4 transition-colors inline-flex items-center gap-1"
            >
              {ctaText}
              <ChevronRight className="size-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue={tabs[0]?.id} className="w-full">
        {/* Tab List - Responsive pills */}
        <div className="flex justify-center px-3 sm:px-4 pb-2">
          <TabsList className="bg-white/20 backdrop-blur-sm h-auto p-1 sm:p-1.5 gap-0.5 sm:gap-1 rounded-full border border-white/25 flex flex-wrap justify-center sm:flex-nowrap sm:overflow-x-auto no-scrollbar shadow-lg max-w-full">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "px-3 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm font-semibold rounded-full",
                  "text-white/90 hover:text-white hover:bg-white/25",
                  "data-[state=active]:text-brand-deal data-[state=active]:bg-white data-[state=active]:shadow-md",
                  "transition-all duration-200",
                  "whitespace-nowrap min-h-9 sm:min-h-11 touch-action-manipulation"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content - Deals Carousel */}
        {tabs.map((tab) => (
          <TabsContent 
            key={tab.id} 
            value={tab.id} 
            className="mt-0 pt-4 sm:pt-5 pb-6 sm:pb-8"
          >
            <div className="relative">
              {/* Scroll Buttons */}
              <button
                onClick={() => scroll("left")}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex",
                  "items-center justify-center size-10 bg-white hover:bg-secondary rounded-full border border-border",
                  "transition-all duration-200",
                  canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                aria-label="Scroll left"
              >
                <ChevronLeft className="size-5 text-foreground" />
              </button>
              <button
                onClick={() => scroll("right")}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex",
                  "items-center justify-center size-10 bg-white hover:bg-secondary rounded-full border border-border",
                  "transition-all duration-200",
                  canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                aria-label="Scroll right"
              >
                <ChevronRight className="size-5 text-foreground" />
              </button>

              {/* Deals Container - Horizontal scroll with exactly 2 visible on mobile */}
              <div
                ref={scrollContainerRef}
                onScroll={checkScrollability}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-pl-4 px-4 pb-2 no-scrollbar scroll-smooth md:gap-4 md:scroll-pl-6 md:px-6"
              >
                {tab.deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="w-[42vw] min-w-[42vw] shrink-0 snap-start md:w-44 md:min-w-44 group"
                  >
                    <CompactDealCard {...deal} />
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
