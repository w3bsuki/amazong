"use client"

import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { ProductMiniCard } from "../card/mini"

interface SellerProductItem {
  id: string
  title: string
  price: number
  image: string
  sellerName: string
  storeSlug?: string | null
  slug?: string | null
}

interface SellerProductsGridProps {
  products: SellerProductItem[]
  totalCount?: number
  sellerUsername?: string
}

/**
 * SellerProductsGrid - "More from Seller" horizontal scroll section.
 */
export function SellerProductsGrid({ products, sellerUsername }: SellerProductsGridProps) {
  const t = useTranslations("Product")
  const tCommon = useTranslations("Common")
  const locale = useLocale()

  const hasProducts = Array.isArray(products) && products.length > 0
  if (!hasProducts) return null

  const viewAllHref = sellerUsername ? `/${sellerUsername}` : undefined
  const sellerFirstName = products[0]?.sellerName?.split(" ")[0] || ""

  return (
    <div className="bg-surface-subtle py-4">
      <div className="mb-3 flex items-center justify-between px-4">
        <h3 className="text-sm font-bold text-foreground">
          {sellerFirstName ? t("moreFromSellerName", { name: sellerFirstName }) : t("moreFromSeller")}
        </h3>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            {tCommon("viewAll")}
          </Link>
        )}
      </div>

      <div className="scrollbar-hide flex gap-2.5 overflow-x-auto px-4 scroll-smooth">
        {products.slice(0, 10).map((product) => {
          const resolvedSellerSlug = product.storeSlug || sellerUsername
          const resolvedProductSlug = product.slug || product.id
          const productHref = resolvedSellerSlug ? `/${resolvedSellerSlug}/${resolvedProductSlug}` : null

          return (
            <div key={product.id} className="w-32 shrink-0">
              <ProductMiniCard
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                href={productHref}
                locale={locale}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
