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
import { Fire, ArrowRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/shared/product/product-card"
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
        // Clean container - no gradients
        "mb-6 rounded-xl",
        // Subtle warm background
        "bg-amber-50/50 dark:bg-amber-950/20",
        // Clean border
        "border border-amber-200/50 dark:border-amber-800/30",
        className
      )}
    >
      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {/* Clean icon badge - flat, no gradient */}
            <div className="flex items-center justify-center size-8 rounded-lg bg-amber-500 dark:bg-amber-600">
              <Fire size={18} weight="fill" className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {t("tabs.promoted")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("sectionAriaLabel")}
              </p>
            </div>
          </div>
          
          {/* View all - proper button style */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-amber-300 bg-white hover:bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 dark:text-amber-400"
          >
            <Link href={`/${locale}?tab=promoted`}>
              {t("viewAll")}
              <ArrowRight size={14} className="ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Product Grid - responsive, not horizontal scroll */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {displayProducts.map((product, index) => (
            <ProductCard
              key={product.id}
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
              tags={product.tags ?? []}
              isBoosted
              index={index}
              {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
              {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
              {...(product.attributes ? { attributes: product.attributes } : {})}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
