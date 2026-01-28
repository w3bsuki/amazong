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

  // Mobile layout - ultra-compact, everything visible without scrolling
  if (isMobile) {
    return (
      <div className="flex flex-col h-full touch-action-pan-y">
        {/* Compact hero image - wide aspect for more content space */}
        <QuickViewImageGallery
          images={allImages}
          title={title}
          discountPercent={showDiscount ? discountPercent : undefined}
          onNavigateToProduct={onNavigateToProduct}
          compact
        />

        {/* Content area - clean card-like styling */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-2 gap-2">
          {/* Price row - prominent */}
          <div className="flex items-baseline gap-2">
            <span className={cn("text-xl font-bold tabular-nums tracking-tight", showDiscount ? "text-price-sale" : "text-foreground")}>
              {formattedPrice}
            </span>
            {showDiscount && originalPrice && (
              <span className="text-sm text-muted-foreground line-through tabular-nums">
                {formatPrice(originalPrice, { locale })}
              </span>
            )}
          </div>

          {/* Title - two lines max with proper weight */}
          <h2 className="text-base font-semibold leading-snug text-foreground line-clamp-2">{title}</h2>

          {/* Meta row - rating, condition, shipping inline */}
          <div className="flex items-center gap-2 flex-wrap">
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
              <Badge variant={getConditionBadgeVariant(condition)} className="text-xs">
                <Tag size={10} />
                {condition}
              </Badge>
            )}
            {freeShipping && (
              <Badge variant="shipping" className="text-xs">
                <Truck size={10} weight="fill" />
                {tProduct("freeShipping")}
              </Badge>
            )}
          </div>

          {/* Seller card */}
          <QuickViewSellerCard
            sellerName={sellerName}
            sellerAvatarUrl={sellerAvatarUrl}
            sellerVerified={sellerVerified}
            onNavigateToProduct={onNavigateToProduct}
            compact
          />
        </div>

        {/* CTA footer - polished */}
        <div className="border-t border-border px-4 py-3 bg-background pb-safe-max">
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="black"
              size="lg"
              className="gap-2 touch-action-manipulation"
              onClick={onAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart size={18} weight="bold" />
              {tDrawers("addToCart")}
            </Button>
            <Button
              variant="cta"
              size="lg"
              className="touch-action-manipulation"
              onClick={onBuyNow}
              disabled={!inStock}
            >
              {tProduct("buyNow")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Desktop layout - clean, modern product dialog
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 min-h-full">
      {/* LEFT: Gallery - larger, better proportions */}
      <div className="relative bg-surface-subtle flex items-center justify-center p-6 lg:p-8 lg:col-span-3">
        <div className="w-full max-w-xl">
          <QuickViewImageGallery
            images={allImages}
            title={title}
            discountPercent={showDiscount ? discountPercent : undefined}
            onNavigateToProduct={onNavigateToProduct}
            compact={false}
          />
        </div>
      </div>

      {/* RIGHT: Product Info - scrollable, better hierarchy */}
      <div className="flex flex-col bg-background lg:col-span-2">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* Header: Title + badges */}
          <div className="space-y-3 pr-10">
            <h2 className="text-2xl font-bold leading-tight text-foreground">
              {title}
            </h2>
            
            {/* Meta: Rating + Condition */}
            <div className="flex flex-wrap items-center gap-3">
              {condition && (
                <Badge variant={getConditionBadgeVariant(condition)} className="gap-1.5">
                  <Tag size={12} weight="fill" />
                  {condition}
                </Badge>
              )}
              {hasRating && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Star size={16} weight="fill" className="fill-rating text-rating" />
                  <span className="font-semibold tabular-nums">{rating.toFixed(1)}</span>
                  {typeof reviews === "number" && reviews > 0 && (
                    <span className="text-muted-foreground">({reviews})</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Price Section - prominent */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className={cn(
                "text-4xl font-bold tabular-nums tracking-tight",
                showDiscount ? "text-price-sale" : "text-foreground",
              )}>
                {formattedPrice}
              </span>
              {showDiscount && originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through tabular-nums">
                    {formatPrice(originalPrice, { locale })}
                  </span>
                  <Badge variant="destructive" className="text-sm font-bold px-2.5 py-0.5">
                    -{discountPercent}%
                  </Badge>
                </>
              )}
            </div>

            {/* Shipping & location inline */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {freeShipping ? (
                <span className="flex items-center gap-1.5 text-shipping-free font-semibold">
                  <Truck size={18} weight="fill" />
                  {tProduct("freeShipping")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Truck size={18} />
                  {tProduct("shippingAvailable") || "Shipping available"}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin size={16} />
                  {location}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector - cleaner */}
          {inStock && (
            <div className="flex items-center gap-4 py-2">
              <span className="text-sm font-medium text-muted-foreground min-w-12">{tProduct("qty") || "Qty"}</span>
              <div className="flex items-center rounded-lg border border-border bg-surface-subtle">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="size-10 flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg disabled:opacity-30"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} weight="bold" />
                </button>
                <span className="px-5 py-2.5 text-base font-semibold min-w-14 text-center tabular-nums border-x border-border bg-background">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  className="size-10 flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} weight="bold" />
                </button>
              </div>
              {quantity > 1 && (
                <div className="ml-auto text-right">
                  <span className="text-xs text-muted-foreground block">{tProduct("total") || "Total"}</span>
                  <span className="text-lg font-bold tabular-nums">{totalPrice}</span>
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

          {/* Trust Badges - more prominent */}
          <div className="flex items-center justify-center gap-6 py-4 px-4 rounded-lg bg-success/5 border border-success/20">
            <span className="flex items-center gap-2 text-sm font-medium text-success">
              <ShieldCheck size={18} weight="fill" />
              {tProduct("buyerProtection") || "Buyer Protection"}
            </span>
            <span className="w-px h-4 bg-border" />
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowsClockwise size={18} />
              {tProduct("easyReturns") || "Easy Returns"}
            </span>
          </div>

          {/* View full listing link */}
          <button
            type="button"
            onClick={onNavigateToProduct}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {tModal("viewFullPage")}
            <ArrowSquareOut size={16} weight="bold" />
          </button>
        </div>

        {/* Sticky footer with CTAs */}
        <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur-sm px-6 lg:px-8 py-5">
          {/* Quick actions row */}
          <div className="flex items-center gap-3 mb-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              aria-label={tModal("copyLink")}
              disabled={!shareUrl}
              className="size-10 shrink-0"
            >
              <LinkSimple size={18} weight="bold" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
              aria-label={inWishlist ? tProduct("removeFromWatchlist") : tProduct("addToWatchlist")}
              disabled={wishlistPending}
              className="size-10 shrink-0"
            >
              <Heart
                size={18}
                weight={inWishlist ? "fill" : "bold"}
                className={cn(
                  inWishlist ? "fill-wishlist-active text-wishlist-active" : "text-foreground",
                  wishlistPending && "opacity-50",
                )}
              />
            </Button>
            {!inStock && (
              <Badge variant="secondary" className="ml-auto text-destructive bg-destructive/10 font-medium">
                {tProduct("outOfStock") || "Out of Stock"}
              </Badge>
            )}
          </div>

          {/* Main CTAs - full width, stacked or side by side */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="black"
              size="lg"
              className="gap-2.5 font-semibold h-12"
              onClick={handleAddToCartWithQuantity}
              disabled={!inStock}
            >
              <ShoppingCart size={20} weight="bold" />
              {tDrawers("addToCart")}
            </Button>
            <Button
              variant="cta"
              size="lg"
              className="font-semibold h-12"
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
