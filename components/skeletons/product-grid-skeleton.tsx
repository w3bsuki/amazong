"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ProductGridSkeletonProps {
  count?: number
  className?: string
}

/**
 * Skeleton for product card in horizontal carousels
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-md overflow-hidden h-full flex flex-col border border-border">
      {/* Image placeholder */}
      <div className="relative w-full aspect-square bg-secondary p-3">
        <Skeleton className="w-full h-full rounded-md" />
      </div>
      
      {/* Content */}
      <div className="p-2.5 flex-1 flex flex-col gap-2">
        {/* Title */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        
        {/* Price */}
        <div className="mt-auto pt-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-24 mt-1" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton grid for product sections like Trending, Featured, etc.
 */
export function ProductGridSkeleton({ count = 6, className }: ProductGridSkeletonProps) {
  return (
    <div className={cn(
      "flex flex-row flex-nowrap gap-3 overflow-x-auto snap-x snap-mandatory scroll-pl-4 px-4 pb-2 no-scrollbar md:gap-4 md:scroll-pl-6 md:px-6",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-[45%] min-w-[45%] shrink-0 snap-start md:w-44 md:min-w-44"
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  )
}

/**
 * Full section skeleton with header and tabs
 */
export function TrendingSectionSkeleton() {
  return (
    <div className="bg-card border border-border rounded-md overflow-hidden">
      {/* Header */}
      <div className="text-center pt-5 sm:pt-6 pb-3 sm:pb-4 px-4">
        <Skeleton className="h-7 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>
      
      {/* Tabs placeholder */}
      <div className="flex justify-center px-3 sm:px-4 pb-2">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
      
      {/* Products grid */}
      <div className="pt-3 sm:pt-4 pb-4 sm:pb-6">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  )
}

/**
 * Skeleton for Deals section
 */
export function DealsSectionSkeleton() {
  return (
    <div className="rounded-md overflow-hidden bg-card border border-border">
      {/* Header */}
      <div className="text-center pt-5 sm:pt-6 pb-3 sm:pb-4 px-4">
        <Skeleton className="h-7 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-20 mx-auto" />
      </div>
      
      {/* Tabs placeholder */}
      <div className="flex justify-center px-3 sm:px-4 pb-2">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-16 rounded-full" />
          <Skeleton className="h-10 w-16 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
      </div>
      
      {/* Deals grid */}
      <div className="pt-3 sm:pt-4 pb-4 sm:pb-6">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  )
}

/**
 * Skeleton for Featured Products section
 */
export function FeaturedSectionSkeleton() {
  return (
    <div className="bg-card border border-border rounded-md overflow-hidden">
      {/* Header */}
      <div className="pt-5 sm:pt-6 pb-3 sm:pb-4 px-4">
        <Skeleton className="h-6 w-48 mb-1" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Products grid */}
      <div className="pb-4 sm:pb-6">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  )
}
