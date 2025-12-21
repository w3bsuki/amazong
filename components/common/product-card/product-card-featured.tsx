"use client"

import Image from "next/image"
import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BoringAvatar from "boring-avatars"
import { WishlistButton } from "@/components/common/wishlist/wishlist-button"
import { ProductCardMenu } from "@/components/product-card-menu"
import { useCart } from "@/components/providers/cart-context"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  ShoppingCart, 
  ShieldCheck, 
  Star, 
  Tag, 
  Sparkle,
  Truck
} from "@phosphor-icons/react"
import { useMemo } from "react"

// =============================================================================
// CONSTANTS
// =============================================================================

const AVATAR_COLORS = ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]

// =============================================================================
// CVA VARIANTS
// =============================================================================

const cardVariants = cva(
  "block group relative bg-card border rounded-xl overflow-hidden h-full transition-all",
  {
    variants: {
      state: {
        default: "border-border hover:shadow-md",
        promoted: "border-primary/30 ring-1 ring-primary/20 hover:shadow-lg",
        sale: "border-destructive/20 hover:shadow-md",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

// =============================================================================
// TYPES
// =============================================================================

export interface ProductCardFeaturedProps extends VariantProps<typeof cardVariants> {
  // Required
  id: string
  title: string
  price: number
  image: string

  // Pricing
  originalPrice?: number | null

  // Product info
  condition?: string
  brand?: string
  categorySlug?: string

  // Seller (full)
  sellerId?: string
  sellerName?: string
  sellerAvatarUrl?: string | null
  sellerVerified?: boolean
  sellerTier?: "basic" | "premium" | "business"
  sellerRating?: number

  // Shipping
  freeShipping?: boolean

  // URLs
  slug?: string | null
  username?: string | null

  // Feature toggles
  showPills?: boolean

  // Smart pills data
  attributes?: Record<string, string>

  // Context
  index?: number
  currentUserId?: string | null
  inStock?: boolean
}

// =============================================================================
// SMART PILLS (reuse same logic)
// =============================================================================

const CATEGORY_PILL_PRIORITY: Record<string, string[]> = {
  cars: ["year", "mileage_km", "fuel_type"],
  motorcycles: ["year", "mileage_km", "engine_cc"],
  electronics: ["brand", "storage", "condition"],
  phones: ["brand", "storage", "condition"],
  fashion: ["size", "brand", "condition"],
  default: ["condition", "brand"],
}

function formatPillValue(key: string, value: string): string {
  if (!value) return ""
  switch (key) {
    case "mileage_km":
      return `${parseInt(value).toLocaleString()} km`
    case "area_sqm":
      return `${value} m²`
    default:
      return value.length > 14 ? `${value.slice(0, 14)}…` : value
  }
}

function getSmartPills(
  categorySlug: string | undefined,
  attributes: Record<string, string> | undefined,
  condition: string | undefined,
  brand: string | undefined,
  maxPills: number = 2
): Array<{ key: string; label: string }> {
  const pills: Array<{ key: string; label: string }> = []
  const attrs = attributes || {}
  const priorityKeys = CATEGORY_PILL_PRIORITY[categorySlug || ""] || CATEGORY_PILL_PRIORITY.default

  const merged: Record<string, string> = {
    ...attrs,
    condition: condition || attrs.condition || "",
    brand: brand || attrs.brand || "",
  }

  for (const key of priorityKeys) {
    if (pills.length >= maxPills) break
    const value = merged[key]?.trim()
    if (value && !pills.some((p) => p.label.toLowerCase() === value.toLowerCase())) {
      pills.push({ key, label: formatPillValue(key, value) })
    }
  }

  return pills
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ProductCardFeatured({
  // Required
  id,
  title,
  price,
  image,

  // Pricing
  originalPrice,

  // Product info
  condition,
  brand,
  categorySlug,

  // Seller
  sellerId,
  sellerName,
  sellerAvatarUrl,
  sellerVerified = false,
  sellerTier = "basic",
  sellerRating,

  // Shipping
  freeShipping = false,

  // URLs
  slug,
  username,

  // CVA
  state,

  // Feature toggles
  showPills = true,

  // Smart pills
  attributes,

  // Context
  index = 0,
  currentUserId,
  inStock = true,
}: ProductCardFeaturedProps) {
  const { addToCart } = useCart()
  const t = useTranslations("Product")
  const tCart = useTranslations("Cart")
  const locale = useLocale()

  // Derived values
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const resolvedState = state || "default"
  const productUrl = username && slug ? `/${username}/${slug}` : `/product/${slug || id}`
  const displayName = sellerName || username || "Seller"
  const loadingStrategy = getImageLoadingStrategy(index, 4)

  const smartPills = useMemo(
    () => (showPills ? getSmartPills(categorySlug, attributes, condition, brand) : []),
    [showPills, categorySlug, attributes, condition, brand]
  )

  const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

  const formatPrice = (p: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: locale === "bg" ? "BGN" : "EUR",
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

  // Seller tier labels
  const tierLabel = sellerTier === "business"
    ? (locale === "bg" ? "Бизнес продавач" : "Pro Seller")
    : sellerTier === "premium"
      ? (locale === "bg" ? "Топ продавач" : "Top Rated")
      : (locale === "bg" ? "Продавач" : "Seller")

  return (
    <Link href={productUrl} className={cn(cardVariants({ state: resolvedState }))}>
      {/* SELLER HEADER */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b bg-muted/30">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-8 w-8 border shrink-0">
            <AvatarImage src={sellerAvatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-transparent p-0">
              <BoringAvatar size={32} name={sellerId || displayName} variant="beam" colors={AVATAR_COLORS} />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">
                {displayName}
              </span>
              {sellerVerified && (
                <ShieldCheck size={14} weight="fill" className="text-primary shrink-0" />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">{tierLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {sellerRating && sellerRating > 0 && (
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground mr-1">
              <Star size={12} weight="fill" className="text-amber-500" />
              {sellerRating.toFixed(1)}
            </span>
          )}
          <div onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
            <WishlistButton product={{ id, title, price, image }} variant="icon" />
          </div>
          <div onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
            <ProductCardMenu productUrl={productUrl} title={title} />
          </div>
        </div>
      </div>

      {/* IMAGE SECTION */}
      <div className="relative bg-muted">
        <AspectRatio ratio={1}>
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            placeholder="blur"
            blurDataURL={productBlurDataURL()}
            loading={loadingStrategy.loading}
            priority={loadingStrategy.priority}
          />
        </AspectRatio>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {resolvedState === "promoted" && (
            <span className="inline-flex items-center gap-1 rounded bg-primary/90 text-primary-foreground px-1.5 py-0.5 text-[10px] font-semibold shadow-sm">
              <Sparkle size={10} weight="fill" />
              {locale === "bg" ? "Промо" : "Promoted"}
            </span>
          )}
          {hasDiscount && discountPercent >= 10 && (
            <span className="rounded bg-destructive text-destructive-foreground px-1.5 py-0.5 text-[10px] font-bold shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Desktop Hover Quick Add */}
        <div
          className="absolute inset-x-2 bottom-2 z-10 hidden md:block opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        >
          <button
            onClick={handleAddToCart}
            disabled={isOwnProduct || !inStock}
            className={cn(
              "w-full h-9 rounded-md text-xs font-semibold transition-colors",
              "bg-foreground text-background hover:bg-foreground/90",
              "flex items-center justify-center gap-1.5 shadow-lg",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <ShoppingCart size={14} weight="bold" />
            {!inStock ? (locale === "bg" ? "Изчерпано" : "Sold") : (locale === "bg" ? "Добави" : "Add to Cart")}
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-3 space-y-2">
        {/* Price Row */}
        <div className="flex items-baseline gap-2">
          <span className={cn(
            "text-lg font-bold",
            hasDiscount ? "text-destructive" : "text-foreground"
          )}>
            {formatPrice(price)}
          </span>
          {hasDiscount && originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Smart Pills */}
        {smartPills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {smartPills.map((pill) => (
              <span
                key={pill.key}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted/60 border text-[10px] font-medium text-muted-foreground"
              >
                <Tag size={10} className="opacity-60" />
                {pill.label}
              </span>
            ))}
          </div>
        )}

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
          {freeShipping && (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <Truck size={12} weight="bold" />
              {locale === "bg" ? "Безплатна доставка" : "Free shipping"}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={12} className="text-muted-foreground" />
            {locale === "bg" ? "Защита на купувача" : "Buyer protection"}
          </span>
        </div>
      </div>
    </Link>
  )
}
