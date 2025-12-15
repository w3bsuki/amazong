import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero */}
      <div className="bg-muted py-12 sm:py-20">
        <div className="container text-center">
          <Skeleton className="h-10 sm:h-14 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
          <Skeleton className="h-5 w-3/4 max-w-xl mx-auto mt-2" />
        </div>
      </div>

      <div className="container py-12">
        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="aspect-video rounded-xl" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-10 w-20 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <Skeleton className="h-8 w-40 mx-auto mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-6">
                <Skeleton className="size-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="text-center">
          <Skeleton className="h-8 w-32 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="aspect-square rounded-xl mb-3" />
                <Skeleton className="h-5 w-28 mx-auto mb-1" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
