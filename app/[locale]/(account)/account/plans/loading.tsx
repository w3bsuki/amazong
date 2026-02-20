import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CurrentPlanCardSkeleton } from "../_components/current-plan-card-skeleton"

export default function AccountPlansLoading() {
  return (
    <div className="p-4 lg:p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Current Plan Card */}
        <CurrentPlanCardSkeleton statusBadgeRounded />

        {/* Usage Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full mt-3 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Plans Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-10 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className={i === 2 ? "border-primary" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-lg" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Skeleton className="size-4 rounded-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
