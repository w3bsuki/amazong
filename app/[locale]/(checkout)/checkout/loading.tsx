import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-20 hidden sm:block" />
              {i < 2 && <Skeleton className="h-0.5 w-8 sm:w-16" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Shipping Address Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Saved Addresses */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20" />
                        {i === 1 && <Skeleton className="h-5 w-16 rounded-full" />}
                      </div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
                
                {/* New Address Form */}
                <div className="border rounded-lg p-4 border-dashed">
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="size-5" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-6 w-36" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-4 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Method Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="size-10" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="size-16 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>

                <Skeleton className="h-12 w-full rounded-lg" />

                <div className="flex items-center gap-2 justify-center">
                  <Skeleton className="size-4" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
