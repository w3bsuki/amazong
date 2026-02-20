import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  DashboardFiltersSkeleton,
  DashboardHeaderSkeleton,
  DashboardPageLoadingShell,
  DashboardStatsCardsSkeleton,
} from "../_components/dashboard-loading-skeletons"

export default function DashboardCustomersLoading() {
  return (
    <DashboardPageLoadingShell>
      {/* Header */}
      <DashboardHeaderSkeleton titleWidthClassName="w-32" actionWidthClassName="w-32" />

      {/* Stats Cards */}
      <DashboardStatsCardsSkeleton
        count={4}
        gridClassName="grid gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-4"
        labelWidthClassName="w-24"
      />

      {/* Filters */}
      <DashboardFiltersSkeleton rightButtonWidths={["w-28", "w-28"]} />

      {/* Customers Table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="p-0">
            <div className="hidden md:block">
              <div className="grid grid-cols-6 gap-4 p-4 border-b bg-surface-subtle">
                <Skeleton className="h-4 w-24 col-span-2" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center">
                  <div className="col-span-2 flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLoadingShell>
  )
}
