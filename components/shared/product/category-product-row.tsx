"use client"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { HorizontalProductCard } from "@/components/shared/product/horizontal-product-card"
import { ArrowRight, Fire, Tag, TShirt, Car, DeviceMobile, Baby, FlagBanner } from "@phosphor-icons/react"
import type { UIProduct } from "@/lib/data/products"
import type { ReactNode } from "react"

// =============================================================================
// TYPES
// =============================================================================

export type CategoryRowVariant = 
  | "promoted"
  | "deals"
  | "fashion"
  | "automotive"
  | "electronics"
  | "kids"
  | "bulgarian"
  | "generic"

export interface CategoryProductRowProps {
  /** Section title */
  title: string
  /** Products to display */
  products: UIProduct[]
  /** Link to "See all" page */
  seeAllHref?: string
  /** "See all" text */
  seeAllText?: string
  /** Visual variant for icon/styling */
  variant?: CategoryRowVariant
  /** Custom icon override */
  icon?: ReactNode
  /** Locale for product links */
  locale?: string
  /** Max products to show (default 10) */
  maxProducts?: number
  /** Use mobile horizontal cards (default: false for desktop cards) */
  useMobileCards?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// ICON MAP - Use size-5 (20px) for section headers
// =============================================================================

const VARIANT_ICONS: Record<CategoryRowVariant, ReactNode> = {
  promoted: <Fire size={20} weight="fill" className="text-fire" />,
  deals: <Tag size={20} weight="fill" className="text-price-sale" />,
  fashion: <TShirt size={20} weight="fill" className="text-primary" />,
  automotive: <Car size={20} weight="fill" className="text-primary" />,
  electronics: <DeviceMobile size={20} weight="fill" className="text-primary" />,
  kids: <Baby size={20} weight="fill" className="text-primary" />,
  bulgarian: <FlagBanner size={20} weight="fill" className="text-success" />,
  generic: <Tag size={20} weight="fill" className="text-muted-foreground" />,
}

// =============================================================================
// MOBILE VARIANT - uses HorizontalProductCard
// =============================================================================

export function CategoryProductRowMobile({
  title,
  products,
  seeAllHref,
  seeAllText = "See all",
  variant = "generic",
  icon,
  maxProducts = 8,
  className,
}: Omit<CategoryProductRowProps, "useMobileCards" | "locale">) {
  if (!products || products.length === 0) return null

  const displayIcon = icon ?? VARIANT_ICONS[variant]
  const displayProducts = products.slice(0, maxProducts)

  return (
    <section className={cn("pt-3 pb-1", className)}>
      {/* Section header */}
      <div className="px-inset mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="shrink-0" aria-hidden="true">{displayIcon}</span>
          <span className="text-sm font-bold text-foreground">
            {title}
          </span>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
          >
            {seeAllText}
            <ArrowRight size={12} weight="bold" />
          </Link>
        )}
      </div>

      {/* Horizontal scroll product cards */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-inset">
          {displayProducts.map((product) => (
            <HorizontalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
