import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "../../../_components/page-shell"

export default function GiftCardsLoadingSkeleton() {
  return (
    <PageShell variant="muted" className="pb-20 sm:pb-12">
      <div className="bg-surface-subtle py-8 sm:py-12">
        <div className="container">
          <div className="flex gap-2 items-center mb-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-full max-w-md" />
              <Skeleton className="h-5 w-3/4 max-w-sm" />
              <Skeleton className="h-11 w-40 rounded-full" />
            </div>
            <Skeleton className="w-64 h-40 rounded-md" />
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Skeleton className="h-6 w-44 mb-6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border overflow-hidden">
              <Skeleton className="aspect-16-10 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="flex flex-wrap gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 w-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="bg-muted rounded-md p-4 sm:p-4">
          <Skeleton className="h-6 w-36 mx-auto mb-8" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="size-16 mx-auto rounded-full mb-4" />
                <Skeleton className="h-5 w-28 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

