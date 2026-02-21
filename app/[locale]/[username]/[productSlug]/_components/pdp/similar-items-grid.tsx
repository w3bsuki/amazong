import { useLocale, useTranslations } from "next-intl"
import { ChevronRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { ProductMiniCard } from "@/components/shared/product/card/mini"
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
 * Similar items rail for product pages (mobile).
 * Displays related products in a horizontal scroll rail.
 */
export function SimilarItemsGrid({
  products,
  rootCategory,
  maxItems = 10,
}: SimilarItemsGridProps) {
  const locale = useLocale()
  const t = useTranslations("Product")

  if (!products || products.length === 0) return null

  return (
    <section className="mt-4 border-t border-border pt-4">
      <div className="flex items-center justify-between px-4">
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

      <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory">
        {products.slice(0, maxItems).map((item) => {
          const productHref = item.storeSlug ? `/${item.storeSlug}/${item.slug || item.id}` : null
          return (
            <div key={item.id} className="shrink-0 snap-start">
              <ProductMiniCard
                id={item.id}
                title={item.title}
                price={item.price}
                image={item.image}
                href={productHref}
                locale={locale}
                className="w-40"
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export type { SimilarProduct, SimilarItemsGridProps }

