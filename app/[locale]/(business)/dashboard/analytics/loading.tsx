import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardAnalyticsLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-24" />
                </div>
                <Skeleton className="size-10 rounded-full" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="size-10 rounded" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
