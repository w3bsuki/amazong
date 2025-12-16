import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton for ProductCarouselSection
 * Shows loading state for horizontal product carousel
 */
export function ProductCarouselSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Carousel Container */}
      <div className="flex gap-4 px-5 py-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[200px]">
            <div className="space-y-3">
              {/* Product Image */}
              <Skeleton className="aspect-square rounded-lg" />
              {/* Title */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              {/* Price */}
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
