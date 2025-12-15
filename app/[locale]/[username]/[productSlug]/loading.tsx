import { Skeleton } from "@/components/ui/skeleton"

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-background pb-24 lg:pb-10">
      {/* Breadcrumb skeleton */}
      <div className="hidden md:block container py-2">
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Main content skeleton */}
      <div className="container pt-2 pb-0 lg:py-4">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Image gallery skeleton */}
          <div className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-16 h-16 rounded-md" />
              ))}
            </div>
          </div>

          {/* Product details skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex gap-2 items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-10 w-32" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Related products skeleton */}
      <div className="container pt-8">
        <Skeleton className="h-6 w-64 mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
