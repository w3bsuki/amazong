import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function PaymentsLoading() {
  return (
    <div className="p-4 lg:p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-40" />
        </div>

        {/* Payment Methods Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Add New Payment Method Card */}
          <Card className="border-dashed">
            <CardContent className="p-4 flex flex-col items-center justify-center min-h-[180px]">
              <Skeleton className="size-12 rounded-full mb-3" />
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardContent>
          </Card>

          {/* Payment Method Cards */}
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  {i === 1 && <Skeleton className="h-5 w-16 rounded-full" />}
                </div>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Billing Address Section */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
