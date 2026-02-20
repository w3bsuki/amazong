import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading skeleton for ChatInterface
 * Used for Suspense boundaries and loading states
 */
function ChatInterfaceSkeletonBase({ variant }: { variant: "full" | "inline" }) {
  const isFull = variant === "full"

  return (
    <div
      className={
        isFull ? "flex h-full min-h-0 flex-col bg-background" : "flex h-full min-h-0 flex-col"
      }
    >
      {/* Header skeleton */}
      <div
        className={
          isFull
            ? "shrink-0 border-b border-border-subtle px-4 py-3 pt-safe-max-sm"
            : "shrink-0 border-b border-border-subtle px-4 py-3"
        }
      >
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-28 mb-1.5" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
      {/* Messages area skeleton */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        <div className="flex items-end gap-2">
          <Skeleton className="size-7 rounded-full shrink-0" />
          <Skeleton className="h-12 w-48 rounded-md rounded-bl-md" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-12 w-40 rounded-md rounded-br-md" />
        </div>
        <div className="flex items-end gap-2">
          <Skeleton className="size-7 rounded-full shrink-0" />
          <Skeleton className="h-16 w-56 rounded-md rounded-bl-md" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-md rounded-br-md" />
        </div>
      </div>
      {/* Input skeleton */}
      <div
        className={
          isFull
            ? "shrink-0 border-t border-border-subtle p-3 pb-safe-max-sm"
            : "shrink-0 border-t border-border-subtle p-3"
        }
      >
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  )
}

export function ChatInterfaceSkeleton() {
  return <ChatInterfaceSkeletonBase variant="full" />
}

export function ChatInterfaceSkeletonInline() {
  return <ChatInterfaceSkeletonBase variant="inline" />
}
