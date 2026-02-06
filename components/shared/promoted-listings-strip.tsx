"use client"

import { useTranslations } from "next-intl"
import { HorizontalProductCard } from "@/components/shared/product/horizontal-product-card"
import type { UIProduct } from "@/lib/types/products"
import { Badge } from "@/components/ui/badge"
import { HomeSectionHeader } from "@/components/mobile/home-section-header"
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
    <section className={cn("py-0", className)}>
      <HomeSectionHeader
        title={t("mobile.promotedListings")}
        href="/search?promoted=true&sort=newest"
        actionLabel={t("mobile.seeAll")}
        leading={
          <Badge variant="promoted" className="shrink-0 px-2 py-0.5 text-2xs">
            {tProduct("adBadge")}
          </Badge>
        }
      />

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-inset-md">
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
