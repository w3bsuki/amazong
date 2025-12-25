import { Skeleton } from "@/components/ui/skeleton"

export default function TermsLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero */}
      <div className="bg-muted py-8 sm:py-12">
        <div className="container">
          <Skeleton className="h-8 sm:h-10 w-56 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <div className="richtext max-w-none text-sm">
          {/* Table of Contents */}
          <div className="bg-card rounded-lg border border-border p-4 mb-8">
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-4 w-48" />
              ))}
            </div>
          </div>

          {/* Sections */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="mb-8">
              <Skeleton className="h-7 w-56 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
