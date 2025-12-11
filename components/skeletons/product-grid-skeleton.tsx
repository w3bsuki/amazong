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
      "flex flex-row flex-nowrap gap-2 overflow-x-auto snap-x snap-mandatory scroll-pl-2 px-2 pb-2 no-scrollbar md:gap-4 md:scroll-pl-6 md:px-6",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-[44%] min-w-[44%] shrink-0 snap-start md:w-44 md:min-w-44"
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
    <section className="md:bg-card md:border md:border-border md:rounded-md overflow-hidden">
      {/* Header */}
      <div className="text-left px-2 pt-4 pb-2 md:text-center md:pt-6 md:pb-4 md:px-4">
        <Skeleton className="h-6 w-40 md:mx-auto mb-1" />
        <Skeleton className="h-4 w-20 md:mx-auto" />
      </div>
      
      {/* Tabs placeholder */}
      <div className="flex justify-start md:justify-center px-2 md:px-4 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-1 md:gap-2">
          <Skeleton className="h-8 md:h-10 w-20 md:w-24 rounded-full" />
          <Skeleton className="h-8 md:h-10 w-20 md:w-24 rounded-full" />
          <Skeleton className="h-8 md:h-10 w-24 md:w-28 rounded-full" />
        </div>
      </div>
      
      {/* Products grid */}
      <div className="pt-3 md:pt-4 pb-4 md:pb-6">
        <ProductGridSkeleton count={6} />
      </div>
    </section>
  )
}

/**
 * Skeleton for Deals section
 */
export function DealsSectionSkeleton() {
  return (
    <section className="md:rounded-md overflow-hidden md:bg-card md:border md:border-border">
      {/* Header */}
      <div className="text-left px-2 pt-4 pb-2 md:text-center md:pt-6 md:pb-4 md:px-4">
        <Skeleton className="h-6 w-40 md:mx-auto mb-1" />
        <Skeleton className="h-4 w-20 md:mx-auto" />
      </div>
      
      {/* Tabs placeholder */}
      <div className="flex justify-start md:justify-center px-2 md:px-4 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-1 md:gap-2">
          <Skeleton className="h-8 md:h-10 w-16 md:w-20 rounded-full" />
          <Skeleton className="h-8 md:h-10 w-14 md:w-16 rounded-full" />
          <Skeleton className="h-8 md:h-10 w-14 md:w-16 rounded-full" />
          <Skeleton className="h-8 md:h-10 w-16 md:w-20 rounded-full" />
        </div>
      </div>
      
      {/* Deals grid */}
      <div className="pt-3 md:pt-4 pb-4 md:pb-6">
        <ProductGridSkeleton count={6} />
      </div>
    </section>
  )
}

/**
 * Skeleton for Featured Products section
 */
export function FeaturedSectionSkeleton() {
  return (
    <section className="md:bg-card md:border md:border-border md:rounded-md overflow-hidden">
      {/* Header */}
      <div className="pt-4 pb-2 px-2 md:pt-6 md:pb-4 md:px-4">
        <Skeleton className="h-5 md:h-6 w-40 md:w-48 mb-1" />
        <Skeleton className="h-4 w-56 md:w-64" />
      </div>
      
      {/* Products grid */}
      <div className="pb-4 md:pb-6">
        <ProductGridSkeleton count={6} />
      </div>
    </section>
  )
}
