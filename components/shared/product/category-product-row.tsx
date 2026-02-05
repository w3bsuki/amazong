"use client"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { HorizontalProductCard } from "@/components/shared/product/horizontal-product-card"
import { ArrowRight } from "@phosphor-icons/react"
import type { UIProduct } from "@/lib/types/products"
import { useTranslations } from "next-intl"

export interface CategoryProductRowProps {
  /** Section title */
  title: string
  /** Products to display */
  products: UIProduct[]
  /** Link to "See all" page */
  seeAllHref?: string
  /** "See all" text */
  seeAllText?: string
  /** Max products to show (default 8) */
  maxProducts?: number
  /** Additional className */
  className?: string
}

export function CategoryProductRowMobile({
  title,
  products,
  seeAllHref,
  seeAllText,
  maxProducts = 8,
  className,
}: CategoryProductRowProps) {
  const t = useTranslations("Common")

  if (!products || products.length === 0) return null

  const displayProducts = products.slice(0, maxProducts)
  const displaySeeAllText = seeAllText ?? t("viewAll")

  return (
    <section className={cn("py-3", className)}>
      <div className="mb-3 flex items-center justify-between gap-2 px-inset-md">
        <h2 className="min-w-0 truncate text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className={cn(
              "inline-flex items-center gap-1",
              "min-h-(--spacing-touch-md) -mr-1 rounded-md px-1.5",
              "text-xs font-medium text-muted-foreground",
              "transition-colors hover:text-foreground active:bg-active active:text-foreground"
            )}
          >
            {displaySeeAllText}
            <ArrowRight size={14} weight="bold" aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3.5 px-inset-md">
          {displayProducts.map((product) => (
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
