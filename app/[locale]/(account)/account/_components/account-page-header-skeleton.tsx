import { Skeleton } from "@/components/ui/skeleton"
import type { ReactNode } from "react"

interface AccountPageHeaderSkeletonProps {
  titleSkeletonClassName?: string | undefined
  actionSkeletonClassName?: string | undefined
  action?: ReactNode | null
}

export function AccountPageHeaderSkeleton({
  titleSkeletonClassName = "h-8 w-32",
  actionSkeletonClassName = "h-9 w-36",
  action,
}: AccountPageHeaderSkeletonProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className={titleSkeletonClassName} />
        <Skeleton className="h-4 w-64" />
      </div>
      {action === null ? null : (action ?? <Skeleton className={actionSkeletonClassName} />)}
    </div>
  )
}
