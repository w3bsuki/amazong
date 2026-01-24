import { Skeleton } from "@/components/ui/skeleton"
import { getTranslations } from "next-intl/server"

export default async function MembersLoadingSkeleton() {
  const t = await getTranslations("MembersPage")

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12" role="status" aria-live="polite" aria-busy="true">
      <p className="sr-only">{t("loading")}</p>
      <div className="bg-primary/5 py-10 sm:py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-5 w-32 rounded-full" />
              <Skeleton className="h-10 sm:h-12 w-72" />
              <Skeleton className="h-5 w-full max-w-md" />
              <Skeleton className="h-5 w-3/4 max-w-sm" />
              <div className="flex gap-3">
                <Skeleton className="h-11 w-40 rounded-full" />
                <Skeleton className="h-11 w-36 rounded-full" />
              </div>
            </div>
            <Skeleton className="w-72 h-48 rounded-md" />
          </div>
        </div>
      </div>

      <div className="container py-10">
        <Skeleton className="h-7 w-48 mx-auto mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="size-12 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-7 w-36 mx-auto mb-8" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-md border border-border p-6">
                <Skeleton className="h-6 w-28 mb-2" />
                <Skeleton className="h-10 w-32 mb-4" />
                <div className="space-y-3 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="size-4 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-11 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
