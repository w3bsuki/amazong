import { Skeleton } from "@/components/ui/skeleton"

export default function CustomerServiceLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero */}
      <div className="bg-muted py-8 sm:py-12">
        <div className="container">
          <div className="flex gap-2 items-center mb-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 sm:h-10 w-56 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      <div className="container py-8">
        {/* Quick Help Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="size-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Options */}
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-4 text-center">
              <Skeleton className="size-14 mx-auto rounded-full mb-4" />
              <Skeleton className="h-5 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
