import { Skeleton } from "@/components/ui/skeleton"

export default function TodaysDealsLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Banner Skeleton */}
      <div className="bg-brand-deal text-white py-6 sm:py-10">
        <div className="container">
          {/* Breadcrumb */}
          <div className="flex gap-2 items-center mb-2">
            <Skeleton className="h-4 w-16 bg-white/20" />
            <Skeleton className="h-4 w-4 bg-white/20" />
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="size-12 sm:size-14 rounded-full bg-white/20" />
            <div>
              <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 bg-white/20 mb-2" />
              <Skeleton className="h-4 w-64 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="container -mt-4 sm:-mt-6">
        {/* Category Circles Skeleton */}
        <div className="bg-card rounded-lg border border-border p-4 mb-4 sm:mb-6">
          <Skeleton className="h-4 w-36 mb-3" />
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 min-w-[70px] shrink-0">
                <Skeleton className="size-14 sm:size-16 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>

        {/* Tab Filters Skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 sm:mb-6 no-scrollbar">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-24 rounded-full shrink-0" />
          ))}
        </div>

        {/* Results count */}
        <Skeleton className="h-4 w-24 mb-4" />

        {/* Deals Grid Skeleton */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-2 sm:p-3 md:p-4">
              {/* Image */}
              <Skeleton className="aspect-square rounded-lg mb-2 sm:mb-3" />
              
              {/* Time remaining */}
              <Skeleton className="h-3 w-32 mb-2" />
              
              {/* Price */}
              <div className="mb-1.5 sm:mb-2 flex items-center gap-2">
                <Skeleton className="h-6 sm:h-8 w-20" />
                <Skeleton className="h-4 w-14" />
              </div>
              
              {/* Title */}
              <div className="space-y-1 mb-1.5 sm:mb-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
