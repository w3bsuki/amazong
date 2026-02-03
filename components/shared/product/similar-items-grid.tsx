"use client"

import { useLocale, useTranslations } from "next-intl"
import { ChevronRight, Heart, Package } from "lucide-react"
import { Link } from "@/i18n/routing"
import { formatPrice } from "@/lib/format-price"
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
    <section className="px-4 py-4 bg-background border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-foreground">{t("similarItems")}</h2>
        {rootCategory?.slug && (
          <Link
            href={`/categories/${rootCategory.slug}`}
            className="text-sm text-primary font-medium flex items-center gap-0.5"
          >
            {t("viewAll")}
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.slice(0, maxItems).map((item) => {
          const productHref = item.storeSlug
            ? `/${item.storeSlug}/${item.slug || item.id}`
            : "#"
          return (
            <Link
              key={item.id}
              href={productHref}
              className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:bg-hover active:bg-active"
            >
              {/* Image */}
              <div className="aspect-square relative bg-muted">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="size-8 text-muted-foreground" />
                  </div>
                )}
                {/* Wishlist button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 size-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center shadow-sm"
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  <Heart className="size-4 text-muted-foreground" />
                </button>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-bold text-foreground">
                  {formatPrice(item.price, { locale })}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-snug">
                  {item.title}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export type { SimilarProduct, SimilarItemsGridProps }
