import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SalesLoading() {
  return (
    <div className="p-4 lg:p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-20" />
                  </div>
                  <Skeleton className="size-10 rounded-full" />
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
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
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>

        {/* Recent Sales Table */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile View */}
            <div className="md:hidden divide-y">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted/50">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 items-center">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-8 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
