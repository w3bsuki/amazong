import { Skeleton } from "@/components/ui/skeleton"

export default function PlansLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        {/* Title Section */}
        <div className="text-center mb-8 space-y-3">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-5 w-48 mx-auto" />
        </div>

        {/* Toggle Switches */}
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Account Type Toggle */}
          <div className="flex items-center gap-3 p-1 bg-muted rounded-lg">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
          
          {/* Billing Period Toggle */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-10 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        {/* Plans Grid */}
        <div className="-mx-4 px-4 pt-3 flex gap-4 overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory no-scrollbar md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="shrink-0 snap-center md:w-auto md:shrink md:snap-none w-[calc(100vw-3rem)] rounded-xl border bg-card p-4 sm:p-6"
            >
              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="size-10 sm:size-12 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-24" />
                  {i === 2 && <Skeleton className="h-4 w-16 rounded-full" />}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <Skeleton className="h-8 sm:h-10 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-32 mt-1" />
              </div>

              {/* Description */}
              <Skeleton className="h-4 w-full mb-4" />

              {/* Features */}
              <div className="space-y-2.5 mb-6">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex items-start gap-2">
                    <Skeleton className="size-4 rounded-full shrink-0 mt-0.5" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Skeleton className="h-10 sm:h-11 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Skeleton className="h-6 w-32 mx-auto mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="size-5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
