/**
 * ProductAttributeBadge - Subtle contextual pill for product cards
 * 
 * Shows the most relevant info based on category:
 * - Vehicles: Make + Model (e.g., "BMW 320d")
 * - Electronics: Brand + Storage (e.g., "iPhone · 128GB")
 * - Fashion: Brand + Size (e.g., "Nike · L")
 * - Fallback: L1 category name (if no attributes)
 * 
 * Design: Small muted pill, readable but not dominant.
 */

import { cn } from "@/lib/utils"
import { buildHeroBadgeText } from "@/lib/product-card-hero-attributes"

interface ProductAttributeBadgeProps {
  /** L0 category slug (e.g., "vehicles", "fashion", "electronics") */
  categoryRootSlug?: string | null | undefined
  /** Product attributes object */
  attributes?: Record<string, unknown> | null | undefined
  /** Category path from L0 to leaf */
  categoryPath?: Array<{ slug: string; name: string; nameBg?: string | null }> | null | undefined
  /** Current locale */
  locale?: string
  /** Additional className */
  className?: string
}

export function ProductAttributeBadge({
  categoryRootSlug,
  attributes,
  categoryPath,
  locale = "en",
  className,
}: ProductAttributeBadgeProps) {
  const badgeText = buildHeroBadgeText(categoryRootSlug, attributes, categoryPath, locale)
  
  if (!badgeText) return null
  
  return (
    <span
      className={cn(
        // Subtle pill style - using specific category badge tokens from globals.css
        "inline-flex w-fit items-center rounded px-1.5 py-0.5",
        "bg-category-badge-bg text-category-badge-text border border-category-badge-border",
        "text-xs font-medium",
        "max-w-full truncate",
        className
      )}
    >
      {badgeText}
    </span>
  )
}
