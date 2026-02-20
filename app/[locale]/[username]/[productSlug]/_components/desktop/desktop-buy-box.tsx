"use client"

// =============================================================================
// DESKTOP BUY BOX - Sticky with Embedded Seller
// =============================================================================
// Based on V2 demo design - the winner from our audit.
// Key features:
// - Sticky positioning on scroll
// - Seller card embedded inside (not separate)
// - Category-adaptive CTAs (Buy Now vs Contact Agent vs Test Drive)
// - Quantity selector (hidden for real-estate/automotive)
// - Shipping/Returns info section
// =============================================================================

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import {
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Package,
  Truck,
  Clock,
  MapPin,
  ShoppingCart,
  Zap,
  BadgeCheck,
  RotateCcw,
  Store,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Badge } from "@/components/ui/badge"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import type { CategoryType } from "@/lib/utils/category-type"

interface SellerInfo {
  id: string
  name: string
  username?: string | null
  avatarUrl?: string | null
  verified?: boolean
  rating?: number | null
  reviewCount?: number | null
  responseTime?: string | null
  ordersCompleted?: number | null
  location?: string | null
}

export interface DesktopBuyBoxProps {
  productId: string
  productSlug: string
  title: string
  price: number
  originalPrice?: number | null
  currency?: string
  condition?: string | null
  stock?: number | null
  seller: SellerInfo
  categoryType?: CategoryType
  freeShipping?: boolean
  location?: string | null
  primaryImage?: string | null
  className?: string
}

