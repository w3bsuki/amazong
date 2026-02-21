import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "../../_components/page-shell"

/**
 * /categories loading skeleton
 */
export default function CategoriesLoading() {
  return (
    <PageShell variant="muted">
      <div className="mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe">
        {/* Search input skeleton */}
        <div className="border-b border-border-subtle bg-background px-inset py-3">
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>

        {/* Icon grid skeleton */}
        <div className="px-inset py-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border-subtle bg-background p-4"
              >
                <Skeleton className="size-12 rounded-2xl" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

