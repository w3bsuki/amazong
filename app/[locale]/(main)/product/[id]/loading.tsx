import { Skeleton } from "@/components/ui/skeleton"

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="container py-4 sm:py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2 items-center mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Mobile-first responsive grid layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px_300px] gap-4 sm:gap-6 lg:gap-8 mt-4 items-start">
          {/* Images Section */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 h-fit order-1 items-start">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible no-scrollbar sm:w-[60px] pb-2 sm:pb-0 order-2 sm:order-1">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-14 h-14 sm:w-full sm:h-14 shrink-0 rounded-sm" />
              ))}
            </div>
            {/* Main image */}
            <Skeleton className="w-full sm:w-[calc(100%-76px)] h-[400px] sm:h-[500px] lg:h-[600px] order-1 sm:order-2" />
          </div>

          {/* Middle Column: Product Details */}
          <div className="flex flex-col gap-3 order-2">
            {/* Title */}
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-3/4" />

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4" />
                ))}
              </div>
              <Skeleton className="h-4 w-24" />
            </div>

            <Skeleton className="h-px w-full" />

            {/* Price */}
            <div className="flex flex-col gap-1">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Icons Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1">
                  <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>

            <Skeleton className="h-px w-full" />

            {/* About This Item */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Right Column: Buy Box */}
          <div className="border border-border rounded-lg p-4 h-fit lg:sticky lg:top-4 bg-card order-3">
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-48 mb-4" />
            <Skeleton className="h-5 w-20 mb-4" />

            {/* Add to Cart Buttons */}
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full mb-2 rounded-full" />
            <Skeleton className="h-10 w-full mb-4 rounded-full" />

            {/* Shipping Info */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
