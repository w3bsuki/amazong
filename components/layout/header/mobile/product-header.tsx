"use client"

import { IconButton } from "@/components/ui/icon-button"
import { UserAvatar } from "@/components/shared/user-avatar"
import { ArrowLeft, Export, Heart } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useWishlist } from "@/components/providers/wishlist-context"
import { Link } from "@/i18n/routing"
import type { ProductHeaderProps } from "../types"

/**
 * Mobile Product Header - Premium E-commerce Design
 * 
 * A polished, modern product page header inspired by top marketplace apps.
 * Features glass morphism, micro-interactions, and thoughtful UX.
 * 
 * Layout: [Back] [Avatar • Title] [Wishlist] [Share/More]
 * 
 * Design principles:
 * - Glass background with premium blur
 * - Semantic h1 for SEO/accessibility
 * - Micro-interactions on all touch targets
 * - Trust indicator via seller avatar
 * - Native share API integration
 */
export function MobileProductHeader({
  productTitle,
  sellerName,
  sellerUsername,
  sellerAvatarUrl,
  onBack,
  productId,
  productPrice,
  productImage,
}: ProductHeaderProps) {
  const tProduct = useTranslations("Product")

  // Seller display
  const profileHref = sellerUsername ? `/${sellerUsername}` : "#"
  const hasSellerInfo = sellerUsername || sellerAvatarUrl

  // Wishlist state
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

  // Native share with fallback
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: productTitle || document.title, 
          url: window.location.href 
        })
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard?.writeText(window.location.href)
    }
  }

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 border-b border-border-subtle bg-background pt-safe md:hidden"
      )}
    >
      <div className="flex h-(--control-primary) items-center px-1">
        {/* Back Button - Large touch target */}
        <IconButton
          type="button"
          variant="ghost"
          className={cn(
            "shrink-0 border border-transparent text-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-hover active:bg-active"
          )}
          aria-label={tProduct("back")}
          onClick={onBack}
        >
          <ArrowLeft className="size-icon-sm" weight="bold" />
        </IconButton>

        {/* Center Content: Avatar + Title */}
        <div className="flex-1 flex items-center gap-2.5 min-w-0 pl-0.5 pr-1">
          {/* Seller Avatar - Trust indicator */}
          {hasSellerInfo && (
            <Link 
              href={profileHref} 
              className={cn(
                "shrink-0 rounded-full tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                "ring-1 ring-border-subtle"
              )}
            >
              <UserAvatar
                name={sellerName || tProduct("seller")}
                avatarUrl={sellerAvatarUrl ?? null}
                size="sm"
                className="size-8"
                fallbackClassName="text-xs font-semibold bg-muted text-muted-foreground"
              />
            </Link>
          )}
          
          {/* Product Title */}
          {productTitle && (
            <h1 
              className={cn(
                "text-sm font-semibold leading-tight",
                "text-foreground",
                "truncate"
              )}
            >
              {productTitle}
            </h1>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center shrink-0">
          {/* Wishlist Button */}
          {productId && (
            <IconButton
              type="button"
              variant="ghost"
              className={cn(
                "border border-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-hover active:bg-active"
              )}
              aria-label={isWishlisted ? tProduct("removeFromWishlist") : tProduct("addToWishlist")}
              aria-pressed={isWishlisted}
              onClick={handleWishlistToggle}
            >
              <Heart 
              className={cn(
                  "size-icon-sm motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none",
                  isWishlisted 
                    ? "fill-wishlist-active text-wishlist-active" 
                    : "text-foreground"
                )} 
                weight={isWishlisted ? "fill" : "regular"}
              />
            </IconButton>
          )}

          {/* Share Button */}
            <IconButton
              type="button"
              variant="ghost"
              className={cn(
              "border border-transparent text-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-hover active:bg-active"
            )}
            aria-label={tProduct("share")}
            onClick={handleShare}
          >
            <Export className="size-icon-sm" weight="bold" />
          </IconButton>
        </div>
      </div>
    </header>
  )
}
