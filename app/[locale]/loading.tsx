import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-muted pb-20">
      {/* Hero Carousel Skeleton */}
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-muted">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="container relative z-10 -mt-6 sm:-mt-28 md:-mt-32">
        {/* Category Circles Skeleton */}
        <div className="mt-3 sm:mt-4">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <Skeleton className="size-16 sm:size-20 rounded-full" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}
          </div>
        </div>

        {/* Category Grid Skeleton */}
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 px-1 mt-3 sm:mt-4 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:overflow-visible sm:pb-0 no-scrollbar">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[60vw] min-w-[60vw] shrink-0 snap-start sm:w-auto sm:min-w-0 bg-card rounded-lg border border-border p-2.5 sm:p-3">
              <Skeleton className="h-5 w-24 mb-2.5" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j}>
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-3 w-14 mt-1.5" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-4 w-16 mt-2.5" />
            </div>
          ))}
        </div>

        {/* Brand Circles Skeleton */}
        <div className="mt-3 sm:mt-4">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <Skeleton className="size-14 sm:size-16 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>

        {/* Daily Deals Banner Skeleton */}
        <div className="mt-4 px-1 sm:px-0">
          <Skeleton className="w-full h-24 sm:h-32 rounded-lg" />
        </div>

        {/* Tabbed Product Section Skeleton */}
        <div className="mt-4 sm:mt-6 mx-1 sm:mx-0 bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Promo Cards Skeleton */}
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 px-1 mt-4 sm:mt-6 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0 no-scrollbar">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-[45vw] min-w-[45vw] shrink-0 snap-start sm:w-auto sm:min-w-0 h-32 sm:h-40 rounded-lg" />
          ))}
        </div>

        {/* Deals Section Skeleton */}
        <div className="mt-4 sm:mt-6 mx-1 sm:mx-0 bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>

        {/* More Ways to Shop Skeleton */}
        <div className="mt-4 sm:mt-6 px-1 sm:px-0">
          <Skeleton className="h-6 w-48 mb-3 sm:mb-4" />
          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-3 no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className={`w-[42vw] min-w-[42vw] h-44 shrink-0 snap-start rounded-lg sm:w-auto sm:min-w-0 ${i === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2 sm:min-h-80' : 'sm:min-h-60'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
