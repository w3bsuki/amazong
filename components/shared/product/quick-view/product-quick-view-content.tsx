"use client"

import * as React from "react"
import { ArrowSquareOut, Heart, LinkSimple, ShoppingCart, Star, Tag, Truck, X } from "@phosphor-icons/react"
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

  const formattedPrice = formatPrice(price, { locale })

  return (
    <div className="flex flex-col md:grid md:grid-cols-[1.1fr_0.9fr] md:min-h-full">
      {/* Image section with close button */}
      <div className="relative md:border-r md:border-border">
        {/* Close button - top right */}
        {onRequestClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRequestClose}
            className="absolute top-3 right-3 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            aria-label={tProduct("close")}
          >
            <X size={20} weight="bold" />
          </Button>
        )}
        <QuickViewImageGallery
          images={allImages}
          title={title}
          discountPercent={showDiscount ? discountPercent : undefined}
          onNavigateToProduct={onNavigateToProduct}
          compact={isMobile}
        />
      </div>

      <div className="flex flex-col flex-1">
        <div className="px-4 py-3 space-y-2.5">
          {/* Price */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={cn(
              "text-xl font-bold tabular-nums",
              showDiscount ? "text-price-sale" : "text-foreground",
            )}>
              {formattedPrice}
            </span>
            {showDiscount && originalPrice && (
              <span className="text-sm text-muted-foreground line-through tabular-nums">
                {formatPrice(originalPrice, { locale })}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-base font-semibold leading-snug text-foreground line-clamp-2">
            {title}
          </h2>

          {/* Rating + badges row */}
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

          {/* View full page + actions */}
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onNavigateToProduct}
            >
              {tModal("viewFullPage")}
              <ArrowSquareOut size={16} weight="bold" />
            </Button>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleCopyLink}
                aria-label={tModal("copyLink")}
                disabled={!shareUrl}
              >
                <LinkSimple size={18} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleToggleWishlist}
                aria-label={inWishlist ? tProduct("removeFromWatchlist") : tProduct("addToWatchlist")}
                disabled={wishlistPending}
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
            </div>
          </div>

          {/* Seller card */}
          <QuickViewSellerCard
            sellerName={sellerName}
            sellerAvatarUrl={sellerAvatarUrl}
            sellerVerified={sellerVerified}
            onNavigateToProduct={onNavigateToProduct}
          />
        </div>

        {/* Sticky CTA buttons */}
        <div className="sticky bottom-0 border-t border-border px-4 py-3 mt-auto bg-background pb-safe-max">
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="black"
              size="lg"
              className="gap-2"
              onClick={onAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart size={18} weight="bold" />
              {tDrawers("addToCart")}
            </Button>
            <Button
              variant="cta"
              size="lg"
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
