import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type CurrentPlanCardSkeletonProps = {
  statusBadgeRounded?: boolean
}

export function CurrentPlanCardSkeleton({
  statusBadgeRounded = false,
}: CurrentPlanCardSkeletonProps) {
  const statusBadgeClassName = statusBadgeRounded ? "h-5 w-16 rounded-full" : "h-5 w-16"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className={statusBadgeClassName} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

