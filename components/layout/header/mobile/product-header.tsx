"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Export, Heart, DotsThree } from "@phosphor-icons/react"
import { cn, safeAvatarSrc } from "@/lib/utils"
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
  locale,
  onBack,
  productId,
  productPrice,
  productImage,
}: ProductHeaderProps) {
  const tProduct = useTranslations("Product")

  // Seller display
  const sellerInitials = (sellerName || sellerUsername || "?").slice(0, 1).toUpperCase()
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
        "md:hidden",
        "sticky top-0 z-50",
        // Premium glass effect
        "bg-white/80 dark:bg-zinc-950/80",
        "backdrop-blur-xl backdrop-saturate-150",
        // Subtle shadow instead of harsh border
        "shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
        "dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
        // Safe area for notch devices
        "pt-safe"
      )}
    >
      <div className="h-14 flex items-center px-1">
        {/* Back Button - Large touch target */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-11 rounded-full shrink-0",
            "text-zinc-700 dark:text-zinc-200",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800",
            "active:scale-95 active:bg-zinc-200 dark:active:bg-zinc-700",
            "transition-all duration-150"
          )}
          aria-label={tProduct("back")}
          onClick={onBack}
        >
          <ArrowLeft className="size-icon-sm" weight="bold" />
        </Button>

        {/* Center Content: Avatar + Title */}
        <div className="flex-1 flex items-center gap-2.5 min-w-0 pl-0.5 pr-1">
          {/* Seller Avatar - Trust indicator */}
          {hasSellerInfo && (
            <Link 
              href={profileHref} 
              className={cn(
                "shrink-0 rounded-full",
                "ring-2 ring-white dark:ring-zinc-900",
                "shadow-sm",
                "active:scale-95 transition-transform"
              )}
            >
              <Avatar className="size-8">
                <AvatarImage 
                  src={safeAvatarSrc(sellerAvatarUrl)} 
                  alt={sellerName || tProduct("seller")} 
                />
                <AvatarFallback 
                  className={cn(
                    "text-xs font-semibold",
                    "bg-linear-to-br from-zinc-100 to-zinc-200",
                    "dark:from-zinc-700 dark:to-zinc-800",
                    "text-zinc-600 dark:text-zinc-300"
                  )}
                >
                  {sellerInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          
          {/* Product Title */}
          {productTitle && (
            <h1 
              className={cn(
                "text-[15px] font-semibold leading-tight",
                "text-zinc-900 dark:text-zinc-50",
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-11 rounded-full",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                "active:scale-95 transition-all duration-150",
                isWishlisted && "hover:bg-rose-50 dark:hover:bg-rose-950/30"
              )}
              aria-label={isWishlisted ? tProduct("removeFromWishlist") : tProduct("addToWishlist")}
              aria-pressed={isWishlisted}
              onClick={handleWishlistToggle}
            >
              <Heart 
                className={cn(
                  "size-icon-sm transition-all duration-200",
                  isWishlisted 
                    ? "fill-rose-500 text-rose-500 scale-110" 
                    : "text-zinc-700 dark:text-zinc-200"
                )} 
                weight={isWishlisted ? "fill" : "regular"}
              />
            </Button>
          )}

          {/* Share Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-11 rounded-full",
              "text-zinc-700 dark:text-zinc-200",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              "active:scale-95 transition-all duration-150"
            )}
            aria-label={tProduct("share")}
            onClick={handleShare}
          >
            <Export className="size-icon-sm" weight="bold" />
          </Button>
        </div>
      </div>
    </header>
  )
}