export function DesktopBuyBox({
  productId,
  productSlug,
  title,
  price,
  originalPrice,
  currency = "EUR",
  condition,
  stock,
  seller,
  categoryType = "default",
  freeShipping = false,
  location,
  primaryImage,
  className,
}: DesktopBuyBoxProps) {
  const t = useTranslations("Product")
  const locale = useLocale()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { toast } = useToast()

  const [quantity, setQuantity] = useState(1)

  const isRealEstate = categoryType === "real-estate"
  const isAutomotive = categoryType === "automotive"
  const showQuantity = !isRealEstate && !isAutomotive

  const isOutOfStock = stock === 0
  const isLowStock = stock != null && stock > 0 && stock <= 5
  const productInWishlist = isInWishlist(productId)

  // Calculate discount percentage
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0

  // Format price
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Cart product info
  const cartProduct = {
    id: productId,
    title,
    price,
    image: primaryImage ?? "",
    slug: productSlug,
    ...(seller.username ? { username: seller.username } : {}),
  }

  // Handle add to cart
  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart({ ...cartProduct, quantity })
    toast({
      title: t("addedToCart"),
      description: `${quantity}x ${title}`,
    })
  }

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart()
    // Navigate to checkout would happen here.
  }

  // Category-adaptive CTA labels
  const getPrimaryCTA = () => {
    if (isRealEstate) return { label: t("contactAgent"), icon: MessageCircle }
    if (isAutomotive) return { label: t("contactSeller"), icon: MessageCircle }
    return { label: t("addToCart"), icon: ShoppingCart }
  }

  const getSecondaryCTA = () => {
    if (isRealEstate) return t("scheduleVisit")
    if (isAutomotive) return t("testDrive")
    return t("buyNow")
  }

  const primaryCTA = getPrimaryCTA()

  return (
    <div
      className={cn(
        "sticky top-24 rounded-xl border border-border bg-card p-4 space-y-3",
        className
      )}
    >
      {/* Stock Status + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isOutOfStock ? (
            <>
              <span className="size-1.5 rounded-full bg-destructive" />
              <span className="text-sm font-medium text-destructive">
                {t("outOfStock")}
              </span>
            </>
          ) : isLowStock ? (
            <>
              <span className="size-1.5 rounded-full bg-warning" />
              <span className="text-sm font-medium text-warning">
                {t("lowStock", { count: stock })}
              </span>
            </>
          ) : (
            <>
              <span className="size-1.5 rounded-full bg-success" />
              <span className="text-sm font-medium text-success">
                {t("inStock")}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <IconButton
            type="button"
            variant="ghost"
            onClick={() => toggleWishlist(cartProduct)}
            aria-label={
              productInWishlist ? t("removeFromWatchlist") : t("addToWatchlist")
            }
            className="text-muted-foreground hover:text-foreground"
          >
            <Heart
              className={cn(
                productInWishlist
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground"
              )}
            />
          </IconButton>
          <IconButton
            type="button"
            variant="ghost"
            aria-label={t("share")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Share2 />
          </IconButton>
        </div>
      </div>

      {/* Price Block */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-foreground">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
              <Badge
                variant="destructive"
                className="text-xs px-1.5 py-0 h-5"
              >
                -{discount}%
              </Badge>
            </>
          )}
        </div>
        {condition && (
          <MarketplaceBadge variant="condition">{condition}</MarketplaceBadge>
        )}
      </div>

      {/* Shipping/Location Info */}
      <div className="rounded-xl border border-border bg-surface-subtle p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {isRealEstate ? (
              <>
                <MapPin className="size-4 text-foreground" />
                <span className="font-medium text-foreground">
                  {location || t("locationTBA")}
                </span>
              </>
            ) : (
              <>
                <Truck
                  className="size-4 text-muted-foreground"
                />
                <span
                  className="font-medium text-foreground"
                >
                  {freeShipping ? t("freeShipping") : t("shippingAvailable")}
                </span>
              </>
            )}
          </div>
        </div>
        {!isRealEstate && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {isAutomotive ? t("pickupAvailable") : t("delivery2to3Days")}
            </span>
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {location}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quantity Selector (for applicable categories) */}
      {showQuantity && !isOutOfStock && (
        <div className="flex items-center justify-between gap-3 py-2 border-y border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("qty")}</span>
            <div className="flex items-center border border-border rounded-xl">
              <IconButton
                type="button"
                size="icon-lg"
                variant="ghost"
                className="hover:bg-muted"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label={t("decreaseQuantity")}
              >
                <Minus
                  className={cn(
                    quantity <= 1 ? "text-muted-foreground opacity-40" : "text-foreground"
                  )}
                />
              </IconButton>
              <span className="px-3 py-1 text-sm font-medium min-w-touch text-center">
                {quantity}
              </span>
              <IconButton
                type="button"
                size="icon-lg"
                variant="ghost"
                className="hover:bg-muted"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                aria-label={t("increaseQuantity")}
              >
                <Plus className="text-foreground" />
              </IconButton>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">{t("total")}</span>
            <div className="text-lg font-bold text-foreground">
              {formatPrice(price * quantity)}
            </div>
          </div>
        </div>
      )}

      {/* CTA Buttons - Category Adaptive */}
      <div className="flex gap-2">
        {isRealEstate || isAutomotive ? (
          <>
            <Button
              size="lg"
              className="flex-1 font-semibold"
              disabled={isOutOfStock}
            >
              <primaryCTA.icon className="size-4" />
              {primaryCTA.label}
            </Button>
            <Button variant="outline" size="lg" className="px-4">
              {getSecondaryCTA()}
            </Button>
          </>
        ) : (
          <>
            <Button
              size="lg"
              className="flex-1 font-semibold"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="size-4" />
              {t("addToCart")}
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              title={t("buyNow")}
              aria-label={t("buyNow")}
            >
              <Zap />
            </Button>
          </>
        )}
      </div>

      {/* Protection Badges */}
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="size-3 text-muted-foreground" />
          {t("buyerProtection")}
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="flex items-center gap-1">
          <RotateCcw className="size-3" />
          {isRealEstate ? t("verifiedListing") : t("easyReturns")}
        </span>
      </div>

      {/* Embedded Seller Card */}
      <div className="rounded-xl border border-border bg-surface-subtle p-3">
        <div className="flex items-center gap-2.5">
          <UserAvatar
            name={seller.name}
            avatarUrl={seller.avatarUrl ?? null}
            className="size-10 border border-border bg-muted"
            fallbackClassName="text-xs font-medium bg-muted"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground text-sm truncate">
                {seller.name}
              </span>
              {seller.verified && (
                <BadgeCheck className="size-3.5 text-muted-foreground shrink-0" />
              )}
            </div>
            {seller.rating != null && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-muted-foreground">★</span>
                <span>{seller.rating.toFixed(1)}</span>
                {seller.reviewCount != null && (
                  <>
                    <span>•</span>
                    <span>
                      {t("reviews", { count: seller.reviewCount })}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Seller Stats */}
        {(seller.responseTime || seller.ordersCompleted || seller.location) && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle text-xs text-muted-foreground">
            {seller.responseTime && (
              <span className="flex items-center gap-1">
                <Clock className="size-2.5" />
                {seller.responseTime}
              </span>
            )}
            {seller.ordersCompleted != null && (
              <span className="flex items-center gap-1">
                <Package className="size-2.5" />
                {seller.ordersCompleted.toLocaleString()} {t("orders")}
              </span>
            )}
            {seller.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-2.5" />
                {seller.location.split(",")[0]}
              </span>
            )}
          </div>
        )}

        {/* Seller Actions */}
        <div className="flex gap-2 mt-2.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 text-xs bg-background"
          >
            <MessageCircle className="size-3" />
            {t("message")}
          </Button>
          {seller.username && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs bg-background"
              asChild
            >
              <Link href={`/${seller.username}`}>
                <Store className="size-3 mr-1" />
                {t("viewStore")}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
