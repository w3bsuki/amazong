import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  DashboardFiltersSkeleton,
  DashboardHeaderSkeleton,
  DashboardPageLoadingShell,
  DashboardStatsCardsSkeleton,
} from "../_components/dashboard-loading-skeletons"

export default function DashboardDiscountsLoading() {
  return (
    <DashboardPageLoadingShell>
      {/* Header */}
      <DashboardHeaderSkeleton titleWidthClassName="w-32" actionWidthClassName="w-40" />

      {/* Stats Cards */}
      <DashboardStatsCardsSkeleton
        count={3}
        gridClassName="grid gap-4 px-4 lg:px-6 sm:grid-cols-3"
        labelWidthClassName="w-28"
      />

      {/* Filters */}
      <DashboardFiltersSkeleton rightButtonWidths={["w-28", "w-28"]} />

      {/* Discounts List */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="p-0 divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <Skeleton className="size-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardPageLoadingShell>
  )
}
