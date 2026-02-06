"use client"

import * as React from "react"
import {
  ArrowSquareOut,
  ArrowsClockwise,
  Heart,
  LinkSimple,
  MapPin,
  ShieldCheck,
  Truck,
} from "@phosphor-icons/react"
import { X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Skeleton } from "@/components/ui/skeleton"
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
  detailsLoading = false,
}: {
  product: QuickViewProduct
  productPath: string
  onRequestClose?: () => void
  onAddToCart: () => void
  onBuyNow: () => void
  onNavigateToProduct: () => void
  detailsLoading?: boolean
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
  const hasSellerData = Boolean(sellerName || sellerAvatarUrl)
  const showSellerSkeleton = detailsLoading && !hasSellerData
  const showLocationSkeleton = detailsLoading && !location
  const showConditionSkeleton = detailsLoading && !condition

  return (
    <div className="flex min-h-full flex-col bg-surface-elevated">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border bg-surface-elevated px-4 py-3 lg:px-6">
        <div className="flex items-center gap-2">
          <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">
            {titleText}
          </h2>
          <IconButton
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleCopyLink}
            aria-label={tModal("copyLink")}
            disabled={!shareUrl}
            className="border border-border-subtle bg-background text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active ![&_svg]:size-4"
          >
            <LinkSimple size={16} weight="bold" />
          </IconButton>
          <IconButton
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? tProduct("removeFromWatchlist") : tProduct("addToWatchlist")}
            disabled={wishlistPending}
            className={cn(
              "border border-border-subtle bg-background ![&_svg]:size-4",
              inWishlist
                ? "text-primary hover:bg-hover active:bg-active"
                : "text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
            )}
          >
            <Heart
              size={16}
              weight={inWishlist ? "fill" : "regular"}
              className={cn(inWishlist && "fill-primary text-primary")}
            />
          </IconButton>
          <IconButton
            type="button"
            variant="ghost"
            size="icon-sm"
            className="border border-border-subtle bg-background text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active ![&_svg]:size-4"
            onClick={() => onRequestClose?.()}
            aria-label={tDrawers("close")}
          >
            <X className="size-4" />
          </IconButton>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 px-4 py-3 lg:grid-cols-5 lg:gap-6 lg:px-6 lg:py-5">
          <div className="space-y-4 lg:col-span-3">
            <QuickViewImageGallery
              images={allImages}
              title={titleText}
              discountPercent={showDiscount ? discountPercent : undefined}
              onNavigateToProduct={onNavigateToProduct}
              compact
            />

            <div className="space-y-3 rounded-xl border border-border-subtle bg-card p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                  {formattedPrice}
                </span>
                {formattedOriginalPrice && (
                  <span className="text-sm tabular-nums text-muted-foreground line-through">
                    {formattedOriginalPrice}
                  </span>
                )}
                {showDiscount && discountPercent > 0 && (
                  <Badge variant="destructive" className="text-xs font-semibold tabular-nums">
                    -{discountPercent}%
                  </Badge>
                )}
                {!inStock && (
                  <Badge
                    variant="outline"
                    className="ml-auto border-destructive bg-destructive-subtle text-destructive"
                  >
                    {tProduct("outOfStock")}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Truck size={17} />
                  {freeShipping ? tProduct("freeShipping") : tProduct("shippingAvailable")}
                </span>

                {location ? (
                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {location}
                  </span>
                ) : showLocationSkeleton ? (
                  <Skeleton className="h-4 w-28" />
                ) : null}

                {condition ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getConditionBadgeVariant(condition)} className="text-xs">
                      {condition}
                    </Badge>
                  </div>
                ) : showConditionSkeleton ? (
                  <Skeleton className="h-5 w-20 rounded-full" />
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-2">
            {showSellerSkeleton ? (
              <div className="rounded-xl border border-border-subtle bg-surface-subtle p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ) : (
              <QuickViewSellerCard
                compact
                sellerName={sellerName}
                sellerAvatarUrl={sellerAvatarUrl}
                sellerVerified={sellerVerified}
                rating={rating}
                reviews={reviews}
                onNavigateToProduct={onNavigateToProduct}
              />
            )}

            <div className="rounded-xl border border-border-subtle bg-surface-subtle p-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <ShieldCheck size={17} weight="fill" className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{tProduct("buyerProtection")}</p>
                  <p className="text-xs text-muted-foreground">{tProduct("buyerProtectionBadgeSubtitle")}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <ArrowsClockwise size={16} className="shrink-0" />
                <span>{tProduct("easyReturns")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToProduct}
              className="inline-flex min-h-(--spacing-touch-md) w-full items-center justify-center gap-2 rounded-xl border border-border-subtle bg-background px-4 text-sm font-medium text-foreground hover:bg-hover active:bg-active"
            >
              {tModal("viewFullPage")}
              <ArrowSquareOut size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="shrink-0 border-t border-border bg-surface-elevated px-4 py-3 pb-safe-max lg:px-6">
        <div className="grid grid-cols-2 gap-2">
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
  )
}
