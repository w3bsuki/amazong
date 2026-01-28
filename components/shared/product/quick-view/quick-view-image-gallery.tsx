"use client"

import * as React from "react"
import Image from "next/image"
import { CaretRight, CaretLeft, MagnifyingGlassPlus } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { cn } from "@/lib/utils"

interface QuickViewImageGalleryProps {
  images: string[]
  title: string
  discountPercent?: number | undefined
  onNavigateToProduct: () => void
  onRequestClose?: () => void
  /** Use compact layout with 4:3 aspect ratio + thumbnail strip (better for mobile) */
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
  const [isZoomed, setIsZoomed] = React.useState(false)
  
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
        <div className="group relative">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <button
              type="button"
              onClick={onNavigateToProduct}
              className="absolute inset-0 size-full cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              aria-label={tDrawers("viewFullListing")}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <Image
                src={normalizeImageUrl(currentImage) ?? PLACEHOLDER_IMAGE_PATH}
                alt={title}
                fill
                className={cn(
                  "object-contain transition-transform duration-500",
                  isZoomed && "scale-105"
                )}
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={tProduct("previousImage")}
                >
                  <CaretLeft size={20} weight="bold" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); nextImage() }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={tProduct("nextImage")}
                >
                  <CaretRight size={20} weight="bold" />
                </Button>
              </>
            )}

            {/* Discount badge */}
            {discountPercent && discountPercent > 0 && (
              <Badge variant="discount" className="absolute top-3 left-3 text-sm px-2.5 py-1">
                -{discountPercent}%
              </Badge>
            )}

            {/* Image counter */}
            {hasMultiple && (
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-foreground/80 backdrop-blur-sm text-background text-xs font-medium tabular-nums">
                {currentIndex + 1}/{images.length}
              </div>
            )}

            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border text-xs font-medium">
                <MagnifyingGlassPlus size={14} weight="bold" />
                {tDrawers("viewFullListing")}
              </div>
            </div>
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
                onMouseEnter={() => setCurrentIndex(i)}
                className={cn(
                  "relative size-20 shrink-0 rounded-lg overflow-hidden transition-all duration-200",
                  i === currentIndex
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "border border-border opacity-70 hover:opacity-100"
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

  // Mobile/compact layout - optimized touch handling, wide aspect for space efficiency
  return (
    <div className="relative touch-action-pan-x">
      <div className="relative aspect-[16/10] bg-muted">
        <button
          type="button"
          onClick={onNavigateToProduct}
          className="absolute inset-0 size-full cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset touch-action-manipulation"
          aria-label={tDrawers("viewFullListing")}
        >
          <Image
            src={normalizeImageUrl(currentImage) ?? PLACEHOLDER_IMAGE_PATH}
            alt={title}
            fill
            className="object-contain pointer-events-none"
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
              className="absolute left-1.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 touch-action-manipulation"
              aria-label={tProduct("previousImage")}
            >
              <CaretLeft size={18} weight="bold" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 touch-action-manipulation"
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
            size="icon-sm"
            onClick={(e) => { e.stopPropagation(); onRequestClose() }}
            className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 touch-action-manipulation"
            aria-label={tProduct("close")}
          >
            <span className="sr-only">{tProduct("close")}</span>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Button>
        )}

        {discountPercent && discountPercent > 0 && (
          <Badge variant="discount" className="absolute top-2 left-2 text-xs px-1.5 py-0.5">
            -{discountPercent}%
          </Badge>
        )}

        {/* Image counter - compact */}
        {hasMultiple && (
          <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-foreground/70 backdrop-blur-sm text-background text-[10px] font-medium tabular-nums">
            {currentIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip - styled for better UX */}
      {hasMultiple && (
        <div className="flex gap-1.5 overflow-x-auto px-4 py-2 scrollbar-hide touch-action-pan-x bg-muted/30">
          {images.map((img, i) => (
            <button
              key={`thumb-${i}`}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "relative size-11 shrink-0 rounded-md overflow-hidden transition-all touch-action-manipulation",
                i === currentIndex
                  ? "ring-2 ring-foreground ring-offset-1 ring-offset-background shadow-sm"
                  : "border border-border opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={normalizeImageUrl(img) ?? PLACEHOLDER_IMAGE_PATH}
                alt=""
                fill
                className="object-cover pointer-events-none"
                sizes="44px"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
