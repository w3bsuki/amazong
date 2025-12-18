import { Skeleton } from "@/components/ui/skeleton"

export default function CategorySlugLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4">
        {/* Layout: Sidebar (desktop) + Main Content */}
        <div className="flex gap-0">
          {/* Sidebar Filters - Desktop Only */}
          <aside className="w-56 hidden lg:block shrink-0 border-r border-border">
            <div className="sticky top-16 pr-4 py-1 max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar space-y-6">
              {/* Category Header */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              
              {/* Subcategories */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-24" />
                ))}
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-28" />
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 lg:pl-5">
            {/* Subcategory Pills */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
              ))}
            </div>

            {/* Filter & Sort Row */}
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="h-9 w-24 lg:hidden" />
              <Skeleton className="h-9 w-36" />
              <div className="hidden lg:flex items-center gap-2 ml-auto">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="hidden sm:block h-4 w-24 ml-auto" />
            </div>

            {/* Mobile Results Strip */}
            <div className="sm:hidden mb-4">
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg border border-border overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
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
    </div>
  )
}
