"use client"

// =============================================================================
// MOBILE GALLERY - Edge-to-Edge with Horizontal Thumbnail Strip
// =============================================================================
// Based on V2 demo design - the winner from our audit.
// Key features:
// - Full-bleed edge-to-edge hero image
// - Horizontal thumbnail strip below (not just dots)
// - Swipe navigation with scroll sync
// - Floating action buttons (back, share, wishlist)
// - Image counter overlay
// - Fullscreen image viewer on tap
// =============================================================================

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Heart, ChevronLeft, MoreHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { getConditionBadgeVariant } from "@/components/shared/product/_lib/condition-badges"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/components/providers/wishlist-context"
import type { GalleryImage } from "@/lib/view-models/product-page"

export interface MobileGalleryProps {
  images: GalleryImage[]
  /** Product info for wishlist functionality */
  product?: {
    id: string
    title: string
    price: number
    slug?: string
    username?: string
  }
  /** Optional overlay element (e.g., condition badge) positioned bottom-left */
  overlayBadge?: ReactNode
  /** Category label text */
  categoryLabel?: string
  /** Condition label text (display value) */
  conditionLabel?: string
  /** Condition value for styling (e.g., "new", "like_new", "good", "fair") */
  condition?: string | null
  /** Called when back button is pressed */
  onBack?: () => void
  className?: string
}

export function MobileGallery({
  images,
  product,
  overlayBadge,
  categoryLabel,
  conditionLabel,
  condition,
  onBack,
  className,
}: MobileGalleryProps) {
  const t = useTranslations("Product")
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)
  
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWishlisted = product ? isInWishlist(product.id) : false

  const getAlt = useCallback(
    (img: GalleryImage) => t(img.altKey as never, img.altParams as never),
    [t],
  )

  // Sync scroll position with active index
  useEffect(() => {
    const el = galleryRef.current
    if (!el) return
    
    const handleScroll = () => {
      const newIndex = Math.round(el.scrollLeft / el.offsetWidth)
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
        setActiveIndex(newIndex)
      }
    }
    
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [activeIndex, images.length])

  // Scroll to specific image
  const scrollToImage = useCallback((index: number) => {
    const el = galleryRef.current
    if (!el) return
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" })
  }, [])

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!product) return
    toggleWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      image: images[0]?.src ?? "",
    })
  }

  if (!images || images.length === 0) {
    return (
      <div className={cn(
        "w-full aspect-square bg-muted flex items-center justify-center",
        className
      )}>
        <span className="text-sm text-muted-foreground">{t("noImage")}</span>
      </div>
    )
  }

  return (
    <>
      <div className={cn("w-full relative", className)}>
        {/* Main Gallery - Edge-to-Edge */}
        <div className="relative bg-surface-gallery">
          {/* Floating Navigation */}
          <div className="absolute top-3 left-3 right-3 z-20 flex justify-between">
            {/* Back Button */}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="size-touch-lg rounded-full bg-surface-floating/90 shadow-sm flex items-center justify-center active:bg-background"
                aria-label={t("back")}
              >
                <ChevronLeft className="size-5 text-text-strong" />
              </button>
            )}
            {!onBack && <div />}
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {product && (
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={cn(
                    "size-touch-lg rounded-full shadow-sm flex items-center justify-center",
                    isWishlisted 
                      ? "bg-destructive text-destructive-foreground" 
                      : "bg-surface-floating/90 active:bg-background"
                  )}
                  aria-label={isWishlisted ? t("removeFromWishlist") : t("addToWishlist")}
                >
                  <Heart 
                    className={cn(
                      "size-4",
                      isWishlisted && "fill-current"
                    )} 
                  />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Badges */}
          <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1.5 items-start">
            {conditionLabel && (
              <Badge variant={getConditionBadgeVariant(condition)}>
                {conditionLabel}
              </Badge>
            )}
            {categoryLabel && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-background/90 text-xs font-medium text-foreground">
                {categoryLabel}
              </span>
            )}
            {overlayBadge}
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-20 px-2 py-1 rounded bg-surface-overlay text-overlay-text text-xs font-medium">
              {activeIndex + 1}/{images.length}
            </div>
          )}

          {/* Thumbnail Strip - Overlaid inside gallery (prototype pattern) */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-3 right-16 z-20 flex gap-1.5 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    scrollToImage(i)
                  }}
                  className={cn(
                    "flex-shrink-0 size-11 rounded-lg overflow-hidden border-2 transition-all",
                    i === activeIndex 
                      ? "border-background shadow-md" 
                      : "border-transparent opacity-70"
                  )}
                  aria-label={t("viewImageNumber", { number: i + 1 })}
                >
                  <Image
                    src={img.src}
                    alt={getAlt(img)}
                    width={44}
                    height={44}
                    className="object-cover size-full"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Swipeable Image Gallery */}
          <div
            ref={galleryRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            onClick={() => setViewerOpen(true)}
          >
            {images.map((img, i) => (
              <div key={i} className="flex-none w-full snap-center">
                <div className="relative aspect-square">
                  <Image
                    src={img.src}
                    alt={getAlt(img)}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    sizes="100vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {viewerOpen && (
        <div className="fixed inset-0 z-60 bg-surface-gallery flex flex-col">
          {/* Viewer Header */}
          <div className="flex items-center justify-between p-3 relative z-10">
            <button
              type="button"
              onClick={() => setViewerOpen(false)}
              className="size-10 rounded-full bg-surface-floating/20 flex items-center justify-center"
              aria-label={t("closeViewer")}
            >
              <X className="size-6 text-overlay-text" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 text-overlay-text text-sm font-medium">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              className="size-10 rounded-full bg-surface-floating/20 flex items-center justify-center"
              aria-label={t("moreOptions")}
            >
              <MoreHorizontal className="size-5 text-overlay-text" />
            </button>
          </div>

          {/* Viewer Image */}
          <div className="flex-1 flex items-center justify-center relative">
            {images[activeIndex] && (
              <Image
                src={images[activeIndex].src}
                alt={getAlt(images[activeIndex])}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            )}
          </div>

          {/* Viewer Thumbnails */}
          <div className="flex gap-2 p-4 justify-center">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "size-14 rounded-lg overflow-hidden transition-all",
                  i === activeIndex 
                    ? "ring-2 ring-gallery-ring ring-offset-2 ring-offset-gallery-ring-offset" 
                    : "opacity-40 hover:opacity-60"
                )}
                aria-label={t("viewImageNumber", { number: i + 1 })}
              >
                <Image
                  src={img.src}
                  alt={getAlt(img)}
                  width={56}
                  height={56}
                  className="object-cover size-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
