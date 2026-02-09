import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "../../../_components/page-shell"

export default function SellersLoadingSkeleton() {
  return (
    <PageShell variant="muted" className="pb-20 sm:pb-12">
      <div className="bg-muted py-6 sm:py-10">
        <div className="container">
          <div className="flex gap-2 items-center mb-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>

          <Skeleton className="h-8 sm:h-10 w-40 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      <div className="container py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <Skeleton className="h-4 w-32 mb-4" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="size-4 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              <Skeleton className="h-9 w-full rounded-full" />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
        </div>
      </div>
    </PageShell>
  )
}

