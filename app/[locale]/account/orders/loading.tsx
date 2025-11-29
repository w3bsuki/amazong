import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <div className="container py-4 min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-4">
        <Skeleton className="h-9 w-36" />
        <div className="flex w-full md:w-auto">
          <Skeleton className="h-10 w-full md:w-80 rounded-r-none" />
          <Skeleton className="h-10 w-32 rounded-l-none" />
        </div>
      </div>

      {/* Order Cards */}
      <div className="space-y-6">
        {[1, 2, 3].map((order) => (
          <div key={order} className="rounded-md border border-border shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="bg-muted p-4 border-b border-border">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-8">
                  <div>
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-3 w-32 mb-1" />
                  <div className="flex gap-2 justify-end">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Content */}
            <div className="p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              
              {/* Order Items */}
              <div className="flex flex-col gap-6">
                {[1, 2].map((item) => (
                  <div key={item} className="flex gap-4">
                    <Skeleton className="w-24 h-24 shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-full mb-1" />
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-48 mb-2" />
                      <div className="flex gap-2 mt-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-28" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
