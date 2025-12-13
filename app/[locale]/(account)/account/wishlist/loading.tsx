import { Skeleton } from "@/components/ui/skeleton"

export default function WishlistLoading() {
  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-8 w-36" />
      </div>

        {/* Card with items */}
        <div className="bg-card rounded-lg border border-border">
          {[1, 2, 3, 4].map((item, index) => (
            <div key={item}>
              {index > 0 && <div className="h-px w-full bg-border" />}
              <div className="p-4 flex gap-4">
                {/* Product Image */}
                <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg shrink-0" />

                {/* Product Details */}
                <div className="flex-1 flex flex-col">
                  {/* Title */}
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  
                  {/* Price */}
                  <Skeleton className="h-6 w-20 mt-1" />

                  {/* Added date */}
                  <Skeleton className="h-3 w-32 mt-1" />

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-3">
                    <Skeleton className="h-8 w-28 rounded" />
                    <Skeleton className="h-8 w-20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* Add All to Cart Button */}
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-10 w-44 rounded" />
      </div>
    </div>
  )
}
