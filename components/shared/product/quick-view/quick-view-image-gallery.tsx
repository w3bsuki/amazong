"use client"

import * as React from "react"
import Image from "next/image"
import { CaretRight, CaretLeft } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { cn } from "@/lib/utils"

interface QuickViewImageGalleryProps {
  images: string[]
  title: string
  discountPercent?: number | undefined
  onNavigateToProduct: () => void
  onRequestClose?: () => void
  /** Use compact layout with a square hero + thumbnail strip (better for mobile drawers) */
  compact?: boolean
}

export function QuickViewImageGallery({
  images,
  title,
  discountPercent,
  onNavigateToProduct,
  onRequestClose,
  compact = false,
}: QuickViewImageGalleryProps) {
  const tDrawers = useTranslations("Drawers")
  const tProduct = useTranslations("Product")
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  const hasMultiple = images.length > 1
  const currentImage = images[currentIndex] ?? PLACEHOLDER_IMAGE_PATH

  const nextImage = React.useCallback(() => {
    if (hasMultiple) {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }
  }, [hasMultiple, images.length])

  const prevImage = React.useCallback(() => {
    if (hasMultiple) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }, [hasMultiple, images.length])

  // Reset index when images change
  React.useEffect(() => {
    setCurrentIndex(0)
  }, [images])

  // Desktop layout with horizontal thumbnails below
  if (!compact) {
    return (
      <div className="flex flex-col gap-3">
        {/* Main image - larger aspect for desktop modal */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <button
              type="button"
              onClick={onNavigateToProduct}
              className="absolute inset-0 size-full cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              aria-label={tDrawers("viewFullListing")}
            >
              <Image
                src={normalizeImageUrl(currentImage) ?? PLACEHOLDER_IMAGE_PATH}
                alt={title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            </button>

            {/* Image navigation arrows */}
            {hasMultiple && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); prevImage() }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 border border-border bg-surface-glass backdrop-blur-md"
                  aria-label={tProduct("previousImage")}
                >
                  <CaretLeft size={20} weight="bold" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); nextImage() }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 border border-border bg-surface-glass backdrop-blur-md"
                  aria-label={tProduct("nextImage")}
                >
                  <CaretRight size={20} weight="bold" />
                </Button>
              </>
            )}

            {/* Discount badge */}
            {discountPercent && discountPercent > 0 && (
              <Badge variant="destructive" className="absolute top-3 left-3 text-xs px-2 py-0.5 font-semibold">
                -{discountPercent}%
              </Badge>
            )}

            {/* Image counter */}
            {hasMultiple && (
              <div className="absolute bottom-3 left-3 rounded-full border border-border bg-surface-glass px-2.5 py-1 text-xs font-medium tabular-nums text-foreground backdrop-blur-md">
                {currentIndex + 1}/{images.length}
              </div>
            )}
          </div>
        </div>

        {/* Horizontal thumbnails - larger for desktop */}
        {hasMultiple && (
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
            {images.map((img, i) => (
              <button
                key={`thumb-${i}`}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "relative size-20 shrink-0 rounded-xl overflow-hidden border border-border transition-colors",
                  i === currentIndex
                    ? "ring-2 ring-ring"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={normalizeImageUrl(img) ?? PLACEHOLDER_IMAGE_PATH}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Mobile/compact layout - optimized touch handling with a square hero (fills drawer better)
  return (
    <div className="touch-pan-x">
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-gallery">
        <AspectRatio ratio={1} className="relative">
        <button
          type="button"
          onClick={onNavigateToProduct}
          className="absolute inset-0 size-full cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset touch-manipulation"
          aria-label={tDrawers("viewFullListing")}
        >
          <Image
            src={normalizeImageUrl(currentImage) ?? PLACEHOLDER_IMAGE_PATH}
            alt={title}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
            draggable={false}
          />
        </button>

        {hasMultiple && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-2 top-1/2 -translate-y-1/2 border border-border bg-surface-glass backdrop-blur-md touch-manipulation"
              aria-label={tProduct("previousImage")}
            >
              <CaretLeft size={18} weight="bold" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-2 top-1/2 -translate-y-1/2 border border-border bg-surface-glass backdrop-blur-md touch-manipulation"
              aria-label={tProduct("nextImage")}
            >
              <CaretRight size={18} weight="bold" />
            </Button>
          </>
        )}

        {onRequestClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onRequestClose() }}
            className="absolute top-2 right-2 border border-border bg-surface-glass backdrop-blur-md touch-manipulation"
            aria-label={tProduct("close")}
          >
            <span className="sr-only">{tProduct("close")}</span>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Button>
        )}

        {discountPercent && discountPercent > 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2 text-xs px-2 py-0.5 font-semibold">
            -{discountPercent}%
          </Badge>
        )}

        {/* Image counter - compact */}
        {hasMultiple && (
          <div className="absolute bottom-2 left-2 rounded-full border border-border bg-surface-glass px-2 py-0.5 text-2xs font-medium tabular-nums text-foreground backdrop-blur-md">
            {currentIndex + 1}/{images.length}
          </div>
        )}
        </AspectRatio>
      </div>

      {/* Thumbnail strip - styled for better UX */}
      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1 touch-pan-x">
          {images.map((img, i) => (
            <button
              key={`thumb-${i}`}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "relative size-12 shrink-0 rounded-xl overflow-hidden border border-border-subtle bg-muted transition-all touch-manipulation",
                i === currentIndex
                  ? "ring-2 ring-ring"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={normalizeImageUrl(img) ?? PLACEHOLDER_IMAGE_PATH}
                alt=""
                fill
                className="object-cover pointer-events-none"
                sizes="48px"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
