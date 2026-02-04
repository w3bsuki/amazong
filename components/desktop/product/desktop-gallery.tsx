"use client"

// =============================================================================
// DESKTOP GALLERY - Horizontal Thumbnails Below Hero
// =============================================================================
// Based on V2 demo design - the winner from our audit.
// Key features:
// - Large hero image with zoom on hover
// - Horizontal thumbnail strip below (not vertical sidebar)
// - Image counter overlay
// - PhotoSwipe lightbox integration
// =============================================================================

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"
import { Share2, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { GalleryImage } from "@/lib/view-models/product-page"

export interface DesktopGalleryProps {
  images: GalleryImage[]
  galleryID?: string
  className?: string
}

export function DesktopGallery({
  images,
  galleryID = "desktop-gallery",
  className,
}: DesktopGalleryProps) {
  const t = useTranslations("Product")
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null)

  // Initialize PhotoSwipe lightbox
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryID}`,
      children: "a",
      bgOpacity: 1,
      wheelToZoom: true,
      arrowPrev: true,
      arrowNext: true,
      close: true,
      zoom: true,
      counter: true,
      mainClass: "pswp--treido",
      pswpModule: () => import("photoswipe"),
    })
    lightbox.init()
    lightboxRef.current = lightbox
    return () => lightbox.destroy()
  }, [galleryID])

  if (!images || images.length === 0) return null

  const activeImage = images[activeIndex] ?? images[0]
  const getAlt = (img: GalleryImage) =>
    t(img.altKey as never, img.altParams as never)

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Hero Image */}
      <div className="relative group" id={galleryID}>
        <div
          className={cn(
            "relative aspect-square rounded-lg overflow-hidden bg-muted border border-border"
          )}
        >
          <a
            href={activeImage?.src}
            data-pswp-width={activeImage?.width ?? 1200}
            data-pswp-height={activeImage?.height ?? 1200}
            target="_blank"
            rel="noreferrer"
            className="relative block size-full"
          >
            <Image
              src={activeImage?.src ?? "/placeholder.svg"}
              alt={activeImage ? getAlt(activeImage) : t("imagePreview")}
              fill
              className={cn(
                "object-cover transition-transform duration-500 cursor-zoom-in",
                isZoomed && "scale-110"
              )}
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            />
          </a>
        </div>

        {/* Floating Share Button */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-9 rounded-full bg-surface-glass backdrop-blur-md border border-border hover:bg-background"
            aria-label={t("share")}
          >
            <Share2 className="size-4 text-foreground" />
          </Button>
        </div>

        {/* Zoom Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-10 rounded-full bg-surface-glass backdrop-blur-md border border-border hover:bg-background"
            aria-label={t("clickToEnlarge")}
            onClick={() => lightboxRef.current?.loadAndOpen(activeIndex)}
          >
            <ZoomIn className="size-5 text-foreground" />
          </Button>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-overlay-dark backdrop-blur-sm text-overlay-text text-xs font-medium px-2.5 py-1 rounded-full">
            {activeIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Horizontal Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              onMouseEnter={() => setActiveIndex(i)}
              aria-label={t("goToImage", { index: i + 1 })}
              className={cn(
                "relative size-16 rounded-md overflow-hidden shrink-0 transition-all duration-200",
                i === activeIndex
                  ? "ring-2 ring-gallery-ring ring-offset-2 ring-offset-gallery-ring-offset"
                  : "border border-border opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.src}
                alt={getAlt(img)}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
