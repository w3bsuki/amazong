import { createStaticClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/shared/product/product-card"
import { Button } from "@/components/ui/button"
import { SubcategoryTabs } from "@/components/category/subcategory-tabs"
import { DesktopFilters } from "@/components/shared/filters/desktop-filters"
import { FilterChips } from "@/components/shared/filters/filter-chips"
import { SortSelect } from "@/components/shared/search/sort-select"
import { SearchPagination } from "@/components/shared/search/search-pagination"
import { SearchFilters } from "@/components/shared/search/search-filters"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { PageShell } from "@/components/shared/page-shell"
import { Suspense, use } from "react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'
import CategorySlugLoading from "./loading"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import {
  getCategoryBySlug,
  getCategoryContext,
  getCategoryHierarchy,
  getCategoryAncestry,
  getCategoryAncestryFull,
  getSubcategoriesForBrowse,
  type BreadcrumbCategory,
  type CategoryWithCount,
} from "@/lib/data/categories"
import { searchProducts } from "./_lib/search-products"
import type { Product } from "./_lib/types"
import { ITEMS_PER_PAGE } from "../../_lib/pagination"
import { MobileCategoryBrowser } from "@/components/mobile/mobile-category-browser"
import type { UIProduct } from "@/lib/data/products"

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
    return {
      title: "Category Not Found",
    }
  }

  const categoryName = locale === "bg" && category.name_bg
    ? category.name_bg
    : category.name

  return {
    title: `${categoryName} - Shop`,
    description: `Browse our wide selection of ${categoryName} products. Find the best deals with fast shipping and great prices.`,
    openGraph: {
      title: `${categoryName} - Shop`,
      description: `Browse our wide selection of ${categoryName} products.`,
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
  const categoriesWithChildren = use(getCategoryHierarchy(null, 2))
  const ancestry = use(getCategoryAncestry(slug))
  const ancestryFull = use(getCategoryAncestryFull(slug))

  if (!categoryContext) {
    notFound()
  }

  const { current: currentCategory, parent: parentCategory, children: subcategories } = categoryContext
  
  // DEC-002: Fetch subcategories with counts for curated browse UX
  // filterForBrowse=true enforces "show if populated OR curated" rule
  const subcategoriesWithCounts = use(getSubcategoriesForBrowse(currentCategory.id, true))
  
  const allCategoriesWithSubs = categoriesWithChildren.map((c) => ({
    category: c,
    subs: c.children ?? [],
  }))
  const allCategories = allCategoriesWithSubs.map((c) => c.category)

  const categoryId = currentCategory.id

  const categoryName = locale === 'bg' && currentCategory.name_bg
    ? currentCategory.name_bg
    : currentCategory.name

  // Extract filterable attributes for the filter toolbar
  const filterableAttributes = categoryContext.attributes.filter(attr => attr.is_filterable)

  const defaultTab = ancestry?.[0] ?? null
  const defaultSubTab = ancestry?.[1] ?? null
  const defaultL2 = ancestry?.[2] ?? null
  const defaultL3 = ancestry?.[3] ?? null

  return (
    <CategoryPageDynamicContent
      locale={locale}
      slug={slug}
      categoryId={categoryId}
      searchParamsPromise={searchParamsPromise}
      categoriesWithChildren={categoriesWithChildren}
      allCategoriesWithSubs={allCategoriesWithSubs}
      allCategories={allCategories}
      currentCategory={currentCategory}
      parentCategory={parentCategory}
      subcategories={subcategories}
      subcategoriesWithCounts={subcategoriesWithCounts}
      filterableAttributes={filterableAttributes}
      categoryName={categoryName}
      defaultTab={defaultTab}
      defaultSubTab={defaultSubTab}
      defaultL2={defaultL2}
      defaultL3={defaultL3}
      ancestryFull={ancestryFull}
    />
  )
}

function CategoryPageDynamicContent({
  locale,
  slug,
  categoryId,
  searchParamsPromise,
  categoriesWithChildren,
  allCategoriesWithSubs,
  allCategories,
  currentCategory,
  parentCategory,
  subcategories,
  subcategoriesWithCounts,
  filterableAttributes,
  categoryName,
  defaultTab,
  defaultSubTab,
  defaultL2,
  defaultL3,
  ancestryFull,
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
  categoriesWithChildren: any
  allCategoriesWithSubs: any
  allCategories: any
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
  subcategories: Awaited<ReturnType<typeof getCategoryContext>> extends infer T
    ? T extends { children: infer CH }
      ? CH
      : never
    : never
  /** DEC-002: Subcategories with product counts for curated browse UX */
  subcategoriesWithCounts: CategoryWithCount[]
  filterableAttributes: any[]
  categoryName: string
  defaultTab: string | null
  defaultSubTab: string | null
  defaultL2: string | null
  defaultL3: string | null
  ancestryFull: BreadcrumbCategory[]
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
        attributeFilters[attrKey] = Array.from(new Set([...existingValues, ...nextValues]))
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

  const t = use(getTranslations('SearchFilters'))

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
          initialCategories={categoriesWithChildren}
          defaultTab={defaultTab}
          defaultSubTab={defaultSubTab}
          defaultL2={defaultL2}
          defaultL3={defaultL3}
          showBanner={false}
          l0Style="tabs"
          showQuickFilters={false}
          showL3Pills={false}
          tabsNavigateToPages={false}
          circlesNavigateToPages={false}
          locale={locale}
          filterableAttributes={filterableAttributes}
          // Phase 2: Enable contextual mode (Vinted-style)
          contextualMode={true}
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

      <PageShell variant="muted" className="hidden lg:block">
        <div className="container px-4 xl:px-6 py-4">
          {/* Subcategory circles - full width above grid (DEC-002: curated ordering + counts) */}
          <SubcategoryTabs
            currentCategory={currentCategory}
            subcategories={subcategoriesWithCounts}
            parentCategory={parentCategory}
            basePath="/categories"
            variant="desktop"
            showCounts={true}
          />

          {/* Main grid: sidebar + content */}
          <div className="grid grid-cols-[var(--spacing-filter-sidebar)_1fr] gap-6">
            {/* Sidebar - uses bg-sidebar for subtle differentiation from main content */}
            <aside className="shrink-0">
              <div className="sticky top-20 max-h-(--spacing-sidebar-max-h) overflow-y-auto bg-sidebar rounded-lg p-4 -ml-2">
                <SearchFilters
                  categories={allCategories}
                  subcategories={subcategories}
                  currentCategory={currentCategory}
                  parentCategory={parentCategory}
                  allCategoriesWithSubs={allCategoriesWithSubs}
                  brands={[]}
                  basePath={`/categories/${slug}`}
                  ancestry={ancestryFull}
                />
              </div>
            </aside>

            {/* Main content */}
            <main className="min-w-0">
              {/* Toolbar - single row with sort/count on left, filters on right */}
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-border">
                <div className="flex items-center gap-4 shrink-0">
                  <SortSelect />
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    <span className="font-semibold text-foreground">{totalProducts}</span>
                    {' '}{t('results')} {t('in')} <span className="font-medium text-foreground">{categoryName}</span>
                  </p>
                </div>
                <DesktopFilters attributes={filterableAttributes} categorySlug={slug} categoryId={categoryId} />
              </div>

              {/* Active filter chips */}
              <FilterChips currentCategory={currentCategory} basePath={`/categories/${slug}`} className="mb-4" />

              {/* Product grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => {
                  const image = product.image_url || product.images?.[0] || "/placeholder.svg"
                  const sellerName =
                    product.sellers?.display_name ||
                    product.sellers?.business_name ||
                    product.sellers?.store_slug

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      image={image}
                      rating={product.rating || 0}
                      reviews={product.review_count || 0}
                      originalPrice={product.list_price ?? null}
                      tags={product.tags || []}
                      slug={product.slug ?? null}
                      username={product.sellers?.store_slug ?? null}
                      sellerId={product.sellers?.id ?? null}
                      {...(sellerName ? { sellerName } : {})}
                      sellerAvatarUrl={product.sellers?.avatar_url ?? null}
                      sellerTier={
                        product.sellers?.account_type === "business"
                          ? "business"
                          : product.sellers?.tier === "premium"
                            ? "premium"
                            : "basic"
                      }
                      sellerVerified={Boolean(product.sellers?.is_verified_business)}
                      categorySlug={slug}
                      {...(product.attributes?.condition ? { condition: product.attributes.condition } : {})}
                      {...(product.attributes?.brand ? { brand: product.attributes.brand } : {})}
                      {...(product.attributes?.make ? { make: product.attributes.make } : {})}
                      {...(product.attributes?.model ? { model: product.attributes.model } : {})}
                      {...(product.attributes?.year ? { year: product.attributes.year } : {})}
                      {...(product.attributes?.location ? { location: product.attributes.location } : {})}
                    />
                  )
                })}

                {products.length === 0 && (
                  <EmptyStateCTA variant="no-category" categoryName={categoryName} className="mt-8 col-span-full" />
                )}
              </div>

              {products.length > 0 && (
                <SearchPagination
                  totalItems={totalProducts}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                />
              )}
            </main>
          </div>
        </div>
      </PageShell>
    </>
  )
}
