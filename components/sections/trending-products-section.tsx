"use client"

import { useRef, useState, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight, TrendUp, Tag, CurrencyCircleDollar } from "@phosphor-icons/react"
import { useLocale } from "next-intl"
import { ProductCard } from "@/components/shared/product/product-card"

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
  /** Mobile banner tone; desktop remains transparent. */
  bannerTone?: "trust" | "contrast"
}

export function TrendingProductsSection({
  title,
  newestProducts,
  promoProducts,
  bestSellersProducts,
  ctaText,
  ctaHref,
  bannerTone = "trust",
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
    <section className="overflow-hidden md:bg-card md:border md:border-border md:rounded-md">
      {/* Header Section */}
      <div className="px-3 pt-2 md:px-0 md:pt-0">
        <div
          className={cn(
            "px-3 py-2.5 flex items-center justify-between",
            "rounded-lg border border-border/60",
            "md:rounded-none md:border-0 md:bg-transparent md:text-foreground md:block md:text-center md:pt-5 md:pb-3 md:px-4",
            bannerTone === "contrast"
              ? "bg-foreground text-background"
              : "bg-cta-trust-blue text-cta-trust-blue-text"
          )}
        >
          <h2 className="text-sm font-semibold md:text-xl md:font-bold md:mb-1.5 md:tracking-tight">
            {title}
          </h2>
          {ctaText && ctaHref && (
            <Link
              href={ctaHref}
              className={cn(
                "text-xs font-semibold hover:underline inline-flex items-center gap-0.5 md:text-sm",
                bannerTone === "contrast" ? "text-background/90" : "text-cta-trust-blue-text/90",
                "md:text-link"
              )}
            >
              {ctaText}
              <CaretRight size={14} weight="regular" />
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="newest" className="w-full">
        {/* Tab List - Mobile + Desktop */}
        <div className="flex justify-center px-3 pt-2 pb-1 md:px-4 md:pt-0 md:pb-2 overflow-x-auto no-scrollbar">
          <TabsList className="h-auto p-1 gap-1 rounded-full bg-muted/70 border border-border w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full",
                    "text-muted-foreground hover:text-foreground hover:bg-secondary/70",
                    "data-[state=active]:text-foreground data-[state=active]:bg-card data-[state=active]:border data-[state=active]:border-border",
                    "whitespace-nowrap min-h-9 flex items-center gap-1.5"
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
            className="mt-1 pb-1 md:mt-0 md:pt-4 md:pb-6 overflow-hidden"
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
                  tab.products.map((product, index) => (
                    <div
                      key={product.id}
                      className="w-[calc(50%-0.5rem)] min-w-[calc(50%-0.5rem)] shrink-0 snap-start sm:w-[32%] sm:min-w-[32%] md:w-48 md:min-w-48"
                    >
                      <ProductCard
                        index={index}
                        {...product}
                      />
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
