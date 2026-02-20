import * as React from "react"
import { useTranslations } from "next-intl"

import type { ProductCardSurfaceProps } from "./product-card-surface"

type ProductCardSurfaceBaseProps = Omit<ProductCardSurfaceProps, "children" | "mediaOverlay">

type UseProductCardSurfacePropsInput = Pick<
  ProductCardSurfaceBaseProps,
  "href" | "title" | "onLinkClick" | "className" | "imageSrc" | "imageIndex" | "inStock" | "imageRatio"
>

export function useProductCardSurfaceProps({
  href,
  title,
  onLinkClick,
  className,
  imageSrc,
  imageIndex,
  inStock,
  imageRatio,
}: UseProductCardSurfacePropsInput): ProductCardSurfaceBaseProps {
  const t = useTranslations("Product")

  return React.useMemo(
    () => ({
      href,
      title,
      ariaLabel: t("openProduct", { title }),
      onLinkClick,
      className,
      imageSrc,
      imageAlt: title,
      imageIndex,
      inStock,
      outOfStockLabel: t("outOfStock"),
      imageRatio,
    }),
    [className, href, imageIndex, imageRatio, imageSrc, inStock, onLinkClick, t, title]
  )
}

