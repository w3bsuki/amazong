"use client"

import * as React from "react"
import Image from "next/image"
import { Link, useRouter } from "@/i18n/routing"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import BoringAvatar from "boring-avatars"
import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { Badge } from "@/components/ui/badge"
import { FollowSellerButton } from "@/components/seller/follow-seller-button"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Heart,
  ShoppingCart,
  Plus,
  ShieldCheck,
  Star,
  Sparkle,
  Truck,
  DotsThree,
} from "@phosphor-icons/react"

// =============================================================================
// CONSTANTS
// =============================================================================

const AVATAR_COLORS = ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]

// =============================================================================
// CVA VARIANTS - Modern Minimal (Swiss Design Principles)
// =============================================================================

/**
 * ProductCard Variants
 * ---------------------
 * Modern Minimal aesthetic - flat surfaces, subtle borders, no gradients.
 * Uses Tailwind v4 semantic tokens (bg-card, text-foreground, etc.)
 */
const productCardVariants = cva(
  // Base: cursor, block, relative, full height, overflow hidden for clean edges
  // Removed all transitions for "super fast" UI
  "group relative block h-full min-w-0 cursor-pointer overflow-hidden",
  {
    variants: {
      /**
       * Visual variant:
       * - default: Clean flat card with subtle border, no background
       * - featured: Card surface with seller header (promoted/business)
       */
      variant: {
        default: "",
        featured: "",
      },
      /**
       * State modifiers:
       * - default: Standard appearance
       * - promoted: Primary accent (Ad/Promoted)
       * - sale: Sale highlight
       */
      state: {
        default: "",
        promoted: "",
        sale: "",
      },
    },
    compoundVariants: [
      // Default variant states - flat, NO SHADOW on hover as requested
      {
        variant: "default",
        state: "default",
        className: "",
      },
      {
        variant: "default",
        state: "promoted",
        className: "",
      },
      {
        variant: "default",
        state: "sale",
        className: "",
      },
      // Featured variant states - card surface, NO SHADOW on hover as requested
      {
        variant: "featured",
        state: "default",
        className: "",
      },
      {
        variant: "featured",
        state: "promoted",
        className: "",
      },
      {
        variant: "featured",
        state: "sale",
        className: "border-destructive/10",
      },
    ],
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
)

// =============================================================================
// TYPES
// =============================================================================

interface ProductCardProps extends VariantProps<typeof productCardVariants> {
  // Required
  id: string
  title: string
  price: number
  image: string

  // Pricing
  originalPrice?: number | null
  /** @deprecated Use originalPrice */
  listPrice?: number | null

  // Sale semantics (truth)
  isOnSale?: boolean
  salePercent?: number
  saleEndDate?: string | null

  // Product info
  rating?: number
  reviews?: number
  condition?: string
  brand?: string
  categorySlug?: string
  /** Root (L0) category slug (e.g. fashion, electronics, automotive) */
  categoryRootSlug?: string
  /** Category path from L0 -> leaf (includes BG label when available) */
  categoryPath?: Array<{ slug: string; name: string; nameBg?: string | null; icon?: string | null }>
  tags?: string[]
  make?: string | null
  model?: string | null
  year?: string | number | null
  color?: string | null
  size?: string | null

  // Seller
  sellerId?: string | null
  sellerName?: string
  sellerAvatarUrl?: string | null
  sellerVerified?: boolean
  sellerRating?: number
  sellerTier?: "basic" | "premium" | "business"
  location?: string

  // Social
  initialIsFollowingSeller?: boolean

  // Shipping
  freeShipping?: boolean

  // URLs
  slug?: string | null
  username?: string | null
  /** @deprecated Use username */
  storeSlug?: string | null

  // Feature toggles
  showQuickAdd?: boolean
  showWishlist?: boolean
  showRating?: boolean
  showPills?: boolean
  /** @deprecated Use state="promoted" */
  isBoosted?: boolean

  // Smart pills data
  attributes?: Record<string, string>

  // Context
  index?: number
  currentUserId?: string | null
  inStock?: boolean
  className?: string
}

function getProductCardImageSrc(src: string): string {
  if (!src) return PLACEHOLDER_IMAGE_PATH
  const isRemote = /^https?:\/\//i.test(src)

  const normalized = normalizeImageUrl(src)
  if (!normalized) return PLACEHOLDER_IMAGE_PATH
  if (normalized === PLACEHOLDER_IMAGE_PATH) return normalized

  // In Playwright E2E runs we avoid remote network requests entirely.
  if (process.env.NEXT_PUBLIC_E2E === "true" && isRemote) {
    return PLACEHOLDER_IMAGE_PATH
  }

  return normalized
}

// =============================================================================
// SMART PILLS HELPERS
// =============================================================================

const CATEGORY_PILL_PRIORITY: Record<string, string[]> = {
  automotive: ["year", "mileage_km", "fuel_type", "make", "model"],
  electronics: ["brand", "model", "storage", "condition"],
  fashion: ["size", "brand", "condition"],
  // Back-compat / optional granular slugs
  cars: ["year", "mileage_km", "fuel_type"],
  motorcycles: ["year", "mileage_km", "engine_cc"],
  phones: ["brand", "storage", "condition"],
  default: ["condition", "brand"],
}

function pickCategoryBadgeNode(
  path: NonNullable<ProductCardProps["categoryPath"]> | undefined
): { slug: string; name: string; nameBg?: string | null; icon?: string | null } | undefined {
  if (!path || path.length === 0) return undefined
  if (path.length === 1) return path[0]

  const l0 = path[0]
  const l1 = path[1]
  const l2 = path[2]

  // Fashion: L1 is usually just gender (Men's/Women's), so L2 is more useful.
  if (l0.slug === "fashion") {
    const genderL1 = new Set(["fashion-mens", "fashion-womens", "fashion-kids", "fashion-unisex"])
    if (l1 && genderL1.has(l1.slug) && l2) return l2
    return l1 || l0
  }

  // Automotive: if L1 is a very broad grouping (Vehicles / Electric Vehicles), L2 is usually the useful type.
  if (l0.slug === "automotive") {
    const broadL1 = new Set(["vehicles", "electric-vehicles"])
    if (l1 && broadL1.has(l1.slug) && l2) return l2
    return l1 || l0
  }

  // Default: show L1 when available.
  return l1 || l0
}

function getCategoryBadgeLabel(
  path: ProductCardProps["categoryPath"],
  locale: string
): string | null {
  const node = pickCategoryBadgeNode(path)
  if (!node) return null

  const raw = locale === "bg" ? (node.nameBg || node.name) : node.name
  const clean = raw.replace(/^\s*\[HIDDEN\]\s*/i, "").trim()
  if (!clean) return null
  return clean.length > 18 ? `${clean.slice(0, 18)}…` : clean
}

function formatPillValue(key: string, value: string): string {
  if (!value) return ""
  switch (key) {
    case "mileage_km":
      return `${Number.parseInt(value).toLocaleString()} km`
    case "area_sqm":
      return `${value} m²`
    case "condition":
      // Return raw value - will be translated at render time
      return value
    default:
      return value.length > 14 ? `${value.slice(0, 14)}…` : value
  }
}

// Translate condition value using next-intl
function translateCondition(value: string, t: (key: string) => string): string {
  const raw = value?.trim()
  if (!raw) return "—"
  const lowered = raw.toLowerCase().replace(/[_\s]+/g, "-")
  
  const conditionMap: Record<string, string> = {
    "new": "conditionNew",
    "new-with-tags": "conditionNewWithTags",
    "used": "conditionUsed",
    "used-excellent": "conditionUsedExcellent",
    "used-good": "conditionUsedGood",
    "used-fair": "conditionUsedFair",
    "refurbished": "conditionRefurbished",
  }
  
  const translationKey = conditionMap[lowered]
  if (translationKey) return t(translationKey)
  
  // Fallback: capitalize words for unknown conditions
  return raw.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
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
  const priorityKeys =
    CATEGORY_PILL_PRIORITY[categorySlug || ""] || CATEGORY_PILL_PRIORITY.default

  const merged: Record<string, string> = {
    ...attrs,
    condition: condition || attrs.condition || "",
    brand: brand || attrs.brand || "",
  }

  for (const key of priorityKeys) {
    if (pills.length >= maxPills) break
    const value = merged[key]?.trim()
    if (
      value &&
      !pills.some((p) => p.label.toLowerCase() === value.toLowerCase())
    ) {
      pills.push({ key, label: formatPillValue(key, value) })
    }
  }

  // Ensure we still show useful pills across all categories.
  // Some categories prioritize attributes (e.g. year/mileage) and might omit condition/brand.
  const addFallback = (key: "condition" | "brand") => {
    if (pills.length >= maxPills) return
    const value = merged[key]?.trim()
    if (!value) return
    const label = formatPillValue(key, value)
    if (!label) return
    if (pills.some((p) => p.label.toLowerCase() === label.toLowerCase())) return
    pills.push({ key, label })
  }

  addFallback("condition")
  addFallback("brand")

  return pills
}

// =============================================================================
// PRODUCT CARD COMPONENT
// =============================================================================

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      // Required
      id,
      title,
      price,
      image,

      // Pricing
      originalPrice,
      listPrice,
      isOnSale,
      salePercent,
      saleEndDate,

      // Product info
      rating = 0,
      reviews = 0,
      brand,
      condition,
      categorySlug,
      categoryRootSlug,
      categoryPath,
      location,
      sellerId,

      // Seller
      sellerName,
      sellerAvatarUrl,
      sellerVerified = false,
      sellerTier = "basic",
      initialIsFollowingSeller = false,

      // Shipping
      freeShipping = false,

      // URLs
      slug,
      username,
      storeSlug,

      // CVA variants
      variant = "default",
      state,
      isBoosted,

      // Feature toggles
      showQuickAdd = true,
      showWishlist = true,
      showRating = true,
      showPills = true,

      // Smart pills
      attributes,

      // Context
      index = 0,
      currentUserId,
      inStock = true,
      className,
    },
    ref
  ) => {
    const router = useRouter()
    const { addToCart, items: cartItems } = useCart()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const t = useTranslations("Product")
    const tCart = useTranslations("Cart")
    const locale = useLocale()

    const [isWishlistPending, setIsWishlistPending] = React.useState(false)

    // Resolve deprecated props
    const resolvedOriginalPrice = originalPrice ?? listPrice ?? null
    const resolvedUsername = username ?? storeSlug ?? null

    // Derived values
    const hasDiscount = resolvedOriginalPrice && resolvedOriginalPrice > price
    const priceDerivedDiscountPercent = hasDiscount
      ? Math.round(
          ((resolvedOriginalPrice - price) / resolvedOriginalPrice) * 100
        )
      : 0

    const resolvedSalePercent =
      typeof salePercent === "number" && Number.isFinite(salePercent)
        ? salePercent
        : priceDerivedDiscountPercent

    const saleEndOk = (() => {
      if (!saleEndDate) return true
      const d = new Date(saleEndDate)
      if (Number.isNaN(d.getTime())) return true
      return d.getTime() > Date.now()
    })()

    const saleByTruthSemantics = isOnSale === true && resolvedSalePercent > 0 && saleEndOk

    // Auto-detect state
    const resolvedState =
      state ||
      (isBoosted
        ? "promoted"
        : saleByTruthSemantics || (isOnSale == null && hasDiscount && priceDerivedDiscountPercent >= 10)
          ? "sale"
          : "default")

    // URLs
    const productUrl = resolvedUsername
      ? `/${resolvedUsername}/${slug || id}`
      : "#"
    const displayName = sellerName || resolvedUsername || "Seller"

    const inWishlist = isInWishlist(id)
    const inCart = React.useMemo(() => cartItems.some((item) => item.id === id), [cartItems, id])

    const handleOpenProduct = React.useCallback(() => {
      router.push(productUrl)
    }, [router, productUrl])

    // Loading strategy
    const loadingStrategy = getImageLoadingStrategy(index, 4)

    const imageSrc = React.useMemo(() => getProductCardImageSrc(image), [image])

    // Smart pills
    const smartPills = React.useMemo(
      () =>
        showPills
          ? getSmartPills(categoryRootSlug || categorySlug, attributes, condition, brand)
          : [],
      [showPills, categoryRootSlug, categorySlug, attributes, condition, brand]
    )

    const conditionPill = smartPills.find((p) => p.key === "condition")
    const nonConditionPills = smartPills.filter((p) => p.key !== "condition")

    const categoryBadge = React.useMemo(
      () => getCategoryBadgeLabel(categoryPath, locale),
      [categoryPath, locale]
    )

    const showConditionBadge = !!(
      conditionPill &&
      conditionPill.label.trim().toLowerCase() !== "new"
    )

    const displayNonConditionPills = categoryBadge ? nonConditionPills.slice(0, 1) : nonConditionPills

    // Check if own product
    const isOwnProduct = !!(currentUserId && sellerId && currentUserId === sellerId)

    // Price formatting - EUR is base currency (Bulgaria joined Eurozone)
    const formatPrice = (p: number) =>
      new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(p)

    // Handlers
    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (isOwnProduct) {
        toast.error(t("cannotBuyOwnProduct"))
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

    const handleWishlist = async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (isWishlistPending) return

      setIsWishlistPending(true)
      try {
        await toggleWishlist({
          id,
          title,
          price,
          image,
        })
      } finally {
        setIsWishlistPending(false)
      }
    }

    // Tier label for featured variant
    const tierLabel =
      sellerTier === "business"
        ? t("businessSeller")
        : sellerTier === "premium"
          ? t("topRated")
          : t("seller")

    return (
      <div
        ref={ref}
        className={cn(productCardVariants({ variant, state: resolvedState }), className)}
        onClick={handleOpenProduct}
      >
        {/* Overlay link for full-card navigation.
            IMPORTANT: Do not nest interactive controls inside an anchor. */}
        <Link
          href={productUrl}
          className="absolute inset-0 z-1"
          aria-label={t("openProduct", { title })}
        >
          <span className="sr-only">{title}</span>
        </Link>

        {/* ═══════════════════════════════════════════════════════════════════
            SELLER HEADER - Featured variant only (promoted/business sellers)
            Swiss Design: Clean horizontal layout, minimal visual weight
        ═══════════════════════════════════════════════════════════════════ */}
        {variant === "featured" && (
          <div className="relative z-10 flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar className="size-7 shrink-0 border border-border">
                <AvatarImage src={sellerAvatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="bg-transparent p-0">
                  <BoringAvatar
                    size={28}
                    name={sellerId || displayName}
                    variant="beam"
                    colors={AVATAR_COLORS}
                  />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1">
                  <span className="max-w-[100px] truncate text-xs font-medium text-foreground">
                    {displayName}
                  </span>
                  {sellerVerified && (
                    <ShieldCheck size={12} weight="fill" className="shrink-0 text-cta-trust-blue" />
                  )}
                </div>
                <span className="text-tiny text-muted-foreground">{tierLabel}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!!sellerId && !isOwnProduct && (
                <div
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <FollowSellerButton
                    sellerId={sellerId}
                    initialIsFollowing={initialIsFollowingSeller}
                    locale={locale}
                    showLabel={false}
                    size="icon"
                    variant="ghost"
                    className="size-7 rounded-full"
                  />
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 rounded-full"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <DotsThree size={16} weight="bold" />
                <span className="sr-only">More options</span>
              </Button>
            </div>
          </div>
        )}

        {/* Compact Seller Info for C2C feel - Default variant */}
        {variant === "default" && (sellerName || resolvedUsername) && (
          <div className="relative z-10 flex items-center gap-1.5 px-1.5 py-1.5">
            <Avatar className="size-7 shrink-0 border border-border/50">
              <AvatarImage src={sellerAvatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-transparent p-0">
                <BoringAvatar
                  size={28}
                  name={sellerId || displayName}
                  variant="beam"
                  colors={AVATAR_COLORS}
                />
              </AvatarFallback>
            </Avatar>
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <span className="truncate text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  {displayName}
                </span>
              </HoverCardTrigger>
              <HoverCardContent align="start" side="top" className="w-64 p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="size-9 shrink-0 border border-border">
                    <AvatarImage src={sellerAvatarUrl || undefined} alt={displayName} />
                    <AvatarFallback className="bg-transparent p-0">
                      <BoringAvatar
                        size={36}
                        name={sellerId || displayName}
                        variant="beam"
                        colors={AVATAR_COLORS}
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-1">
                      <span className="truncate text-sm font-medium text-foreground">{displayName}</span>
                      {sellerVerified && (
                        <ShieldCheck size={12} weight="fill" className="shrink-0 text-cta-trust-blue" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{tierLabel}</div>
                  </div>
                </div>

                {resolvedUsername && (
                  <Link
                    href={`/${resolvedUsername}`}
                    className="mt-2 inline-flex text-xs font-medium text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("viewProfile")}
                  </Link>
                )}
              </HoverCardContent>
            </HoverCard>
            {sellerVerified && (
              <ShieldCheck size={10} weight="fill" className="shrink-0 text-cta-trust-blue" />
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            IMAGE SECTION - Square aspect ratio for maximum image visibility
            Standardized: 1:1 ratio like eBay/Vinted for consistent grid alignment
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            variant === "default" && "rounded-2xl"
          )}
        >
          {/* Square aspect ratio - industry standard for product grids */}
          <AspectRatio ratio={1}>
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="size-full object-cover transition-opacity duration-200 group-hover:opacity-90"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL={productBlurDataURL()}
              loading={loadingStrategy.loading}
              priority={loadingStrategy.priority}
            />
          </AspectRatio>

          {/* Action Buttons - Bottom Row (prevents badge crowding) */}
          {(showWishlist || showQuickAdd) && (
            <div
              className={cn(
                "absolute inset-x-1.5 bottom-1.5 z-10 flex items-end justify-between gap-2",
                // Mobile: always visible.
                // Desktop: only hide when *not* in a saved/added state.
                "opacity-100",
                !(inWishlist || inCart) &&
                  "md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100",
                "transition-opacity duration-150",
                // Prevent invisible buttons from stealing clicks on desktop.
                !(inWishlist || inCart) &&
                  "md:pointer-events-none md:group-hover:pointer-events-auto md:group-focus-within:pointer-events-auto"
              )}
            >
              {showWishlist ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-touch w-touch rounded-full p-0",
                    "bg-transparent hover:bg-transparent"
                  )}
                  onClick={handleWishlist}
                >
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full",
                      "bg-background/90 border border-border/50",
                      "transition-colors",
                      inWishlist ? "bg-cta-trust-blue/10" : "hover:bg-background"
                    )}
                  >
                    {isWishlistPending ? (
                      <Spinner className="size-4" />
                    ) : (
                      <Heart
                        size={16}
                        weight={inWishlist ? "fill" : "regular"}
                        className={inWishlist ? "text-cta-trust-blue" : "text-muted-foreground"}
                      />
                    )}
                  </span>
                  <span className="sr-only">
                    {inWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
                  </span>
                </Button>
              ) : (
                <div className="h-touch w-touch" />
              )}

              {showQuickAdd && (
                <Button
                  variant={inCart ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-touch w-touch rounded-full p-0",
                    "bg-transparent hover:bg-transparent",
                    "border-0",
                    ""
                  )}
                  onClick={handleAddToCart}
                  disabled={isOwnProduct || !inStock}
                >
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full",
                      "transition-colors",
                      !inCart && [
                        "bg-background/90 border border-border/50",
                        "group-hover:bg-cta-trust-blue group-hover:text-cta-trust-blue-text"
                      ],
                      inCart && "bg-cta-trust-blue text-cta-trust-blue-text"
                    )}
                  >
                    {inCart ? (
                      <ShoppingCart size={14} weight="fill" />
                    ) : (
                      <Plus size={14} weight="bold" />
                    )}
                  </span>
                  <span className="sr-only">{inCart ? t("inCart") : t("addToCart")}</span>
                </Button>
              )}
            </div>
          )}

          {/* Badges - Top Left (Flat, no shadows per Swiss design) */}
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {resolvedState === "promoted" && (
              <Badge className="inline-flex items-center gap-0.5 rounded-md bg-cta-trust-blue px-1.5 py-0.5 text-tiny font-semibold text-cta-trust-blue-text">
                <Sparkle size={10} weight="fill" />
                {t("promoted")}
              </Badge>
            )}
            {(saleByTruthSemantics || (isOnSale == null && hasDiscount && priceDerivedDiscountPercent >= 5)) && (
              <span className="rounded-md bg-destructive px-1.5 py-0.5 text-tiny font-bold text-destructive-foreground">
                -{Math.max(0, Math.round(resolvedSalePercent))}%
              </span>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CONTENT SECTION - Ultra-tight spacing & Refined Typography
            Swiss Design: Clear hierarchy, optimized for desktop scanning
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "relative z-10 flex flex-col gap-0.5",
            variant === "featured" ? "p-2" : "p-1.5"
          )}
        >
          {/* Compact meta badges: Category (smart level) + Condition (only if not 'new') */}
          {(categoryBadge || showConditionBadge) && (
            <div className="flex flex-wrap items-center gap-1">
              {categoryBadge && (
                <Badge
                  variant="secondary"
                  className="w-fit max-w-full truncate px-2 py-0.5 text-[10px] font-semibold tracking-normal normal-case"
                >
                  {categoryBadge}
                </Badge>
              )}
              {showConditionBadge && (
                <Badge
                  variant="secondary"
                  className="w-fit px-2 py-0.5 text-[10px] font-semibold tracking-normal normal-case"
                >
                  {translateCondition(conditionPill!.label, t)}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h3
            className={cn(
              "text-sm font-medium leading-tight text-foreground/90",
              variant === "featured" ? "line-clamp-2" : "line-clamp-1"
            )}
          >
            {title}
          </h3>

          {/* Quick pills (excluding condition) */}
          {displayNonConditionPills.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {displayNonConditionPills.map((pill) => (
                <span
                  key={pill.key}
                  className="rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-tiny font-medium leading-none text-muted-foreground"
                >
                  {pill.label}
                </span>
              ))}
            </div>
          )}

          {/* Price Row - Bold, prominent */}
          <div className="flex items-baseline gap-1 pt-0.5">
            <span
              className={cn(
                "text-base font-bold tracking-tight",
                (saleByTruthSemantics || hasDiscount) ? "text-destructive" : "text-foreground"
              )}
            >
              {formatPrice(price)}
            </span>
            {hasDiscount && resolvedOriginalPrice && (
              <span className="text-2xs text-muted-foreground line-through decoration-muted-foreground/30">
                {formatPrice(resolvedOriginalPrice)}
              </span>
            )}
          </div>

          {/* Rating Row - Compact stars */}
          {showRating && rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={10}
                    weight="fill"
                    className={cn(
                      i <= Math.floor(rating)
                        ? "text-rating"
                        : "text-rating-empty"
                    )}
                  />
                ))}
              </div>
              {reviews > 0 && (
                <span className="text-2xs text-muted-foreground">({reviews.toLocaleString()})</span>
              )}
            </div>
          )}

          {/* Free Shipping - Trust signal */}
          {freeShipping && (
            <p className="inline-flex items-center gap-1 pt-0.5 text-2xs font-medium text-success">
              <Truck size={12} weight="bold" />
              {t("freeShipping")}
            </p>
          )}

          {/* Location - Marketplace essential */}
          {location && (
            <p className="truncate text-2xs text-muted-foreground pt-0.5">{location}</p>
          )}
        </div>
      </div>
    )
  }
)

