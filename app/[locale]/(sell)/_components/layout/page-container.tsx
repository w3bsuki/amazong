import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * PageContainer - Consistent max-width and padding wrapper for pages
 * 
 * Use this for full-page layouts that need consistent horizontal margins
 * and max-width constraints across desktop/mobile.
 */
function PageContainer({
  children,
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  /** 
   * Container size variant:
   * - "narrow": 768px max (forms, auth pages)
   * - "default": 1200px max (product pages, listings)
   * - "wide": 1400px max (dashboards)
   * - "full": no max-width
   */
  size?: "narrow" | "default" | "wide" | "full"
}) {
  return (
    <div
      data-slot="page-container"
      className={cn(
        "w-full",
        {
          // Intentionally uses the same width primitives as the rest of the app.
          "container-narrow": size === "narrow",
          "container": size === "default",
          "container-wide": size === "wide",
          "px-4 sm:px-6 lg:px-8": size === "full",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  PageContainer,
}
