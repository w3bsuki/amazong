"use client"

// =============================================================================
// PRODUCT MODAL LAYOUT - Perfect-Fit Desktop Quick View
// =============================================================================
// Clean 2-column grid (gallery left, buy box right). No nested scrollbars.
// Content fits viewport; long details link to full page. Essential info only.
// =============================================================================

import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  MapPin,
  ShoppingCart,
  Zap,
  BadgeCheck,
  RotateCcw,
  Store,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  Star,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import type { ProductPageViewModel } from "@/lib/view-models/product-page"
import type { Database } from "@/lib/supabase/database.types"
import type { CategoryType } from "@/lib/utils/category-type"

type ProductRow = Database["public"]["Tables"]["products"]["Row"]
type SellerStatsRow = Database["public"]["Tables"]["seller_stats"]["Row"]

type ProductWithSellerStats = ProductRow & { seller_stats?: Partial<SellerStatsRow> | null }

type SellerSummary = {
  id: string
  username?: string | null
  display_name?: string | null
  avatar_url?: string | null
  verified?: boolean | null
  created_at?: string | null
  last_active?: string | null
}

type CategorySummary = {
  id?: string
  name: string
  name_bg?: string | null
  slug: string
  icon?: string | null
  parent_id?: string | null
}

interface ProductModalLayoutProps {
  locale: string
  username: string
  productSlug: string
  product: ProductWithSellerStats
  seller: SellerSummary
  category: CategorySummary | null
  rootCategory: CategorySummary | null
  viewModel: ProductPageViewModel
  favoritesCount?: number | undefined
}

