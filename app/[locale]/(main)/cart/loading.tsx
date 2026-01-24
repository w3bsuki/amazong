import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "@/components/shared/page-shell"

export default function CartLoading() {
  return (
    <PageShell variant="muted" className="pt-14 pb-32 lg:pt-0 lg:pb-12">
      <div className="container py-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-12" />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Cart Items Skeleton */}
        <div className="flex-1 bg-card p-4 rounded border border-border">
          <div className="flex justify-between items-end mb-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="h-px w-full bg-border mb-4" />

          {/* Cart Item Skeletons */}
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <Skeleton className="w-full sm:w-32 md:w-48 h-32 sm:h-32 md:h-48 shrink-0" />
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div className="flex-1">
                      {/* Title */}
                      <Skeleton className="h-5 w-full mb-1" />
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      
                      {/* Stock Status */}
                      <Skeleton className="h-3 w-16 mb-1" />
                      
                      {/* Shipping Info */}
                      <Skeleton className="h-3 w-48 mb-2" />
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    
                    {/* Price */}
                    <Skeleton className="h-6 w-20 mt-2 sm:mt-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px w-full bg-border my-4" />
          
          {/* Subtotal */}
          <div className="flex justify-end gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>

        {/* Checkout Sidebar Skeleton */}
        <div className="w-full lg:w-80 h-fit bg-card p-4 rounded shadow-sm">
          {/* Free Shipping Notice */}
          <div className="flex items-start gap-2 mb-4">
            <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          
          {/* Subtotal */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-16" />
          </div>
          
          {/* Gift Checkbox */}
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>
          
          {/* Checkout Button */}
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
      </div>
    </PageShell>
  )
}
