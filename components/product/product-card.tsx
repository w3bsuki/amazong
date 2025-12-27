"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WishlistButton } from "@/components/common/wishlist/wishlist-button"
import { useCart } from "@/components/providers/cart-context"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
// Note: UltimateMarketplaceCard was removed as part of consolidation. 
// "marketplace" variant now uses the default card rendering.
import { cva, type VariantProps } from "class-variance-authority"
import { 
  ShoppingCart, 
  ShieldCheck, 
  Star, 
  Sparkle,
  Truck,
  Briefcase,
  Crown,
  User
} from "@phosphor-icons/react"
import { useMemo } from "react"

// =============================================================================
// CVA VARIANTS
// =============================================================================

const cardVariants = cva(
  "block group relative overflow-hidden h-full min-w-0",
  {
    variants: {
      variant: {
        default: "",
        grid: "",
        ultimate: "",
        compact: "",
        marketplace: "",
        featured: "",
      },
      state: {
        default: "",
        promoted: "",
        sale: "",
      },
    },
    defaultVariants: {
      variant: "ultimate",
      state: "default",
    },
  }
)

// =============================================================================
// TYPES
// =============================================================================

export interface ProductCardProps extends VariantProps<typeof cardVariants> {
  // Required
  id: string
  title: string
  price: number
  image: string

  // Pricing
  originalPrice?: number | null
  listPrice?: number | null

  // Product info
  rating?: number
  reviews?: number
  condition?: string
  brand?: string
  categorySlug?: string
  tags?: string[]
  make?: string | null
  model?: string | null
  year?: string | number | null
  color?: string | null
  size?: string | null

  // Seller
  sellerName?: string
  sellerVerified?: boolean
  sellerRating?: number
  location?: string
  sellerId?: string | null
  sellerTier?: 'basic' | 'premium' | 'business' | string

  // Shipping
  freeShipping?: boolean

  // URLs
  slug?: string | null
  username?: string | null
  storeSlug?: string | null

  // Feature toggles
  showPills?: boolean
  showSeller?: boolean
  showQuickAdd?: boolean
  showSellerRow?: boolean // Backwards compat
  
  // Smart pills data
  attributes?: Record<string, string>

  // Context
  index?: number
  currentUserId?: string | null
  sellerAvatarUrl?: string | null
  inStock?: boolean
  
  // Deprecated but kept for props compatibility
  density?: string
  showCategory?: boolean
  showMetaLine?: boolean
  showTagChips?: boolean
  showHoverActions?: boolean
  showAddToCart?: boolean
  showWishlist?: boolean
  isBoosted?: boolean
  showRatingSeller?: boolean
  showCondition?: boolean
  showBidInfo?: boolean
  showFreeShipping?: boolean
  showDiscount?: boolean
  showBadge?: boolean
  showAttributePills?: boolean
}

// =============================================================================
// SMART META CONFIG
// =============================================================================

// Defines which attributes to combine into a single "meta string" (e.g. "2015 • Diesel • 150k km")
const CATEGORY_META_CONFIG: Record<string, string[]> = {
  cars: ["year", "fuel_type", "transmission", "mileage_km"],
  motorcycles: ["year", "engine_cc", "mileage_km"],
  electronics: ["brand", "model", "storage", "condition"],
  phones: ["brand", "storage", "color", "condition"],
  computers: ["brand", "processor", "ram", "storage"],
  fashion: ["brand", "size", "material", "condition"],
  shoes: ["brand", "size", "condition"],
  furniture: ["material", "color", "condition"],
  "real-estate": ["type", "area_sqm", "rooms"],
  default: ["brand", "condition"],
}

function formatMetaValue(key: string, value: string): string {
  if (!value) return ""
  switch (key) {
    case "mileage_km":
      return `${parseInt(value).toLocaleString()} km`
    case "area_sqm":
      return `${value} m²`
    case "engine_cc":
      return `${value}cc`
    case "storage":
      return value.toUpperCase()
    case "ram":
      return value.toUpperCase()
    default:
      // Capitalize first letter
      return value.charAt(0).toUpperCase() + value.slice(1)
  }
}

