import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <div className="flex flex-col gap-4 md:gap-4">
      {/* Main card */}
      <div className="rounded-md border border-border bg-card">
        <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-36 hidden sm:block" />
            </div>
          </div>

          {/* Tabs */}
          <Skeleton className="h-10 w-full sm:w-96 rounded-full" />
          {/* Search */}
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="border-t border-border" />

        {/* Mobile list skeleton */}
        <div className="p-2 md:hidden space-y-2">
          {[1, 2, 3].map((order) => (
            <div key={order} className="rounded-md border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table skeleton */}
        <div className="hidden md:block p-6">
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((h) => (
              <Skeleton key={h} className="h-4 w-full" />
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {[1, 2, 3, 4].map((r) => (
              <div key={r} className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((c) => (
                  <Skeleton key={c} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
