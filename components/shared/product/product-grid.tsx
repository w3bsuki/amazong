"use client"

import * as React from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// =============================================================================
// PRODUCT GRID - Responsive CSS Grid with density options
// =============================================================================

interface ProductGridProps {
  children: React.ReactNode
  /** Grid density: compact (Temu), default (eBay), comfortable (Airbnb) */
  density?: "compact" | "default" | "comfortable"
  className?: string
}

/**
 * ProductGrid - Responsive CSS Grid
 * Uses tokenized gap via `--product-grid-gap` (dense marketplace default).
 */
function ProductGrid({ children, density = "default", className }: ProductGridProps) {
  const densityClasses = {
    compact: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    default: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    comfortable: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }

  return (
    <div
      className={cn(
        "grid gap-(--product-grid-gap) px-inset md:px-inset-md lg:px-inset-lg",
        densityClasses[density],
        className
      )}
    >
      {children}
    </div>
  )
}

// =============================================================================
// SKELETON COMPONENTS
// =============================================================================

type ProductCardSkeletonProps = {
  showQuickAdd?: boolean
}

function ProductCardSkeleton({ showQuickAdd = true }: ProductCardSkeletonProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-2.5">
      <div className="relative overflow-hidden rounded-xl bg-muted">
        <AspectRatio ratio={1}>
          <Skeleton className="h-full w-full" />
        </AspectRatio>

        {showQuickAdd && (
          <Skeleton className="absolute top-2 right-2 size-11 rounded-xl" />
        )}
      </div>

      <div className="mt-2 space-y-1">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

ProductCardSkeleton.displayName = "ProductCardSkeleton"

// =============================================================================
// SKELETON GRID
// =============================================================================

interface ProductCardSkeletonGridProps {
  count?: number
  density?: "compact" | "default" | "comfortable"
  className?: string
}

function ProductCardSkeletonGrid({
  count = 8,
  density = "default",
  className,
}: ProductCardSkeletonGridProps) {
  return (
    <ProductGrid density={density} className={className ?? ""}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </ProductGrid>
  )
}

ProductCardSkeletonGrid.displayName = "ProductCardSkeletonGrid"

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ProductGrid,
  ProductCardSkeleton,
  ProductCardSkeletonGrid,
  type ProductGridProps,
  type ProductCardSkeletonProps,
  type ProductCardSkeletonGridProps,
}