ProductCard.displayName = "ProductCard"

// =============================================================================
// PRODUCT GRID - Standardized CSS Grid (eBay/Amazon reference)
// =============================================================================

interface ProductGridProps {
  children: React.ReactNode
  /**
   * Grid density preset
   * - compact: More items visible (mobile-first marketplaces like Vinted)
   * - default: Balanced (like eBay)
   * - comfortable: Larger cards (like Airbnb)
   */
  density?: "compact" | "default" | "comfortable"
  /** Gap between items */
  gap?: "sm" | "md" | "lg"
  className?: string
}

/**
 * ProductGrid Component
 * ----------------------
 * Standardized CSS Grid for product catalogs.
 *
 * STANDARDIZED BREAKPOINTS (based on eBay/Amazon):
 * - Mobile (< 640px):   2 columns - essential for thumb reach
 * - Tablet (640-1024):  3 columns - balanced density
 * - Desktop (1024+):    4 columns - optimal for scanning
 * - Wide (1280+):       4-5 columns max - prevents images from getting too small
 *
 * Gap Strategy:
 * - sm: gap-2 sm:gap-3 (8-12px) - Compact
 * - md: gap-3 sm:gap-4 (12-16px) - Default
 * - lg: gap-4 sm:gap-6 (16-24px) - Comfortable
 */
