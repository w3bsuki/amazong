import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function BusinessDashboardLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Setup Guide Skeleton (for new stores) */}
      <Card className="mx-4 lg:mx-6">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <Skeleton className="size-5 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="px-4 lg:px-6">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Live Activity & Tasks Badges */}
      <div className="flex items-center gap-3 px-4 lg:px-6 flex-wrap">
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-20" />
                </div>
                <Skeleton className="size-10 rounded-full" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Score */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <Skeleton className="size-32 rounded-full" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-2 flex-1 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
