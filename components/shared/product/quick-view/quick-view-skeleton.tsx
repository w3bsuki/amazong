import { Skeleton } from "@/components/ui/skeleton"

export function QuickViewSkeleton() {
  return (
    <div className="flex min-h-full flex-col bg-surface-elevated">
      <div className="border-b border-border px-4 py-3 lg:px-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="size-(--control-compact) rounded-full" />
          <Skeleton className="size-(--control-compact) rounded-full" />
          <Skeleton className="size-(--control-compact) rounded-full" />
        </div>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-1 gap-3 px-4 py-3 lg:grid-cols-5 lg:gap-6 lg:px-6 lg:py-5">
          <div className="space-y-3 lg:col-span-3">
            <Skeleton className="aspect-square w-full rounded-2xl" />

            <div className="space-y-3 rounded-2xl border border-border-subtle bg-card p-4">
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-2">
            <div className="rounded-xl border border-border-subtle bg-surface-subtle p-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 shrink-0 border-t border-border bg-surface-elevated px-4 py-3 pb-safe-max lg:px-6">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-(--control-primary) rounded-xl" />
          <Skeleton className="h-(--control-primary) rounded-xl" />
        </div>
      </div>
    </div>
  )
}

