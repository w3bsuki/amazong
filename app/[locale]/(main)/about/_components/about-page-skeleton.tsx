import { Skeleton } from "@/components/ui/skeleton"

export function AboutPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="bg-header-bg text-white relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container py-12 md:py-20 relative z-10">
          <Skeleton className="h-8 w-48 mb-4 bg-primary-foreground/20" />
          <Skeleton className="h-12 w-96 mb-4 bg-primary-foreground/20" />
          <Skeleton className="h-6 w-80 bg-primary-foreground/20" />
        </div>
      </div>
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="aspect-video" />
        </div>
      </div>
    </div>
  )
}