function ProductGrid({ children, density = "default", gap = "md", className }: ProductGridProps) {
  const gapClasses = {
    sm: "gap-2 sm:gap-3",
    md: "gap-3 sm:gap-4 lg:gap-5",
    lg: "gap-4 sm:gap-6",
  }

  // Standardized column configurations
  const densityClasses = {
    // Compact: 2 → 3 → 4 → 5 (Vinted-style, more items)
    compact: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    // Default: 2 → 3 → 4 → 4 (eBay-style, balanced)
    default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5",
    // Comfortable: 2 → 2 → 3 → 4 (Airbnb-style, larger cards)
    comfortable: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }

  return (
    <div className={cn("grid", densityClasses[density], gapClasses[gap], className)}>
      {children}
    </div>
  )
}

ProductGrid.displayName = "ProductGrid"

// =============================================================================
// SKELETON - Matches Modern Minimal card design
// =============================================================================

interface ProductCardSkeletonProps {
  variant?: "default" | "featured"
  className?: string
}

/**
 * ProductCardSkeleton
 * -------------------
 * Skeleton loader matching the ProductCard layout.
 * Uses same aspect ratio (4:3 for default, 1:1 for featured) and spacing.
 */
function ProductCardSkeleton({ variant = "default", className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "h-full overflow-hidden",
        variant === "featured" && "rounded-xl",
        variant === "default" && "rounded-lg",
        className
      )}
    >
      {/* Seller Header Skeleton - Featured only */}
      {variant === "featured" && (
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
          <Skeleton className="size-7 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-14" />
          </div>
        </div>
      )}

      {/* Image Skeleton - Square aspect ratio */}
      <div className={cn("bg-muted", variant === "default" && "rounded-lg")}>
        <AspectRatio ratio={1}>
          <Skeleton className="size-full" />
        </AspectRatio>
      </div>

      {/* Content Skeleton - Matches card padding */}
      <div className={cn("flex flex-col gap-1.5", variant === "featured" ? "p-2" : "p-1.5")}>
        {/* Brand */}
        <Skeleton className="h-3 w-16" />
        {/* Title */}
        <Skeleton className="h-4 w-full" />
        {variant === "featured" && <Skeleton className="h-4 w-3/4" />}
        {/* Price */}
        <Skeleton className="h-5 w-20" />
        {/* Rating */}
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

