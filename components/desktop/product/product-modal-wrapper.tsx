"use client"

/**
 * ProductModalWrapper - Desktop modal for intercepted product routes
 * 
 * Displays product in a full-width modal overlay while preserving the
 * underlying page context (categories, search results, etc.).
 * 
 * Features:
 * - Full layout width modal (matches homepage max-width)
 * - URL updates for shareability/bookmarking
 * - Back button closes modal (stays on original page)
 * - "View Full Page" link for users who want the complete experience
 * - Desktop-only: mobile users get full navigation (handled by ProductCard)
 */

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { X, ArrowRight, Heart, ShoppingCart, MessageCircle, Share2 } from "lucide-react"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

import { DesktopGalleryV2 } from "@/components/desktop/product/desktop-gallery-v2"
import { HeroSpecs } from "@/components/shared/product/hero-specs"
import { BuyerProtectionBadge } from "@/components/shared/product/buyer-protection-badge"
import { FreshnessIndicator } from "@/components/shared/product/freshness-indicator"

import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { cn } from "@/lib/utils"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { formatPrice, hasDiscount, getDiscountPercentage } from "@/lib/format-price"
import { Link } from "@/i18n/routing"

import type { ProductPageProduct, HeroSpec } from "@/lib/data/product-page"
import type { GalleryImage, ResolvedHeroSpec } from "@/lib/view-models/product-page"

// =============================================================================
// TYPES
// =============================================================================

interface ProductModalWrapperProps {
  locale: string
  username: string
  productSlug: string
  product: ProductPageProduct
  seller: {
    id: string
    username?: string | null
    display_name?: string | null
    avatar_url?: string | null
    verified?: boolean | null
    created_at?: string | null
  }
  category: {
    id?: string
    name: string
    name_bg?: string | null
    slug: string
    icon?: string | null
  } | null
  heroSpecs: HeroSpec[]
}

// =============================================================================
// HELPERS
// =============================================================================

type ProductImage = { image_url?: string | null }

function buildGalleryImages(product: ProductPageProduct): GalleryImage[] {
  // Prefer product_images from join, fallback to images JSONB
  const productImages = (product.product_images ?? []) as ProductImage[]
  
  if (productImages.length > 0) {
    return productImages.map((img, i) => ({
      src: normalizeImageUrl(img.image_url ?? PLACEHOLDER_IMAGE_PATH),
      alt: `${product.title} - Image ${i + 1}`,
      width: 1200,
      height: 1200,
    }))
  }

  // Fallback to images array
  const imagesArray: unknown[] = Array.isArray(product.images) ? product.images : []
  if (imagesArray.length > 0) {
    return imagesArray.map((url, i) => ({
      src: normalizeImageUrl(String(url)),
      alt: `${product.title} - Image ${i + 1}`,
      width: 1200,
      height: 1200,
    }))
  }

  // Single placeholder
  return [{
    src: PLACEHOLDER_IMAGE_PATH,
    alt: product.title,
    width: 1200,
    height: 1200,
  }]
}

