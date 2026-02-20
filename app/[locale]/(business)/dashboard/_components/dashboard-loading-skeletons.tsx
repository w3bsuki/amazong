import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardPageLoadingShell({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">{children}</div>
}

export function DashboardHeaderSkeleton({
  titleWidthClassName,
  actionWidthClassName,
}: {
  titleWidthClassName: string
  actionWidthClassName: string
}) {
  return (
    <div className="px-4 lg:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className={`h-8 ${titleWidthClassName}`} />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className={`h-9 ${actionWidthClassName}`} />
    </div>
  )
}

export function DashboardStatsCardsSkeleton({
  count,
  gridClassName,
  labelWidthClassName,
}: {
  count: number
  gridClassName: string
  labelWidthClassName: string
}) {
  const items = Array.from({ length: count }, (_, index) => index + 1)

  return (
    <div className={gridClassName}>
      {items.map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className={`h-4 ${labelWidthClassName}`} />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function DashboardFiltersSkeleton({
  rightButtonWidths,
}: {
  rightButtonWidths: readonly [string, string]
}) {
  const [firstWidth, secondWidth] = rightButtonWidths

  return (
    <div className="px-4 lg:px-6 flex flex-col sm:flex-row gap-3">
      <Skeleton className="h-10 flex-1" />
      <div className="flex gap-2">
        <Skeleton className={`h-10 ${firstWidth}`} />
        <Skeleton className={`h-10 ${secondWidth}`} />
      </div>
    </div>
  )
}

