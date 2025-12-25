import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile skeleton */}
      <div className="w-full md:hidden space-y-3">
        <div className="px-3 pt-2">
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <Skeleton className="size-[72px] rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>

        <div className="px-3">
          <Skeleton className="w-full h-20 rounded-lg" />
        </div>

        <div className="px-3">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-3">
                <div className="flex gap-3">
                  <Skeleton className="size-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-3 pb-4">
          <Skeleton className="w-full h-16 rounded-lg" />
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="hidden md:block">
        <div className="container px-4 lg:px-6 pt-4 pb-6">
          <Skeleton className="w-full h-28 rounded-xl" />
        </div>

        <div className="container px-4 lg:px-6 space-y-8 pb-20">
          <Skeleton className="w-full h-44 rounded-xl" />

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-52" />
              <Skeleton className="h-8 w-44 rounded-full" />
            </div>
            <div className="flex gap-2 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Skeleton className="h-6 w-56 mb-3" />
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-[260px] min-w-[260px] h-32 rounded-xl" />
              ))}
            </div>
          </div>

          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
