import { Skeleton } from "@/components/ui/skeleton"

export default function RegistryLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero */}
      <div className="bg-primary/5 py-10 sm:py-16">
        <div className="container text-center">
          <Skeleton className="h-10 sm:h-14 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-80 mx-auto mb-6" />
          <div className="flex justify-center gap-3">
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 w-40 rounded-full" />
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Registry Types */}
        <Skeleton className="h-6 w-44 mx-auto mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-md border border-border overflow-hidden">
              <Skeleton className="aspect-[16/9] w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-muted rounded-md p-4 mb-16">
          <Skeleton className="h-6 w-40 mx-auto mb-10" />
          <div className="grid gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="size-14 mx-auto rounded-full mb-4" />
                <Skeleton className="h-5 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Search Registry */}
        <div className="max-w-xl mx-auto text-center">
          <Skeleton className="h-6 w-48 mx-auto mb-4" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}
