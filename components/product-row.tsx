"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight, Star, Clock, Lightning } from "@phosphor-icons/react"
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

interface Deal {
  id: string
  title: string
  price: number
  listPrice: number
  image: string
  rating?: number
  reviews?: number
}

interface ProductRowProps {
  title: string
  products?: Product[]
  deals?: Deal[]
  ctaText?: string
  ctaHref?: string
  variant?: "products" | "deals"
}

// Simple Product Card - Amazon style
function ProductCard({ id, title, price, image, rating = 4.5, reviews = 0 }: Product) {
  const locale = useLocale()
  const t = useTranslations('Product')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  return (
    <Link href={`/product/${id}`} className="block group">
      <div className="flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden mb-2">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain p-2"
            sizes="150px"
          />
        </div>

        {/* Price */}
        <span className="text-sm sm:text-base font-medium text-foreground">{formatPrice(price)}</span>
        
        {/* Title - 2 lines */}
        <h3 className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5 group-hover:text-link group-hover:underline">
          {title}
        </h3>

        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex text-rating">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  weight={i < Math.floor(rating) ? "fill" : "regular"}
                  className={i < Math.floor(rating) ? "" : "text-rating-empty"}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">{reviews}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

// Simple Deal Card - Amazon style with discount
function DealCard({ id, title, price, listPrice, image, rating = 4.5, reviews = 0 }: Deal) {
  const locale = useLocale()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  const discountPercent = Math.round((1 - price / listPrice) * 100)

  return (
    <Link href={`/product/${id}`} className="block group">
      <div className="flex flex-col">
        {/* Image with discount badge */}
        <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden mb-2">
          <div className="absolute top-1.5 left-1.5 z-10 bg-badge-deal text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Lightning size={10} weight="fill" />
            -{discountPercent}%
          </div>
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain p-2 sm:p-3"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 192px, 224px"
          />
        </div>

        {/* Prices */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-medium text-price-sale">{formatPrice(price)}</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground line-through">{formatPrice(listPrice)}</span>
        </div>
        
        {/* Title - 2 lines */}
        <h3 className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5 group-hover:text-link group-hover:underline">
          {title}
        </h3>

        {/* Savings */}
        <div className="text-[10px] text-stock-available font-medium mt-1 flex items-center gap-1">
          <Clock size={10} weight="regular" />
          <span>{locale === 'bg' ? `Спести ${formatPrice(listPrice - price)}` : `Save ${formatPrice(listPrice - price)}`}</span>
        </div>
      </div>
    </Link>
  )
}

export function ProductRow({
  title,
  products,
  deals,
  ctaText,
  ctaHref,
  variant = "products",
}: ProductRowProps) {
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
      const scrollAmount = direction === "left" ? -200 : 200
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const items = variant === "deals" ? deals : products

  if (!items || items.length === 0) return null

  return (
    <div className="py-4">
      {/* Header - Amazon style: simple left-aligned with right link */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">
          {title}
        </h2>
        {ctaText && ctaHref && (
          <Link 
            href={ctaHref} 
            className="text-xs sm:text-sm text-brand-blue hover:underline font-medium"
          >
            {ctaText}
          </Link>
        )}
      </div>

      {/* Horizontal scroll container */}
      <div className="relative">
        {/* Desktop scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-1 top-1/2 -translate-y-1/2 z-10 hidden md:flex",
            "items-center justify-center size-8 bg-white hover:bg-secondary rounded-full border border-border shadow-sm",
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <CaretLeft size={16} weight="regular" className="text-foreground" />
        </button>
        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 z-10 hidden md:flex",
            "items-center justify-center size-8 bg-white hover:bg-secondary rounded-full border border-border shadow-sm",
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <CaretRight size={16} weight="regular" className="text-foreground" />
        </button>

        {/* Products/Deals scroll */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-4 px-4 pb-2 no-scrollbar scroll-smooth"
        >
          {variant === "deals" 
            ? deals?.map((deal) => (
                <div key={deal.id} className="w-[45%] min-w-[45%] sm:w-48 sm:min-w-48 lg:w-56 lg:min-w-56 shrink-0 snap-start">
                  <DealCard {...deal} />
                </div>
              ))
            : products?.map((product) => (
                <div key={product.id} className="w-[45%] min-w-[45%] sm:w-48 sm:min-w-48 lg:w-56 lg:min-w-56 shrink-0 snap-start">
                  <ProductCard {...product} />
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}
