import { cn } from "@/lib/utils"

import { DrawerBody } from "@/components/ui/drawer"
import { Skeleton } from "@/components/ui/skeleton"

import { MENU_GROUP_CLASS } from "./account-drawer.styles"

/** Skeleton for loading state — matches grouped-card layout shape */
export function AccountDrawerSkeleton() {
  return (
    <DrawerBody className="px-inset py-4 pb-6">
      {/* Profile skeleton */}
      <div className={MENU_GROUP_CLASS}>
        <div className="flex items-center gap-3.5 p-4">
          <Skeleton className="size-14 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </div>
      {/* Stats skeleton */}
      <div className={cn(MENU_GROUP_CLASS, "mt-3")}>
        <div className="grid grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3",
                i > 0 && "border-l border-border-subtle"
              )}
            >
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </div>
      {/* Menu group skeleton */}
      <div className={cn(MENU_GROUP_CLASS, "mt-4")}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              i > 0 && "border-t border-border-subtle"
            )}
          >
            <Skeleton className="size-5 shrink-0 rounded" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        ))}
      </div>
      <div className={cn(MENU_GROUP_CLASS, "mt-3")}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              i > 0 && "border-t border-border-subtle"
            )}
          >
            <Skeleton className="size-5 shrink-0 rounded" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>
    </DrawerBody>
  )
}
