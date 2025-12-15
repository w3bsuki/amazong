import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardSettingsLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6 space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Settings Navigation */}
      <div className="px-4 lg:px-6">
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-md shrink-0" />
          ))}
        </div>
      </div>

      {/* Store Info */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo & Banner */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="size-24 rounded-xl" />
                <Skeleton className="h-9 w-28" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <Skeleton className="h-10 w-28" />
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
