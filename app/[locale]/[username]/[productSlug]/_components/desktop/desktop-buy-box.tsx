"use client"

// =============================================================================
// DESKTOP BUY BOX - Sticky with Embedded Seller
// =============================================================================
// Based on V2 demo design - the winner from our audit.
// Key features:
// - Sticky positioning on scroll
// - Seller card embedded inside (not separate)
// - Category-adaptive CTAs (Buy Now vs Contact Agent vs Test Drive)
// - Quantity selector (hidden for real-estate/automotive)
// - Shipping/Returns info section
// =============================================================================

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import {
  Heart,
  MessageCircle,
  Share2,
  Package,
  Clock,
  MapPin,
  BadgeCheck,
  Flag,
  Store,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import type { CategoryType } from "@/lib/utils/category-type"
import { DesktopBuyBoxCtaSection } from "./desktop-buy-box-cta-section"
import { DesktopBuyBoxPriceSection } from "./desktop-buy-box-price-section"
import { DesktopBuyBoxShippingInfo } from "./desktop-buy-box-shipping-info"
import { ReportListingDialog } from "../report-listing-dialog"

interface SellerInfo {
  id: string
  name: string
  username?: string | null
  avatarUrl?: string | null
  verified?: boolean
  rating?: number | null
  reviewCount?: number | null
  responseTime?: string | null
  ordersCompleted?: number | null
  location?: string | null
}

export interface DesktopBuyBoxProps {
  productId: string
  productSlug: string
  title: string
  price: number
  originalPrice?: number | null
  currency?: string
  condition?: string | null
  stock?: number | null
  seller: SellerInfo
  categoryType?: CategoryType
  freeShipping?: boolean
  location?: string | null
  primaryImage?: string | null
  className?: string
}

export function DesktopBuyBox({
  productId,
  productSlug,
  title,
  price,
  originalPrice,
  currency = "EUR",
  condition,
  stock,
  seller,
  categoryType = "default",
  freeShipping = false,
  location,
  primaryImage,
  className,
}: DesktopBuyBoxProps) {
  const t = useTranslations("Product")
  const tModal = useTranslations("ProductModal")
  const tCommon = useTranslations("Common")
  const locale = useLocale()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { toast } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [reportOpen, setReportOpen] = useState(false)
  const [wishlistPending, setWishlistPending] = useState(false)

  const isRealEstate = categoryType === "real-estate"
  const isAutomotive = categoryType === "automotive"
  const showQuantity = !isRealEstate && !isAutomotive

  const isOutOfStock = stock === 0
  const isLowStock = stock != null && stock > 0 && stock <= 5
  const productInWishlist = isInWishlist(productId)

  // Cart product info
  const cartProduct = {
    id: productId,
    title,
    price,
    image: primaryImage ?? "",
    slug: productSlug,
    ...(seller.username ? { username: seller.username } : {}),
  }

  // Handle add to cart
  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart({ ...cartProduct, quantity })
    toast({
      title: t("addedToCart"),
      description: `${quantity}x ${title}`,
    })
  }

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart()
    // Navigate to checkout would happen here.
  }

  const handleWishlistToggle = async () => {
    if (wishlistPending) return
    setWishlistPending(true)
    try {
      await toggleWishlist(cartProduct)
    } catch {
      toast({
        variant: "destructive",
        title: tCommon("error"),
      })
    } finally {
      setWishlistPending(false)
    }
  }

  const handleShare = async () => {
    if (typeof window === "undefined") return
    const url = window.location.href
    if (!url) return

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return
        }
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: t("share"),
          description: tModal("linkCopied"),
        })
      } catch {
        toast({
          variant: "destructive",
          title: t("share"),
          description: tModal("copyFailed"),
        })
      }
    }
  }

  return (
    <div
      className={cn(
        "sticky top-24 rounded-xl border border-border bg-card p-4 space-y-3",
        className
      )}
    >
      {/* Stock Status + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isOutOfStock ? (
            <>
              <span className="size-1.5 rounded-full bg-destructive" />
              <span className="text-sm font-medium text-destructive">
                {t("outOfStock")}
              </span>
            </>
          ) : isLowStock ? (
            <>
              <span className="size-1.5 rounded-full bg-warning" />
              <span className="text-sm font-medium text-warning">
                {t("lowStock", { count: stock })}
              </span>
            </>
          ) : (
            <>
              <span className="size-1.5 rounded-full bg-success" />
              <span className="text-sm font-medium text-success">
                {t("inStock")}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <IconButton
            type="button"
            variant="ghost"
            onClick={() => {
              void handleWishlistToggle()
            }}
            disabled={wishlistPending}
            aria-label={
              productInWishlist ? t("removeFromWatchlist") : t("addToWatchlist")
            }
            className="text-muted-foreground hover:text-foreground"
          >
            <Heart
              className={cn(
                productInWishlist
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground"
              )}
            />
          </IconButton>
          <IconButton
            type="button"
            variant="ghost"
            onClick={() => {
              void handleShare()
            }}
            aria-label={t("share")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Share2 />
          </IconButton>
        </div>
      </div>

      <DesktopBuyBoxPriceSection
        locale={locale}
        currency={currency}
        price={price}
        originalPrice={originalPrice}
        condition={condition}
      />

      <DesktopBuyBoxShippingInfo
        isRealEstate={isRealEstate}
        isAutomotive={isAutomotive}
        freeShipping={freeShipping}
        location={location}
        t={t}
      />

      <DesktopBuyBoxCtaSection
        locale={locale}
        currency={currency}
        price={price}
        quantity={quantity}
        setQuantity={setQuantity}
        isRealEstate={isRealEstate}
        isAutomotive={isAutomotive}
        isOutOfStock={isOutOfStock}
        showQuantity={showQuantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        t={t}
      />

      {/* Embedded Seller Card */}
      <div className="rounded-xl border border-border bg-surface-subtle p-3">
        <div className="flex items-center gap-2.5">
          <UserAvatar
            name={seller.name}
            avatarUrl={seller.avatarUrl ?? null}
            className="size-10 border border-border bg-muted"
            fallbackClassName="text-xs font-medium bg-muted"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground text-sm truncate">
                {seller.name}
              </span>
              {seller.verified && (
                <BadgeCheck className="size-3.5 text-muted-foreground shrink-0" />
              )}
            </div>
            {seller.rating != null && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-muted-foreground">★</span>
                <span>{seller.rating.toFixed(1)}</span>
                {seller.reviewCount != null && (
                  <>
                    <span>•</span>
                    <span>
                      {t("reviews", { count: seller.reviewCount })}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Seller Stats */}
        {(seller.responseTime || seller.ordersCompleted || seller.location) && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle text-xs text-muted-foreground">
            {seller.responseTime && (
              <span className="flex items-center gap-1">
                <Clock className="size-2.5" />
                {seller.responseTime}
              </span>
            )}
            {seller.ordersCompleted != null && (
              <span className="flex items-center gap-1">
                <Package className="size-2.5" />
                {seller.ordersCompleted.toLocaleString()} {t("orders")}
              </span>
            )}
            {seller.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-2.5" />
                {seller.location.split(",")[0]}
              </span>
            )}
          </div>
        )}

        {/* Seller Actions */}
        <div className="flex gap-2 mt-2.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 text-xs bg-background"
          >
            <MessageCircle className="size-3" />
            {t("message")}
          </Button>
          {seller.username && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs bg-background"
              asChild
            >
              <Link href={`/${seller.username}`}>
                <Store className="size-3 mr-1" />
                {t("viewStore")}
              </Link>
            </Button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setReportOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active"
      >
        <Flag className="size-4" aria-hidden="true" />
        {t("report.listing")}
      </button>

      <ReportListingDialog productId={productId} open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  )
}
