import { use } from "react"
import { notFound } from "next/navigation"

import { createStaticClient } from "@/lib/supabase/server"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import { ProductGrid, type ProductGridProduct } from "@/components/shared/product/product-grid"
import { EmptyStateCTA } from "../../../../_components/empty-state-cta"
import { searchProducts } from "../_lib/search-products"
import { SearchPagination } from "../../../_components/search-controls/search-pagination"
import { DesktopShell } from "../../../_components/layout/desktop-shell.server"
import { FilterChips } from "../../../_components/filters/filter-chips"
import { DesktopFilterToolbar } from "../_components/desktop-filter-toolbar"
import { MobileCategoryBrowser } from "../_components/mobile/mobile-category-browser"
import { SubcategoryTabs } from "../../../_components/category/subcategory-tabs"
import { ITEMS_PER_PAGE } from "../../../_lib/pagination"
import type { CategoryWithCount } from "@/lib/data/categories"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryAttribute } from "@/lib/types/categories"

interface CategoryPageSearchParams {
  minPrice?: string
  maxPrice?: string
  minRating?: string
  subcategory?: string
  tag?: string
  deals?: string
  brand?: string
  availability?: string
  sort?: string
  page?: string
  [key: string]: string | string[] | undefined
}

interface CategoryShape {
  id: string
  slug: string
  name: string
  name_bg: string | null
  parent_id: string | null
  image_url?: string | null
}

interface CategoryPageDynamicContentProps {
  locale: string
  slug: string
  categoryId: string
  searchParamsPromise: Promise<CategoryPageSearchParams>
  currentCategory: CategoryShape
  parentCategory: CategoryShape | null
  siblingCategories: CategoryShape[]
  subcategoriesWithCounts: CategoryWithCount[]
  filterableAttributes: CategoryAttribute[]
  categoryName: string
}

export function CategoryPageDynamicContent({
  locale,
  slug,
  categoryId,
  searchParamsPromise,
  currentCategory,
  parentCategory,
  siblingCategories,
  subcategoriesWithCounts,
  filterableAttributes,
  categoryName,
}: CategoryPageDynamicContentProps) {
  const searchParams = use(searchParamsPromise)
  const currentPage = Math.max(1, Number.parseInt(searchParams.page || "1", 10))

  const attributeFilters: Record<string, string | string[]> = {}
  for (const [key, value] of Object.entries(searchParams)) {
    if (key.startsWith("attr_") && value) {
      const rawName = key.replace("attr_", "")
      const attrKey = normalizeAttributeKey(rawName) || rawName
      const nextValues = Array.isArray(value) ? value : [value]
      const existing = attributeFilters[attrKey]
      if (!existing) {
        attributeFilters[attrKey] = nextValues
      } else {
        const existingValues = Array.isArray(existing) ? existing : [existing]
        attributeFilters[attrKey] = [...new Set([...existingValues, ...nextValues])]
      }
    }
  }

  const shippingFilter = ""
  const supabase = createStaticClient()
  if (!supabase) {
    notFound()
  }

  const result = use(
    searchProducts(
      supabase,
      categoryId,
      {
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        tag: searchParams.tag,
        minRating: searchParams.minRating,
        availability: searchParams.availability,
        sort: searchParams.sort,
        attributes: Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined,
      },
      currentPage,
      ITEMS_PER_PAGE,
      shippingFilter
    )
  )

  const products = result.products
  const totalProducts = result.total

  const mobileInitialProducts: UIProduct[] = products.map((product): UIProduct => ({
    id: product.id,
    title: product.title,
    price: product.price,
    ...(product.list_price != null ? { listPrice: product.list_price } : {}),
    image: product.image_url || product.images?.[0] || "/placeholder.svg",
    rating: product.rating ?? 0,
    reviews: product.review_count ?? 0,
    slug: product.slug ?? null,
    storeSlug: product.sellers?.store_slug ?? null,
    sellerId: product.sellers?.id ?? null,
    sellerName: product.sellers?.display_name || product.sellers?.business_name || product.sellers?.store_slug || null,
    sellerAvatarUrl: product.sellers?.avatar_url ?? null,
    sellerTier:
      product.sellers?.account_type === "business"
        ? "business"
        : product.sellers?.tier === "premium"
          ? "premium"
          : "basic",
    sellerVerified: product.sellers?.is_verified_business ?? false,
    ...(product.attributes?.condition ? { condition: product.attributes.condition } : {}),
    ...(product.attributes?.brand ? { brand: product.attributes.brand } : {}),
  }))

  return (
    <>
      <div className="lg:hidden">
        <MobileCategoryBrowser
          initialProducts={mobileInitialProducts}
          initialProductsSlug={slug}
          locale={locale}
          filterableAttributes={filterableAttributes}
          contextualCategoryName={categoryName}
          contextualBackHref={
            parentCategory
              ? `/categories/${parentCategory.slug}`
              : `/categories`
          }
          contextualSubcategories={subcategoriesWithCounts}
          contextualSiblingCategories={siblingCategories}
          categoryId={categoryId}
          parentCategory={parentCategory ? {
            id: parentCategory.id,
            slug: parentCategory.slug,
            name: parentCategory.name,
            name_bg: parentCategory.name_bg,
            parent_id: parentCategory.parent_id,
          } : null}
        />
      </div>

      <DesktopShell
        variant="muted"
        className="hidden lg:block"
      >
        <SubcategoryTabs
          currentCategory={currentCategory}
          subcategories={subcategoriesWithCounts}
          parentCategory={parentCategory}
          basePath="/categories"
          variant="desktop"
          showCounts={true}
        />

        <DesktopFilterToolbar
          locale={locale}
          productCount={totalProducts}
          categoryName={categoryName}
          categorySlug={slug}
          categoryId={categoryId}
          attributes={filterableAttributes}
        />

        <FilterChips currentCategory={currentCategory} basePath={`/categories/${slug}`} className="mb-3" />

        <div>
          {products.length === 0 ? (
            <EmptyStateCTA variant="no-category" categoryName={categoryName} className="mt-4" />
          ) : (
            <ProductGrid
              products={products.map((product): ProductGridProduct => ({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image_url || product.images?.[0] || "/placeholder.svg",
                listPrice: product.list_price ?? undefined,
                rating: product.rating ?? 0,
                reviews: product.review_count ?? 0,
                slug: product.slug ?? null,
                storeSlug: product.sellers?.store_slug ?? null,
                sellerId: product.sellers?.id ?? null,
                sellerName: product.sellers?.display_name || product.sellers?.business_name || product.sellers?.store_slug || undefined,
                sellerAvatarUrl: product.sellers?.avatar_url ?? null,
                sellerTier:
                  product.sellers?.account_type === "business"
                    ? "business"
                    : product.sellers?.tier === "premium"
                      ? "premium"
                      : "basic",
                sellerVerified: Boolean(product.sellers?.is_verified_business),
                condition: product.attributes?.condition,
                tags: product.tags ?? [],
              }))}
              viewMode="grid"
            />
          )}
        </div>

        {products.length > 0 && (
          <SearchPagination
            totalItems={totalProducts}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
          />
        )}
      </DesktopShell>
    </>
  )
}
