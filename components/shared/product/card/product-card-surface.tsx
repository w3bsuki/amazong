import * as React from "react"
import { Link } from "@/i18n/routing"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

import { ProductCardImage } from "./image"

export interface ProductCardSurfaceProps {
  href: string
  title: string
  ariaLabel: string
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined
  className?: string | undefined
  imageSrc: string
  imageAlt: string
  imageIndex: number
  inStock: boolean
  outOfStockLabel: string
  imageRatio: number
  mediaOverlay?: React.ReactNode | undefined
  children: React.ReactNode
}

export function ProductCardSurface({
  href,
  title,
  ariaLabel,
  onLinkClick,
  className,
  imageSrc,
  imageAlt,
  imageIndex,
  inStock,
  outOfStockLabel,
  imageRatio,
  mediaOverlay,
  children,
}: ProductCardSurfaceProps) {
  return (
    <Card
      data-slot="surface"
      className={cn(
        "tap-highlight tap-transparent group relative flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border-border-subtle shadow-none",
        className
      )}
    >
      <Link
        href={href}
        prefetch={false}
        data-slot="product-card-link"
        className="absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        aria-label={ariaLabel}
        onClick={onLinkClick}
      >
        <span className="sr-only">{title}</span>
      </Link>

      <div className="relative overflow-hidden rounded-t-xl bg-surface-subtle">
        <ProductCardImage
          src={imageSrc}
          alt={imageAlt}
          index={imageIndex}
          inStock={inStock}
          outOfStockLabel={outOfStockLabel}
          ratio={imageRatio}
        />

        {mediaOverlay}
      </div>

      {children}
    </Card>
  )
}
