import { Skeleton } from "@/components/ui/skeleton"

export default function HelpLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-muted py-8 sm:py-12">
        <div className="container text-center">
          <Skeleton className="h-8 sm:h-10 w-48 mx-auto mb-3" />
          <Skeleton className="h-5 w-72 mx-auto mb-6" />
          <Skeleton className="h-12 max-w-xl mx-auto rounded-full" />
        </div>
      </div>

      <div className="container py-8">
        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-4 text-center">
              <Skeleton className="size-12 mx-auto rounded-full mb-3" />
              <Skeleton className="h-5 w-28 mx-auto mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>

        {/* Popular Topics */}
        <div className="mb-12">
          <Skeleton className="h-6 w-36 mb-6" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-6 w-48 mx-auto mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="size-5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <Skeleton className="h-6 w-52 mx-auto mb-3" />
          <Skeleton className="h-4 w-72 mx-auto mb-4" />
          <Skeleton className="h-10 w-36 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  )
}
