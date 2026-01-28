"use client"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/shared/product/product-card"
import { HorizontalProductCard } from "@/components/mobile/horizontal-product-card"
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
// DESKTOP COMPONENT
// =============================================================================

export function CategoryProductRow({
  title,
  products,
  seeAllHref,
  seeAllText = "See all",
  variant = "generic",
  icon,
  locale = "en",
  maxProducts = 10,
  useMobileCards = false,
  className,
}: CategoryProductRowProps) {
  if (!products || products.length === 0) return null

  const displayIcon = icon ?? VARIANT_ICONS[variant]
  const displayProducts = products.slice(0, maxProducts)

  return (
    <section
      aria-label={title}
      className={cn(
        "rounded-xl border border-border bg-surface-subtle p-4 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {displayIcon}
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {seeAllText}
            <ArrowRight size={12} weight="bold" />
          </Link>
        )}
      </div>

      {/* Horizontal scroll cards */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-4">
          {displayProducts.map((product, index) => (
            <div key={product.id} className={useMobileCards ? "shrink-0" : "w-56 shrink-0"}>
              {useMobileCards ? (
                <HorizontalProductCard product={product} />
              ) : (
                <ProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.listPrice ?? null}
                  isOnSale={Boolean(product.isOnSale)}
                  salePercent={product.salePercent ?? 0}
                  saleEndDate={product.saleEndDate ?? null}
                  createdAt={product.createdAt ?? null}
                  image={product.image}
                  rating={product.rating ?? 0}
                  reviews={product.reviews ?? 0}
                  slug={product.slug ?? null}
                  username={product.storeSlug ?? null}
                  sellerId={product.sellerId ?? null}
                  sellerName={product.sellerName || product.storeSlug || undefined}
                  sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                  sellerVerified={Boolean(product.sellerVerified)}
                  {...(product.location ? { location: product.location } : {})}
                  {...(product.condition ? { condition: product.condition } : {})}
                  isBoosted={variant === "promoted" || Boolean(product.isBoosted)}
                  index={index}
                  {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
                  {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                  {...(product.attributes ? { attributes: product.attributes } : {})}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
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
    <section className={cn("pt-section-top pb-section-bottom", className)}>
      {/* Section header - semantic tokens */}
      <header className="px-inset mb-3 flex items-center justify-between min-h-touch-sm">
        <div className="flex items-center gap-2.5">
          <span className="shrink-0 [&>svg]:size-5" aria-hidden="true">{displayIcon}</span>
          <h2 className="text-body font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-1 text-compact font-medium text-primary min-h-touch-sm px-1 -mr-1 active:opacity-70 transition-opacity"
          >
            {seeAllText}
            <ArrowRight size={14} weight="bold" aria-hidden="true" />
          </Link>
        )}
      </header>

      {/* Horizontal scroll product cards with snap */}
      <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory">
        <div className="flex gap-3 px-inset pb-1">
          {displayProducts.map((product) => (
            <HorizontalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// TRUST BANNER - Reusable for desktop
// =============================================================================

export function TrustBannerDesktop({ 
  className 
}: { 
  className?: string 
}) {
  return (
    <div className={cn(
      "flex items-center justify-center gap-8 py-3 px-4 rounded-lg bg-surface-subtle border border-border",
      className
    )}>
      <TrustItem icon="🛡️" label="Buyer Protection" />
      <TrustItem icon="🚚" label="Fast Shipping" />
      <TrustItem icon="💰" label="0% Seller Fees" />
      <TrustItem icon="✅" label="Verified Sellers" />
    </div>
  )
}

function TrustItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  )
}
