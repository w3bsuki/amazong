import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "@/components/shared/page-shell"

export default function ProfileLoading() {
  return (
    <PageShell>
      {/* Banner skeleton */}
      <Skeleton className="h-32 md:h-48 w-full" />

      {/* Profile header skeleton */}
      <div className="container -mt-12 md:-mt-16">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-4">
          <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background" />
          <div className="flex-1 pt-2 space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="container py-6">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="container py-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
