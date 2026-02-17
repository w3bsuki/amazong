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
  /** Image aspect ratio. Defaults to 1 (square). */
  ratio?: number
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
  ratio = 1,
}: ProductCardImageProps) {
  const loadingStrategy = getImageLoadingStrategy(index, 4)
  const imageSrc = React.useMemo(() => getProductCardImageSrc(src), [src])
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    setHasError(false)
  }, [imageSrc])

  return (
    <>
      <AspectRatio ratio={ratio}>
        <Image
          src={hasError ? PLACEHOLDER_IMAGE_PATH : imageSrc}
          alt={alt}
          fill
          className={cn("object-cover pointer-events-none", !inStock && "grayscale")}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL={productBlurDataURL()}
          loading={loadingStrategy.loading}
          priority={loadingStrategy.priority}
          onError={() => setHasError(true)}
        />
      </AspectRatio>

      {/* Out of Stock overlay */}
      {!inStock && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <span className="rounded-sm bg-overlay-dark px-2 py-1 text-xs font-semibold uppercase tracking-wide text-overlay-text">
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

