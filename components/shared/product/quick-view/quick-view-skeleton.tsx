"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function QuickViewSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full rounded-none" />
      
      {/* Content skeleton */}
      <div className="px-4 py-4 space-y-4">
        {/* Price */}
        <div className="flex items-baseline gap-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Seller card */}
        <Skeleton className="h-16 w-full rounded-md" />
      </div>
    </div>
  )
}
