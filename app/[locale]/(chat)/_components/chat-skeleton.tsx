"use client"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading skeleton for ChatInterface
 * Used for Suspense boundaries and loading states
 */
export function ChatInterfaceSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Header skeleton */}
      <div className="shrink-0 border-b border-border/50 px-4 py-3 pt-safe-max-sm">
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
      <div className="shrink-0 border-t border-border/50 p-3 pb-safe-max-sm">
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  )
}

/**
 * Loading skeleton for conversation list
 */
export function ConversationListSkeleton() {
  return (
    <div className="flex flex-col">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <Skeleton className="size-12 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-3.5 w-24 mb-1.5" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      ))}
    </div>
  )
}
