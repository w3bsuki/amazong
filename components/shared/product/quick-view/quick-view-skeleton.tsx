"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function QuickViewSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="p-4 lg:p-6">
        <Skeleton className="aspect-square w-full rounded-xl" />
      </div>
      
      {/* Thumbnail strip skeleton - mobile only */}
      <div className="flex gap-1.5 px-4 pb-2 lg:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="size-11 shrink-0 rounded-xl" />
        ))}
      </div>
      
      {/* Content skeleton - simplified */}
      <div className="px-4 pb-4 space-y-2.5 lg:px-6 lg:pb-6">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-11 w-32 rounded-xl" />
          <div className="flex gap-1">
            <Skeleton className="size-11 rounded-xl" />
            <Skeleton className="size-11 rounded-xl" />
          </div>
        </div>

        {/* Seller card */}
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>

      {/* CTA buttons */}
      <div className="px-4 py-3 mt-auto border-t border-border lg:px-6">
        <div className="grid gap-2 lg:grid-cols-2">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
