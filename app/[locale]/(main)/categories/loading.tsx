import { Skeleton } from "@/components/ui/skeleton"

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
    <div className="min-h-screen bg-background">
      {/* Header - matches page.tsx */}
      <div className="border-b border-border/30 bg-background">
        <div className="px-(--page-inset) py-1.5">
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
            className="flex items-center gap-2 px-(--page-inset) min-h-touch-lg"
          >
            {/* Category circle */}
            <Skeleton className="size-14 shrink-0 rounded-full" />

            {/* Category info */}
            <div className="flex-1 min-w-0 py-3 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>

            {/* Caret */}
            <Skeleton className="size-3 shrink-0" />
          </div>
        ))}
      </div>

      {/* Quick Actions - matches page.tsx */}
      <div className="px-(--page-inset) py-3 bg-muted/20 border-t border-border/30">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-14 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
