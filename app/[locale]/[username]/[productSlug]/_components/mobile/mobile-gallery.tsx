"use client"

// =============================================================================
// MOBILE GALLERY - OLX-style edge-to-edge hero with dot indicators
// =============================================================================
// Key features:
// - Full-bleed edge-to-edge hero image (4:3 ratio)
// - Swipe navigation with scroll snap + scroll sync
// - Dot indicators (not numbered)
// - Floating action buttons (back, wishlist)
// - Lazy-loaded images with stable dimensions
// =============================================================================

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Heart, ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getConditionBadgeVariant } from "@/components/shared/product/condition"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { useWishlist } from "@/components/providers/wishlist-context"
import type { GalleryImage } from "@/lib/view-models/product-page"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

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
  const tCommon = useTranslations("Common")
  const [activeIndex, setActiveIndex] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)
  
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [isWishlistPending, setIsWishlistPending] = useState(false)
  const isWishlisted = product ? isInWishlist(product.id) : false
  const normalizedImageSources = useMemo(
    () => images.map((img) => normalizeImageUrl(img.src)),
    [images],
  )
  const [failedImageIndexes, setFailedImageIndexes] = useState<Record<number, true>>({})
  const imageResetKey = useMemo(() => normalizedImageSources.join("|"), [normalizedImageSources])

  const getAlt = useCallback(
    (img: GalleryImage) => t(img.altKey as never, img.altParams as never),
    [t],
  )

  useEffect(() => {
    setFailedImageIndexes({})
    setActiveIndex(0)
    galleryRef.current?.scrollTo({ left: 0 })
  }, [imageResetKey])

  const getImageSrc = useCallback(
    (index: number) => {
      if (failedImageIndexes[index]) return PLACEHOLDER_IMAGE_PATH
      return normalizedImageSources[index] ?? PLACEHOLDER_IMAGE_PATH
    },
    [failedImageIndexes, normalizedImageSources],
  )

  const handleImageError = useCallback((index: number) => {
    setFailedImageIndexes((previous) => {
      if (previous[index]) return previous
      return { ...previous, [index]: true }
    })
  }, [])

  useEffect(() => {
    const el = galleryRef.current
    if (!el) return

    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId != null) return
      rafId = window.requestAnimationFrame(() => {
        rafId = null
        const newIndex = Math.round(el.scrollLeft / el.offsetWidth)
        if (newIndex < 0 || newIndex >= images.length) return
        setActiveIndex((previous) => (previous === newIndex ? previous : newIndex))
      })
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", handleScroll)
      if (rafId != null) window.cancelAnimationFrame(rafId)
    }
  }, [images.length])

  // Scroll to specific image
  const scrollToImage = useCallback((index: number) => {
    const el = galleryRef.current
    if (!el) return
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    el.scrollTo({
      left: index * el.offsetWidth,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    })
  }, [])

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!product) return
    if (isWishlistPending) return
    setIsWishlistPending(true)
    try {
      await toggleWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: getImageSrc(0),
      })
    } catch {
      toast.error(tCommon("error"))
    } finally {
      setIsWishlistPending(false)
    }
  }

  if (!images || images.length === 0) {
    return (
      <div className={cn(
        "w-full aspect-4-3 bg-muted flex items-center justify-center",
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
                className="size-touch-lg rounded-full bg-surface-floating shadow-sm flex items-center justify-center active:bg-background"
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
                  onClick={() => {
                    void handleWishlistToggle()
                  }}
                  disabled={isWishlistPending}
                  className={cn(
                    "size-touch-lg rounded-full shadow-sm flex items-center justify-center",
                    isWishlisted 
                      ? "bg-destructive text-destructive-foreground" 
                      : "bg-surface-floating active:bg-background",
                    isWishlistPending && "opacity-70"
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
              <MarketplaceBadge variant={getConditionBadgeVariant(condition)}>
                {conditionLabel}
              </MarketplaceBadge>
            )}
            {categoryLabel && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-background text-xs font-medium text-foreground">
                {categoryLabel}
              </span>
            )}
            {overlayBadge}
          </div>

          {/* Dot Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-surface-overlay px-2 py-1">
              <div className="flex items-center gap-1.5" aria-label={t("imagePreview")}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      scrollToImage(i)
                    }}
                    className="flex size-touch-sm items-center justify-center"
                    aria-label={t("viewImageNumber", { number: i + 1 })}
                    aria-current={i === activeIndex ? "true" : undefined}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        i === activeIndex ? "bg-overlay-text" : "bg-overlay-text-muted",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Swipeable Image Gallery */}
          <div
            ref={galleryRef}
            className="flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain scrollbar-hide"
            aria-label={t("imagePreview")}
          >
            {images.map((img, i) => (
              <div key={i} className="flex-none w-full snap-center">
                <div className="relative aspect-4-3">
                  <Image
                    src={getImageSrc(i)}
                    alt={getAlt(img)}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    sizes="100vw"
                    onError={() => handleImageError(i)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
