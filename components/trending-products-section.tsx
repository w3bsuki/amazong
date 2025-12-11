"use client"

import { useRef, useState, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight, Star, TrendUp, Tag, CurrencyCircleDollar } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"

interface Product {
  id: string
  title: string
  price: number
  listPrice?: number
  image: string
  rating?: number
  reviews?: number
  isPrime?: boolean
  createdAt?: string
  slug?: string | null
  storeSlug?: string | null
}

interface TrendingProductsSectionProps {
  title: string
  newestProducts: Product[]
  promoProducts: Product[]
  bestSellersProducts: Product[]
  ctaText?: string
  ctaHref?: string
}

// Compact Product Card with optional discount badge
function CompactProductCard({ 
  id, 
  title, 
  price, 
  listPrice,
  image, 
  rating = 0, 
  reviews = 0,
  slug,
  storeSlug
}: Product) {
  const locale = useLocale()
  const t = useTranslations('Product')
  
  // Use store slug + product slug for SEO-friendly URLs
  const productUrl = storeSlug && slug 
    ? `/product/${storeSlug}/${slug}` 
    : `/product/${slug || id}`

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  const hasDiscount = listPrice && listPrice > price
  const discountPercent = hasDiscount 
    ? Math.round(((listPrice - price) / listPrice) * 100) 
    : 0

  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 2)
  const formattedDate = new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'numeric', day: 'numeric' }).format(deliveryDate)

  return (
    <Link href={productUrl} className="block h-full group">
      <div className="rounded-md overflow-hidden h-full flex flex-col bg-card border border-border">
        {/* Square Image Container with optional discount badge */}
        <div className="relative w-full aspect-square bg-secondary rounded-md p-2 flex items-center justify-center overflow-hidden">
          {hasDiscount && (
            <div className="absolute top-2 left-2 z-10 bg-deal text-white text-xs font-medium px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </div>
          )}
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

        {/* Content */}
        <div className="p-2 md:p-2.5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xs font-medium text-foreground line-clamp-2 mb-1 leading-tight md:text-sm group-hover:underline">
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

          {/* Price */}
          <div className="mt-auto pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className={cn(
                "text-sm font-normal",
                hasDiscount ? "text-deal" : "text-foreground"
              )}>
                {formatPrice(price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(listPrice)}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {t('delivery')} {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function TrendingProductsSection({
  title,
  newestProducts,
  promoProducts,
  bestSellersProducts,
  ctaText,
  ctaHref,
}: TrendingProductsSectionProps) {
  const locale = useLocale()
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [scrollStates, setScrollStates] = useState<Record<string, { left: boolean; right: boolean }>>({
    newest: { left: false, right: true },
    promo: { left: false, right: true },
    bestsellers: { left: false, right: true },
  })

  const tabs = [
    { id: "newest", label: locale === "bg" ? "Нови" : "Newest", icon: TrendUp, products: newestProducts },
    { id: "promo", label: locale === "bg" ? "Промоции" : "Deals", icon: Tag, products: promoProducts },
    { id: "bestsellers", label: locale === "bg" ? "Топ продажби" : "Best Sellers", icon: CurrencyCircleDollar, products: bestSellersProducts },
  ]

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
    <section className="overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 md:px-4 md:pt-4 md:pb-2">
        <h2 className="text-sm font-semibold text-foreground md:text-base">
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
      <Tabs defaultValue="newest" className="w-full">
        {/* Tab List - Hidden on mobile, show on md+ */}
        <div className="hidden md:flex justify-center px-4 pb-2 overflow-x-auto no-scrollbar">
          <TabsList className="h-9 p-1 gap-1 rounded-lg bg-muted border border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md",
                    "text-muted-foreground hover:text-foreground",
                    "data-[state=active]:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm",
                    "whitespace-nowrap flex items-center gap-1.5"
                  )}
                >
                  <Icon size={14} weight="regular" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        {tabs.map((tab) => (
          <TabsContent 
            key={tab.id} 
            value={tab.id} 
            className="mt-0 pb-2 md:pb-4 overflow-hidden"
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

              {/* Products Container */}
              <div
                ref={(el) => { scrollContainerRefs.current[tab.id] = el }}
                onScroll={() => checkScrollability(tab.id)}
                className="flex flex-row flex-nowrap gap-2 overflow-x-auto snap-x snap-mandatory scroll-pl-3 px-3 pb-1 no-scrollbar scroll-smooth md:gap-4 md:scroll-pl-6 md:px-6"
              >
                {tab.products.length > 0 ? (
                  tab.products.map((product) => (
                    <div
                      key={product.id}
                      className="w-[40%] min-w-[40%] shrink-0 snap-start sm:w-[30%] sm:min-w-[30%] md:w-44 md:min-w-44"
                    >
                      <CompactProductCard {...product} />
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-8 text-muted-foreground text-sm">
                    {locale === "bg" ? "Няма продукти в тази категория" : "No products in this category"}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
