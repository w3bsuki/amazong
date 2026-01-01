import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-sm bg-card rounded-md border border-border">
        <div className="p-6">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-56 mb-6" />
          <Skeleton className="h-24 w-full mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
