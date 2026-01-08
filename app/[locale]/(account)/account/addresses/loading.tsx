import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AddressesLoading() {
  return (
    <div className="p-4 lg:p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>

        {/* Addresses Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Add New Address Card */}
          <Card className="border-dashed">
            <CardContent className="p-4 flex flex-col items-center justify-center min-h-(--card-loading-min-h)">
              <Skeleton className="size-12 rounded-full mb-3" />
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardContent>
          </Card>

          {/* Address Cards */}
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24" />
                    {i === 1 && <Skeleton className="h-5 w-16 rounded-full" />}
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
