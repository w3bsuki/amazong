import { Skeleton } from "@/components/ui/skeleton"

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-background pb-24 lg:pb-10">
      {/* Breadcrumb Skeleton - Desktop only */}
      <div className="hidden md:block bg-background">
        <div className="container py-1.5 lg:py-2">
          <div className="flex gap-2 items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container pt-2 pb-0 lg:py-4">
        {/* Unified Seller Banner Skeleton (Trust Blue themed) */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-cta-trust-blue -mx-4 lg:mx-0 lg:mb-4 lg:rounded-lg lg:px-5 lg:py-3">
          <Skeleton className="h-9 w-9 lg:h-10 lg:w-10 rounded-full shrink-0 bg-white/20" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <Skeleton className="h-4 w-32 bg-white/20" />
            <Skeleton className="h-3 w-40 lg:w-56 bg-white/20" />
          </div>
          <Skeleton className="h-8 w-20 lg:w-24 rounded-full bg-white/80" />
        </div>

        {/* Unified Container (matches product-page-content-new structure) */}
        <div className="lg:bg-muted/10 lg:border lg:border-border/50 lg:rounded-xl lg:overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
            
            {/* LEFT: Image Section */}
            <div className="relative overflow-hidden -mx-4 lg:mx-0 lg:border-r lg:border-border/50">
              <div className="flex">
                {/* Desktop Thumbnails */}
                <div className="hidden lg:flex flex-col gap-2 p-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-16 h-16 rounded-lg shrink-0" />
                  ))}
                </div>
                
                {/* Main Image Area */}
                <div className="flex-1">
                  {/* Main Image */}
                  <Skeleton className="w-full min-h-[320px] sm:min-h-[400px] lg:min-h-[550px]" />
                  
                  {/* Mobile Thumbnails */}
                  <div className="lg:hidden flex gap-2 py-2 px-4 overflow-x-auto">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="w-16 h-16 rounded-lg shrink-0" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Buy Box */}
            <div className="px-2 sm:px-0 lg:p-5 xl:p-6 mt-3 lg:mt-0 space-y-4">
              {/* Title + Rating */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              {/* Condition - Desktop */}
              <div className="hidden lg:flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>

              {/* Price - Desktop */}
              <div className="hidden lg:block space-y-1">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>

              {/* Seller Card - Desktop */}
              <div className="hidden lg:block p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden lg:block space-y-2 pt-4 border-t border-border/50">
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Shipping Info */}
              <div className="border-t border-b py-2.5 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="h-4 w-20 shrink-0" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>

              {/* Guarantee */}
              <div className="flex items-center gap-2 py-1.5">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>
        </div>

        {/* Description/Specs/Contents Section */}
        <div className="mt-4 lg:mt-6">
          {/* Mobile: Simple stacked */}
          <div className="lg:hidden py-3 space-y-4 px-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Desktop: 3-column cards */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-4 pt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted/30 border border-border/50 rounded-xl p-5 space-y-3">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Seller Section Skeleton */}
        <div className="mt-3 lg:mt-8 pt-3 lg:pt-0">
          {/* Desktop */}
          <div className="hidden lg:block bg-muted/20 border border-border/50 rounded-xl p-6">
            <Skeleton className="h-6 w-48 mb-5" />
            <div className="grid lg:grid-cols-[380px_1fr] gap-6">
              <div className="bg-muted/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-9 w-full rounded-full" />
                <div className="pt-3 border-t space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-2 w-20" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="py-3 border-b border-border/30 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden px-2">
            <div className="bg-muted/30 border border-border/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar Skeleton */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-background border-t lg:hidden pb-safe">
        <div className="px-3 py-2.5 flex items-center gap-2.5">
          <div className="flex-1 min-w-0 space-y-1">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
          <Skeleton className="h-11 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  )
}
