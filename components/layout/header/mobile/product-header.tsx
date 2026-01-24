"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, ShareNetwork, Heart } from "@phosphor-icons/react"
import { safeAvatarSrc, cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useWishlist } from "@/components/providers/wishlist-context"
import type { ProductHeaderProps } from "../types"

/**
 * Mobile Product Header
 * 
 * Product page header with:
 * - Back button
 * - Seller avatar + Product title
 * - Wishlist button
 * - Share button
 * 
 * Used for: Product detail pages (mobile only)
 */
export function MobileProductHeader({
  productTitle,
  sellerName,
  sellerUsername,
  sellerAvatarUrl,
  locale,
  onBack,
  productId,
  productPrice,
  productImage,
}: ProductHeaderProps) {
  const tProduct = useTranslations("Product")
  const sellerInitials = (sellerName || sellerUsername || "?").slice(0, 2).toUpperCase()
  const profileHref = sellerUsername ? `/${sellerUsername}` : "#"

  // Wishlist
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWishlisted = productId ? isInWishlist(productId) : false

  const handleWishlistToggle = () => {
    if (!productId || !productTitle) return
    toggleWishlist({
      id: productId,
      title: productTitle,
      price: productPrice ?? 0,
      image: productImage ?? "",
    })
  }

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: window.location.href })
      } catch {
        // User cancelled
      }
    }
  }

  return (
    <div className="md:hidden bg-background/90 backdrop-blur-md border-b border-border/50 pt-safe">
      <div className="h-12 flex items-center gap-2 px-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full shrink-0"
          aria-label={tProduct("back")}
          onClick={onBack}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <Link href={profileHref} className="shrink-0">
            <Avatar className="size-7 border border-border">
              <AvatarImage src={safeAvatarSrc(sellerAvatarUrl)} alt={sellerName || tProduct("seller")} />
              <AvatarFallback className="text-2xs font-medium bg-muted">{sellerInitials}</AvatarFallback>
            </Avatar>
          </Link>
          {productTitle && (
            <span className="text-sm font-medium text-foreground truncate">{productTitle}</span>
          )}
        </div>
        {productId && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            aria-label={isWishlisted ? tProduct("removeFromWishlist") : tProduct("addToWishlist")}
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={cn("size-5", isWishlisted && "fill-wishlist-active text-wishlist-active")} 
              weight={isWishlisted ? "fill" : "regular"}
            />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full shrink-0"
          aria-label={tProduct("share")}
          onClick={handleShare}
        >
          <ShareNetwork className="size-5" />
        </Button>
      </div>
    </div>
  )
}
