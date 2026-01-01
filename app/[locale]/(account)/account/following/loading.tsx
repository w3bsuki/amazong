import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function FollowingLoading() {
  return (
    <div className="p-4 lg:p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>

        {/* Following Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
                <div className="mt-3 pt-3 border-t space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
        </div>
      </div>
    </div>
  )
}
