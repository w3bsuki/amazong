import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function BusinessUpgradeLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6 text-center">
        <Skeleton className="h-8 w-56 mx-auto mb-2" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>

      {/* Current Status */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="size-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Toggle */}
      <div className="px-4 lg:px-6 flex justify-center">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>

      {/* Plans Grid */}
      <div className="px-4 lg:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className={i === 2 ? "border-primary" : ""}>
              <CardHeader className="pb-3">
                {i === 2 && <Skeleton className="h-5 w-20 rounded-full mb-2" />}
                <div className="flex items-center gap-3">
                  <Skeleton className="size-12 rounded-lg" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="space-y-2.5 pt-2">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div key={j} className="flex items-start gap-2">
                      <Skeleton className="size-4 rounded-full shrink-0 mt-0.5" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-11 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="px-4 lg:px-6 mt-8">
        <Skeleton className="h-6 w-24 mx-auto mb-6" />
        <div className="max-w-2xl mx-auto space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="size-5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
