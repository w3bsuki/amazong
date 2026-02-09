"use client"

import { useLocale, useTranslations } from "next-intl"
import { ChevronRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { ProductMiniCard } from "./product-card-mini"
import type { CategorySummary } from "./meta-row"

interface SimilarProduct {
  id: string
  title: string
  price: number
  image: string | null
  slug?: string | null
  storeSlug?: string | null
}

interface SimilarItemsGridProps {
  products: SimilarProduct[]
  rootCategory: CategorySummary | null
  maxItems?: number
}

/**
 * Similar items grid for product pages.
 * Displays related products in a 2-column grid.
 */
export function SimilarItemsGrid({
  products,
  rootCategory,
  maxItems = 4,
}: SimilarItemsGridProps) {
  const locale = useLocale()
  const t = useTranslations("Product")

  if (!products || products.length === 0) return null

  return (
    <section className="border-t border-border bg-background px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">{t("similarItems")}</h2>
        {rootCategory?.slug && (
          <Link
            href={`/categories/${rootCategory.slug}`}
            className="flex items-center gap-0.5 text-sm font-medium text-primary"
          >
            {t("viewAll")}
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.slice(0, maxItems).map((item) => {
          const productHref = item.storeSlug ? `/${item.storeSlug}/${item.slug || item.id}` : null
          return (
            <ProductMiniCard
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              image={item.image}
              href={productHref}
              locale={locale}
            />
          )
        })}
      </div>
    </section>
  )
}

export type { SimilarProduct, SimilarItemsGridProps }
