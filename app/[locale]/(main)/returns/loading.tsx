import { Skeleton } from "@/components/ui/skeleton"

export default function ReturnsLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero */}
      <div className="bg-muted py-8 sm:py-12">
        <div className="container">
          <div className="flex gap-2 items-center mb-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 sm:h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Return Steps */}
        <div className="space-y-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>

        {/* Return Policy */}
        <div className="bg-card rounded-lg border border-border p-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
