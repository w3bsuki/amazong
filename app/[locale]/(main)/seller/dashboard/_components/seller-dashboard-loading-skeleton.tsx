import { Skeleton } from "@/components/ui/skeleton"
import { getTranslations } from "next-intl/server"
import { PageShell } from "../../../../_components/page-shell"

export default async function SellerDashboardLoadingSkeleton() {
  const tCommon = await getTranslations("Common")

  return (
    <PageShell className="pb-20 sm:pb-12" role="status" aria-live="polite" aria-busy="true">
      <p className="sr-only">{tCommon("loading")}</p>
      <div className="border-b bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>

      <div className="container py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="size-8 rounded" />
              </div>
              <Skeleton className="h-7 w-20 mb-1" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-28 rounded-lg shrink-0" />
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border">
          <div className="p-4 border-b flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center gap-3">
                <Skeleton className="size-12 rounded" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="text-right space-y-1.5">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

