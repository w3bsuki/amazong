import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "../../_components/page-shell"

export default function SearchLoading() {
  return (
    <PageShell variant="muted">
      <div className="flex flex-col lg:flex-row container px-0!">
        {/* Sidebar Skeleton - Hidden on mobile */}
        <aside className="w-64 hidden lg:block shrink-0 border-r border-sidebar-border bg-sidebar">
          <div className="sticky top-0 p-4 space-y-5 max-h-screen overflow-y-auto">
            {/* Department Filter */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            {/* Price Filter */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-16" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))}
              </div>
            </div>
            {/* Rating Filter */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-28" />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Results Skeleton */}
        <div className="flex-1 p-4 sm:p-4">
          {/* Search Header */}
          <div className="mb-4">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
            ))}
          </div>

          {/* Filter & Sort Row */}
          <div className="mb-3 sm:mb-5 flex items-center gap-2 sm:gap-2.5">
            <Skeleton className="h-10 w-24 lg:hidden" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-24 ml-auto hidden sm:block" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-2 sm:p-3">
                {/* Product Image */}
                <Skeleton className="aspect-square w-full rounded-lg mb-2 sm:mb-3" />
                {/* Title */}
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-10" />
                </div>
                {/* Price */}
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

