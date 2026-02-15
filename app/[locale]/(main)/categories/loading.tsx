import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "../../_components/page-shell"

/**
 * /categories loading skeleton
 * 
 * Matches the actual page structure:
 * - Compact header with title + count
 * - Directory list with category circles + subcategory preview
 * - Quick action cards at bottom
 */
export default function CategoriesLoading() {
  return (
    <PageShell>
      {/* Header - matches page.tsx */}
      <div className="border-b border-border-subtle bg-background">
        <div className="px-inset py-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Category List - matches page.tsx directory style */}
      <div className="divide-y divide-border/60">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex min-h-(--control-default) items-center gap-2 px-inset"
          >
            {/* Category circle */}
            <Skeleton className="size-(--control-primary) shrink-0 rounded-full" />

            {/* Category info */}
            <div className="min-w-0 flex-1 space-y-1.5 py-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>

            {/* Caret */}
            <Skeleton className="size-3 shrink-0" />
          </div>
        ))}
      </div>

      {/* Quick Actions - matches page.tsx */}
      <div className="px-inset py-3 bg-surface-subtle border-t border-border-subtle">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-14 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-md" />
        </div>
      </div>
    </PageShell>
  )
}

