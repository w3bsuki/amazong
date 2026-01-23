// =============================================================================
// HERO SPECS - Category-Adaptive Specification Pills
// =============================================================================
// Displays up to 4 key product specifications in a pill grid.
// The specs shown depend on the product's category (electronics shows
// Brand/Model/Condition/Warranty, automotive shows Make/Model/Year/Mileage, etc.)
// =============================================================================

"use client"

import { cn } from "@/lib/utils"
import type { ResolvedHeroSpec } from "@/lib/view-models/product-page"

// Re-export for consumers
export type { ResolvedHeroSpec }

interface HeroSpecsProps {
  /** Pre-resolved hero specs from view model */
  specs: ResolvedHeroSpec[]
  /** Layout variant */
  variant?: "desktop" | "mobile"
  /** Additional className */
  className?: string
}

/**
 * Renders category-adaptive hero specifications in a pill grid.
 * 
 * Desktop: 4-column grid with larger pills
 * Mobile: 2-column grid with compact pills
 * 
 * Uses design system tokens:
 * - bg-muted/30 for pill background (subtle)
 * - border-border for pill border
 * - text-muted-foreground for labels
 * - text-foreground + font-semibold for values
 */
export function HeroSpecs({
  specs,
  variant = "desktop",
  className,
}: HeroSpecsProps) {
  // Don't render if no specs available
  if (!specs || specs.length === 0) {
    return null
  }

  const isMobile = variant === "mobile"

  return (
    <div
      className={cn(
        "grid gap-2",
        isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {specs.map((spec) => (
        <div
          key={spec.label}
          className={cn(
            "rounded-lg border border-border bg-muted/30",
            // Mobile: compact, centered layout
            // Desktop: slightly larger, centered
            isMobile
              ? "flex items-center justify-between px-3 py-2"
              : "px-3 py-2 text-center"
          )}
        >
          {isMobile ? (
            // Mobile: horizontal label-value layout
           <>
              <span className="text-xs text-muted-foreground shrink-0">
                {spec.label}
              </span>
              <span className="text-sm font-semibold text-foreground truncate min-w-0 text-right">
                {spec.value}
              </span>
            </>
          ) : (
            // Desktop: stacked label over value
            <>
              <span className="block text-2xs uppercase tracking-wide text-muted-foreground">
                {spec.label}
              </span>
              <span className="block text-sm font-semibold text-foreground mt-0.5 truncate">
                {spec.value}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
