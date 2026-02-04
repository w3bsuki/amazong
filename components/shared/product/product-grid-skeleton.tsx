"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// =============================================================================
// TYPES
// =============================================================================

export interface ProductGridSkeletonProps {
  viewMode: "grid" | "list"
  count?: number
}

// =============================================================================
// PRODUCT GRID SKELETON
// =============================================================================

export function ProductGridSkeleton({ viewMode, count = 18 }: ProductGridSkeletonProps) {
  return (
    <div className={cn(
      viewMode === "list"
        ? "flex flex-col gap-3"
        : "grid gap-3 grid-cols-2 @[520px]:grid-cols-3 @[720px]:grid-cols-4 @[960px]:grid-cols-5"
    )}>
      {Array.from({ length: count }).map((_, i) =>
        viewMode === "list" ? (
          <div key={i} className="flex gap-3 rounded-xl border border-border p-3 bg-card">
            <Skeleton className="w-32 h-32 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-24 mt-auto" />
            </div>
          </div>
        ) : (
          <div key={i} className="space-y-2 border border-border bg-card rounded-xl p-3">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )
      )}
    </div>
  )
}
