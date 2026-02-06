"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { ArrowRight } from "@phosphor-icons/react"
import { HorizontalProductCard } from "@/components/shared/product/horizontal-product-card"
import type { UIProduct } from "@/lib/types/products"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PromotedListingsStripProps {
  products: UIProduct[]
  className?: string
}

export function PromotedListingsStrip({ products, className }: PromotedListingsStripProps) {
  const t = useTranslations("Home")
  const tProduct = useTranslations("Product")

  if (!products || products.length === 0) return null

  return (
    <section className={cn("py-3", className)}>
      <div className="px-inset-md mb-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex items-center gap-2">
          <Badge variant="promoted" className="shrink-0 text-2xs px-2 py-0.5">
            {tProduct("adBadge")}
          </Badge>
          <h2 className="min-w-0 truncate text-base font-semibold tracking-tight text-foreground">
            {t("mobile.promotedListings")}
          </h2>
        </div>
        <Link
          href="/search?promoted=true&sort=newest"
          className={cn(
            "inline-flex items-center gap-1",
            "min-h-(--spacing-touch-md) px-1.5 -mr-1 rounded-md",
            "text-xs font-medium text-muted-foreground",
            "hover:text-foreground active:bg-active active:text-foreground transition-colors"
          )}
        >
          {t("mobile.seeAll")}
          <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3.5 px-inset-md">
          {products.slice(0, 8).map((product) => (
            <HorizontalProductCard
              key={product.id}
              product={product}
              uiVariant="home"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export type { PromotedListingsStripProps }
