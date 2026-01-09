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
import { Suspense, use } from "react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'
import CategorySlugLoading from "./loading"
import {
  getCategoryBySlug,
  getCategoryContext,
  getCategoryHierarchy,
  getCategoryAncestry,
} from "@/lib/data/categories"
import { searchProducts } from "./_lib/search-products"
import type { Product } from "./_lib/types"
import { ITEMS_PER_PAGE } from "../../_lib/pagination"
import { MobileHomeTabs } from "@/components/mobile/mobile-home-tabs"
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

  if (!categoryContext) {
    notFound()
  }

  const { current: currentCategory, parent: parentCategory, children: subcategories } = categoryContext
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
      filterableAttributes={filterableAttributes}
      categoryName={categoryName}
      defaultTab={defaultTab}
      defaultSubTab={defaultSubTab}
      defaultL2={defaultL2}
      defaultL3={defaultL3}
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
  filterableAttributes,
  categoryName,
  defaultTab,
  defaultSubTab,
  defaultL2,
  defaultL3,
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
  filterableAttributes: any[]
  categoryName: string
  defaultTab: string | null
  defaultSubTab: string | null
  defaultL2: string | null
  defaultL3: string | null
}) {
  // React/Next can only stream partial prerenders when request-bound data is
  // accessed via Suspense. `use()` will suspend this segment properly.
  const searchParams = use(searchParamsPromise)
  const currentPage = Math.max(1, Number.parseInt(searchParams.page || "1", 10))

  const attributeFilters: Record<string, string | string[]> = {}
  for (const [key, value] of Object.entries(searchParams)) {
    if (key.startsWith('attr_') && value) {
      const attrName = key.replace('attr_', '')
      attributeFilters[attrName] = value
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
        <MobileHomeTabs
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
          contextualSubcategories={subcategories}
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

      <div className="hidden lg:block min-h-screen bg-background">
        <div className="container px-2 sm:px-4 py-1">
          <div className="flex gap-0">
            <aside className="w-56 shrink-0 border-r border-border">
              <div className="sticky top-16 pr-4 py-1 max-h-(--category-sidebar-max-h) overflow-y-auto no-scrollbar">
                <SearchFilters
                  categories={allCategories}
                  subcategories={subcategories}
                  currentCategory={currentCategory}
                  parentCategory={parentCategory}
                  allCategoriesWithSubs={allCategoriesWithSubs}
                  brands={[]}
                  basePath={`/categories/${slug}`}
                />
              </div>
            </aside>

            <div className="flex-1 min-w-0 lg:pl-5">
              <SubcategoryTabs
                currentCategory={currentCategory}
                subcategories={subcategories}
                parentCategory={parentCategory}
                basePath="/categories"
              />

              <div className="mb-2 sm:mb-4 flex items-center gap-2">
                <div className="lg:contents">
                  <SortSelect />
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  <span className="font-semibold text-foreground">{totalProducts}</span>
                  <span> {t('results')}</span>
                  <span className="hidden lg:inline">
                    {' '}
                    {t('in')} <span className="font-medium">{categoryName}</span>
                  </span>
                </p>

                <div className="hidden lg:flex items-center gap-2 flex-wrap ml-auto">
                  <DesktopFilters attributes={filterableAttributes} categorySlug={slug} categoryId={categoryId} />
                </div>
              </div>

              <div className="mb-4">
                <FilterChips currentCategory={currentCategory} basePath={`/categories/${slug}`} />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
              </div>

              {products.length === 0 && (
                <EmptyStateCTA variant="no-category" categoryName={categoryName} className="mt-8" />
              )}

              {products.length > 0 && (
                <SearchPagination
                  totalItems={totalProducts}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
