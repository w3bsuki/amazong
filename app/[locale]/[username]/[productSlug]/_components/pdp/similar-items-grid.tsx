import { useTranslations } from "next-intl"
import { ChevronRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import {
  ProductGrid,
  type ProductGridProduct,
} from "@/components/shared/product/product-grid"
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
  const t = useTranslations("Product")

  if (!products || products.length === 0) return null

  const gridProducts: ProductGridProduct[] = products.slice(0, maxItems).map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image ?? "/placeholder.svg",
    slug: item.slug ?? null,
    storeSlug: item.storeSlug ?? null,
  }))

  return (
    <section className="mt-4 space-y-3 border-t border-border pt-4">
      <div className="flex items-center justify-between px-inset">
        <h2 className="font-semibold text-foreground">{t("similarItems")}</h2>
        {rootCategory?.slug && (
          <Link
            href={`/categories/${rootCategory.slug}`}
            className="inline-flex min-h-(--control-default) items-center gap-0.5 text-sm font-medium text-primary"
          >
            {t("viewAll")}
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>

      <div className="px-inset pb-4">
        <ProductGrid
          products={gridProducts}
          viewMode="grid"
          preset="mobile-feed"
          density="compact"
        />
      </div>
    </section>
  )
}

export type { SimilarProduct, SimilarItemsGridProps }

