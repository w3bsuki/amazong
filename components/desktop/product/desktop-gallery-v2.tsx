"use client"

// =============================================================================
// DESKTOP GALLERY V2 - Horizontal Thumbnails Below Hero
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

interface DesktopGalleryV2Props {
  images: GalleryImage[]
  galleryID?: string
  className?: string
}

export function DesktopGalleryV2({
  images,
  galleryID = "desktop-gallery-v2",
  className,
}: DesktopGalleryV2Props) {
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
      mainClass: "[&>div:first-child]:!bg-background",
      pswpModule: () => import("photoswipe"),
    })
    lightbox.init()
    lightboxRef.current = lightbox
    return () => lightbox.destroy()
  }, [galleryID])

  if (!images || images.length === 0) return null

  const activeImage = images[activeIndex] ?? images[0]

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Hero Image */}
      <div className="relative group" id={galleryID}>
        <div
          className={cn(
            "relative aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border"
          )}
        >
          <a
            href={activeImage?.src}
            data-pswp-width={activeImage?.width ?? 1200}
            data-pswp-height={activeImage?.height ?? 1200}
            target="_blank"
            rel="noreferrer"
            className="block size-full"
          >
            <Image
              src={activeImage?.src ?? "/placeholder.svg"}
              alt={activeImage?.alt ?? "Product image"}
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
            className="size-9 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:bg-background"
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
            className="size-10 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:bg-background"
            aria-label={t("clickToEnlarge")}
            onClick={() => lightboxRef.current?.loadAndOpen(activeIndex)}
          >
            <ZoomIn className="size-5 text-foreground" />
          </Button>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-foreground/80 backdrop-blur-sm text-background text-xs font-medium px-2.5 py-1 rounded-full">
            {activeIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Horizontal Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
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
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "border border-border hover:border-foreground/30 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
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
