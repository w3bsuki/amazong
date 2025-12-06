"use client"

import { useRef, useState, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight, Star, Clock, Lightning } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"

interface Deal {
  id: string
  title: string
  price: number
  listPrice?: number
  image: string
  rating?: number
  reviews?: number
  slug?: string | null
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
function CompactDealCard({ id, title, price, listPrice, image, rating = 4.5, reviews = 0, slug }: Deal) {
  const locale = useLocale()
  const t = useTranslations('Product')
  
  // Use slug for SEO-friendly URLs, fallback to id
  const productUrl = `/product/${slug || id}`

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  // Use listPrice for discount calc, fallback to price if not available
  const effectiveListPrice = listPrice ?? price
  const discountPercent = effectiveListPrice > price 
    ? Math.round((1 - price / effectiveListPrice) * 100) 
    : 0

  return (
    <Link href={productUrl} className="block h-full group">
      <div className="bg-card rounded-md overflow-hidden h-full flex flex-col border border-border">
        {/* Square Image Container with Discount Badge */}
        <div className="relative w-full aspect-square bg-secondary p-3 flex items-center justify-center overflow-hidden">
          {/* Discount Badge - More prominent */}
          <div className="absolute top-2 left-2 z-10 bg-badge-deal text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Lightning size={12} weight="fill" />
            -{discountPercent}%
          </div>
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

        {/* Content - Compact */}
        <div className="p-2.5 flex-1 flex flex-col">
          {/* Deal Badge */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="bg-deal-light text-deal font-medium text-xs uppercase px-2 py-0.5 rounded-full">
              {t('deal')}
            </span>
          </div>

          {/* Title - 2 lines max */}
          <h3 className="text-xs sm:text-sm font-normal text-foreground line-clamp-2 mb-1.5 leading-snug min-h-9 group-hover:underline">
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

          {/* Price - With strikethrough */}
          <div className="mt-auto pt-1">
            <div className="flex flex-col">
              <span className="text-sm font-normal text-price-sale">{formatPrice(price)}</span>
              {discountPercent > 0 && (
                <span className="text-xs text-muted-foreground line-through">{formatPrice(effectiveListPrice)}</span>
              )}
            </div>
            {discountPercent > 0 && (
              <div className="text-xs text-stock-available font-medium mt-1 flex items-center gap-1">
                <Clock size={12} weight="regular" />
                <span className="truncate">{locale === 'bg' ? `Спести ${formatPrice(effectiveListPrice - price)}` : `Save ${formatPrice(effectiveListPrice - price)}`}</span>
              </div>
            )}
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
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [scrollStates, setScrollStates] = useState<Record<string, { left: boolean; right: boolean }>>(() => 
    Object.fromEntries(tabs.map(tab => [tab.id, { left: false, right: true }]))
  )

  const checkScrollability = useCallback((tabId: string) => {
    const container = scrollContainerRefs.current[tabId]
    if (!container) return
    setScrollStates(prev => ({
      ...prev,
      [tabId]: {
        left: container.scrollLeft > 0,
        right: container.scrollLeft < container.scrollWidth - container.clientWidth - 10,
      }
    }))
  }, [])

  const scroll = (tabId: string, direction: "left" | "right") => {
    scrollContainerRefs.current[tabId]?.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth"
    })
  }

  return (
    <div className="rounded-md overflow-hidden bg-card border border-border">
      {/* Header Section - Clean eBay-style */}
      <div className="text-center pt-5 sm:pt-6 pb-3 sm:pb-4 px-4">
        <h2 className="text-xl font-bold mb-1.5 tracking-tight text-foreground">
          {title}
        </h2>
        {ctaText && ctaHref && (
          <Link 
            href={ctaHref} 
            className="text-xs sm:text-sm font-normal hover:underline underline-offset-4 inline-flex items-center gap-1 text-brand-blue hover:text-brand-blue-dark"
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
          <TabsList className="bg-muted h-auto p-1 gap-0.5 sm:gap-1 rounded-full border border-border flex flex-wrap justify-center sm:flex-nowrap sm:overflow-x-auto no-scrollbar max-w-full">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-normal rounded-full",
                  "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  "data-[state=active]:text-foreground data-[state=active]:bg-card data-[state=active]:border data-[state=active]:border-border",
                  "whitespace-nowrap min-h-8 sm:min-h-10"
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
            className="mt-0 pt-3 sm:pt-4 pb-4 sm:pb-6 overflow-hidden"
          >
            <div className="relative overflow-hidden">
              {/* Scroll Buttons */}
              <button
                onClick={() => scroll(tab.id, "left")}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex",
                  "items-center justify-center size-10 bg-white hover:bg-secondary rounded-full border border-border",
                  scrollStates[tab.id]?.left ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                aria-label="Scroll left"
              >
                <CaretLeft size={20} weight="regular" className="text-foreground" />
              </button>
              <button
                onClick={() => scroll(tab.id, "right")}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex",
                  "items-center justify-center size-10 bg-white hover:bg-secondary rounded-full border border-border",
                  scrollStates[tab.id]?.right ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                aria-label="Scroll right"
              >
                <CaretRight size={20} weight="regular" className="text-foreground" />
              </button>

              {/* Deals Container - Horizontal scroll with exactly 2 visible on mobile */}
              <div
                ref={(el) => { scrollContainerRefs.current[tab.id] = el }}
                onScroll={() => checkScrollability(tab.id)}
                className="flex flex-row flex-nowrap gap-3 overflow-x-auto snap-x snap-mandatory scroll-pl-4 px-4 pb-2 no-scrollbar scroll-smooth md:gap-4 md:scroll-pl-6 md:px-6"
              >
                {tab.deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="w-[45%] min-w-[45%] shrink-0 snap-start md:w-44 md:min-w-44 group"
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
