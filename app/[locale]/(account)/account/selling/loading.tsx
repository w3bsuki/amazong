import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SellingLoading() {
  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        {/* Products Table/Grid */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile View */}
            <div className="md:hidden divide-y">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 flex gap-3">
                  <Skeleton className="size-20 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/50">
                <Skeleton className="h-4 w-20 col-span-2" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center">
                  <div className="col-span-2 flex gap-3">
                    <Skeleton className="size-12 rounded" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
        </div>
      </div>
    </div>
  )
}