function getSmartMetaString(
  categorySlug: string | undefined,
  attributes: Record<string, string> | undefined,
  props: Partial<ProductCardProps>
): string | null {
  const attrs = attributes || {}
  const configKeys = CATEGORY_META_CONFIG[categorySlug || ""] || CATEGORY_META_CONFIG.default

  // Merge top-level props into attributes for unified lookup
  const merged: Record<string, string> = {
    ...attrs,
    condition: props.condition || attrs.condition || "",
    brand: props.brand || attrs.brand || "",
    year: props.year?.toString() || attrs.year || "",
    make: props.make || attrs.make || "",
    model: props.model || attrs.model || "",
    color: props.color || attrs.color || "",
    size: props.size || attrs.size || "",
  }

  const parts: string[] = []
  
  for (const key of configKeys) {
    if (parts.length >= 3) break // Max 3 items
    const value = merged[key]?.trim()
    if (value && !parts.includes(formatMetaValue(key, value))) {
      parts.push(formatMetaValue(key, value))
    }
  }

  return parts.length > 0 ? parts.join(" • ") : null
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ProductCard({
  id,
  title,
  price,
  image,
  originalPrice,
  listPrice,
  rating = 0,
  reviews = 0,
  condition,
  brand,
  categorySlug,
  sellerName,
  sellerVerified = false,
  sellerRating: _sellerRating,
  location,
  sellerId,
  sellerTier,
  freeShipping = false,
  slug,
  username,
  storeSlug,
  state,
  isBoosted,
  showSeller = true,
  showQuickAdd = true,
  showSellerRow,
  attributes,
  index = 0,
  currentUserId,
  inStock = true,
  variant = "ultimate",
  ...props // Capture other props for meta generation
}: ProductCardProps) {
  const { addToCart } = useCart()
  const t = useTranslations("Product")
  const tCart = useTranslations("Cart")
  const locale = useLocale()

  // Resolve values
  const resolvedOriginalPrice = originalPrice ?? listPrice ?? null
  const resolvedUsername = username ?? storeSlug ?? null
  const hasDiscount = resolvedOriginalPrice && resolvedOriginalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((resolvedOriginalPrice - price) / resolvedOriginalPrice) * 100)
    : 0

  const resolvedState = state || (isBoosted ? "promoted" : hasDiscount && discountPercent >= 10 ? "sale" : "default")
  const productUrl = resolvedUsername ? `/${resolvedUsername}/${slug || id}` : "#"
  const loadingStrategy = getImageLoadingStrategy(index, 4)

  // Generate Smart Meta String (e.g. "2015 • Diesel • 150k km")
  const metaString = useMemo(
    () => getSmartMetaString(categorySlug, attributes, { condition, brand, year: props.year, make: props.make, model: props.model, color: props.color, size: props.size }),
    [categorySlug, attributes, condition, brand, props.year, props.make, props.model, props.color, props.size]
  )

  // Note: "marketplace" variant now uses default card rendering
  // UltimateMarketplaceCard was consolidated into the main ProductCard component

  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  const formatPrice = (p: number) =>
    new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(p)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOwnProduct) {
      toast.error(locale === "bg" ? "Не можете да купите собствен продукт" : "Cannot buy your own product")
      return
    }
    if (!inStock) {
      toast.error(t("outOfStock"))
      return
    }

    addToCart({
      id,
      title,
      price,
      image,
      quantity: 1,
      slug: slug || undefined,
      username: username || undefined,
    })
    toast.success(tCart("itemAdded"))
  }

  // Determine if we should show the seller header
  const showSellerHeader = (showSeller || showSellerRow) && (sellerName || location)

  // Determine Seller Icon & Badge
  const getSellerBadge = () => {
    if (sellerTier === 'business') {
      return { icon: Briefcase, label: locale === 'bg' ? 'Бизнес' : 'Business', color: 'text-primary bg-primary/10 border-primary/20' }
    }
    if (sellerTier === 'premium') {
      return { icon: Crown, label: 'Pro', color: 'text-primary bg-primary/10 border-primary/20' }
    }
    // Default / Basic / Personal
    return { icon: User, label: null, color: 'text-muted-foreground bg-background border-border/60' }
  }

  const sellerBadge = getSellerBadge()
  const SellerIcon = sellerBadge.icon

  const formatSellerInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <Link href={productUrl} className={cn("block group", cardVariants({ variant, state: resolvedState }))}>
      <div className={cn(
        "overflow-hidden flex flex-col group relative min-w-0",
        resolvedState === "promoted" && "ring-1 ring-primary/20 rounded-md"
      )}>
        {/* Seller-first header + wishlist in header */}
        <div className={cn("flex items-center justify-between gap-1.5", "px-1 py-1.5")}>
          <div className="flex items-center gap-1.5 min-w-0">
            {showSellerHeader ? (
              <>
                <Avatar className="h-7 w-7 border-0">
                  <AvatarImage src={props.sellerAvatarUrl || undefined} alt={sellerName || "Seller"} />
                  <AvatarFallback className="text-[9px] bg-muted">
                    {formatSellerInitials(sellerName || (locale === "bg" ? "Продавач" : "Seller"))}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-2xs font-semibold text-foreground truncate">{sellerName}</span>
                    {sellerVerified && <ShieldCheck size={12} weight="fill" className="text-primary shrink-0" />}
                    {sellerBadge.label && (
                      <span className={cn(
                        "text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-wider",
                        sellerBadge.color
                      )}>
                        {sellerBadge.label}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0">
                <div className={cn(
                  "size-7 rounded-full flex items-center justify-center overflow-hidden shrink-0",
                  sellerBadge.color
                )}>
                  <SellerIcon size={12} weight="fill" />
                </div>
                <span className="text-2xs font-semibold text-foreground truncate">
                  {locale === "bg" ? "Обява" : "Listing"}
                </span>
              </div>
            )}
          </div>

          <div
            className="shrink-0"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <WishlistButton product={{ id, title, price, image }} />
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full bg-muted overflow-hidden rounded-md">
          <AspectRatio ratio={1}>
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              placeholder="blur"
              blurDataURL={productBlurDataURL()}
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
              loading={loadingStrategy.loading}
              priority={loadingStrategy.priority}
            />

            {/* Promoted + discount badges */}
            <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1">
              {resolvedState === "promoted" && (
                <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur-sm">
                  <Sparkle size={10} weight="fill" className="text-primary" />
                  <span className="text-2xs font-semibold">{locale === "bg" ? "Промо" : "Promoted"}</span>
                </Badge>
              )}
              {hasDiscount && discountPercent >= 10 && (
                <Badge className="bg-deal text-white border-0">
                  <span className="text-2xs font-semibold">-{discountPercent}%</span>
                </Badge>
              )}
            </div>

            {/* Desktop hover quick add */}
            {showQuickAdd && (
              <div
                className={cn(
                  "absolute inset-x-2 bottom-2 z-10 hidden md:flex",
                  "opacity-0 translate-y-1 transition-all",
                  "group-hover:opacity-100 group-hover:translate-y-0"
                )}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <button
                  onClick={handleAddToCart}
                  disabled={isOwnProduct || !inStock}
                  className={cn(
                    "h-8 w-full rounded-md border text-2xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5",
                    "bg-foreground text-background border-foreground hover:bg-foreground/90",
                    (isOwnProduct || !inStock) && "opacity-60 cursor-not-allowed"
                  )}
                  aria-label={!inStock ? (locale === "bg" ? "Изчерпано" : "Out of stock") : (locale === "bg" ? "Добави" : "Add to cart")}
                >
                  <ShoppingCart size={12} weight="bold" />
                  {!inStock ? (locale === "bg" ? "Изчерпано" : "Out of stock") : (locale === "bg" ? "Добави" : "Add to cart")}
                </button>
              </div>
            )}
          </AspectRatio>
        </div>

        {/* Content */}
        <div className="min-w-0 p-1.5 space-y-1">
          <h3 className="text-foreground group-hover:underline decoration-muted-foreground/40 underline-offset-2 leading-snug text-[13px] font-medium line-clamp-2">
            {title}
          </h3>

          {metaString && (
            <p className="text-2xs text-muted-foreground truncate">
              {metaString}
            </p>
          )}

          {(rating > 0 || freeShipping) && (
            <div className="flex items-center gap-1 text-2xs text-muted-foreground">
              {rating > 0 ? (
                <span className="inline-flex items-center gap-0.5">
                  <Star size={10} weight="fill" className="text-muted-foreground" />
                  <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                  {reviews > 0 && <span>({reviews})</span>}
                </span>
              ) : null}
              {freeShipping ? (
                <span className="inline-flex items-center gap-0.5">
                  <Truck size={10} weight="fill" className="text-muted-foreground" />
                  <span>{locale === "bg" ? "Безплатна" : "Free"}</span>
                </span>
              ) : null}
            </div>
          )}

          {/* Price row */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5">
            <span className={cn("text-[15px] font-bold", hasDiscount ? "text-deal" : "text-foreground")}>
              {formatPrice(price)}
              {hasDiscount && resolvedOriginalPrice && (
                <span className="ml-1 text-2xs font-normal text-muted-foreground line-through">
                  {formatPrice(resolvedOriginalPrice)}
                </span>
              )}
            </span>

            {/* Mobile action (desktop uses hover overlay) */}
            {showQuickAdd && (
              <div
                className="flex md:hidden"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <button
                  onClick={handleAddToCart}
                  disabled={isOwnProduct || !inStock}
                  className={cn(
                    "size-7 rounded-full border text-xs font-semibold transition-colors inline-flex items-center justify-center",
                    "bg-background text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary",
                    (isOwnProduct || !inStock) && "opacity-60 cursor-not-allowed"
                  )}
                  aria-label={!inStock ? (locale === "bg" ? "Изчерпано" : "Out of stock") : (locale === "bg" ? "Добави" : "Add")}
                >
                  <ShoppingCart size={14} weight="bold" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
