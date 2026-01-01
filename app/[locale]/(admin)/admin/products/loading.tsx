import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminProductsLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 px-4 lg:px-6 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-7 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="px-4 lg:px-6 flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Products Table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 gap-4 p-4 border-b bg-muted/50">
              <Skeleton className="h-4 w-20 col-span-2" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="grid grid-cols-7 gap-4 p-4 border-b last:border-0 items-center">
                <div className="col-span-2 flex items-center gap-3">
                  <Skeleton className="size-12 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      <div className="px-4 lg:px-6 flex justify-center gap-2">
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 w-9 rounded" />
      </div>
    </div>
  )
}
