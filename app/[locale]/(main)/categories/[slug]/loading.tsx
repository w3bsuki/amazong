import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "../../../_components/page-shell"

export default function CategorySlugLoading() {
  return (
    <PageShell variant="muted">
      {/* MOBILE Loading State - Matches contextual mode layout */}
      <div className="lg:hidden">
        {/* Contextual Header skeleton (48px) - matches ContextualCategoryHeader */}
        <div className="sticky top-0 z-50 bg-background">
          <div className="pt-safe-top">
            <div className="flex items-center justify-between px-3 h-12 border-b border-border-subtle">
              <div className="flex items-center">
                <Skeleton className="size-9 rounded-full" /> {/* Back button */}
                <Skeleton className="h-5 w-32 ml-1" /> {/* Title */}
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="size-9 rounded-full" /> {/* Search */}
                <Skeleton className="size-9 rounded-full" /> {/* Wishlist */}
                <Skeleton className="size-9 rounded-full" /> {/* Cart */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Subcategory circles skeleton - matches CategoryCircles */}
        <div className="bg-background border-b border-border-subtle">
          <div className="px-inset py-3">
            <div className="flex items-start gap-3 overflow-x-auto no-scrollbar">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 w-18">
                  <Skeleton className="size-14 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Filter/Sort bar skeleton - 50/50 split matches FilterSortBar */}
        <div className="sticky top-12 z-20 bg-background border-b border-border-subtle">
          <div className="flex items-stretch divide-x divide-border/60 h-10">
            <div className="flex-1 flex items-center justify-center gap-1.5">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex-1 flex items-center justify-center gap-1.5">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Filter chips skeleton */}
        <div className="bg-background px-4 py-2">
          <div className="flex gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* Product grid skeleton - matches ProductFeed compact density */}
        <div className="pt-1 px-4">
          <div className="grid grid-cols-2 gap-2 py-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full rounded-md" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-8/12" />
                <Skeleton className="h-4 w-6/12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP Loading State */}
      <div className="hidden lg:block container px-2 sm:px-4 py-1">
        <div className="flex gap-0">
          {/* Sidebar Filters - Desktop Only */}
          <aside className="w-56 hidden lg:block shrink-0 border-r border-border">
            <div className="sticky top-16 pr-4 py-1 max-h-(--category-sidebar-max-h) overflow-y-auto no-scrollbar space-y-3">
              <Skeleton className="h-6 w-36" />
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
              <div className="pt-2">
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 lg:pl-5">
            {/* Mobile Results Info Strip (matches page position) */}
            <div className="sm:hidden mb-3 flex items-end justify-between px-1 pt-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-16" />
            </div>

            {/* Subcategory circles row placeholder */}
            <div className="mb-2">
              <div className="flex overflow-x-auto no-scrollbar gap-2 py-1 px-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                    <Skeleton className="size-12 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>

            {/* Filter & Sort Row */}
            <div className="mb-2 sm:mb-4 grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-2">
              <div className="lg:hidden">
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="lg:contents">
                <Skeleton className="h-9 w-full lg:w-44" />
              </div>
              <div className="hidden lg:flex items-center gap-2 flex-wrap">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-28" />
                ))}
              </div>
              <div className="hidden sm:block ml-auto">
                <Skeleton className="h-5 w-48" />
              </div>
            </div>

            {/* Active Filter Chips */}
            <div className="mb-4 flex gap-2 flex-wrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-md" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-8/12" />
                  <Skeleton className="h-4 w-6/12" />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Skeleton className="h-10 w-64" />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

