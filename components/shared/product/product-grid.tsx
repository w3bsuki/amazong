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
 * Mobile: 2 cols, gap-2 (8px)
 * Desktop: 4-5 cols, gap-3 (12px)
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
        "grid gap-2.5 px-(--page-inset) md:gap-4 md:px-(--page-inset-md) lg:px-(--page-inset-lg)",
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
    <div className="overflow-hidden">
      <div className="relative overflow-hidden rounded-sm bg-muted">
        <AspectRatio ratio={4 / 5}>
          <Skeleton className="h-full w-full" />
        </AspectRatio>

        {showQuickAdd && (
          <Skeleton className="absolute top-1.5 right-1.5 size-8 rounded-full" />
        )}
      </div>

      <div className="pt-1">
        <div className="flex items-baseline gap-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>

        <Skeleton className="mt-1 h-4 w-full" />
        <Skeleton className="mt-0.5 h-4 w-2/3" />

        <div className="mt-1 flex items-center gap-1">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-2.5 w-16" />
        </div>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-2.5 w-14" />
          </div>
          <Skeleton className="size-7 rounded" />
        </div>
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
