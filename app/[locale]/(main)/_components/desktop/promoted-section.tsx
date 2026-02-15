"use client"

/**
 * Desktop Promoted Section
 * 
 * A clean, professional container for promoted/boosted listings on desktop.
 * Features:
 * - Clean flat background (no gradients)
 * - Subtle border styling
 * - Responsive grid layout
 * - Professional shadcn/Tailwind v4 appearance
 */

import * as React from "react"
import { useTranslations } from "next-intl"
import { Megaphone, ArrowRight } from "@/lib/icons/phosphor"
import { cn } from "@/lib/utils"
import { DesktopProductCard } from "@/components/shared/product/card/desktop"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// =============================================================================
// TYPES
// =============================================================================

interface Product {
  id: string
  title: string
  price: number
  listPrice?: number
  isOnSale?: boolean
  salePercent?: number
  saleEndDate?: string | null
  createdAt?: string | null
  image: string
  rating?: number
  reviews?: number
  slug?: string | null
  storeSlug?: string | null
  sellerId?: string | null
  sellerName?: string | null
  sellerAvatarUrl?: string | null
  sellerVerified?: boolean
  location?: string
  condition?: string
  isBoosted?: boolean
  tags?: string[]
  categoryRootSlug?: string
  categoryPath?: { slug: string; name: string; nameBg?: string | null; icon?: string | null }[]
  attributes?: Record<string, unknown>
}

interface PromotedSectionProps {
  products: Product[]
  locale: string
  className?: string
  /** Maximum products to show (default: 5) */
  maxProducts?: number
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PromotedSection({ 
  products, 
  locale, 
  className,
  maxProducts = 5 
}: PromotedSectionProps) {
  const t = useTranslations("TabbedProductFeed")
  
  const displayProducts = products.slice(0, maxProducts)
  
  if (displayProducts.length === 0) return null

  return (
    <section
      aria-label={t("tabs.promoted")}
      className={cn(
        "mb-6 rounded-xl border border-promoted overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-promoted">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-promoted-muted">
            <Megaphone size={20} weight="fill" className="text-promoted" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-promoted-foreground">
            {t("promotedTitle")}
          </h2>
        </div>
        
        {/* View all button */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="border-promoted-foreground bg-promoted-foreground text-promoted hover:bg-background hover:text-promoted"
        >
          <Link href={`/${locale}?tab=promoted`}>
            {t("viewAll")}
            <ArrowRight size={14} className="ml-1.5" />
          </Link>
        </Button>
      </div>

      {/* Product Grid - white bg */}
      <div className="p-4 bg-card">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {displayProducts.map((product, index) => (
            <DesktopProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              originalPrice={product.listPrice ?? null}
              isOnSale={Boolean(product.isOnSale)}
              salePercent={product.salePercent ?? 0}
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
              isBoosted
              index={index}
              {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
              {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
