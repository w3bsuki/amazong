"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useCart } from "@/lib/cart-context"
import { WishlistButton } from "@/components/wishlist-button"
import { ProductCardMenu } from "@/components/product-card-menu"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, imageSizes, getImageLoadingStrategy } from "@/lib/image-utils"
import type { ShippingRegion } from "@/lib/shipping"
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
  "relative w-full bg-muted overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        grid: "",
        compact: "",
        featured: "",
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
        default: "flex-1 p-2 sm:p-2.5 bg-card",
        grid: "flex-1 p-2 sm:p-2.5 bg-card",
        compact: "p-2",
        featured: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const titleVariants = cva(
  "text-foreground group-hover:underline decoration-muted-foreground/40 underline-offset-2 truncate leading-snug",
  {
    variants: {
      variant: {
        default: "text-sm",
        grid: "text-sm",
        compact: "text-sm",
        featured: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

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
  /** Seller username for SEO-friendly URLs: /{username}/{slug} */
  username?: string | null
  /** @deprecated Use 'username' instead */
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
  rating: _rating = 0, 
  reviews: _reviews = 0,
  originalPrice,
  listPrice,
  tags: _tags = [],
  isBoosted: _isBoosted = false,
  compact: compactLegacy = false,
  variant = "default",
  index = 0,
  sellerId,
  currentUserId,
  sellerCountryCode: _sellerCountryCode = 'BG',
  buyerRegion: _buyerRegion = 'BG',
  slug,
  username,
  storeSlug, // deprecated alias
  sellerTier: _sellerTier,
  showWishlist,
  showAddToCart,
  condition: _condition,
  brand: _brand,
  categorySlug: _categorySlug,
  make: _make,
  model: _model,
  year: _year,
  location: _location,
}: ProductCardProps) {
  // Unused props kept for API compatibility (may be used in future iterations)
  void _rating; void _reviews; void _tags; void _isBoosted;
  void _sellerCountryCode; void _buyerRegion; void _sellerTier;
  void _condition; void _brand; void _categorySlug;
  void _make; void _model; void _year; void _location;
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

  // URL construction - SEO-optimized: /{username}/{slug}
  const sellerUsername = username || storeSlug // backward compatibility
  const productUrl = sellerUsername && slug 
    ? `/${sellerUsername}/${slug}` 
    : `/product/${slug || id}` // fallback for products without username

  // Check if user is trying to buy their own product
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

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
      username: sellerUsername || undefined,
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

  // For featured/compact: entire card is clickable link
  // For default/grid: card has overlay link but button is separate
  const isLinkCard = resolvedVariant === 'featured' || resolvedVariant === 'compact'

  // =============================================================================
  // RENDER: LINK CARD (featured/compact) - Clean Amazon/eBay style
  // =============================================================================
  if (isLinkCard) {
    return (
      <Link href={productUrl} className="block group">
        <div className={cn(productCardVariants({ variant: resolvedVariant }))}>
          {/* Image Container with AspectRatio - Amazon/eBay style */}
          <div className={cn(imageContainerVariants({ variant: resolvedVariant }))}>
            <AspectRatio ratio={1}>
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
              />
              {/* Discount Badge - only show if significant */}
              {hasDiscount && discountPercent >= 10 && (
                <div className="absolute top-1.5 left-1.5 z-10 bg-deal text-white text-2xs font-semibold px-1.5 py-0.5 rounded">
                  -{discountPercent}%
                </div>
              )}
              {/* Wishlist Button - top right */}
              <div className="absolute top-1.5 right-1.5 z-10" onClick={(e) => e.preventDefault()}>
                <WishlistButton product={{ id, title, price, image }} />
              </div>
            </AspectRatio>
          </div>
          
          {/* Content - eBay style */}
          <div className={cn(contentVariants({ variant: resolvedVariant }))}>
            {/* Title - 2 lines */}
            <h3 className={cn(titleVariants({ variant: resolvedVariant }))}>
              {title}
            </h3>

            {/* Price row with 3-dot menu */}
            <div className="flex items-center justify-between">
              <div>
                <span className={cn(
                  "text-sm font-semibold leading-tight",
                  hasDiscount ? "text-deal" : "text-foreground"
                )}>
                  {formatPrice(price)}
                </span>
                {hasDiscount && effectiveOriginalPrice && (
                  <span className="ml-1 text-xs text-muted-foreground line-through">
                    {formatPrice(effectiveOriginalPrice)}
                  </span>
                )}
              </div>
              
              {/* 3-dot menu - drawer on mobile, dropdown on desktop */}
              <div onClick={(e) => e.preventDefault()}>
                <ProductCardMenu productUrl={productUrl} title={title} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // =============================================================================
  // RENDER: INTERACTIVE CARD (default/grid) - Amazon/eBay style with Add to Cart
  // =============================================================================
  return (
    <Card className={cn(productCardVariants({ variant: resolvedVariant }))}>
      {/* Hit Area for Nav */}
      <Link 
        href={productUrl} 
        className="absolute inset-0 z-10" 
        aria-label={`View ${title}`}
        prefetch={index < 4}
      />

      {/* Image Container with AspectRatio */}
      <CardContent className={cn(
        imageContainerVariants({ variant: resolvedVariant }),
        "pointer-events-none p-0"
      )}>
        <AspectRatio ratio={1}>
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes={sizes}
            placeholder="blur"
            blurDataURL={productBlurDataURL()}
            loading={loadingStrategy.loading}
            priority={loadingStrategy.priority}
          />
          
          {/* Discount Badge - only show if significant */}
          {hasDiscount && discountPercent >= 10 && (
            <div className="absolute top-1.5 left-1.5 z-20 bg-deal text-white text-2xs font-semibold px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </div>
          )}
          
          {/* Wishlist Button */}
          {shouldShowWishlist && (
            <div className="absolute top-1.5 right-1.5 z-20 pointer-events-auto">
              <WishlistButton product={{ id, title, price, image }} />
            </div>
          )}
        </AspectRatio>
      </CardContent>

      <CardFooter className={cn(
        contentVariants({ variant: resolvedVariant }),
        "z-20 pointer-events-none"
      )}>
        {/* Title - 2 lines */}
        <h3 className={cn(titleVariants({ variant: resolvedVariant }))}>
          {title}
        </h3>

        {/* Price row with 3-dot menu */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div>
            <span className={cn(
              "text-sm font-bold",
              hasDiscount ? "text-deal" : "text-foreground"
            )}>
              {formatPrice(price)}
            </span>
            {hasDiscount && effectiveOriginalPrice && (
              <span className="ml-1 text-xs text-muted-foreground line-through">
                {formatPrice(effectiveOriginalPrice)}
              </span>
            )}
          </div>
          
          {/* 3-dot menu - drawer on mobile, dropdown on desktop */}
          <ProductCardMenu productUrl={productUrl} title={title} />
        </div>

        {/* Add to Cart Button */}
        {shouldShowAddToCart && (
          <div className="mt-2 pointer-events-auto">
            <Button
              onClick={handleAddToCart}
              disabled={isOwnProduct}
              className={cn(
                "w-full bg-interactive hover:bg-interactive-hover text-white font-medium rounded-md touch-action-manipulation disabled:opacity-50",
                resolvedVariant === "grid" ? "h-9 text-sm" : "h-10 text-sm"
              )}
              title={isOwnProduct ? "You cannot purchase your own products" : undefined}
            >
              {isOwnProduct ? "Your Product" : t('addToCart')}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
