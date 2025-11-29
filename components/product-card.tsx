"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "@phosphor-icons/react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { WishlistButton } from "@/components/wishlist-button"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, imageSizes, getImageLoadingStrategy } from "@/lib/image-utils"

interface ProductCardProps {
  id: string
  title: string
  price: number
  image: string
  rating?: number
  reviews?: number
  compact?: boolean // Legacy prop - use variant instead
  variant?: "default" | "grid" | "compact" | "carousel"
  /** Index in list for determining loading priority (0-based) */
  index?: number
}

export function ProductCard({ 
  id, 
  title, 
  price, 
  image, 
  rating = 4.5, 
  reviews = 120, 
  compact = false,
  variant = "default",
  index = 0
}: ProductCardProps) {
  const { addToCart } = useCart()
  const t = useTranslations('Product')
  const tCart = useTranslations('Cart')
  const locale = useLocale()

  // Resolve variant from legacy compact prop
  const resolvedVariant = compact ? "compact" : variant

  // Get optimized loading strategy based on position in list
  const loadingStrategy = getImageLoadingStrategy(index, 4)
  
  // Get appropriate sizes based on variant
  const sizeKey = resolvedVariant as keyof typeof imageSizes.productCard
  const sizes = imageSizes.productCard[sizeKey] || imageSizes.productCard.default

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    addToCart({
      id,
      title,
      price,
      image,
      quantity: 1,
    })
    toast.success(tCart('itemAdded'))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 2)
  const formattedDate = new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'numeric', day: 'numeric' }).format(deliveryDate)

  // Variant-specific styles
  const isCompact = resolvedVariant === "compact" || resolvedVariant === "carousel"
  const isGrid = resolvedVariant === "grid"

  return (
    <Card className={cn(
      "bg-product-card-bg overflow-hidden flex flex-col group relative border border-product-card-border h-full",
      isGrid && "rounded-sm" // Sharper corners for grid
    )}>
      {/* Hit Area for Nav - Prefetch first 4 products for instant navigation */}
      <Link 
        href={`/product/${id}`} 
        className="absolute inset-0 z-10" 
        aria-label={`View ${title}`}
        prefetch={index < 4}
      />

      {/* Image Container - Consistent square aspect ratio */}
      <CardContent className={cn(
        "relative bg-secondary aspect-square flex items-center justify-center overflow-hidden pointer-events-none",
        isGrid ? "p-2" : "p-2 sm:p-3 md:p-4"
      )}>
        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 z-20 pointer-events-auto">
          <WishlistButton
            product={{ id, title, price, image }}
          />
        </div>
        <div className="relative w-full h-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain mix-blend-multiply"
            sizes={sizes}
            placeholder="blur"
            blurDataURL={productBlurDataURL()}
            loading={loadingStrategy.loading}
            priority={loadingStrategy.priority}
          />
        </div>
      </CardContent>

      <CardFooter className={cn(
        "flex-1 flex flex-col z-20 pointer-events-none bg-card",
        isGrid ? "p-2 sm:p-2.5" : "p-2 sm:p-2.5 md:p-3"
      )}>
        {/* Title - 2 lines max - eBay style: normal weight, underline on hover */}
        <h3 className={cn(
          "font-normal text-foreground group-hover:underline line-clamp-2 leading-snug",
          isGrid ? "text-xs mb-1 min-h-8" : "text-xs sm:text-sm mb-1 sm:mb-1.5 min-h-8 sm:min-h-10"
        )}>
          {title}
        </h3>

        {/* Rating - Compact */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex text-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                weight={i < Math.floor(rating) ? "fill" : "regular"}
                className="text-rating"
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground font-normal">{reviews.toLocaleString()}</span>
        </div>

        {/* Price & Button */}
        <div className="mt-auto pointer-events-auto">
          <div className="mb-1">
            <span className={cn(
              "font-medium text-foreground tracking-tight",
              isGrid ? "text-sm" : "text-sm sm:text-base md:text-lg"
            )}>{formatPrice(price)}</span>
          </div>

          {!isCompact && (
            <div className={cn(
              "text-[10px] text-muted-foreground mb-1.5",
              isGrid ? "hidden" : "hidden sm:block sm:mb-2"
            )}>
              {t('delivery')} <span className="font-semibold text-foreground">{formattedDate}</span>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            className={cn(
              "w-full bg-interactive hover:bg-interactive-hover text-white font-normal rounded-sm touch-action-manipulation",
              isGrid ? "min-h-9 text-xs" : "min-h-11 text-xs sm:text-sm"
            )}
          >
            {t('addToCart')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
