import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "../../_components/page-shell"

export default function ProductPageLoading() {
  return (
    <PageShell variant="muted" className="pb-24 lg:pb-10">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Breadcrumb skeleton */}
        <div className="hidden lg:flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4">
          {/* Left: Gallery Skeleton */}
          <div className="space-y-3">
            {/* Main Image */}
            <Skeleton className="aspect-square w-full rounded-md" />
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-16 h-16 rounded-lg shrink-0" />
              ))}
            </div>
          </div>

          {/* Right: Buy Box Skeleton */}
          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-24 mt-2" />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-12 rounded" />
            </div>

            {/* Seller Card */}
            <div className="p-4 rounded-md border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
              {/* Seller metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-border-subtle">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center space-y-1">
                    <Skeleton className="h-2 w-12 mx-auto" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping info */}
            <div className="space-y-3 p-4 rounded-md border border-border-subtle">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Add to Cart Button */}
            <Skeleton className="h-12 w-full rounded-lg" />
            
            {/* Buy Now Button */}
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        {/* Item Specifics Skeleton */}
        <div className="mt-10 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between p-3 rounded-lg border border-border-subtle">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-10 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-3">
                <Skeleton className="aspect-square w-full rounded-lg mb-3" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Skeleton */}
        <div className="mt-12 rounded-md bg-surface-subtle p-4 border border-border-subtle">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Rating Summary */}
            <div className="space-y-6 lg:w-80 lg:shrink-0">
              <div className="flex items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              {/* Rating bars */}
              <div className="space-y-3 p-4 rounded-md border border-border-subtle">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-2 flex-1" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                ))}
              </div>
            </div>
            {/* Reviews list */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:flex-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 rounded-md border border-border-subtle space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-background p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-11 w-32 rounded-lg" />
        </div>
      </div>
    </PageShell>
  )
}

