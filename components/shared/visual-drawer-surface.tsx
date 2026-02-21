import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

type VisualDrawerSurfaceProps = ComponentPropsWithoutRef<"section"> & {
  showHandle?: boolean
}

export function VisualDrawerSurface({
  showHandle = true,
  className,
  children,
  ...props
}: VisualDrawerSurfaceProps) {
  return (
    <section
      data-slot="visual-drawer-surface"
      className={cn(
        "relative -mt-4 overflow-hidden rounded-t-2xl bg-surface-elevated shadow-nav border-t border-border",
        className
      )}
      {...props}
    >
      {showHandle ? (
        <div aria-hidden="true" className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 shrink-0 rounded-full bg-border" />
        </div>
      ) : null}
      {children}
    </section>
  )
}
