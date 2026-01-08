"use client"

import * as React from "react"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"
import { productBlurDataURL, getImageLoadingStrategy } from "@/lib/image-utils"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

// =============================================================================
// TYPES
// =============================================================================

interface ProductCardImageProps {
  src: string
  alt: string
  index: number
  inStock: boolean
  outOfStockLabel: string
}

// =============================================================================
// HELPERS
// =============================================================================

function getProductCardImageSrc(src: string): string {
  if (!src) return PLACEHOLDER_IMAGE_PATH
  const normalized = normalizeImageUrl(src)
  if (!normalized) return PLACEHOLDER_IMAGE_PATH
  return normalized === PLACEHOLDER_IMAGE_PATH ? PLACEHOLDER_IMAGE_PATH : normalized
}

// =============================================================================
// COMPONENT
// =============================================================================

function ProductCardImage({
  src,
  alt,
  index,
  inStock,
  outOfStockLabel,
}: ProductCardImageProps) {
  const loadingStrategy = getImageLoadingStrategy(index, 4)
  const imageSrc = React.useMemo(() => getProductCardImageSrc(src), [src])

  return (
    <>
      <AspectRatio ratio={1}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={cn("object-cover", !inStock && "grayscale")}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL={productBlurDataURL()}
          loading={loadingStrategy.loading}
          priority={loadingStrategy.priority}
        />
      </AspectRatio>

      {/* Out of Stock overlay */}
      {!inStock && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="rounded-sm bg-foreground/80 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-background">
            {outOfStockLabel}
          </span>
        </div>
      )}
    </>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCardImage, type ProductCardImageProps }