/** Convert HeroSpec to ResolvedHeroSpec (strip unit_suffix) */
function toResolvedSpecs(specs: HeroSpec[]): ResolvedHeroSpec[] {
  return specs.map(({ label, value, priority }) => ({ label, value, priority }))
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProductModalWrapper({
  locale,
  username,
  productSlug,
  product,
  seller,
  category,
  heroSpecs,
}: ProductModalWrapperProps) {
  const router = useRouter()
  const t = useTranslations("Product")
  const tModal = useTranslations("ProductModal")
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  // Modal is always open when this component renders (intercepted route)
  const [open, setOpen] = React.useState(true)

  const handleClose = React.useCallback(() => {
    setOpen(false)
    // Navigate back to close modal (restores previous URL)
    router.back()
  }, [router])

  const handleOpenChange = React.useCallback((isOpen: boolean) => {
    if (!isOpen) {
      handleClose()
    }
  }, [handleClose])

  // Product data
  const price = typeof product.price === "number" ? product.price : 0
  const originalPrice = typeof product.list_price === "number" ? product.list_price : null
  const showDiscount = hasDiscount(originalPrice, price)
  const discountPercent = showDiscount ? getDiscountPercentage(originalPrice!, price) : 0
  const galleryImages = buildGalleryImages(product)
  const primaryImage = galleryImages[0]?.src ?? PLACEHOLDER_IMAGE_PATH

  const productInWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stock === 0
  const productUrl = `/${username}/${productSlug}`
  const sellerDisplayName = seller.display_name || seller.username || t("unknownSeller")

  // Condition label
  const conditionLabel = React.useMemo(() => {
    if (!product.condition) return null
    const c = product.condition.toLowerCase()
    if (c === "new" || c === "novo" || c === "ново") return t("condition.new")
    if (c === "like_new" || c === "like new" || c === "като ново") return t("condition.likeNew")
    if (c === "used" || c === "употребявано") return t("condition.used")
    if (c === "refurbished" || c === "рефърбиш") return t("condition.refurbished")
    return product.condition
  }, [product.condition, t])

  // Add to cart
  const handleAddToCart = React.useCallback(() => {
    addToCart({
      id: product.id,
      title: product.title,
      price,
      image: primaryImage,
      quantity: 1,
      ...(product.slug ? { slug: product.slug } : {}),
      ...(seller.username ? { username: seller.username } : {}),
    })
  }, [addToCart, product.id, product.title, product.slug, price, primaryImage, seller.username])

  // Toggle wishlist
  const handleToggleWishlist = React.useCallback(() => {
    toggleWishlist({
      id: product.id,
      title: product.title,
      price,
      image: primaryImage,
      ...(product.slug ? { slug: product.slug } : {}),
      ...(seller.username ? { username: seller.username } : {}),
    })
  }, [toggleWishlist, product.id, product.title, product.slug, price, primaryImage, seller.username])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          // Full layout width - matches homepage container
          "max-w-7xl w-[95vw] h-[90vh] p-0 gap-0",
          // Hide default close button, we'll add our own in header
          "[&>button[data-slot=dialog-close]]:hidden"
        )}
        showCloseButton={false}
      >
        {/* Accessible title/description */}
        <DialogTitle className="sr-only">{product.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {product.description ?? product.title}
        </DialogDescription>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Category breadcrumb */}
            {category && (
              <Badge variant="secondary" className="text-xs">
                {locale === "bg" && category.name_bg ? category.name_bg : category.name}
              </Badge>
            )}
            <FreshnessIndicator createdAt={product.created_at} />
          </div>

          <div className="flex items-center gap-2">
            {/* View full page link */}
            <Button variant="ghost" size="sm" asChild>
              <Link href={productUrl}>
                {tModal("viewFullPage")}
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label={t("close")}
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 p-6">
            {/* Left Column - Gallery */}
            <div className="space-y-4">
              <DesktopGalleryV2
                images={galleryImages}
                galleryID="product-modal-gallery"
              />

              {/* Description */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    {t("description")}
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Buy Box */}
            <div className="space-y-4">
              {/* Title */}
              <h1 className="text-xl font-bold leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className={cn(
                  "text-3xl font-bold tabular-nums",
                  showDiscount ? "text-price-sale" : "text-price"
                )}>
                  {formatPrice(price, { locale })}
                </span>
                {showDiscount && originalPrice && (
                  <>
                    <span className="text-lg text-price-original line-through tabular-nums">
                      {formatPrice(originalPrice, { locale })}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      -{discountPercent}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Hero Specs */}
              {heroSpecs.length > 0 && (
                <HeroSpecs specs={toResolvedSpecs(heroSpecs)} />
              )}

              {/* Condition & Stock */}
              <div className="flex flex-wrap gap-2">
                {conditionLabel && (
                  <Badge variant="condition-outline">{conditionLabel}</Badge>
                )}
                {isOutOfStock ? (
                  <Badge variant="stock-out">{t("outOfStock")}</Badge>
                ) : product.stock != null && product.stock <= 5 && (
                  <Badge variant="stock-low">
                    {t("lowStock", { count: product.stock })}
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Seller Card */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="size-12">
                  <AvatarImage src={seller.avatar_url ?? undefined} />
                  <AvatarFallback>
                    {sellerDisplayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium truncate">{sellerDisplayName}</span>
                    {seller.verified && (
                      <Badge variant="verified" className="text-xs">
                        {t("verified")}
                      </Badge>
                    )}
                  </div>
                  <Link
                    href={`/${seller.username}`}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    {tModal("viewProfile")}
                  </Link>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/messages?to=${seller.id}`}>
                    <MessageCircle className="size-4 mr-1.5" />
                    {t("contact")}
                  </Link>
                </Button>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="size-5" />
                    {t("addToCart")}
                  </Button>
                  <Button
                    variant="cta"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    {t("buyNow")}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex-1",
                      productInWishlist && "text-destructive"
                    )}
                    onClick={handleToggleWishlist}
                  >
                    <Heart
                      className={cn(
                        "size-4 mr-1.5",
                        productInWishlist && "fill-current"
                      )}
                    />
                    {productInWishlist ? t("removeFromWishlist") : t("addToWishlist")}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="size-4 mr-1.5" />
                    {t("share")}
                  </Button>
                </div>
              </div>

              {/* Trust Badge */}
              <BuyerProtectionBadge className="mt-4" />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
