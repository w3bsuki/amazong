"use client"

import { useRef, useState, useCallback } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight, Star, Lightning, Medal, Briefcase } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface FeaturedProduct {
  id: string
  title: string
  price: number
  listPrice?: number
  image: string
  rating?: number
  reviews?: number
  isPrime?: boolean
  isBoosted?: boolean
  sellerTier?: 'basic' | 'premium' | 'business'
  slug?: string | null
}

interface FeaturedProductsSectionProps {
  title: string
  subtitle?: string
  products: FeaturedProduct[]
  ctaText?: string
  ctaHref?: string
}

// Featured Product Card
function FeaturedProductCard({ 
  id, 
  title, 
  price, 
  listPrice,
  image, 
  rating = 0, 
  reviews = 0,
  isBoosted,
  sellerTier,
  slug
}: FeaturedProduct) {
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

  const hasDiscount = listPrice && listPrice > price
  const discountPercent = hasDiscount 
    ? Math.round(((listPrice - price) / listPrice) * 100) 
    : 0

  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 2)
  const formattedDate = new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'numeric', day: 'numeric' }).format(deliveryDate)

  return (
    <Link href={productUrl} className="block h-full group">
      <div className="bg-card rounded-md overflow-hidden h-full flex flex-col border border-border relative">
        {/* Boosted Indicator */}
        {isBoosted && (
          <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-medium py-0.5 text-center flex items-center justify-center gap-1 z-20">
            <Lightning size={10} weight="fill" />
            <span>{locale === 'bg' ? 'Промотирано' : 'Boosted'}</span>
          </div>
        )}
        
        {/* Square Image Container */}
        <div className={cn(
          "relative w-full aspect-square bg-secondary p-3 flex items-center justify-center overflow-hidden",
          isBoosted && "pt-6"
        )}>
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 z-10 bg-deal text-white text-xs font-medium px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </div>
          )}
          
          {/* Seller Tier Badge */}
          {sellerTier === 'premium' && (
            <Badge className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 border-0">
              <Medal size={10} weight="fill" className="mr-0.5" />
              {locale === 'bg' ? 'Премиум' : 'Premium'}
            </Badge>
          )}
          {sellerTier === 'business' && (
            <Badge className="absolute top-2 right-2 z-10 bg-foreground text-background text-xs px-1.5 py-0.5 border-0">
              <Briefcase size={10} weight="fill" className="mr-0.5" />
              {locale === 'bg' ? 'Бизнес' : 'Business'}
            </Badge>
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
        <div className="p-2.5 flex-1 flex flex-col">
          {/* Title */}
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

          {/* Price */}
          <div className="mt-auto pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className={cn(
                "text-sm sm:text-base font-medium",
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

export function FeaturedProductsSection({
  title,
  subtitle,
  products,
  ctaText,
  ctaHref,
}: FeaturedProductsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState({ left: false, right: true })

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    setScrollState({
      left: container.scrollLeft > 0,
      right: container.scrollLeft < container.scrollWidth - container.clientWidth - 10,
    })
  }, [])

  const scroll = (direction: "left" | "right") => {
    scrollContainerRef.current?.scrollBy({ 
      left: direction === "left" ? -250 : 250, 
      behavior: "smooth" 
    })
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden">
      {/* Header Section */}
      <div className="text-center pt-5 sm:pt-6 pb-3 sm:pb-4 px-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-1.5">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
        )}
        {ctaText && ctaHref && (
          <Link 
            href={ctaHref} 
            className="text-xs sm:text-sm font-normal hover:underline underline-offset-4 inline-flex items-center gap-1 text-link hover:text-link-hover"
          >
            {ctaText}
            <CaretRight size={12} weight="regular" />
          </Link>
        )}
      </div>

      {/* Products Carousel */}
      <div className="relative overflow-hidden pb-4 sm:pb-6">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex",
            "items-center justify-center size-10 bg-white hover:bg-secondary rounded-full border border-border",
            scrollState.left ? "opacity-100" : "opacity-0 pointer-events-none"
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
            scrollState.right ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <CaretRight size={20} weight="regular" className="text-foreground" />
        </button>

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="flex flex-row flex-nowrap gap-3 overflow-x-auto snap-x snap-mandatory scroll-pl-4 px-4 pb-2 no-scrollbar scroll-smooth md:gap-4 md:scroll-pl-6 md:px-6"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[45%] min-w-[45%] shrink-0 snap-start md:w-44 md:min-w-44 group"
            >
              <FeaturedProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
