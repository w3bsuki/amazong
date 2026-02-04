"use client"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { HorizontalProductCard } from "@/components/shared/product/horizontal-product-card"
import { ArrowRight, Fire, Tag, TShirt, Car, DeviceMobile, Baby, FlagBanner } from "@phosphor-icons/react"
import type { UIProduct } from "@/lib/data/products"
import type { ReactNode } from "react"
import { useTranslations } from "next-intl"

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
// ICON MAP - Use compact icons for section headers
// =============================================================================

const VARIANT_ICONS: Record<CategoryRowVariant, ReactNode> = {
  promoted: <Fire size={18} weight="fill" className="text-fire" />,
  deals: <Tag size={18} weight="fill" className="text-price-sale" />,
  fashion: <TShirt size={18} weight="fill" className="text-foreground" />,
  automotive: <Car size={18} weight="fill" className="text-foreground" />,
  electronics: <DeviceMobile size={18} weight="fill" className="text-foreground" />,
  kids: <Baby size={18} weight="fill" className="text-foreground" />,
  bulgarian: <FlagBanner size={18} weight="fill" className="text-foreground" />,
  generic: <Tag size={18} weight="fill" className="text-muted-foreground" />,
}

// =============================================================================
// MOBILE VARIANT - uses HorizontalProductCard
// =============================================================================

export function CategoryProductRowMobile({
  title,
  products,
  seeAllHref,
  seeAllText,
  variant = "generic",
  icon,
  maxProducts = 8,
  className,
}: Omit<CategoryProductRowProps, "useMobileCards" | "locale">) {
  const t = useTranslations("Common")

  if (!products || products.length === 0) return null
  const displayIcon = icon ?? VARIANT_ICONS[variant]
  const displayProducts = products.slice(0, maxProducts)
  const displaySeeAllText = seeAllText ?? t("viewAll")

  return (
    <section className={cn("py-2", className)}>
      {/* Section header */}
      <div className="px-inset-md mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="shrink-0 size-7 rounded-full bg-muted border border-border-subtle flex items-center justify-center"
            aria-hidden="true"
          >
            {displayIcon}
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-foreground truncate">
            {title}
          </h2>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className={cn(
              "inline-flex items-center gap-1",
              "min-h-(--spacing-touch-md) px-1.5 -mr-1 rounded-md",
              "text-xs font-medium text-muted-foreground",
              "hover:text-foreground active:bg-active active:text-foreground transition-colors"
            )}
          >
            {displaySeeAllText}
            <ArrowRight size={14} weight="bold" />
          </Link>
        )}
      </div>

      {/* Horizontal scroll product cards */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-2 px-inset-md">
          {displayProducts.map((product) => (
            <HorizontalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
