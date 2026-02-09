import { createStaticClient } from "@/lib/supabase/server"
import { SubcategoryTabs } from "@/components/category/subcategory-tabs"
import { DesktopFilterToolbar } from "./_components/desktop-filter-toolbar"
import { FilterChips } from "@/components/shared/filters/filter-chips"
import { SearchPagination } from "../../_components/search-controls/search-pagination"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { DesktopShell } from "../../_components/layout/desktop-shell.server"
import { ProductGrid, type ProductGridProduct } from "@/components/grid"
import { Suspense, use } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'
import CategorySlugLoading from "./loading"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import {
  getCategoryBySlug,
  getCategoryContext,
  getSubcategoriesForBrowse,
  type CategoryWithCount,
} from "@/lib/data/categories"
import { searchProducts } from "./_lib/search-products"
import type { Product } from "./_lib/types"
import { ITEMS_PER_PAGE } from "../../_lib/pagination"
import { MobileCategoryBrowser } from "./_components/mobile/mobile-category-browser"
import type { UIProduct } from "@/lib/data/products"
import type { CategoryAttribute } from "@/lib/types/categories"

// =============================================================================
// CATEGORY PAGE - HYBRID CACHING STRATEGY
//
// Static/Cached data (via 'use cache' functions):
// - Category hierarchy (getCategoryContext, getCategoryHierarchy)
// - Category metadata (getCategoryBySlug)
//
// Dynamic data:
// - searchParams-driven filtering/pagination/sort
// =============================================================================

// Generate metadata for SEO - Uses cached getCategoryBySlug
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  setRequestLocale(locale)

  // Use cached function instead of direct query
  const category = await getCategoryBySlug(slug)

  if (!category) {
    const tNotFound = await getTranslations({ locale, namespace: "CategoryNotFound" })
    return {
      title: tNotFound("title"),
    }
  }

  const categoryName = locale === "bg" && category.name_bg
    ? category.name_bg
    : category.name

  const t = await getTranslations({ locale, namespace: "CategoryPage" })

  return {
    title: t("metaTitle", { categoryName }),
    description: t("metaDescription", { categoryName }),
    openGraph: {
      title: t("metaTitle", { categoryName }),
      description: t("metaDescription", { categoryName }),
    },
  }
}


export default function CategoryPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ slug: string; locale: string }>
  searchParams: Promise<{
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
    [key: string]: string | string[] | undefined  // Dynamic attr_* params
  }>
}) {
  return (
    <Suspense
      fallback={
        <CategorySlugLoading />
      }
    >
      <CategoryPageContent paramsPromise={paramsPromise} searchParamsPromise={searchParamsPromise} />
    </Suspense>
  )
}

function CategoryPageContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ slug: string; locale: string }>
  searchParamsPromise: Promise<{
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
  }>
}) {
  const { slug, locale } = use(paramsPromise)
  setRequestLocale(locale)

  // Cached category shell data
  const categoryContext = use(getCategoryContext(slug))
  if (!categoryContext) {
    notFound()
  }

  const { current: currentCategory, parent: parentCategory } = categoryContext
  
  // Fetch subcategories with counts - NEVER filter on category browse pages
  // All children should show as circles; sorting handles curated-first ordering
  const subcategoriesWithCounts = use(getSubcategoriesForBrowse(currentCategory.id, false))

  const categoryId = currentCategory.id

  const categoryName = locale === 'bg' && currentCategory.name_bg
    ? currentCategory.name_bg
    : currentCategory.name

  // Extract filterable attributes for the filter toolbar
  const filterableAttributes = categoryContext.attributes.filter(attr => attr.is_filterable)

  return (
    <CategoryPageDynamicContent
      locale={locale}
      slug={slug}
      categoryId={categoryId}
      searchParamsPromise={searchParamsPromise}
      currentCategory={currentCategory}
      parentCategory={parentCategory}
      subcategoriesWithCounts={subcategoriesWithCounts}
      filterableAttributes={filterableAttributes}
      categoryName={categoryName}
    />
  )
}

function CategoryPageDynamicContent({
  locale,
  slug,
  categoryId,
  searchParamsPromise,
  currentCategory,
  parentCategory,
  subcategoriesWithCounts,
  filterableAttributes,
  categoryName,
}: {
  locale: string
  slug: string
  categoryId: string
  searchParamsPromise: Promise<{
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
  }>
  currentCategory: Awaited<ReturnType<typeof getCategoryContext>> extends infer T
    ? T extends { current: infer C }
      ? C
      : never
    : never
  parentCategory: Awaited<ReturnType<typeof getCategoryContext>> extends infer T
    ? T extends { parent: infer P }
      ? P
      : never
    : never
  /** DEC-002: Subcategories with product counts for curated browse UX */
  subcategoriesWithCounts: CategoryWithCount[]
  filterableAttributes: CategoryAttribute[]
  categoryName: string
}) {
  // React/Next can only stream partial prerenders when request-bound data is
  // accessed via Suspense. `use()` will suspend this segment properly.
  const searchParams = use(searchParamsPromise)
  const currentPage = Math.max(1, Number.parseInt(searchParams.page || "1", 10))

  const attributeFilters: Record<string, string | string[]> = {}
  for (const [key, value] of Object.entries(searchParams)) {
    if (key.startsWith('attr_') && value) {
      const rawName = key.replace('attr_', '')
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

  // NOTE: This route is statically generated for SEO. Avoid request-bound reads
  // (cookies/headers) here so Next.js can prerender successfully.
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

  const mobileInitialProducts: UIProduct[] = products.map((p): UIProduct => ({
    id: p.id,
    title: p.title,
    price: p.price,
    ...(p.list_price != null ? { listPrice: p.list_price } : {}),
    image: p.image_url || p.images?.[0] || '/placeholder.svg',
    rating: p.rating ?? 0,
    reviews: p.review_count ?? 0,
    slug: p.slug ?? null,
    storeSlug: p.sellers?.store_slug ?? null,
    sellerId: p.sellers?.id ?? null,
    sellerName: p.sellers?.display_name || p.sellers?.business_name || p.sellers?.store_slug || null,
    sellerAvatarUrl: p.sellers?.avatar_url ?? null,
    sellerTier:
      p.sellers?.account_type === 'business'
        ? 'business'
        : p.sellers?.tier === 'premium'
          ? 'premium'
          : 'basic',
    sellerVerified: p.sellers?.is_verified_business ?? false,
    ...(p.attributes?.condition ? { condition: p.attributes.condition } : {}),
    ...(p.attributes?.brand ? { brand: p.attributes.brand } : {}),
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
          // DEC-002: Use subcategoriesWithCounts for curated ordering + visibility filtering
          contextualSubcategories={subcategoriesWithCounts}
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
        {/* Subcategory circles - full width above grid (DEC-002: curated ordering + counts) */}
        <SubcategoryTabs
          currentCategory={currentCategory}
          subcategories={subcategoriesWithCounts}
          parentCategory={parentCategory}
          basePath="/categories"
          variant="desktop"
          showCounts={true}
        />

        {/* Unified Filter Toolbar */}
        <DesktopFilterToolbar
          locale={locale}
          productCount={totalProducts}
          categoryName={categoryName}
          categorySlug={slug}
          categoryId={categoryId}
          attributes={filterableAttributes}
        />

        {/* Active filter chips */}
        <FilterChips currentCategory={currentCategory} basePath={`/categories/${slug}`} className="mb-3" />

        {/* Product grid with container queries */}
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