export function ProductModalLayout({
  locale,
  username,
  productSlug,
  product,
  seller,
  category,
  rootCategory,
  viewModel,
  favoritesCount,
}: ProductModalLayoutProps) {
  const t = useTranslations("Product")
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { toast } = useToast()

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const images = viewModel.galleryImages
  const activeImage = images[activeImageIndex]
  const primaryImage = images[0]?.src ?? null

  const price = Number(product.price ?? 0)
  const originalPrice = product.list_price != null ? Number(product.list_price) : null
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const stock = product.stock
  const isOutOfStock = stock === 0
  const isLowStock = stock != null && stock > 0 && stock <= 10
  const productInWishlist = isInWishlist(product.id)

  const categoryType = viewModel.categoryType as CategoryType
  const isRealEstate = categoryType === "real-estate"
  const isAutomotive = categoryType === "automotive"
  const showQuantity = !isRealEstate && !isAutomotive

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const cartProduct = {
    id: product.id,
    title: product.title,
    price,
    image: primaryImage ?? "",
    slug: product.slug || product.id,
    ...(seller.username ? { username: seller.username } : {}),
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart({ ...cartProduct, quantity })
    toast({ title: t("addedToCart"), description: `${quantity}x ${product.title}` })
  }

  const sellerName = viewModel.sellerName || seller?.display_name || seller?.username || username
  const sellerAvatarUrl = viewModel.sellerAvatarUrl || seller?.avatar_url
  const sellerVerified = viewModel.sellerVerified

  // Get specs for compact display (max 4)
  const compactSpecs = viewModel.heroSpecs.slice(0, 4)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:p-5 h-full">
      {/* LEFT COLUMN: Gallery */}
      <div className="flex flex-col gap-3">
        {/* Main Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-card border border-border group">
          {activeImage && (
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          )}
          
          {/* Discount Badge */}
          {discount > 0 && (
            <Badge variant="destructive" className="absolute top-3 left-3 text-xs">
              -{discount}%
            </Badge>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setActiveImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={t("previousImage")}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={t("nextImage")}
              >
                <ChevronRight className="size-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-foreground/80 backdrop-blur-sm text-background text-xs font-medium px-2 py-0.5 rounded-full">
                {activeImageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {images.slice(0, 6).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImageIndex(i)}
                className={cn(
                  "relative size-12 rounded-md overflow-hidden shrink-0 transition-all",
                  i === activeImageIndex
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "border border-border opacity-60 hover:opacity-100"
                )}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="48px" />
              </button>
            ))}
            {images.length > 6 && (
              <div className="size-12 rounded-md bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground shrink-0">  
                {`+${images.length - 6}`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Buy Box & Details */}
      <div className="flex flex-col gap-4">
        {/* Title & Condition */}
        <div>
          <h2 className="text-lg font-semibold text-foreground leading-snug line-clamp-2">
            {product.title}
          </h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {product.condition && (
              <Badge variant="secondary" className="text-xs bg-success/10 text-success border-0">
                {product.condition}
              </Badge>
            )}
            {category && (
              <Badge variant="outline" className="text-xs">
                {locale === "bg" && category.name_bg ? category.name_bg : category.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between gap-3">
          {(product.rating ?? 0) > 0 && (
            <div className="flex items-center gap-1.5">
              <Star className="size-4 fill-rating text-rating" />
              <span className="text-sm font-medium">{Number(product.rating).toFixed(1)}</span>
              {(product.review_count ?? 0) > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({product.review_count?.toLocaleString()})
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "size-2 rounded-full",
              isOutOfStock ? "bg-destructive" : isLowStock ? "bg-warning" : "bg-success"
            )} />
            <span className={cn(
              "text-xs font-medium",
              isOutOfStock ? "text-destructive" : isLowStock ? "text-warning" : "text-success"
            )}>
              {isOutOfStock ? t("outOfStock") : isLowStock ? t("lowStock", { count: stock }) : t("inStock")}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-price-sale">{formatPrice(price)}</span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(originalPrice)}</span>
              <Badge variant="destructive" className="text-xs">
                {t("savePercent", { percent: discount })}
              </Badge>
            </>
          )}
        </div>

        {/* Hero Specs Grid */}
        {compactSpecs.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {compactSpecs.map((spec) => (
              <div
                key={spec.label}
                className="rounded-md border border-border bg-card px-2.5 py-1.5 text-center"
              >
                <span className="block text-xs uppercase tracking-wide text-muted-foreground truncate">
                  {spec.label}
                </span>
                <span className="block text-sm font-semibold text-foreground truncate">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Quantity + CTA */}
        <div className="space-y-3 mt-auto">
          {showQuantity && !isOutOfStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{t("qty")}</span>
              <div className="flex items-center border border-border rounded-md bg-background">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-muted transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-sm font-medium min-w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  className="px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
              <span className="ml-auto text-base font-bold">{formatPrice(price * quantity)}</span>
            </div>
          )}

          {/* Primary CTA */}
          <div className="flex gap-2">
            <Button
              className="flex-1 h-11 gap-2"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="size-4" />
              {t("addToCart")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-11"
              onClick={() => toggleWishlist(cartProduct)}
              aria-label={productInWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
            >
              <Heart className={cn("size-4", productInWishlist ? "fill-destructive text-destructive" : "")} />
            </Button>
            <Button variant="outline" size="icon" className="size-11">
              <Share2 className="size-4" />
            </Button>
          </div>

          {/* Secondary CTA */}
          <Button
            variant="secondary"
            className="w-full h-10 gap-2"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <Zap className="size-4" />
            {t("buyNow")}
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-success" />
            {t("buyerProtection")}
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="size-3.5 text-shipping-free" />
            {t("fastDelivery")}
          </span>
          <span className="flex items-center gap-1.5">
            <RotateCcw className="size-3.5" />
            {t("easyReturns")}
          </span>
        </div>

        {/* Seller Card - Compact */}
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-border">
              <AvatarImage src={sellerAvatarUrl ?? undefined} />
              <AvatarFallback className="text-sm font-medium bg-muted">
                {sellerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground text-sm truncate">{sellerName}</span>
                {sellerVerified && <BadgeCheck className="size-4 text-verified shrink-0" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                {product.seller_stats?.average_rating && (
                  <span className="flex items-center gap-0.5">
                    <Star className="size-3 fill-rating text-rating" />
                    {Number(product.seller_stats.average_rating).toFixed(1)}
                  </span>
                )}
                {product.seller_stats?.total_sales && (
                  <span className="flex items-center gap-0.5">
                    <Package className="size-3" />
                    {product.seller_stats.total_sales.toLocaleString()} {t("orders")}
                  </span>
                )}
                {product.seller_city && (
                  <span className="flex items-center gap-0.5">
                    <MapPin className="size-3" />
                    {product.seller_city.split(",")[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2.5">
            <Button variant="outline" size="sm" className="flex-1 h-8 gap-1.5 text-xs">
              <MessageCircle className="size-3.5" />
              {t("message")}
            </Button>
            {seller.username && (
              <Button variant="outline" size="sm" className="flex-1 h-8 gap-1.5 text-xs" asChild>
                <Link href={`/${locale}/${seller.username}`}>
                  <Store className="size-3.5" />
                  {t("viewStore")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
