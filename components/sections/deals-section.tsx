"use client"

import { useRef, useState, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Star, Clock, Lightning } from "@phosphor-icons/react"
import { CaretRight } from "@phosphor-icons/react"
import { CarouselScrollButton } from "@/components/common/carousel-scroll-button"
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
  storeSlug?: string | null
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
function CompactDealCard({ id, title, price, listPrice, image, rating = 4.5, reviews = 0, slug, storeSlug }: Deal) {
  const locale = useLocale()
  const t = useTranslations('Product')
  
  // Use store slug + product slug for SEO-friendly URLs
  const productUrl = storeSlug ? `/${storeSlug}/${slug || id}` : "#"

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  // Use listPrice for discount calc, fallback to price if not available
  const effectiveListPrice = listPrice ?? price
  const discountPercent = effectiveListPrice > price 
    ? Math.round((1 - price / effectiveListPrice) * 100) 
    : 0

  return (
    <Link href={productUrl} className="block h-full group">
      <div className="rounded-md overflow-hidden h-full flex flex-col bg-card border border-border">
        {/* Square Image Container with Discount Badge */}
        <div className="relative w-full aspect-square bg-secondary rounded-md p-2 flex items-center justify-center overflow-hidden">
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
        <div className="p-2 md:p-2.5 flex-1 flex flex-col">
          {/* Deal Badge */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="bg-deal-light text-deal font-medium text-2xs uppercase px-1.5 py-0.5 rounded-full md:text-xs">
              {t('deal')}
            </span>
          </div>

          {/* Title - 2 lines max */}
          <h3 className="text-xs font-medium text-foreground line-clamp-2 mb-1 leading-tight md:text-sm group-hover:underline">
            {title}
          </h3>

          {/* Rating - Hide on mobile if no reviews */}
          {reviews > 0 ? (
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
          ) : (
            <div className="hidden md:flex items-center gap-1.5 mb-1.5">
              <div className="flex text-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    weight="regular"
                    className="text-rating-empty"
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">0</span>
            </div>
          )}

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
    <section className="overflow-hidden md:rounded-md md:bg-card md:border md:border-border">
      {/* Header Section */}
      <div className="flex items-center justify-between px-3 pt-1.5 pb-1 md:block md:text-center md:pt-5 md:pb-3 md:px-4">
        <h2 className="text-base font-semibold text-foreground md:text-xl md:font-bold md:mb-1.5 md:tracking-tight">
          {title}
        </h2>
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

      {/* Tabs */}
      <Tabs defaultValue={tabs[0]?.id} className="w-full">
        {/* Tab List - Hidden on mobile, show on md+ with clean underline style */}
        <div className="hidden md:flex justify-center px-4 pb-2 overflow-x-auto no-scrollbar">
          <TabsList className="w-max">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="whitespace-nowrap"
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
            className="mt-0 pb-2 md:pt-4 md:pb-6 overflow-hidden"
          >
            <div className="relative overflow-hidden">
              {/* Scroll Buttons */}
              <CarouselScrollButton
                direction="left"
                onClick={() => scroll(tab.id, "left")}
                visible={Boolean(scrollStates[tab.id]?.left)}
              />
              <CarouselScrollButton
                direction="right"
                onClick={() => scroll(tab.id, "right")}
                visible={Boolean(scrollStates[tab.id]?.right)}
              />

              {/* Deals Container - Horizontal scroll with exactly 2 visible on mobile */}
              <div
                ref={(el) => { scrollContainerRefs.current[tab.id] = el }}
                onScroll={() => checkScrollability(tab.id)}
                className="flex flex-row flex-nowrap gap-2 overflow-x-auto snap-x snap-mandatory scroll-pl-3 px-3 pb-1 no-scrollbar scroll-smooth md:gap-4 md:scroll-pl-6 md:px-6"
              >
                {tab.deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="w-[43%] min-w-[43%] shrink-0 snap-start sm:w-[32%] sm:min-w-[32%] md:w-48 md:min-w-48"
                  >
                    <CompactDealCard {...deal} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
