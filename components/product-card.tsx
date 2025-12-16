"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCart } from "@/lib/cart-context"
import { WishlistButton } from "@/components/wishlist-button"
import { ProductCardMenu } from "@/components/product-card-menu"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, imageSizes, getImageLoadingStrategy } from "@/lib/image-utils"
import type { ShippingRegion } from "@/lib/shipping"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle, ShoppingCart, ShieldCheck, Sparkle, Star, Tag } from "@phosphor-icons/react"
import { ProductQuickViewDialog } from "@/components/product-quick-view-dialog"

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
        ultimate: "rounded-md",
        marketplace: "rounded-md",
        featured: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "marketplace",
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
        ultimate: "",
        marketplace: "",
        featured: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const contentVariants = cva(
  "min-w-0",
  {
    variants: {
      variant: {
        default: "flex-1 flex flex-col p-2 sm:p-2.5 bg-card",
        grid: "flex-1 flex flex-col p-2 sm:p-2.5 bg-card",
        compact: "p-2",
        ultimate: "p-2",
        marketplace: "p-2",
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
        marketplace: "text-sm",
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
  /** Optional seller display name (fallbacks to username/storeSlug) */
  sellerName?: string
  /** Optional seller avatar URL */
  sellerAvatarUrl?: string | null
  /** Whether seller is verified */
  sellerVerified?: boolean
  /** Show seller row (trust header) */
  showSellerRow?: boolean
  /** Show a category-aware meta line (make/model/year/location etc.) */
  showMetaLine?: boolean
  /** Show up to 3 tag chips */
  showTagChips?: boolean
  /** Show category-aware attribute pills (condition/location/in-stock/year etc.) */
  showAttributePills?: boolean
  /** Inventory flag for attribute pills */
  inStock?: boolean
  /** Show hover quick actions on desktop */
  showHoverActions?: boolean
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

  /** Normalized attribute map (from Supabase item specifics) */
  attributes?: Record<string, string>
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
  variant = "marketplace",
  index = 0,
  sellerId,
  currentUserId,
  sellerCountryCode: _sellerCountryCode = 'BG',
  buyerRegion: _buyerRegion = 'BG',
  slug,
  username,
  storeSlug, // deprecated alias
  sellerTier: _sellerTier,
  sellerName,
  sellerAvatarUrl,
  sellerVerified,
  showSellerRow,
  showMetaLine,
  showTagChips,
  showAttributePills,
  inStock,
  showHoverActions,
  showWishlist,
  showAddToCart,
  condition: _condition,
  brand: _brand,
  categorySlug: _categorySlug,
  make: _make,
  model: _model,
  year: _year,
  location: _location,
  attributes: _attributes,
}: ProductCardProps) {
  // Unused props kept for API compatibility (may be used in future iterations)
  void _sellerCountryCode; void _buyerRegion;
  const { addToCart } = useCart()
  const t = useTranslations('Product')
  const tCart = useTranslations('Cart')
  const locale = useLocale()
  
  // Resolve variant from legacy compact prop
  const resolvedVariant = compactLegacy ? "compact" : (variant ?? "marketplace")
  
  // Derive showWishlist and showAddToCart from variant if not explicitly set
  const shouldShowWishlist = showWishlist ?? (resolvedVariant !== "compact" && resolvedVariant !== "featured")
  const shouldShowAddToCart = showAddToCart ?? (resolvedVariant !== "compact" && resolvedVariant !== "featured")

  // Opt-in enhancements (kept off by default to avoid changing existing UI)
  const shouldShowSellerRow = showSellerRow ?? (resolvedVariant === "marketplace")
  const shouldShowMetaLine = showMetaLine ?? (resolvedVariant === "marketplace")
  const shouldShowTagChips = showTagChips ?? false
  const shouldShowAttributePills = showAttributePills ?? (resolvedVariant === "marketplace")
  const shouldShowHoverActions = showHoverActions ?? (resolvedVariant === "marketplace")

  // Variant-specific behavior
  // - 'ultimate' should not rely on hover-only CTAs
  // - 'marketplace' gets a desktop hover quick-add, plus a mobile CTA
  const shouldShowHoverActionsForVariant =
    resolvedVariant === 'ultimate'
      ? false
      : shouldShowHoverActions
  
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

  const sellerDisplayName = sellerName || sellerUsername || "Seller"

  const sellerTier = _sellerTier ?? 'basic'
  const sellerTierLabel = sellerTier === 'business'
    ? (locale === 'bg' ? 'Бизнес' : 'Business')
    : sellerTier === 'premium'
      ? (locale === 'bg' ? 'Премиум' : 'Premium')
      : (locale === 'bg' ? 'Нов продавач' : 'New seller')

  const getInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  const buildMetaLine = (): string | null => {
    if (!shouldShowMetaLine) return null

    const category = (_categorySlug || "").toLowerCase()
    const pieces: string[] = []

    const attrs = _attributes ?? {}
    const effectiveMake = (_make || attrs.make || '').trim()
    const effectiveModel = (_model || attrs.model || '').trim()
    const effectiveYear = (_year || attrs.year || '').trim()
    const effectiveLocation = (_location || attrs.location || '').trim()
    const effectiveBrand = (_brand || attrs.brand || '').trim()
    const effectiveCondition = (_condition || attrs.condition || '').trim()

    const hasAutoSignals = !!(effectiveMake || effectiveModel || effectiveYear) || /car|auto|vehicle|motor|parts/.test(category)

    if (hasAutoSignals) {
      const main = [effectiveMake, effectiveModel].filter(Boolean).join(" ").trim()
      if (main) pieces.push(main)
      if (effectiveYear) pieces.push(effectiveYear)
      if (effectiveLocation) pieces.push(effectiveLocation)
    } else {
      if (effectiveBrand) pieces.push(effectiveBrand)
      if (effectiveCondition) pieces.push(effectiveCondition)
      if (effectiveYear) pieces.push(effectiveYear)
      if (effectiveLocation) pieces.push(effectiveLocation)
    }

    const line = pieces.filter(Boolean).slice(0, 3).join(" · ")
    return line.length ? line : null
  }

  const metaLine = buildMetaLine()
  const tagChips = shouldShowTagChips ? _tags.filter(Boolean).slice(0, 3) : []

  const attributePills = (() => {
    if (!shouldShowAttributePills) return [] as Array<{ key: string; label: string; icon: 'tag' | 'check' }>

    const category = (_categorySlug || '').toLowerCase()
    const pillLimit = resolvedVariant === 'ultimate' || resolvedVariant === 'marketplace' ? 2 : 3

    const attrs = _attributes ?? {}

    const normalizedCondition = (_condition || attrs.condition || '').trim()
    const normalizedBrand = (_brand || attrs.brand || '').trim()
    const normalizedYear = (_year || attrs.year || '').trim()
    const normalizedSize = (attrs.size || '').trim()
    const normalizedMileageKm = (attrs.mileage_km || attrs.mileage || '').trim()

    const tags = _tags.filter(Boolean).map((t) => String(t).trim()).filter(Boolean)

    const pickTag = (predicate: (t: string) => boolean): string | null => {
      const hit = tags.find(predicate)
      return hit ?? null
    }

    const isAuto = /car|cars|auto|vehicle|motor|parts/.test(category)
    const isFashion = /fashion|shoe|shoes|sneaker|sneakers|apparel|clothing/.test(category)
    const isElectronics = /electronic|electronics|phone|phones|laptop|computer|audio|camera/.test(category)

    const pills: Array<{ key: string; label: string; icon: 'tag' | 'check' }> = []

    // Stock pill: only show if explicitly out of stock (avoid noisy "In stock" everywhere)
    if (inStock === false) pills.push({ key: 'stock:out', label: 'Out of stock', icon: 'check' })

    if (isFashion) {
      // Fashion/shoes: prioritize Size + Condition (brand can live in meta line)
      const sizeTag = normalizedSize
        || (pickTag((t) => /\bsize\b/i.test(t) || /^size\s*\d+/i.test(t))
          ?? pickTag((t) => /^\d{2,3}$/.test(t))
          ?? pickTag((t) => /\b(3[5-9]|4[0-9]|5[0-1])\b/.test(t))
          ?? '')
      if (sizeTag) pills.push({ key: `size:${sizeTag}`, label: sizeTag, icon: 'tag' })
      if (normalizedCondition) pills.push({ key: `cond:${normalizedCondition}`, label: normalizedCondition, icon: 'tag' })
      if (!sizeTag && normalizedBrand) pills.push({ key: `brand:${normalizedBrand}`, label: normalizedBrand, icon: 'tag' })
    } else if (isElectronics) {
      // Electronics: Brand + Key spec (storage) + Condition
      if (normalizedBrand) pills.push({ key: `brand:${normalizedBrand}`, label: normalizedBrand, icon: 'tag' })
      const storageTag = pickTag((t) => /\b\d+\s*(gb|tb)\b/i.test(t))
      if (storageTag) pills.push({ key: `spec:${storageTag}`, label: storageTag, icon: 'tag' })
      if (normalizedCondition) pills.push({ key: `cond:${normalizedCondition}`, label: normalizedCondition, icon: 'tag' })
    } else if (isAuto) {
      // Auto: prioritize Mileage + Year (what buyers scan first)
      if (normalizedMileageKm) {
        const mileageLabel = /\d/.test(normalizedMileageKm) && !/\bkm\b/i.test(normalizedMileageKm)
          ? `${normalizedMileageKm} km`
          : normalizedMileageKm
        pills.push({ key: `km:${normalizedMileageKm}`, label: mileageLabel, icon: 'tag' })
      }
      if (normalizedYear) pills.push({ key: `year:${normalizedYear}`, label: normalizedYear, icon: 'tag' })

      const fuelFromAttrs = (attrs.fuel_type || '').trim()
      const transmissionFromAttrs = (attrs.transmission || attrs.gearbox || '').trim()
      const fuelTag = fuelFromAttrs || pickTag((t) => /diesel|petrol|gasoline|hybrid|electric/i.test(t))
      const gearboxTag = transmissionFromAttrs || pickTag((t) => /manual|automatic/i.test(t))

      if (!normalizedMileageKm && fuelTag) pills.push({ key: `fuel:${fuelTag}`, label: fuelTag, icon: 'tag' })
      if (!normalizedMileageKm && gearboxTag) pills.push({ key: `gear:${gearboxTag}`, label: gearboxTag, icon: 'tag' })
      if (!normalizedYear && normalizedCondition) pills.push({ key: `cond:${normalizedCondition}`, label: normalizedCondition, icon: 'tag' })
    } else {
      // Generic marketplace: prefer Brand + Condition + one useful tag
      if (normalizedBrand) pills.push({ key: `brand:${normalizedBrand}`, label: normalizedBrand, icon: 'tag' })
      if (normalizedCondition) pills.push({ key: `cond:${normalizedCondition}`, label: normalizedCondition, icon: 'tag' })
      const usefulTag = pickTag((t) => t.length <= 18)
      if (usefulTag) pills.push({ key: `tag:${usefulTag}`, label: usefulTag, icon: 'tag' })
    }

    // Dedupe by label, keep first occurrences by priority
    const seen = new Set<string>()
    const deduped = pills.filter((p) => {
      const k = p.label.toLowerCase()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })

    return deduped.slice(0, pillLimit)
  })()

  const hasEnhancedContent = shouldShowSellerRow || shouldShowMetaLine || tagChips.length > 0 || attributePills.length > 0

  // Check if user is trying to buy their own product
  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  // Loading strategy
  const loadingStrategy = getImageLoadingStrategy(index, 4)
  const sizeKey = (
    resolvedVariant === 'ultimate' || resolvedVariant === 'marketplace'
      ? 'compact'
      : resolvedVariant
  ) as keyof typeof imageSizes.productCard
  const sizes = imageSizes.productCard[sizeKey] || imageSizes.productCard.default

  // Handlers
  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault()
    if (isOwnProduct) {
      toast.error("You cannot purchase your own products")
      return
    }
    if (inStock === false) {
      toast.error(t('outOfStock'))
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
  const isLinkCard =
    resolvedVariant === 'featured' ||
    resolvedVariant === 'compact' ||
    resolvedVariant === 'ultimate' ||
    resolvedVariant === 'marketplace'

  // =============================================================================
  // RENDER: LINK CARD (featured/compact) - Clean Amazon/eBay style
  // =============================================================================
  if (isLinkCard) {
    const isSellerFirstHeader = (resolvedVariant === 'ultimate' || resolvedVariant === 'marketplace') && shouldShowSellerRow
    const isUnavailable = isOwnProduct || inStock === false

    return (
      <Link href={productUrl} className="block group">
        <div className={cn(productCardVariants({ variant: resolvedVariant }), _isBoosted && "ring-1 ring-primary/20")}> 
          {/* Seller header (seller-first trust) */}
          {isSellerFirstHeader && (
            <div
              className={cn(
                "flex items-center justify-between gap-2 border-b",
                "bg-muted/20 px-2.5 py-2"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={sellerAvatarUrl || undefined} alt={sellerDisplayName} />
                  <AvatarFallback className="text-[10px] bg-muted">
                    {getInitials(sellerDisplayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-semibold text-foreground truncate">{sellerDisplayName}</span>
                    <span className={cn(
                      "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold shrink-0",
                      sellerTier === 'business'
                        ? "bg-muted/30 text-foreground"
                        : sellerTier === 'premium'
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted/20 text-muted-foreground"
                    )}>
                      {sellerTierLabel}
                    </span>
                    {sellerVerified && <ShieldCheck size={14} weight="fill" className="text-primary shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground min-w-0">
                    {(_rating || 0) > 0 && (
                      <span className="inline-flex items-center gap-1 shrink-0">
                        <Star size={12} weight="fill" className="text-muted-foreground" />
                        <span>{(_rating || 0).toFixed(1)}</span>
                      </span>
                    )}
                    {sellerVerified && (
                      <span className="truncate">
                        {locale === 'bg' ? 'Потвърден профил' : 'Verified profile'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu stays usable without navigating */}
              <div
                className="shrink-0"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <ProductCardMenu productUrl={productUrl} title={title} />
              </div>
            </div>
          )}

          {/* Image Container */}
          <div className={cn(imageContainerVariants({ variant: resolvedVariant }))}>
            <AspectRatio ratio={1}>
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                fill
                className={cn(
                  "object-cover"
                )}
                sizes={sizes}
                placeholder="blur"
                blurDataURL={productBlurDataURL()}
                loading={loadingStrategy.loading}
                priority={loadingStrategy.priority}
              />
              {/* Promoted badge */}
              {_isBoosted && (
                <div className="absolute top-1.5 left-1.5 z-10 inline-flex items-center gap-1 rounded-full border bg-background/90 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold text-foreground">
                  <Sparkle size={12} weight="fill" className="text-primary" />
                  Promoted
                </div>
              )}
              {/* Discount Badge - top left */}
              {hasDiscount && discountPercent >= 10 && (
                <div className={cn(
                  "absolute left-1.5 z-10 bg-deal text-white text-2xs font-semibold px-1.5 py-0.5 rounded",
                  _isBoosted ? "top-8" : "top-1.5"
                )}>
                  -{discountPercent}%
                </div>
              )}
              {/* Wishlist - top right, single clean button */}
              <div
                className="absolute top-1.5 right-1.5 z-10"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <WishlistButton product={{ id, title, price, image }} />
              </div>
            </AspectRatio>
          </div>
          
          {/* Content */}
          <div className={cn(
            contentVariants({ variant: resolvedVariant }),
            (resolvedVariant === 'compact' || resolvedVariant === 'ultimate') ? "space-y-1" : "space-y-1.5"
          )}> 
            {/* Seller row (compact/featured) */}
            {shouldShowSellerRow && !isSellerFirstHeader && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-7 w-7 border">
                    <AvatarImage src={sellerAvatarUrl || undefined} alt={sellerDisplayName} />
                    <AvatarFallback className="text-[10px] bg-muted">
                      {getInitials(sellerDisplayName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-semibold text-foreground truncate">{sellerDisplayName}</span>
                  <span className={cn(
                    "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold shrink-0",
                    sellerTier === 'business'
                      ? "bg-muted/30 text-foreground"
                      : sellerTier === 'premium'
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted/20 text-muted-foreground"
                  )}>
                    {sellerTierLabel}
                  </span>
                  {sellerVerified && <ShieldCheck size={14} weight="fill" className="text-primary shrink-0" />}
                </div>
                {(_rating || 0) > 0 && (
                  <span className="text-[10px] font-medium text-muted-foreground shrink-0">
                    {(_rating || 0).toFixed(1)}
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <h3
              className={cn(
                "text-foreground group-hover:underline decoration-muted-foreground/40 underline-offset-2 leading-snug",
                "text-sm",
                hasEnhancedContent ? "line-clamp-2" : "truncate"
              )}
            >
              {title}
            </h3>

            {/* Product rating (compact) */}
            {(resolvedVariant === 'marketplace' || resolvedVariant === 'ultimate') && (_rating || 0) > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star size={12} weight="fill" className="text-muted-foreground" />
                  <span className="font-medium text-foreground">{(_rating || 0).toFixed(1)}</span>
                </span>
                {(_reviews || 0) > 0 && <span>({(_reviews || 0)})</span>}
              </div>
            )}

            {/* Category/attribute pills */}
            {attributePills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {attributePills.map((pill) => (
                  <span
                    key={pill.key}
                    className="inline-flex items-center gap-1 rounded-full border bg-muted/20 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {pill.icon === 'check' ? (
                      <CheckCircle size={12} weight="fill" className="text-muted-foreground" />
                    ) : (
                      <Tag size={12} className="text-muted-foreground" />
                    )}
                    {pill.label}
                  </span>
                ))}
              </div>
            )}

            {/* Meta line */}
            {metaLine && <p className="text-xs text-muted-foreground line-clamp-1">{metaLine}</p>}

            {/* Price + actions */}
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "text-sm font-semibold",
                  hasDiscount ? "text-deal" : "text-foreground"
                )}
              >
                {formatPrice(price)}
                {hasDiscount && effectiveOriginalPrice && (
                  <span className="ml-1 text-xs font-normal text-muted-foreground line-through">
                    {formatPrice(effectiveOriginalPrice)}
                  </span>
                )}
              </span>

              <div
                className="flex items-center gap-1"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                {/* Desktop quick view (hover-only) */}
                {shouldShowHoverActionsForVariant && (
                  <ProductQuickViewDialog
                    productUrl={productUrl}
                    title={title}
                    image={image}
                    priceLabel={formatPrice(price)}
                    originalPriceLabel={hasDiscount && effectiveOriginalPrice ? formatPrice(effectiveOriginalPrice) : null}
                    discountPercent={discountPercent}
                    metaLine={metaLine}
                    attributePills={attributePills}
                    isUnavailable={isUnavailable}
                    ctaLabel={isOwnProduct ? "Your Product" : (inStock === false ? t('outOfStock') : t('addToCart'))}
                    onAddToCart={() => handleAddToCart()}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "hidden md:inline-flex",
                        "h-7 px-2 text-xs font-semibold",
                        "opacity-0 pointer-events-none transition-opacity",
                        "group-hover:opacity-100 group-hover:pointer-events-auto"
                      )}
                      aria-label="Quick view"
                    >
                      Quick view
                    </Button>
                  </ProductQuickViewDialog>
                )}

                {/* Cart icon button
                    - If desktop hover quick-add is enabled, avoid duplicate CTAs by showing this only on mobile.
                    - If hover quick-add is off, keep the compact behavior (desktop-only) unless explicitly enabled via showAddToCart.
                 */}
                {(shouldShowAddToCart || shouldShowHoverActionsForVariant) && (
                  (resolvedVariant === 'ultimate' || resolvedVariant === 'marketplace') ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(e)
                      }}
                      disabled={isUnavailable}
                      className={cn(
                        "h-7 px-2.5 rounded-md border text-xs font-semibold transition-colors inline-flex items-center gap-1.5",
                        "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      title={isOwnProduct ? "You cannot purchase your own products" : (inStock === false ? t('outOfStock') : t('addToCart'))}
                      aria-label={t('addToCart')}
                    >
                      <ShoppingCart size={14} weight="bold" />
                      {inStock === false ? t('outOfStock') : "Add"}
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(e)
                      }}
                      disabled={isUnavailable}
                      className={cn(
                        "items-center justify-center size-6 rounded transition-colors",
                        shouldShowHoverActionsForVariant ? "flex md:hidden" : (shouldShowAddToCart ? "flex" : "hidden md:flex"),
                        "bg-interactive hover:bg-interactive-hover text-white",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      title={isOwnProduct ? "You cannot purchase your own products" : (inStock === false ? t('outOfStock') : t('addToCart'))}
                      aria-label={t('addToCart')}
                    >
                      <ShoppingCart size={14} weight="bold" />
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Tag chips */}
            {tagChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tagChips.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border bg-muted/20 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    <Tag size={12} className="text-muted-foreground" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title - spans full width */}
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
