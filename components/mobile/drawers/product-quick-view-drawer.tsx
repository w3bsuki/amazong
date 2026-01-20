"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Truck, Star, MapPin, Tag, X, Link as LinkIcon, ArrowUpRight, Heart, ChatCircle, Minus, Plus, ShieldCheck, Package, ArrowsClockwise, Storefront, CheckCircle, Share } from "@phosphor-icons/react"
import { useTranslations, useLocale } from "next-intl"
import { toast } from "sonner"
import Image from "next/image"

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
} from "@/components/ui/drawer"
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
import { type QuickViewProduct } from "@/components/providers/drawer-context"
import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { PLACEHOLDER_IMAGE_PATH, normalizeImageUrl } from "@/lib/normalize-image-url"
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
  isLoading?: boolean
}

// --- SHARED CONTENT COMPONENT ---

function QuickViewContent({
  product,
  locale,
  onAddToCart,
  onBuyNow,
  onNavigateToProduct,
  t,
  tProduct,
}: {
  product: QuickViewProduct
  locale: string
  onAddToCart: () => void
  onBuyNow: () => void
  onNavigateToProduct: () => void
  t: ReturnType<typeof useTranslations<"Drawers">>
  tProduct: ReturnType<typeof useTranslations<"Product">>
}) {
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
  } = product

  const allImages = images?.length ? images : image ? [image] : []
  const showDiscount = checkHasDiscount(originalPrice, price)
  const discountPercent =
    showDiscount && typeof originalPrice === "number"
      ? getDiscountPercentage(originalPrice, price)
      : 0
  const hasRating = typeof rating === "number" && rating > 0

  return (
    <>
      {/* Hero image with gallery */}
      <QuickViewImageGallery
        images={allImages}
        title={title}
        discountPercent={showDiscount ? discountPercent : undefined}
        onNavigateToProduct={onNavigateToProduct}
      />

      {/* Product info section */}
      <div className="px-4 py-4 space-y-4">
        {/* Price */}
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

      {/* Footer with actions */}
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
            {t("addToCart")}
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
    </>
  )
}

// --- DESKTOP FULL PRODUCT MODAL (matches product page layout) ---

