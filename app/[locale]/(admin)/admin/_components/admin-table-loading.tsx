import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

type AdminTableLoadingVariant = "orders" | "users"

const VARIANTS: Record<
  AdminTableLoadingVariant,
  {
    statsValueWidthClassName: string
    filterSecondWidthClassName: string
    tableGridColsClassName: string
    tableHeaderSkeletonClassNames: string[]
    rowPrefixSkeletonClassNames: string[]
    userInfoSecondLineWidthClassName: string
    rowSuffixSkeletonClassNames: string[]
  }
> = {
  orders: {
    statsValueWidthClassName: "w-16",
    filterSecondWidthClassName: "w-32",
    tableGridColsClassName: "grid-cols-7",
    tableHeaderSkeletonClassNames: [
      "h-4 w-20",
      "h-4 w-20",
      "h-4 w-20 col-span-2",
      "h-4 w-16",
      "h-4 w-16",
      "h-4 w-16",
    ],
    rowPrefixSkeletonClassNames: ["h-4 w-24", "h-4 w-24"],
    userInfoSecondLineWidthClassName: "w-24",
    rowSuffixSkeletonClassNames: [
      "h-4 w-16",
      "h-5 w-20 rounded-full",
      "h-8 w-8 rounded",
    ],
  },
  users: {
    statsValueWidthClassName: "w-12",
    filterSecondWidthClassName: "w-28",
    tableGridColsClassName: "grid-cols-6",
    tableHeaderSkeletonClassNames: [
      "h-4 w-16 col-span-2",
      "h-4 w-16",
      "h-4 w-16",
      "h-4 w-16",
      "h-4 w-16",
    ],
    rowPrefixSkeletonClassNames: [],
    userInfoSecondLineWidthClassName: "w-40",
    rowSuffixSkeletonClassNames: [
      "h-5 w-16 rounded-full",
      "h-4 w-24",
      "h-5 w-16 rounded-full",
      "h-8 w-8 rounded",
    ],
  },
}

function UserInfoSkeleton({
  secondLineWidthClassName,
}: {
  secondLineWidthClassName: string
}) {
  return (
    <div className="col-span-2 flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className={`h-3 ${secondLineWidthClassName}`} />
      </div>
    </div>
  )
}

export function AdminTableLoading({ variant }: { variant: AdminTableLoadingVariant }) {
  const config = VARIANTS[variant]

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 px-4 lg:px-6 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className={`h-7 ${config.statsValueWidthClassName}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="px-4 lg:px-6 flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className={`h-10 ${config.filterSecondWidthClassName}`} />
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="p-0">
            <div
              className={`grid ${config.tableGridColsClassName} gap-4 p-4 border-b bg-surface-subtle`}
            >
              {config.tableHeaderSkeletonClassNames.map((className, idx) => (
                <Skeleton key={idx} className={className} />
              ))}
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className={`grid ${config.tableGridColsClassName} gap-4 p-4 border-b last:border-0 items-center`}
              >
                {config.rowPrefixSkeletonClassNames.map((className, idx) => (
                  <Skeleton key={idx} className={className} />
                ))}
                <UserInfoSkeleton
                  secondLineWidthClassName={config.userInfoSecondLineWidthClassName}
                />
                {config.rowSuffixSkeletonClassNames.map((className, idx) => (
                  <Skeleton key={idx} className={className} />
                ))}
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
        <Skeleton className="h-9 w-9 rounded" />
      </div>
    </div>
  )
}

