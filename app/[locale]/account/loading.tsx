import { Skeleton } from "@/components/ui/skeleton"

export default function AccountLoading() {
  return (
    <div className="container py-4 min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="flex gap-2 items-center mb-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
      
      {/* Title */}
      <Skeleton className="h-9 w-48 mb-6" />

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-4">
            <div className="flex gap-4 items-start pt-2">
              <Skeleton className="size-8 shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
