"use client"

// =============================================================================
// MOBILE HERO SPECS - Category-Adaptive Quick Spec Pills
// =============================================================================
// Thin wrapper around HeroSpecs configured for mobile layout (2x2 grid).
// This is intentionally simple - all the logic lives in hero-specs-config.ts
// and the shared HeroSpecs component.
// =============================================================================

import { HeroSpecs, type ResolvedHeroSpec } from "@/components/shared/product/hero-specs"
import { cn } from "@/lib/utils"

interface MobileHeroSpecsProps {
  specs: ResolvedHeroSpec[]
  className?: string
}

/**
 * Mobile Hero Specs Grid
 * 
 * Renders a 2x2 grid of the most important category-specific specs.
 * Example: Electronics shows condition/warranty/model/brand
 *          Automotive shows mileage/year/transmission/fuel
 *          Real-estate shows area/rooms/floor/year
 * 
 * @see hero-specs-config.ts for category mappings
 * @see HeroSpecs for the shared component
 */
export function MobileHeroSpecs({ specs, className }: MobileHeroSpecsProps) {
  if (!specs || specs.length === 0) return null

  return (
    <div className={cn("px-4 py-3 bg-card border-b border-border/50", className)}>
      <HeroSpecs specs={specs} variant="mobile" />
    </div>
  )
}
