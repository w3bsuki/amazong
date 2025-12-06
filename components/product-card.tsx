"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Lightning, Truck } from "@phosphor-icons/react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { WishlistButton } from "@/components/wishlist-button"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, imageSizes, getImageLoadingStrategy } from "@/lib/image-utils"
import { getDeliveryEstimate, type ShippingRegion } from "@/lib/shipping"

// Tag configuration for badges
const TAG_CONFIG: Record<string, { color: string; label: string; labelBg: string }> = {
  new: { color: "bg-green-500", label: "NEW", labelBg: "НОВО" },
  sale: { color: "bg-red-500", label: "SALE", labelBg: "РАЗПРОДАЖБА" },
  limited: { color: "bg-purple-500", label: "LIMITED", labelBg: "ЛИМИТИРАНО" },
  trending: { color: "bg-orange-500", label: "TRENDING", labelBg: "ПОПУЛЯРНО" },
  bestseller: { color: "bg-yellow-500", label: "BESTSELLER", labelBg: "ТОП" },
  premium: { color: "bg-blue-600", label: "PREMIUM", labelBg: "ПРЕМИУМ" },
  handmade: { color: "bg-amber-600", label: "HANDMADE", labelBg: "РЪЧНА" },
  "eco-friendly": { color: "bg-emerald-500", label: "ECO", labelBg: "ЕКО" },
}

// Helper to get tag config
function getTagConfig(tag: string) {
  return TAG_CONFIG[tag] || null
}

interface ProductCardProps {
  id: string
  title: string
  price: number
  image: string
  rating?: number
  reviews?: number
  originalPrice?: number | null
  tags?: string[]
  isBoosted?: boolean
  compact?: boolean // Legacy prop - use variant instead
  variant?: "default" | "grid" | "compact" | "carousel"
  /** Index in list for determining loading priority (0-based) */
  index?: number
  /** Seller ID of the product */
  sellerId?: string
  /** Current user ID to check if this is their own product */
  currentUserId?: string | null
  /** Seller's country code for delivery time calculation */
  sellerCountryCode?: string
  /** Buyer's shipping region for delivery time calculation */
  buyerRegion?: ShippingRegion
  /** SEO-friendly slug for the product URL (preferred over id) */
  slug?: string | null
  /** Store slug for the seller (for SEO-friendly URLs) */
  storeSlug?: string | null
}

export function ProductCard({ 
  id, 
  title, 
  price, 
  image, 
  rating = 0, 
  reviews = 0,
  originalPrice,
  tags = [],
  isBoosted = false,
  compact = false,
  variant = "default",
  index = 0,
  sellerId,
  currentUserId,
  sellerCountryCode = 'BG',
  buyerRegion = 'BG',
  slug,
  storeSlug
}: ProductCardProps) {
  const { addToCart } = useCart()
  const t = useTranslations('Product')
  const tCart = useTranslations('Cart')
  const locale = useLocale()
  
  // Use store slug + product slug for SEO-friendly URLs
  // Format: /product/{storeSlug}/{productSlug} or fallback to /product/{id}
  const productUrl = storeSlug && slug 
    ? `/product/${storeSlug}/${slug}` 
    : `/product/${slug || id}`

  // Check if user is trying to buy their own product
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  // Resolve variant from legacy compact prop
  const resolvedVariant = compact ? "compact" : variant

  // Get the primary badge to display (priority order)
  const getPrimaryBadge = () => {
    // Check tags in priority order
    const priorityTags = ['sale', 'new', 'limited', 'trending', 'premium', 'bestseller', 'handmade', 'eco-friendly']
    for (const tag of priorityTags) {
      if (tags.includes(tag)) {
        const config = getTagConfig(tag)
        if (config) {
          return { 
            text: locale === 'bg' ? config.labelBg : config.label, 
            color: config.color 
          }
        }
      }
    }
    // Fallback for discount without sale tag
    if (originalPrice && originalPrice > price && !tags.includes('sale')) {
      return { text: locale === 'bg' ? 'РАЗПРОДАЖБА' : 'SALE', color: 'bg-red-500' }
    }
    return null
  }

  const primaryBadge = getPrimaryBadge()

  // Get optimized loading strategy based on position in list
  const loadingStrategy = getImageLoadingStrategy(index, 4)
  
  // Get appropriate sizes based on variant
  const sizeKey = resolvedVariant as keyof typeof imageSizes.productCard
  const sizes = imageSizes.productCard[sizeKey] || imageSizes.productCard.default

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    if (isOwnProduct) {
      toast.error("You cannot purchase your own products")
      return
    }
    addToCart({
      id,
      title,
      price,
      image,
      quantity: 1,
      slug,
      storeSlug,
    })
    toast.success(tCart('itemAdded'))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  // Calculate delivery estimate based on seller location → buyer region
  const deliveryEstimate = getDeliveryEstimate(sellerCountryCode, buyerRegion)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + deliveryEstimate.minDays)
  const formattedDate = new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'numeric', day: 'numeric' }).format(deliveryDate)
  const deliveryLabel = locale === 'bg' ? deliveryEstimate.labelBg : deliveryEstimate.label

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
        href={productUrl} 
        className="absolute inset-0 z-10" 
        aria-label={`View ${title}`}
        prefetch={index < 4}
      />

      {/* Image Container - Consistent square aspect ratio */}
      <CardContent className={cn(
        "relative bg-secondary aspect-square flex items-center justify-center overflow-hidden pointer-events-none",
        isGrid ? "p-2" : "p-2 sm:p-3 md:p-4"
      )}>
        {/* Boosted indicator */}
        {isBoosted && (
          <div className="absolute top-2 left-2 z-20">
            <Badge className="bg-amber-500 text-white border-0 text-xs px-1.5 py-0.5 font-semibold flex items-center gap-0.5">
              <Lightning weight="fill" className="w-3 h-3" />
              BOOST
            </Badge>
          </div>
        )}
        {/* Primary Badge (Sale/New/Limited/etc) */}
        {primaryBadge && !isBoosted && (
          <div className="absolute top-2 left-2 z-20">
            <Badge className={cn(
              "text-white border-0 text-xs px-1.5 py-0.5 font-semibold",
              primaryBadge.color
            )}>
              {primaryBadge.text}
            </Badge>
          </div>
        )}
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
          isGrid ? "text-sm mb-1" : "text-sm mb-1 sm:mb-1.5"
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
          <span className="text-xs text-muted-foreground font-normal">{reviews.toLocaleString()}</span>
        </div>

        {/* Price & Button */}
        <div className="mt-auto pointer-events-auto">
          <div className="mb-1">
            <span className={cn(
              "font-normal text-foreground",
              isGrid ? "text-sm" : "text-sm sm:text-base"
            )}>{formatPrice(price)}</span>
          </div>

          {!isCompact && (
            <div className={cn(
              "text-xs text-muted-foreground mb-1.5 flex items-center gap-1",
              isGrid ? "hidden" : "hidden sm:flex sm:mb-2"
            )}>
              <Truck size={12} className="text-green-600" />
              <span>{formattedDate}</span>
              <span className="text-muted-foreground/70">({deliveryLabel})</span>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={isOwnProduct}
            className={cn(
              "w-full bg-interactive hover:bg-interactive-hover text-white font-normal rounded-sm touch-action-manipulation disabled:opacity-50",
              isGrid ? "min-h-9 text-sm" : "min-h-11 text-sm"
            )}
            title={isOwnProduct ? "You cannot purchase your own products" : undefined}
          >
            {isOwnProduct ? "Your Product" : t('addToCart')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
