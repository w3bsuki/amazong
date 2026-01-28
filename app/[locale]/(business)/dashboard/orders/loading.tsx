import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardOrdersLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="px-4 lg:px-6 flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="p-0">
            {/* Mobile View */}
            <div className="md:hidden divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-7 gap-4 p-4 border-b bg-surface-subtle">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20 col-span-2" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="grid grid-cols-7 gap-4 p-4 border-b last:border-0 items-center">
                  <Skeleton className="h-4 w-24" />
                  <div className="col-span-2 flex items-center gap-3">
                    <Skeleton className="size-10 rounded" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      <div className="px-4 lg:px-6 flex justify-center gap-2">
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 w-9 rounded" />
      </div>
    </div>
  )
}
