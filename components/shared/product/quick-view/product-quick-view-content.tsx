"use client"

import * as React from "react"
import { ArrowSquareOut, Heart, LinkSimple, MapPin, ShoppingCart, Star, Tag, Truck } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { QuickViewProduct } from "@/components/providers/drawer-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { formatPrice, getDiscountPercentage, hasDiscount as checkHasDiscount } from "@/lib/format-price"
import { cn } from "@/lib/utils"

import { QuickViewImageGallery } from "./quick-view-image-gallery"
import { QuickViewSellerCard } from "./quick-view-seller-card"

async function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  // Fallback for older browsers / stricter permissions.
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
  /** Full-page href without locale prefix, e.g. `/{username}/{slug}` */
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
    description,
    condition,
    location,
    categoryPath,
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
    const localizedPath = `/${locale}${safePath}`
    return `${window.location.origin}${localizedPath}`
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

  return (
    <div className="md:grid md:grid-cols-[1.1fr_0.9fr] md:min-h-full">
      <div className="md:border-r md:border-border">
        <QuickViewImageGallery
          images={allImages}
          title={title}
          discountPercent={showDiscount ? discountPercent : undefined}
          onNavigateToProduct={onNavigateToProduct}
          {...(onRequestClose ? { onRequestClose } : {})}
        />
      </div>

      <div className="flex flex-col">
        <div className="px-4 py-4 space-y-4">
        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className={cn(
              "text-2xl font-bold tabular-nums",
              showDiscount ? "text-price-sale" : "text-price",
            )}
          >
            {formatPrice(price, { locale })}
          </span>
          {showDiscount && originalPrice && (
            <span className="text-sm text-price-original line-through tabular-nums">
              {formatPrice(originalPrice, { locale })}
            </span>
          )}
          {showDiscount && (
            <span className="text-sm font-medium text-price-savings">
              {tProduct("savePercent", { percent: discountPercent })}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold leading-tight text-foreground">
          {title}
        </h2>

        {/* Top actions */}
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

          <div className="flex items-center gap-1.5">
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
                  inWishlist
                    ? "fill-wishlist-active text-wishlist-active"
                    : "text-muted-foreground",
                  wishlistPending && "opacity-50",
                )}
              />
            </Button>
          </div>
        </div>

        {/* Rating & Reviews */}
        {hasRating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={16} weight="fill" className="fill-rating text-rating" />
              <span className="font-semibold tabular-nums">{rating.toFixed(1)}</span>
            </div>
            {typeof reviews === "number" && reviews > 0 && (
              <span className="text-sm text-muted-foreground tabular-nums">
                ({tProduct("reviews", { count: reviews.toLocaleString() })})
              </span>
            )}
          </div>
        )}

        {/* Quick info badges */}
        <div className="flex flex-wrap gap-2">
          {condition && (
            <Badge variant="condition">
              <Tag size={12} />
              {condition}
            </Badge>
          )}
          {freeShipping && (
            <Badge variant="shipping">
              <Truck size={12} weight="fill" />
              {tProduct("freeShipping")}
            </Badge>
          )}
          {location && (
            <Badge variant="info">
              <MapPin size={12} />
              {location}
            </Badge>
          )}
          {!inStock && (
            <Badge variant="stock-out">
              {tProduct("outOfStock")}
            </Badge>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-medium text-muted-foreground">
              {tProduct("description")}
            </h3>
            <p className="text-sm leading-relaxed text-foreground line-clamp-4">
              {description}
            </p>
          </div>
        )}

        {/* Category breadcrumb */}
        {categoryPath && categoryPath.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground overflow-x-auto no-scrollbar">
            {categoryPath.map((cat, i) => (
              <React.Fragment key={cat.slug}>
                {i > 0 && <span className="text-border">›</span>}
                <span className="whitespace-nowrap">
                  {locale === "bg" && cat.nameBg ? cat.nameBg : cat.name}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Seller card */}
        <QuickViewSellerCard
          sellerName={sellerName}
          sellerAvatarUrl={sellerAvatarUrl}
          sellerVerified={sellerVerified}
          onNavigateToProduct={onNavigateToProduct}
        />
      </div>

        <div className="border-t border-border px-4 py-4 mt-auto">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
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
