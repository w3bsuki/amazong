import * as React from "react"

import { ProductCardSurface } from "./product-card-surface"
import { useProductCardSurfaceProps } from "./use-product-card-surface-props"
import { useProductCardQuickView } from "./use-product-card-quick-view"

type QuickViewInput = Parameters<typeof useProductCardQuickView>[0]["product"]
type SurfaceInput = Omit<Parameters<typeof useProductCardSurfaceProps>[0], "onLinkClick">

interface ProductCardFrameProps {
  disableQuickView?: boolean
  quickViewInput: QuickViewInput
  surface: SurfaceInput
  mediaOverlay?: React.ReactNode
  children: React.ReactNode
}

export function buildProductCardFrameSurface(
  href: string,
  title: string,
  className: SurfaceInput["className"],
  imageSrc: string,
  imageIndex: number,
  inStock: boolean,
  imageRatio: number
): SurfaceInput {
  return {
    href,
    title,
    className,
    imageSrc,
    imageIndex,
    inStock,
    imageRatio,
  }
}

export function ProductCardFrame({
  disableQuickView,
  quickViewInput,
  surface,
  mediaOverlay,
  children,
}: ProductCardFrameProps) {
  const handleCardClick = useProductCardQuickView({
    ...(disableQuickView === undefined ? {} : { disableQuickView }),
    product: quickViewInput,
  })

  const surfaceProps = useProductCardSurfaceProps({
    ...surface,
    onLinkClick: handleCardClick,
  })

  return (
    <ProductCardSurface {...surfaceProps} mediaOverlay={mediaOverlay}>
      {children}
    </ProductCardSurface>
  )
}
