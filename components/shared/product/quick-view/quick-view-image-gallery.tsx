"use client"

import * as React from "react"
import Image from "next/image"
import { CaretRight, CaretLeft } from "@phosphor-icons/react"
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
}

export function QuickViewImageGallery({
  images,
  title,
  discountPercent,
  onNavigateToProduct,
  onRequestClose,
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

  return (
    <div className="relative aspect-square bg-muted">
      {/* Main image - tappable to view full listing */}
      <button
        type="button"
        onClick={onNavigateToProduct}
        className={cn(
          "absolute inset-0 w-full h-full cursor-pointer",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        )}
        aria-label={tDrawers("viewFullListing")}
      >
        <Image
          src={normalizeImageUrl(currentImage) ?? PLACEHOLDER_IMAGE_PATH}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 400px"
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
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2",
              "size-9 rounded-full bg-background/80 backdrop-blur-sm",
              "hover:bg-background/90"
            )}
            aria-label={tProduct("previousImage")}
          >
            <CaretLeft size={20} weight="bold" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "size-9 rounded-full bg-background/80 backdrop-blur-sm",
              "hover:bg-background/90"
            )}
            aria-label={tProduct("nextImage")}
          >
            <CaretRight size={20} weight="bold" />
          </Button>
        </>
      )}

      {/* Image counter */}
      {hasMultiple && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-foreground/70 text-background text-xs font-medium tabular-nums">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Close button */}
      {onRequestClose && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation()
            onRequestClose()
          }}
          className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
          aria-label={tProduct("close")}
        >
          <span className="sr-only">{tProduct("close")}</span>
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </Button>
      )}

      {/* Discount badge */}
      {discountPercent && discountPercent > 0 && (
        <Badge variant="deal" className="absolute top-3 left-3">
          -{discountPercent}%
        </Badge>
      )}

      {/* "View full listing" hint */}
      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1 md:hidden">
        {tDrawers("viewFullListing")} <CaretRight size={12} weight="bold" />
      </div>
    </div>
  )
}
