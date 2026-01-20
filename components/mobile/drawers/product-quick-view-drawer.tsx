"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Truck, Star, MapPin, Tag } from "@phosphor-icons/react"
import { useTranslations, useLocale } from "next-intl"

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type QuickViewProduct } from "@/components/providers/drawer-context"
import { useCart } from "@/components/providers/cart-context"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { formatPrice, hasDiscount as checkHasDiscount, getDiscountPercentage } from "@/lib/format-price"
import { cn } from "@/lib/utils"

import { QuickViewImageGallery } from "./_components/quick-view-image-gallery"
import { QuickViewSellerCard } from "./_components/quick-view-seller-card"
import { QuickViewSkeleton } from "./_components/quick-view-skeleton"

// --- TYPES ---

interface ProductQuickViewDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: QuickViewProduct | null
  /** Show loading skeleton while product data is being fetched */
  isLoading?: boolean
}

// --- MAIN COMPONENT ---

export function ProductQuickViewDrawer({
  open,
  onOpenChange,
  product,
  isLoading = false,
}: ProductQuickViewDrawerProps) {
  const t = useTranslations("Drawers")
  const tProduct = useTranslations("Product")
  const locale = useLocale()
  const router = useRouter()
  const { addToCart } = useCart()

  const handleAddToCart = React.useCallback(() => {
    if (!product) return
    const imgs = product.images?.length ? product.images : product.image ? [product.image] : []
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: imgs[0] ?? PLACEHOLDER_IMAGE_PATH,
      quantity: 1,
      ...(product.slug ? { slug: product.slug } : {}),
      ...(product.username ? { username: product.username } : {}),
    })
    onOpenChange(false)
  }, [addToCart, product, onOpenChange])

  const handleBuyNow = React.useCallback(() => {
    handleAddToCart()
    // Could navigate to checkout here
  }, [handleAddToCart])

  const handleNavigateToProduct = React.useCallback(() => {
    if (!product) return
    const { id, slug, username } = product
    const productPath = username && slug 
      ? `/${locale}/${username}/${slug}` 
      : username 
        ? `/${locale}/${username}/${id}` 
        : "#"
    onOpenChange(false)
    router.push(productPath)
  }, [onOpenChange, router, product, locale])

  // Destructure product data (with defaults for loading state)
  const {
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
  } = product ?? {}

  // Build images array
  const allImages = React.useMemo(() => {
    if (images?.length) return images
    if (image) return [image]
    return []
  }, [images, image])

  const showDiscount = checkHasDiscount(originalPrice, price)
  const discountPercent = showDiscount ? getDiscountPercentage(originalPrice!, price) : 0
  const hasRating = typeof rating === "number" && rating > 0

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent aria-label={t("quickView")} showHandle>
        <DrawerTitle className="sr-only">{title || t("quickView")}</DrawerTitle>
        <DrawerDescription className="sr-only">{description ?? title}</DrawerDescription>

        {/* Loading state */}
        {isLoading ? (
          <QuickViewSkeleton />
        ) : !product ? null : (
          <>
            {/* Scrollable content area - uses DrawerBody primitive */}
            <DrawerBody className="px-0">
              {/* Hero image with gallery */}
              <QuickViewImageGallery
                images={allImages}
                title={title}
                discountPercent={showDiscount ? discountPercent : undefined}
                onNavigateToProduct={handleNavigateToProduct}
              />

              {/* Product info section */}
              <div className="px-4 py-4 space-y-4">
                {/* Price - uses semantic price colors */}
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={cn(
                    "text-2xl font-bold tabular-nums",
                    showDiscount ? "text-price-sale" : "text-price"
                  )}>
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

                {/* Quick info badges - uses semantic badge variants */}
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
                  onNavigateToProduct={handleNavigateToProduct}
                />
              </div>
            </DrawerBody>

            {/* Sticky footer - uses DrawerFooter with built-in safe area handling */}
            <DrawerFooter className="border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingCart size={18} weight="bold" />
                  {t("addToCart")}
                </Button>
                <Button
                  variant="cta"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                >
                  {tProduct("buyNow")}
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
