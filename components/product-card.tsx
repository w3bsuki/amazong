"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Lightning, Truck, Medal, Briefcase } from "@phosphor-icons/react"
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
import { cva, type VariantProps } from "class-variance-authority"

// =============================================================================
// CVA VARIANT DEFINITIONS - shadcn/ui + Tailwind v4 best practice
// =============================================================================

const productCardVariants = cva(
  "overflow-hidden flex flex-col group relative bg-card border border-border min-w-0",
  {
    variants: {
      variant: {
        default: "rounded-md h-full",
        grid: "rounded-sm h-full",
        compact: "rounded-md",
        featured: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const imageContainerVariants = cva(
  "relative w-full bg-secondary flex items-center justify-center overflow-hidden",
  {
    variants: {
      variant: {
        default: "aspect-square p-2 sm:p-3 md:p-4",
        grid: "aspect-square p-2",
        // Compact: taller image, no padding on mobile for max image size
        compact: "aspect-square p-0 md:aspect-[4/5] md:p-1.5",
        featured: "aspect-square p-0 md:aspect-[4/5] md:p-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const contentVariants = cva(
  "flex flex-col min-w-0",
  {
    variants: {
      variant: {
        default: "flex-1 p-2 sm:p-2.5 md:p-3 bg-card",
        grid: "flex-1 p-2 sm:p-2.5 bg-card",
        // Compact/Featured: minimal padding on mobile, no gap
        compact: "px-1.5 py-1 md:px-1.5 md:py-1.5 md:gap-1",
        featured: "px-1.5 py-1 md:px-1.5 md:py-1.5 md:gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const titleVariants = cva(
  "text-foreground group-hover:underline",
  {
    variants: {
      variant: {
        default: "text-sm font-medium leading-snug mb-1 sm:mb-1.5 line-clamp-2",
        grid: "text-sm font-medium leading-snug mb-1 line-clamp-2",
        // Compact/Featured: single line, truncate with ellipsis - w-full + overflow-hidden + text-ellipsis
        compact: "text-sm font-medium leading-snug w-full overflow-hidden text-ellipsis whitespace-nowrap",
        featured: "text-sm font-medium leading-snug w-full overflow-hidden text-ellipsis whitespace-nowrap",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// =============================================================================
// TAG CONFIGURATION
// =============================================================================

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

function getTagConfig(tag: string) {
  return TAG_CONFIG[tag] || null
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface ProductCardProps extends VariantProps<typeof productCardVariants> {
  id: string
  title: string
  price: number
  image: string
  rating?: number
  reviews?: number
  originalPrice?: number | null
  /** Alias for originalPrice (used in some sections) */
  listPrice?: number | null
  tags?: string[]
  isBoosted?: boolean
  /** @deprecated Use variant="compact" instead */
  compact?: boolean
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
  /** SEO-friendly slug for the product URL */
  slug?: string | null
  /** Store slug for the seller (for SEO-friendly URLs) */
  storeSlug?: string | null
  /** Seller tier for badge display */
  sellerTier?: 'basic' | 'premium' | 'business'
  /** Show wishlist button (default true for default/grid, false for compact/featured) */
  showWishlist?: boolean
  /** Show add to cart button (default true for default/grid, false for compact/featured) */
  showAddToCart?: boolean
  /** Item condition for contextual badge (new, like-new, good, fair, poor) */
  condition?: string
  /** Brand name for contextual badge */
  brand?: string
  /** Category slug for category-aware badge display */
  categorySlug?: string
  /** Vehicle/Product make (for automotive) */
  make?: string
  /** Vehicle/Product model */
  model?: string
  /** Year (for vehicles, electronics) */
  year?: string
  /** Location (for real estate, services) */
  location?: string
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ProductCard({ 
  id, 
  title, 
  price, 
  image, 
  rating = 0, 
  reviews = 0,
  originalPrice,
  listPrice,
  tags = [],
  isBoosted = false,
  compact: compactLegacy = false,
  variant = "default",
  index = 0,
  sellerId,
  currentUserId,
  sellerCountryCode = 'BG',
  buyerRegion = 'BG',
  slug,
  storeSlug,
  sellerTier,
  showWishlist,
  showAddToCart,
  condition,
  brand,
  categorySlug,
  make,
  model,
  year,
  location,
}: ProductCardProps) {
  const { addToCart } = useCart()
  const t = useTranslations('Product')
  const tCart = useTranslations('Cart')
  const locale = useLocale()
  
  // Resolve variant from legacy compact prop
  const resolvedVariant = compactLegacy ? "compact" : (variant ?? "default")
  
  // Derive showWishlist and showAddToCart from variant if not explicitly set
  const shouldShowWishlist = showWishlist ?? (resolvedVariant === "default" || resolvedVariant === "grid")
  const shouldShowAddToCart = showAddToCart ?? (resolvedVariant === "default" || resolvedVariant === "grid")
  
  // Use listPrice as fallback for originalPrice
  const effectiveOriginalPrice = originalPrice ?? listPrice
  
  // Calculate discount
  const hasDiscount = effectiveOriginalPrice && effectiveOriginalPrice > price
  const discountPercent = hasDiscount 
    ? Math.round(((effectiveOriginalPrice - price) / effectiveOriginalPrice) * 100) 
    : 0

  // URL construction
  const productUrl = storeSlug && slug 
    ? `/product/${storeSlug}/${slug}` 
    : `/product/${slug || id}`

  // Check if user is trying to buy their own product
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  // Get the primary badge to display (priority order)
  const getPrimaryBadge = () => {
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
    // Show discount badge for featured/compact variants without explicit sale tag
    if (hasDiscount && !tags.includes('sale') && (resolvedVariant === 'featured' || resolvedVariant === 'compact')) {
      return { text: `-${discountPercent}%`, color: 'bg-deal', isDiscount: true }
    }
    // Fallback for default/grid with discount
    if (hasDiscount && !tags.includes('sale')) {
      return { text: locale === 'bg' ? 'РАЗПРОДАЖБА' : 'SALE', color: 'bg-red-500' }
    }
    return null
  }

  const primaryBadge = getPrimaryBadge()

  // Loading strategy
  const loadingStrategy = getImageLoadingStrategy(index, 4)
  const sizeKey = resolvedVariant as keyof typeof imageSizes.productCard
  const sizes = imageSizes.productCard[sizeKey] || imageSizes.productCard.default

  // Handlers
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
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
      slug: slug || undefined,
      storeSlug: storeSlug || undefined,
    })
    toast.success(tCart('itemAdded'))
  }

  // Formatting
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(p)
  }

  // Delivery estimate
  const deliveryEstimate = getDeliveryEstimate(sellerCountryCode, buyerRegion)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + deliveryEstimate.minDays)
  const formattedDate = new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'numeric', day: 'numeric' }).format(deliveryDate)
  const deliveryLabel = locale === 'bg' ? deliveryEstimate.labelBg : deliveryEstimate.label

  // For featured/compact: entire card is clickable link
  // For default/grid: card has overlay link but button is separate
  const isLinkCard = resolvedVariant === 'featured' || resolvedVariant === 'compact'

  // =============================================================================
  // RENDER: LINK CARD (featured/compact) - Clean, no button, entire card clickable
  // =============================================================================
  if (isLinkCard) {
    return (
      <Link href={productUrl} className="block group">
        <div className={cn(productCardVariants({ variant: resolvedVariant }))}>
          {/* Boosted Banner for Featured */}
          {isBoosted && resolvedVariant === 'featured' && (
            <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-medium py-0.5 text-center flex items-center justify-center gap-1 z-20">
              <Lightning size={10} weight="fill" />
              <span>{locale === 'bg' ? 'Промотирано' : 'Boosted'}</span>
            </div>
          )}
          
          {/* Image Container */}
          <div className={cn(
            imageContainerVariants({ variant: resolvedVariant }),
            isBoosted && resolvedVariant === 'featured' && "pt-6"
          )}>
            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-2 left-2 z-10 bg-deal text-white text-xs font-medium px-1.5 py-0.5 rounded">
                -{discountPercent}%
              </div>
            )}
            
            {/* Seller Tier Badge (featured only) */}
            {resolvedVariant === 'featured' && sellerTier === 'premium' && (
              <Badge className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 border-0">
                <Medal size={10} weight="fill" className="mr-0.5" />
                {locale === 'bg' ? 'Премиум' : 'Premium'}
              </Badge>
            )}
            {resolvedVariant === 'featured' && sellerTier === 'business' && (
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

          {/* Content - tight vertical stack */}
          <div className={cn(contentVariants({ variant: resolvedVariant }))}>
            {/* Title - bigger, readable */}
            <h3 className={cn(titleVariants({ variant: resolvedVariant }))}>
              {title}
            </h3>

            {/* Rating - hide on mobile if no reviews, show contextual badge instead */}
            {reviews > 0 ? (
              <div className="flex items-center gap-1">
                <div className="flex text-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      weight={i < Math.floor(rating) ? "fill" : "regular"}
                      className={cn(i < Math.floor(rating) ? "" : "text-rating-empty")}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{reviews}</span>
              </div>
            ) : (
              <>
                {/* Mobile: show category-aware contextual badge */}
                <div className="flex md:hidden items-center">
                  {(() => {
                    // Category-aware badge logic
                    const isAutomotive = categorySlug?.includes('automotive') || categorySlug?.includes('car') || categorySlug?.includes('vehicle')
                    const isRealEstate = categorySlug?.includes('real-estate') || categorySlug?.includes('property') || categorySlug?.includes('imoti')
                    const isElectronics = categorySlug?.includes('electronics') || categorySlug?.includes('tech')
                    
                    // Automotive: Show Make + Model + Year
                    if (isAutomotive && (make || model)) {
                      const parts = [make, model, year].filter(Boolean)
                      return parts.length > 0 ? (
                        <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                          {parts.join(' ')}
                        </span>
                      ) : null
                    }
                    
                    // Real Estate: Show Location
                    if (isRealEstate && location) {
                      return (
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {location}
                        </span>
                      )
                    }
                    
                    // Electronics: Show Brand + Model
                    if (isElectronics && (brand || model)) {
                      const parts = [brand, model].filter(Boolean)
                      return parts.length > 0 ? (
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {parts.join(' ')}
                        </span>
                      ) : null
                    }
                    
                    // Default: Condition (for fashion/clothing) or Brand
                    if (condition) {
                      const conditionLabel = locale === 'bg' 
                        ? condition === 'new-with-tags' ? 'Ново с етикети' 
                          : condition === 'new-without-tags' ? 'Ново без етикети'
                          : condition === 'used-like-new' ? 'Като ново'
                          : condition === 'used-excellent' ? 'Отлично'
                          : condition === 'used-good' ? 'Добро'
                          : condition === 'used-fair' ? 'Задоволително'
                          : condition
                        : condition === 'new-with-tags' ? 'New'
                          : condition === 'new-without-tags' ? 'New'
                          : condition === 'used-like-new' ? 'Like New'
                          : condition === 'used-excellent' ? 'Excellent'
                          : condition === 'used-good' ? 'Good'
                          : condition === 'used-fair' ? 'Fair'
                          : condition
                      return <span className="text-xs text-muted-foreground">{conditionLabel}</span>
                    }
                    
                    // Final fallback: Brand
                    if (brand) {
                      return <span className="text-xs text-muted-foreground truncate max-w-[120px]">{brand}</span>
                    }
                    
                    return null
                  })()}
                </div>
                {/* Desktop: show empty stars */}
                <div className="hidden md:flex items-center gap-1">
                  <div className="flex text-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        weight="regular"
                        className="text-rating-empty"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">0</span>
                </div>
              </>
            )}

            {/* Price - prominent, clear hierarchy */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className={cn(
                  "text-base font-semibold",
                  hasDiscount ? "text-deal" : "text-foreground"
                )}>
                  {formatPrice(price)}
                </span>
                {hasDiscount && effectiveOriginalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(effectiveOriginalPrice)}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('delivery')} {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // =============================================================================
  // RENDER: INTERACTIVE CARD (default/grid) - With Add to Cart button
  // =============================================================================
  return (
    <Card className={cn(productCardVariants({ variant: resolvedVariant }))}>
      {/* Hit Area for Nav - Prefetch first 4 products for instant navigation */}
      <Link 
        href={productUrl} 
        className="absolute inset-0 z-10" 
        aria-label={`View ${title}`}
        prefetch={index < 4}
      />

      {/* Image Container */}
      <CardContent className={cn(
        imageContainerVariants({ variant: resolvedVariant }),
        "pointer-events-none"
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
        {shouldShowWishlist && (
          <div className="absolute top-2 right-2 z-20 pointer-events-auto">
            <WishlistButton product={{ id, title, price, image }} />
          </div>
        )}
        
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
        contentVariants({ variant: resolvedVariant }),
        "z-20 pointer-events-none"
      )}>
        {/* Title */}
        <h3 className={cn(titleVariants({ variant: resolvedVariant }))}>
          {title}
        </h3>

        {/* Rating - hide on mobile if no reviews, show contextual badge instead */}
        {reviews > 0 ? (
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
        ) : (
          <>
            {/* Mobile: show category-aware contextual badge */}
            <div className="flex md:hidden items-center mb-1.5">
              {(() => {
                // Category-aware badge logic
                const isAutomotive = categorySlug?.includes('automotive') || categorySlug?.includes('car') || categorySlug?.includes('vehicle')
                const isRealEstate = categorySlug?.includes('real-estate') || categorySlug?.includes('property') || categorySlug?.includes('imoti')
                const isElectronics = categorySlug?.includes('electronics') || categorySlug?.includes('tech')
                
                // Automotive: Show Make + Model + Year
                if (isAutomotive && (make || model)) {
                  const parts = [make, model, year].filter(Boolean)
                  return parts.length > 0 ? (
                    <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                      {parts.join(' ')}
                    </span>
                  ) : null
                }
                
                // Real Estate: Show Location
                if (isRealEstate && location) {
                  return (
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {location}
                    </span>
                  )
                }
                
                // Electronics: Show Brand + Model
                if (isElectronics && (brand || model)) {
                  const parts = [brand, model].filter(Boolean)
                  return parts.length > 0 ? (
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {parts.join(' ')}
                    </span>
                  ) : null
                }
                
                // Default: Condition (for fashion/clothing) or Brand
                if (condition) {
                  const conditionLabel = locale === 'bg' 
                    ? condition === 'new-with-tags' ? 'Ново с етикети' 
                      : condition === 'new-without-tags' ? 'Ново без етикети'
                      : condition === 'used-like-new' ? 'Като ново'
                      : condition === 'used-excellent' ? 'Отлично'
                      : condition === 'used-good' ? 'Добро'
                      : condition === 'used-fair' ? 'Задоволително'
                      : condition
                    : condition === 'new-with-tags' ? 'New'
                      : condition === 'new-without-tags' ? 'New'
                      : condition === 'used-like-new' ? 'Like New'
                      : condition === 'used-excellent' ? 'Excellent'
                      : condition === 'used-good' ? 'Good'
                      : condition === 'used-fair' ? 'Fair'
                      : condition
                  return <span className="text-xs text-muted-foreground">{conditionLabel}</span>
                }
                
                // Final fallback: Brand
                if (brand) {
                  return <span className="text-xs text-muted-foreground truncate max-w-[120px]">{brand}</span>
                }
                
                return null
              })()}
            </div>
            {/* Desktop: show empty stars */}
            <div className="hidden md:flex items-center gap-1 mb-1.5">
              <div className="flex text-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    weight="regular"
                    className="text-rating-empty"
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-normal">0</span>
            </div>
          </>
        )}

        {/* Price & Button */}
        <div className="mt-auto pointer-events-auto">
          <div className="mb-1">
            <div className="flex items-baseline gap-1.5">
              <span className={cn(
                "font-normal text-foreground",
                resolvedVariant === "grid" ? "text-sm" : "text-sm sm:text-base",
                hasDiscount && "text-deal"
              )}>
                {formatPrice(price)}
              </span>
              {hasDiscount && effectiveOriginalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(effectiveOriginalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Delivery info - hide on grid mobile */}
          {resolvedVariant !== "grid" && (
            <div className="text-xs text-muted-foreground mb-1.5 hidden sm:flex sm:mb-2 items-center gap-1">
              <Truck size={12} className="text-green-600" />
              <span>{formattedDate}</span>
              <span className="text-muted-foreground/70">({deliveryLabel})</span>
            </div>
          )}

          {/* Add to Cart Button */}
          {shouldShowAddToCart && (
            <Button
              onClick={handleAddToCart}
              disabled={isOwnProduct}
              className={cn(
                "w-full bg-interactive hover:bg-interactive-hover text-white font-normal rounded-sm touch-action-manipulation disabled:opacity-50",
                resolvedVariant === "grid" ? "min-h-9 text-sm" : "min-h-11 text-sm"
              )}
              title={isOwnProduct ? "You cannot purchase your own products" : undefined}
            >
              {isOwnProduct ? "Your Product" : t('addToCart')}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