ProductCardSkeleton.displayName = "ProductCardSkeleton"

// =============================================================================
// SKELETON GRID - Uses ProductGrid for consistent layout
// =============================================================================

interface ProductCardSkeletonGridProps {
  count?: number
  variant?: "default" | "featured"
  density?: "compact" | "default" | "comfortable"
  gap?: "sm" | "md" | "lg"
  className?: string
}

/**
 * ProductCardSkeletonGrid
 * -----------------------
 * Grid of skeleton cards for loading states.
 * Uses CSS Grid with same responsive breakpoints as ProductGrid.
 */
function ProductCardSkeletonGrid({
  count = 8,
  variant = "default",
  density = "default",
  gap = "md",
  className,
}: ProductCardSkeletonGridProps) {
  const gapClasses = {
    sm: "gap-2 sm:gap-3",
    md: "gap-3 sm:gap-4 lg:gap-5",
    lg: "gap-4 sm:gap-6",
  }

  const densityClasses = {
    compact: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5",
    comfortable: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }

  return (
    <div className={cn("grid", densityClasses[density], gapClasses[gap], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  )
}

ProductCardSkeletonGrid.displayName = "ProductCardSkeletonGrid"

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ProductCard,
  ProductGrid,
  ProductCardSkeleton,
  ProductCardSkeletonGrid,
  productCardVariants,
  type ProductCardProps,
  type ProductGridProps,
  type ProductCardSkeletonProps,
  type ProductCardSkeletonGridProps,
}
