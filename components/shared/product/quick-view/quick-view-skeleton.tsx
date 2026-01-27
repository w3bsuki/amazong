"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"

export function QuickViewSkeleton() {
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col">
      {/* Image skeleton - 4:3 on mobile, square on desktop */}
      <Skeleton className={isMobile ? "aspect-[4/3] w-full rounded-none" : "aspect-square w-full rounded-none"} />
      
      {/* Thumbnail strip skeleton - mobile only */}
      {isMobile && (
        <div className="flex gap-1.5 px-4 py-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="size-12 shrink-0 rounded-md" />
          ))}
        </div>
      )}
      
      {/* Content skeleton - simplified */}
      <div className="px-4 py-3 space-y-2.5">
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
          <Skeleton className="h-8 w-32 rounded-md" />
          <div className="flex gap-1">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>

        {/* Seller card */}
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>

      {/* CTA buttons */}
      <div className="px-4 py-3 mt-auto border-t border-border">
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-11 rounded-md" />
          <Skeleton className="h-11 rounded-md" />
        </div>
      </div>
    </div>
  )
}
