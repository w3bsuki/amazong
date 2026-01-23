"use client"

// =============================================================================
// DESKTOP BUY BOX V2 - Sticky with Embedded Seller
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
import Image from "next/image"
import Link from "next/link"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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

interface DesktopBuyBoxV2Props {
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

export function DesktopBuyBoxV2({
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
}: DesktopBuyBoxV2Props) {
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
    if (isOutOfStock) return
    addToCart({ ...cartProduct, quantity })
    // Navigate to checkout would happen here
    toast({
      title: t("addedToCart"),
      description: `${quantity}x ${title}`,
    })
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
        "sticky top-24 rounded-lg border border-border bg-card p-4 space-y-3",
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
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => toggleWishlist(cartProduct)}
            aria-label={
              productInWishlist ? t("removeFromWatchlist") : t("addToWatchlist")
            }
          >
            <Heart
              className={cn(
                "size-4",
                productInWishlist
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground"
              )}
            />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("share")}
          >
            <Share2 className="size-4 text-muted-foreground" />
          </Button>
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
          <Badge
            variant="secondary"
            className="text-xs bg-success/10 text-success border-success/20"
          >
            {condition}
          </Badge>
        )}
      </div>

      {/* Shipping/Location Info */}
      <div className="rounded-md border border-border bg-muted/30 p-2.5 space-y-1.5">
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
                  className={cn(
                    "size-4",
                    freeShipping ? "text-shipping-free" : "text-foreground"
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    freeShipping ? "text-shipping-free" : "text-foreground"
                  )}
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
            <div className="flex items-center border border-border rounded-md">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="size-touch-xs flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label={t("decreaseQuantity")}
              >
                <Minus
                  className={cn(
                    "size-3.5",
                    quantity <= 1
                      ? "text-muted-foreground/40"
                      : "text-foreground"
                  )}
                />
              </button>
              <span className="px-3 py-1 text-sm font-medium min-w-10 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="size-touch-xs flex items-center justify-center hover:bg-muted transition-colors"
                aria-label={t("increaseQuantity")}
              >
                <Plus className="size-3.5 text-foreground" />
              </button>
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
          <ShieldCheck className="size-3 text-success" />
          {t("buyerProtection")}
        </span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1">
          <RotateCcw className="size-3" />
          {isRealEstate ? t("verifiedListing") : t("easyReturns")}
        </span>
      </div>

      {/* Embedded Seller Card */}
      <div className="rounded-md border border-border bg-muted/30 p-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-10 border border-border">
            <AvatarImage src={seller.avatarUrl ?? undefined} />
            <AvatarFallback className="text-xs font-medium bg-muted">
              {seller.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground text-sm truncate">
                {seller.name}
              </span>
              {seller.verified && (
                <BadgeCheck className="size-3.5 text-verified shrink-0" />
              )}
            </div>
            {seller.rating != null && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-rating">★</span>
                <span>{seller.rating.toFixed(1)}</span>
                {seller.reviewCount != null && (
                  <>
                    <span>•</span>
                    <span>
                      {seller.reviewCount.toLocaleString()} {t("reviews")}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Seller Stats */}
        {(seller.responseTime || seller.ordersCompleted || seller.location) && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
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
              <Link href={`/${locale}/${seller.username}`}>
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
