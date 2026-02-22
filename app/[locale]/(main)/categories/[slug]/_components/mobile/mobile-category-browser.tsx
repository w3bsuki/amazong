import { useLocale } from "next-intl"
import type { CategoryTreeNode } from "@/lib/data/categories/types"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryAttribute } from "@/lib/data/categories"
import { MobileCategoryBrowserContextual } from "./mobile-category-browser-contextual"

type Category = CategoryTreeNode

interface MobileCategoryBrowserProps {
  initialProducts: UIProduct[]
  initialProductsSlug?: string
  locale?: string
  filterableAttributes?: CategoryAttribute[]
  contextualCategoryName?: string
  contextualBackHref?: string
  contextualSubcategories?: Category[]
  contextualSiblingCategories?: Category[]
  categoryId?: string
  parentCategory?: {
    id: string
    slug: string
    parent_id: string | null
    name?: string
    name_bg?: string | null
  } | null
}

export function MobileCategoryBrowser({
  initialProducts,
  initialProductsSlug = "all",
  locale: localeProp,
  filterableAttributes = [],
  contextualCategoryName,
  contextualBackHref,
  contextualSubcategories = [],
  contextualSiblingCategories = [],
  categoryId,
  parentCategory,
}: MobileCategoryBrowserProps) {
  const intlLocale = useLocale()
  const locale = localeProp || intlLocale

  return (
    <MobileCategoryBrowserContextual
      locale={locale}
      initialProducts={initialProducts}
      initialProductsSlug={initialProductsSlug}
      contextualCategoryName={contextualCategoryName ?? ""}
      {...(contextualBackHref ? { contextualBackHref } : {})}
      contextualSubcategories={contextualSubcategories}
      contextualSiblingCategories={contextualSiblingCategories}
      filterableAttributes={filterableAttributes}
      {...(categoryId ? { categoryId } : {})}
      parentCategory={parentCategory ?? null}
    />
  )
}

