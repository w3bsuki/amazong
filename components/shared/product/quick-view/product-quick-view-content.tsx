"use client"

import * as React from "react"
import { ArrowSquareOut, Heart, LinkSimple, Minus, Plus, ShoppingCart, Star, Tag, Truck, ShieldCheck, ArrowsClockwise, MapPin } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { QuickViewProduct } from "@/components/providers/drawer-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { formatPrice, getDiscountPercentage, hasDiscount as checkHasDiscount } from "@/lib/format-price"
import { cn, getConditionBadgeVariant } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

import { QuickViewImageGallery } from "./quick-view-image-gallery"
import { QuickViewSellerCard } from "./quick-view-seller-card"

async function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const el = document.createElement("textarea")
  el.value = text
  el.setAttribute("readonly", "")
  el.style.position = "fixed"
  el.style.left = "-9999px"
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

export function ProductQuickViewContent({
  product,
  productPath,
  onRequestClose,
  onAddToCart,
  onBuyNow,
  onNavigateToProduct,
}: {
  product: QuickViewProduct
  productPath: string
  onRequestClose?: () => void
  onAddToCart: () => void
  onBuyNow: () => void
  onNavigateToProduct: () => void
}) {
  const tDrawers = useTranslations("Drawers")
  const tProduct = useTranslations("Product")
  const tModal = useTranslations("ProductModal")
  const locale = useLocale()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isMobile = useIsMobile()
  const [quantity, setQuantity] = React.useState(1)

  const {
    id,
    title = "",
    price = 0,
    image,
    images,
    originalPrice,
    condition,
    freeShipping,
    rating,
    reviews,
    inStock = true,
    sellerName,
    sellerAvatarUrl,
    sellerVerified,
    location,
  } = product

  const allImages = images?.length ? images : image ? [image] : []
  const primaryImage = allImages[0] ?? PLACEHOLDER_IMAGE_PATH

  const showDiscount = checkHasDiscount(originalPrice, price)
  const discountPercent =
    showDiscount && typeof originalPrice === "number"
      ? getDiscountPercentage(originalPrice, price)
      : 0
  const hasRating = typeof rating === "number" && rating > 0

  const inWishlist = isInWishlist(id)
  const [wishlistPending, setWishlistPending] = React.useState(false)

  const shareUrl = React.useMemo(() => {
    if (!productPath || productPath === "#") return null
    if (typeof window === "undefined") return null
    const safePath = productPath.startsWith("/") ? productPath : `/${productPath}`
    return `${window.location.origin}/${locale}${safePath}`
  }, [productPath, locale])

  const handleCopyLink = React.useCallback(async () => {
    if (!shareUrl) return
    try {
      await copyToClipboard(shareUrl)
      toast.success(tModal("linkCopied"))
    } catch {
      toast.error(tModal("copyFailed"))
    }
  }, [shareUrl, tModal])

  const handleToggleWishlist = React.useCallback(async () => {
    if (wishlistPending) return
    setWishlistPending(true)
    try {
      await toggleWishlist({ id, title, price, image: primaryImage })
    } finally {
      setWishlistPending(false)
    }
  }, [wishlistPending, toggleWishlist, id, title, price, primaryImage])

  const handleAddToCartWithQuantity = React.useCallback(() => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart()
    }
  }, [quantity, onAddToCart])

  const formattedPrice = formatPrice(price, { locale })
  const totalPrice = formatPrice(price * quantity, { locale })

  // Mobile layout (compact)
  if (isMobile) {
    return (
      <div className="flex flex-col">
        <QuickViewImageGallery
          images={allImages}
          title={title}
          discountPercent={showDiscount ? discountPercent : undefined}
          onNavigateToProduct={onNavigateToProduct}
          compact
        />
        <div className="flex flex-col flex-1 px-4 py-3 space-y-2.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={cn("text-xl font-bold tabular-nums", showDiscount ? "text-price-sale" : "text-foreground")}>
              {formattedPrice}
            </span>
            {showDiscount && originalPrice && (
              <span className="text-sm text-muted-foreground line-through tabular-nums">
                {formatPrice(originalPrice, { locale })}
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold leading-snug text-foreground line-clamp-2">{title}</h2>
          <div className="flex flex-wrap items-center gap-1.5">
            {hasRating && (
              <div className="flex items-center gap-1">
                <Star size={14} weight="fill" className="fill-rating text-rating" />
                <span className="text-sm font-medium tabular-nums">{rating.toFixed(1)}</span>
                {typeof reviews === "number" && reviews > 0 && (
                  <span className="text-xs text-muted-foreground">({reviews})</span>
                )}
              </div>
            )}
            {condition && (
              <Badge variant={getConditionBadgeVariant(condition)}>
                <Tag size={10} />
                {condition}
              </Badge>
            )}
            {freeShipping && (
              <Badge variant="shipping">
                <Truck size={10} weight="fill" />
                {tProduct("freeShipping")}
              </Badge>
            )}
          </div>
          <QuickViewSellerCard
            sellerName={sellerName}
            sellerAvatarUrl={sellerAvatarUrl}
            sellerVerified={sellerVerified}
            onNavigateToProduct={onNavigateToProduct}
          />
        </div>
        <div className="sticky bottom-0 border-t border-border px-4 py-3 mt-auto bg-background pb-safe-max">
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="black" size="lg" className="gap-2" onClick={onAddToCart} disabled={!inStock}>
              <ShoppingCart size={18} weight="bold" />
              {tDrawers("addToCart")}
            </Button>
            <Button variant="cta" size="lg" onClick={onBuyNow} disabled={!inStock}>
              {tProduct("buyNow")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Desktop layout - product page experience
  return (
    <div className="grid grid-cols-[1fr_420px] min-h-full">
      {/* LEFT: Gallery - takes most space */}
      <div className="p-8">
        <QuickViewImageGallery
          images={allImages}
          title={title}
          discountPercent={showDiscount ? discountPercent : undefined}
          onNavigateToProduct={onNavigateToProduct}
          compact={false}
        />
      </div>

      {/* RIGHT: Product Info - fixed width sidebar */}
      <div className="flex flex-col border-l border-border bg-muted/30">
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold leading-tight text-foreground">
              {title}
            </h2>
            
            {/* Rating + Condition badges */}
            <div className="flex flex-wrap items-center gap-2">
              {hasRating && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Star size={16} weight="fill" className="fill-rating text-rating" />
                  <span className="font-medium tabular-nums">{rating.toFixed(1)}</span>
                  {typeof reviews === "number" && reviews > 0 && (
                    <span className="text-muted-foreground">({reviews} {tProduct("reviews", { count: reviews })})</span>
                  )}
                </div>
              )}
              {condition && (
                <Badge variant={getConditionBadgeVariant(condition)} className="gap-1">
                  <Tag size={12} />
                  {condition}
                </Badge>
              )}
            </div>
          </div>

          {/* Price Block */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className={cn(
                "text-3xl font-bold tabular-nums",
                showDiscount ? "text-price-sale" : "text-foreground",
              )}>
                {formattedPrice}
              </span>
              {showDiscount && originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through tabular-nums">
                    {formatPrice(originalPrice, { locale })}
                  </span>
                  <Badge variant="destructive" className="text-sm px-2">
                    -{discountPercent}%
                  </Badge>
                </>
              )}
            </div>

            {/* Shipping info */}
            <div className="flex items-center gap-4 text-sm">
              {freeShipping ? (
                <span className="flex items-center gap-1.5 text-shipping-free font-medium">
                  <Truck size={16} weight="fill" />
                  {tProduct("freeShipping")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Truck size={16} />
                  {tProduct("shippingAvailable") || "Shipping available"}
                </span>
              )}
              {(location || (product as { location?: string }).location) && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin size={14} />
                  {location || (product as { location?: string }).location}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          {inStock && (
            <div className="flex items-center justify-between gap-4 py-3 border-y border-border">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">{tProduct("qty") || "Qty"}</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="size-9 flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg disabled:opacity-40"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} className={quantity <= 1 ? "text-muted-foreground/40" : "text-foreground"} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium min-w-12 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="size-9 flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} className="text-foreground" />
                  </button>
                </div>
              </div>
              {quantity > 1 && (
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">{tProduct("total") || "Total"}</span>
                  <div className="text-lg font-bold text-foreground tabular-nums">{totalPrice}</div>
                </div>
              )}
            </div>
          )}

          {/* Seller Card */}
          <QuickViewSellerCard
            sellerName={sellerName}
            sellerAvatarUrl={sellerAvatarUrl}
            sellerVerified={sellerVerified}
            onNavigateToProduct={onNavigateToProduct}
          />

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 py-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-success" weight="fill" />
              {tProduct("buyerProtection") || "Buyer Protection"}
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1.5">
              <ArrowsClockwise size={14} />
              {tProduct("easyReturns") || "Easy Returns"}
            </span>
          </div>

          {/* View Full Page Link */}
          <Button
            type="button"
            variant="ghost"
            className="w-full gap-2 text-muted-foreground hover:text-foreground"
            onClick={onNavigateToProduct}
          >
            {tModal("viewFullPage")}
            <ArrowSquareOut size={16} weight="bold" />
          </Button>
        </div>

        {/* Sticky CTA buttons */}
        <div className="sticky bottom-0 border-t border-border px-6 py-4 bg-background">
          {/* Action buttons row */}
          <div className="flex items-center gap-2 mb-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              aria-label={tModal("copyLink")}
              disabled={!shareUrl}
              className="shrink-0"
            >
              <LinkSimple size={18} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
              aria-label={inWishlist ? tProduct("removeFromWatchlist") : tProduct("addToWatchlist")}
              disabled={wishlistPending}
              className="shrink-0"
            >
              <Heart
                size={18}
                weight={inWishlist ? "fill" : "regular"}
                className={cn(
                  inWishlist ? "fill-wishlist-active text-wishlist-active" : "text-muted-foreground",
                  wishlistPending && "opacity-50",
                )}
              />
            </Button>
            <div className="flex-1" />
            {!inStock && (
              <Badge variant="secondary" className="text-destructive bg-destructive/10">
                {tProduct("outOfStock") || "Out of Stock"}
              </Badge>
            )}
          </div>

          {/* Main CTAs */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="black"
              size="lg"
              className="gap-2 font-semibold"
              onClick={handleAddToCartWithQuantity}
              disabled={!inStock}
            >
              <ShoppingCart size={18} weight="bold" />
              {tDrawers("addToCart")}
            </Button>
            <Button
              variant="cta"
              size="lg"
              className="font-semibold"
              onClick={onBuyNow}
              disabled={!inStock}
            >
              {tProduct("buyNow")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