function DesktopProductModal({
  product,
  locale,
  onAddToCart,
  onBuyNow,
  onNavigateToProduct,
  onMessage,
  onShare,
  t,
  tProduct,
}: {
  product: QuickViewProduct
  locale: string
  onAddToCart: (qty: number) => void
  onBuyNow: (qty: number) => void
  onNavigateToProduct: () => void
  onMessage: () => void
  onShare: () => void
  t: ReturnType<typeof useTranslations<"Drawers">>
  tProduct: ReturnType<typeof useTranslations<"Product">>
}) {
  const [quantity, setQuantity] = React.useState(1)
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)

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
    username,
  } = product

  const allImages = React.useMemo(() => {
    const imgs = images?.length ? images : image ? [image] : []
    return imgs.map(src => normalizeImageUrl(src))
  }, [images, image])
  
  const showDiscount = checkHasDiscount(originalPrice, price)
  const discountPercent =
    showDiscount && typeof originalPrice === "number"
      ? getDiscountPercentage(originalPrice, price)
      : 0
  const hasRating = typeof rating === "number" && rating > 0
  const isWishlisted = isInWishlist(id)
  const stock = inStock ? 10 : 0

  const handleWishlistToggle = () => {
    toggleWishlist({ id, title, price, image: allImages[0] ?? PLACEHOLDER_IMAGE_PATH })
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-10">
      {/* Container with same padding as product page */}
      <div className="container px-6 py-8">
        {/* Main Product Card */}
        <div className="bg-background rounded-xl border border-border p-6 lg:p-8">
        {/* 55/45 Split Layout like actual product page */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.22fr_1fr] gap-8 lg:gap-10">
          
          {/* ========== LEFT COLUMN: Gallery ========== */}
          <div className="space-y-4">
            {/* Main Hero Image */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border group">
              {showDiscount && (
                <Badge variant="sale" className="absolute top-4 left-4 z-10">
                  -{discountPercent}%
                </Badge>
              )}
              {allImages[selectedImageIndex] ? (
                <Image
                  src={allImages[selectedImageIndex]}
                  alt={title}
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              ) : (
                <div className="size-full flex items-center justify-center text-muted-foreground">
                  <Package size={80} className="opacity-30" />
                </div>
              )}
              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium">
                  {selectedImageIndex + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Horizontal Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {allImages.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      "relative size-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all",
                      selectedImageIndex === idx
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Image src={src} alt={`${title} ${idx + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Category Breadcrumb */}
            {categoryPath && categoryPath.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {categoryPath.map((cat, i) => (
                  <React.Fragment key={cat.slug}>
                    {i > 0 && <span className="text-border">›</span>}
                    <span className="hover:text-foreground transition-colors cursor-pointer">
                      {locale === "bg" && cat.nameBg ? cat.nameBg : cat.name}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Description Section */}
            {description && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-foreground">{tProduct("description")}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}
          </div>

          {/* ========== RIGHT COLUMN: Buy Box ========== */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-foreground leading-tight">{title}</h1>
              {condition && (
                <Badge variant="condition">
                  <Tag size={12} />
                  {condition}
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {inStock ? (
                <div className="flex items-center gap-1.5 text-sm text-success font-medium">
                  <CheckCircle size={16} weight="fill" />
                  <span>{tProduct("inStockItems", { count: stock })}</span>
                </div>
              ) : (
                <Badge variant="stock-out">{tProduct("outOfStock")}</Badge>
              )}
            </div>

            {/* Price Block */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={cn("text-3xl font-bold tabular-nums", showDiscount ? "text-price-sale" : "text-price")}>
                  {formatPrice(price, { locale })}
                </span>
                {showDiscount && originalPrice && (
                  <span className="text-lg text-price-original line-through tabular-nums">
                    {formatPrice(originalPrice, { locale })}
                  </span>
                )}
                {showDiscount && (
                  <Badge variant="sale">{tProduct("savePercent", { percent: discountPercent })}</Badge>
                )}
              </div>

              {/* Shipping Info */}
              <div className="flex flex-wrap gap-2">
                {freeShipping && (
                  <Badge variant="shipping">
                    <Truck size={14} weight="fill" />
                    {tProduct("freeShipping")}
                  </Badge>
                )}
                {location && (
                  <Badge variant="info">
                    <MapPin size={14} />
                    {location}
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            {hasRating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star size={18} weight="fill" className="fill-rating text-rating" />
                  <span className="font-semibold tabular-nums">{rating.toFixed(1)}</span>
                </div>
                {typeof reviews === "number" && reviews > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({tProduct("reviews", { count: reviews.toLocaleString() })})
                  </span>
                )}
              </div>
            )}

            {/* Quantity + Total */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">{tProduct("quantity")}</span>
                <div className="flex items-center border border-border rounded-lg bg-background">
                  <Button variant="ghost" size="icon-sm" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} className="rounded-r-none">
                    <Minus size={14} />
                  </Button>
                  <span className="w-12 text-center font-medium tabular-nums">{quantity}</span>
                  <Button variant="ghost" size="icon-sm" onClick={() => setQuantity(q => Math.min(stock || 99, q + 1))} disabled={!inStock} className="rounded-l-none">
                    <Plus size={14} />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">{tProduct("total")}</span>
                <div className="text-lg font-bold text-foreground tabular-nums">{formatPrice(price * quantity, { locale })}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button variant="cta" size="lg" className="flex-1 gap-2" onClick={() => onAddToCart(quantity)} disabled={!inStock}>
                  <ShoppingCart size={20} weight="bold" />
                  {t("addToCart")}
                </Button>
                <Button variant={isWishlisted ? "default" : "outline"} size="lg" onClick={handleWishlistToggle}>
                  <Heart size={20} weight={isWishlisted ? "fill" : "regular"} />
                </Button>
                <Button variant="outline" size="lg" onClick={onShare}>
                  <Share size={20} />
                </Button>
              </div>
              <Button variant="outline" size="lg" className="w-full" onClick={() => onBuyNow(quantity)} disabled={!inStock}>
                {tProduct("buyNow")}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="size-10 rounded-full bg-success/10 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-success" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{tProduct("buyerProtection")}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck size={20} className="text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{tProduct("fastDelivery")}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="size-10 rounded-full bg-info/10 flex items-center justify-center">
                  <ArrowsClockwise size={20} className="text-info" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{tProduct("easyReturns")}</span>
              </div>
            </div>

            {/* Seller Card */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-4">
                <Avatar className="size-14 border-2 border-border">
                  <AvatarImage src={sellerAvatarUrl ?? undefined} alt={sellerName ?? "Seller"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {(sellerName ?? username ?? "S").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">{sellerName ?? username}</span>
                    {sellerVerified && <CheckCircle size={18} weight="fill" className="text-success shrink-0" />}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {sellerVerified ? tProduct("verifiedSeller") : tProduct("seller")}
                  </span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={onMessage}>
                  <ChatCircle size={16} />
                  {tProduct("message")}
                </Button>
                <Button variant="ghost" className="flex-1 gap-2" onClick={onNavigateToProduct}>
                  <Storefront size={16} />
                  {tProduct("viewShop")}
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

// --- MAIN COMPONENT (Responsive: Dialog on desktop, Drawer on mobile) ---

export function ProductQuickViewDrawer({
  open,
  onOpenChange,
  product,
  isLoading = false,
}: ProductQuickViewDrawerProps) {
  const t = useTranslations("Drawers")
  const tProduct = useTranslations("Product")
  const tModal = useTranslations("ProductModal")
  const locale = useLocale()
  const router = useRouter()
  const { addToCart } = useCart()
  const isMobile = useIsMobile()

  const handleAddToCart = React.useCallback((qty: number = 1) => {
    if (!product) return
    const imgs = product.images?.length ? product.images : product.image ? [product.image] : []
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: imgs[0] ?? PLACEHOLDER_IMAGE_PATH,
      quantity: qty,
      ...(product.slug ? { slug: product.slug } : {}),
      ...(product.username ? { username: product.username } : {}),
    })
    onOpenChange(false)
    toast.success(t("addedToCart"))
  }, [addToCart, product, onOpenChange, t])

  const handleBuyNow = React.useCallback((qty: number = 1) => {
    handleAddToCart(qty)
    // Could navigate to checkout
  }, [handleAddToCart])

  const productPath = React.useMemo(() => {
    if (!product) return "#"
    const { id, slug, username } = product
    return username && slug 
      ? `/${locale}/${username}/${slug}` 
      : username 
        ? `/${locale}/${username}/${id}` 
        : "#"
  }, [product, locale])

  const handleNavigateToProduct = React.useCallback(() => {
    onOpenChange(false)
    router.push(productPath)
  }, [onOpenChange, router, productPath])

  const handleCopyLink = React.useCallback(async () => {
    try {
      const fullUrl = window.location.origin + productPath
      await navigator.clipboard.writeText(fullUrl)
      toast.success(tModal("linkCopied"))
    } catch {
      toast.error(tModal("copyFailed"))
    }
  }, [productPath, tModal])

  const handleMessage = React.useCallback(() => {
    if (!product?.username) return
    onOpenChange(false)
    router.push(`/${locale}/messages?to=${product.username}`)
  }, [product, locale, router, onOpenChange])

  const title = product?.title ?? ""
  const description = product?.description ?? title

  // MOBILE: Use Drawer (slide up from bottom)
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent aria-label={t("quickView")} showHandle>
          <DrawerTitle className="sr-only">{title || t("quickView")}</DrawerTitle>
          <DrawerDescription className="sr-only">{description}</DrawerDescription>
          <DrawerBody className="px-0">
            {isLoading ? (
              <QuickViewSkeleton />
            ) : product ? (
              <QuickViewContent
                product={product}
                locale={locale}
                onAddToCart={() => handleAddToCart(1)}
                onBuyNow={() => handleBuyNow(1)}
                onNavigateToProduct={handleNavigateToProduct}
                t={t}
                tProduct={tProduct}
              />
            ) : null}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  // DESKTOP: Full-featured product modal using CSS tokens
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-(--product-modal-w) h-(--product-modal-h) max-w-none sm:max-w-none p-0 gap-0 overflow-hidden flex flex-col"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title || t("quickView")}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label={tModal("closeModal")}
              className="shrink-0"
            >
              <X size={20} />
            </Button>
            <h2 className="text-lg font-semibold truncate">{title}</h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" onClick={handleNavigateToProduct}>
              {tModal("viewFullPage")}
              <ArrowUpRight size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCopyLink} aria-label={tModal("copyLink")}>
              <LinkIcon size={18} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8">
              <QuickViewSkeleton />
            </div>
          ) : product ? (
            <DesktopProductModal
              product={product}
              locale={locale}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onNavigateToProduct={handleNavigateToProduct}
              onMessage={handleMessage}
              onShare={handleCopyLink}
              t={t}
              tProduct={tProduct}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
