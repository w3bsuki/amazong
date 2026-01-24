import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "@/components/shared/page-shell"

export default function WishlistLoading() {
  return (
    <PageShell variant="muted" className="py-4">
      <div className="container">
      {/* Breadcrumb */}
      <div className="flex gap-2 items-center mb-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
      
      {/* Title */}
      <Skeleton className="h-9 w-36 mb-6" />
      
      {/* Items count */}
      <Skeleton className="h-4 w-24 mb-4" />

      {/* Wishlist Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-2 sm:p-3">
            {/* Image */}
            <Skeleton className="aspect-square rounded-lg mb-2 sm:mb-3" />
            
            {/* Title */}
            <div className="space-y-1 mb-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-10" />
            </div>
            
            {/* Price */}
            <Skeleton className="h-5 w-20 mb-3" />
            
            {/* Add to Cart Button */}
            <Skeleton className="h-9 w-full rounded-full" />
          </div>
        ))}
      </div>
      </div>
    </PageShell>
  )
}
