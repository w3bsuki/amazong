"use client"

import * as React from "react"
import { ArrowSquareOut, Heart, LinkSimple, ShieldCheck, ArrowsClockwise, MapPin, Truck } from "@phosphor-icons/react"
import { X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { QuickViewProduct } from "@/components/providers/drawer-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { formatPrice, getDiscountPercentage, hasDiscount as checkHasDiscount } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { getConditionBadgeVariant } from "@/components/shared/product/_lib/condition-badges"

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

  const formattedOriginalPrice =
    showDiscount && typeof originalPrice === "number"
      ? formatPrice(originalPrice, { locale })
      : null

  const titleText = title || tDrawers("quickView")

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-surface-glass backdrop-blur-md px-4 py-3">
        <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">
          {titleText}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 rounded-xl border border-border bg-background"
          onClick={() => onRequestClose?.()}
          aria-label={tDrawers("close")}
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="bg-surface-subtle lg:col-span-3 lg:border-r lg:border-border">
          <div className="p-4 lg:p-6">
            <div className="lg:hidden">
              <QuickViewImageGallery
                images={allImages}
                title={titleText}
                discountPercent={showDiscount ? discountPercent : undefined}
                onNavigateToProduct={onNavigateToProduct}
                compact
              />
            </div>
            <div className="hidden lg:block">
              <QuickViewImageGallery
                images={allImages}
                title={titleText}
                discountPercent={showDiscount ? discountPercent : undefined}
                onNavigateToProduct={onNavigateToProduct}
                compact={false}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-4 py-4 lg:col-span-2 lg:px-6 lg:py-6">
          {/* Price */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-sm text-muted-foreground line-through tabular-nums">
                  {formattedOriginalPrice}
                </span>
              )}
              {showDiscount && discountPercent > 0 && (
                <Badge variant="destructive" className="text-xs font-semibold tabular-nums">
                  -{discountPercent}%
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {freeShipping ? (
                <span className="flex items-center gap-2">
                  <Truck size={18} />
                  {tProduct("freeShipping")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Truck size={18} />
                  {tProduct("shippingAvailable")}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {location}
                </span>
              )}
              {condition && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getConditionBadgeVariant(condition)} className="text-xs">
                    {condition}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11"
              onClick={handleCopyLink}
              aria-label={tModal("copyLink")}
              disabled={!shareUrl}
            >
              <LinkSimple size={18} weight="bold" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11"
              onClick={handleToggleWishlist}
              aria-label={inWishlist ? tProduct("removeFromWatchlist") : tProduct("addToWatchlist")}
              disabled={wishlistPending}
            >
              <Heart
                size={18}
                weight={inWishlist ? "fill" : "regular"}
                className={cn(inWishlist ? "fill-primary text-primary" : "text-foreground")}
              />
            </Button>

            {!inStock && (
              <Badge
                variant="outline"
                className="ml-auto border-destructive bg-destructive-subtle text-destructive"
              >
                {tProduct("outOfStock")}
              </Badge>
            )}
          </div>

          {/* Seller */}
          <QuickViewSellerCard
            sellerName={sellerName}
            sellerAvatarUrl={sellerAvatarUrl}
            sellerVerified={sellerVerified}
            rating={rating}
            reviews={reviews}
            onNavigateToProduct={onNavigateToProduct}
          />

          {/* Trust */}
          <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <ShieldCheck size={18} weight="fill" className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{tProduct("buyerProtection")}</p>
                <p className="text-sm text-muted-foreground">{tProduct("buyerProtectionBadgeSubtitle")}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <ArrowsClockwise size={18} className="shrink-0" />
              <span>{tProduct("easyReturns")}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToProduct}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-hover active:bg-active"
          >
            {tModal("viewFullPage")}
            <ArrowSquareOut size={16} weight="bold" />
          </button>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="sticky bottom-0 z-20 border-t border-border bg-surface-glass backdrop-blur-md pb-safe-max">
        <div className="px-4 py-3 lg:px-6">
          <div className="grid gap-2 lg:grid-cols-2">
            <Button
              type="button"
              variant="default"
              size="lg"
              className="h-12 w-full"
              onClick={onBuyNow}
              disabled={!inStock}
            >
              {tProduct("buyNow")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 w-full"
              onClick={onAddToCart}
              disabled={!inStock}
            >
              {tDrawers("addToCart")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
