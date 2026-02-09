import { createStaticClient } from "@/lib/supabase/server"
import { SearchFilters } from "./_components/filters/search-filters"
import { SubcategoryTabs } from "@/components/category/subcategory-tabs"
import { SearchHeader } from "./_components/search-header"
import { searchProducts } from "./_lib/search-products"
import type { Category, Product } from "./_lib/types"
import { DesktopFilters } from "./_components/desktop-filters"
import { FilterChips } from "@/components/shared/filters/filter-chips"
import { SortSelect } from "../_components/search-controls/sort-select"
import { SearchPagination } from "../_components/search-controls/search-pagination"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { DesktopShell } from "../_components/layout/desktop-shell.server"
import { ProductGrid, type ProductGridProduct } from "@/components/grid"
import { PageShell } from "@/components/shared/page-shell"
import { Suspense } from "react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { cookies } from "next/headers"
import type { Metadata } from 'next'
import { getShippingFilter, parseShippingRegion } from '@/lib/shipping'
import { ITEMS_PER_PAGE } from "../_lib/pagination"
import { getCategoryContext } from "@/lib/data/categories"
import type { CategoryAttribute } from "@/lib/data/categories"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import { MobileFilterControls } from "@/components/mobile/filters/mobile-filter-controls"

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const category = resolvedSearchParams.category || '';

  let title = 'Search Results';
  if (query) {
    title = `"${query}" - Search Results`;
  } else if (category) {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} - Shop`;
  }

  return {
    title,
    description: query
      ? `Find the best deals on "${query}" at Treido. Fast shipping and great prices.`
      : 'Browse our wide selection of products. Find electronics, fashion, home goods and more.',
  };
}


export default async function SearchPage({
  params,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    minRating?: string
    subcategory?: string
    tag?: string
    deals?: string
    promoted?: string
    nearby?: string
    city?: string
    verified?: string
    brand?: string
    availability?: string
    sort?: string
    page?: string
    [key: string]: string | string[] | undefined  // Dynamic attr_* params
  }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const searchParams = await searchParamsPromise
  const supabase = createStaticClient()
  const query = searchParams.q || ""
  const currentPage = Math.max(1, Number.parseInt(searchParams.page || "1", 10))

  // Read shipping zone from cookie (set by header "Доставка до" dropdown)
  // Only filter if user has selected a specific zone (not WW = worldwide = show all)
  const cookieStore = await cookies()
  const userZone = cookieStore.get('user-zone')?.value
  const parsedZone = parseShippingRegion(userZone)
  const shippingFilter = parsedZone !== 'WW'
    ? (getShippingFilter(parsedZone) || undefined)
    : undefined

  let products: Product[] = []
  let totalProducts = 0
  let currentCategory: Category | null = null
  let parentCategory: Category | null = null
  let subcategories: Category[] = []
  let allCategories: Category[] = []
  let allCategoriesWithSubs: { category: Category; subs: Category[] }[] = []
  const brands: string[] = []
  let filterableAttributes: CategoryAttribute[] = []
  let categoryIdForFilters: string | undefined = undefined

  if (supabase) {
    // Fetch L0 categories first (with subcategories fetched separately)
    // Order by display_order first (curated), then name (DEC-002 compliance)
    const { data: rootCats, error: rootError } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id, image_url, display_order")
      .is("parent_id", null)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })

    if (rootError) {
      console.error("[SearchPage] Root categories fetch error:", rootError)
    }

    if (rootCats && rootCats.length > 0) {
      allCategories = rootCats

      // Fetch L1 subcategories for all root categories
      // Order by display_order first (curated), then name (DEC-002 compliance)
      const rootIds = rootCats.map(c => c.id)
      const { data: subCats } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug, parent_id, image_url, display_order")
        .in("parent_id", rootIds)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true })

      // Build the hierarchical structure for the sidebar
      allCategoriesWithSubs = rootCats.map(cat => ({
        category: cat,
        subs: (subCats || []).filter(c => c.parent_id === cat.id)
      }))

      // Also store subCats for category lookup
      const allCats = [...rootCats, ...(subCats || [])]

      // If a category is specified, get its details and subcategories
      if (searchParams.category) {
        // Find the category from our already fetched data
        const categoryData = allCats.find(c => c.slug === searchParams.category) || null

        if (categoryData) {
          currentCategory = categoryData
          categoryIdForFilters = categoryData.id

          // Check if this is a subcategory (has parent_id)
          if (categoryData.parent_id) {
            parentCategory = allCats.find(c => c.id === categoryData.parent_id) || null
            // No subcategories for a subcategory
            subcategories = []
          } else {
            // This is a main category - get its subcategories
            subcategories = allCats.filter(c => c.parent_id === categoryData.id)
          }

          // Build product query with category filter
          // Get products from this category AND all its subcategories
          const categoryIds = [categoryData.id, ...subcategories.map(s => s.id)]

          // Extract attr_* params for attribute filtering
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

          // Use the helper function with pagination and shipping filter
          const result = await searchProducts(supabase, query, categoryIds, {
            minPrice: searchParams.minPrice,
            maxPrice: searchParams.maxPrice,
            tag: searchParams.tag,
            minRating: searchParams.minRating,
            deals: searchParams.deals,
            promoted: searchParams.promoted,
            nearby: searchParams.nearby,
            city: searchParams.city,
            verified: searchParams.verified,
            availability: searchParams.availability,
            sort: searchParams.sort,
            attributes: Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined,
          }, currentPage, ITEMS_PER_PAGE, shippingFilter)
          products = result.products
          totalProducts = result.total
        }
      } else {
        // No category filter - get all products filtered by shipping zone
        // Extract attr_* params for attribute filtering
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

        const result = await searchProducts(supabase, query, null, {
          minPrice: searchParams.minPrice,
          maxPrice: searchParams.maxPrice,
          tag: searchParams.tag,
          minRating: searchParams.minRating,
          deals: searchParams.deals,
          promoted: searchParams.promoted,
          nearby: searchParams.nearby,
          city: searchParams.city,
          verified: searchParams.verified,
          availability: searchParams.availability,
          sort: searchParams.sort,
          attributes: Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined,
        }, currentPage, ITEMS_PER_PAGE, shippingFilter)
        products = result.products
        totalProducts = result.total
      }
    }

    // Extract unique brands from products for the filter
    // This would ideally come from a brands table, but for now we can extract from products
    // brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
  }

  // For mobile quick filters, fetch filterable attributes for the active category (if any)
  if (searchParams.category) {
    const ctx = await getCategoryContext(searchParams.category)
    if (ctx) {
      filterableAttributes = ctx.attributes
      categoryIdForFilters = ctx.current.id
    }
  }

  // Get translations for search page UI
  const t = await getTranslations('SearchFilters')

  // Transform products for ProductGrid
  const gridProducts: ProductGridProduct[] = products.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image_url || product.images?.[0] || "/placeholder.svg",
    listPrice: product.list_price ?? undefined,
    rating: product.rating ?? 0,
    reviews: product.review_count ?? 0,
    slug: product.slug ?? null,
    storeSlug: product.profiles?.username ?? null,
    sellerId: product.profiles?.id ?? null,
    sellerName: product.profiles?.display_name || product.profiles?.business_name || product.profiles?.username || undefined,
    sellerAvatarUrl: product.profiles?.avatar_url ?? null,
    sellerTier:
      product.profiles?.account_type === "business"
        ? "business"
        : product.profiles?.tier === "premium"
          ? "premium"
          : "basic",
    sellerVerified: Boolean(product.profiles?.is_verified_business),
    condition: product.attributes?.condition,
    tags: product.tags ?? [],
  }))

  const categoryName = currentCategory
    ? (locale === "bg" && currentCategory.name_bg)
      ? currentCategory.name_bg
      : currentCategory.name
    : undefined

  // Sidebar content for desktop
  const sidebarContent = (
    <div className="bg-sidebar rounded-lg p-4">
      <Suspense>
        <SearchFilters
          categories={allCategories}
          subcategories={subcategories}
          currentCategory={currentCategory}
          allCategoriesWithSubs={allCategoriesWithSubs}
          brands={brands}
        />
      </Suspense>
    </div>
  )

  return (
    <>
      {/* Mobile Layout */}
      <PageShell variant="muted" className="lg:hidden overflow-x-hidden">
        <div className="container overflow-x-hidden py-4">
          {/* Show SubcategoryTabs when in a category, SearchHeader otherwise */}
          {currentCategory ? (
            <Suspense>
              <SubcategoryTabs
                currentCategory={currentCategory}
                subcategories={subcategories}
                parentCategory={parentCategory}
              />
            </Suspense>
          ) : (
            <Suspense>
              <SearchHeader
                query={query}
                category={searchParams.category}
                totalResults={products.length}
              />
            </Suspense>
          )}

          {/* Mobile Filter Controls */}
          <Suspense>
            <MobileFilterControls
              locale={locale}
              {...(currentCategory?.slug ? { categorySlug: currentCategory.slug } : {})}
              {...(categoryIdForFilters ? { categoryId: categoryIdForFilters } : {})}
              {...(query ? { searchQuery: query } : {})}
              attributes={filterableAttributes}
              subcategories={subcategories.map((c) => ({
                id: c.id,
                name: c.name,
                name_bg: c.name_bg,
                slug: c.slug,
              }))}
              {...(categoryName ? { categoryName } : {})}
              {...(currentCategory
                ? {
                    currentCategory: {
                      name: categoryName ?? currentCategory.name,
                      slug: currentCategory.slug,
                    },
                  }
                : {})}
              basePath="/search"
              stickyTop="var(--app-header-offset)"
              sticky={true}
              userZone={userZone ?? null}
              className="mb-3"
            />
          </Suspense>

          {/* Mobile Results Info Strip */}
          <div className="sm:hidden mb-4 flex items-center justify-between text-sm text-muted-foreground bg-surface-subtle rounded-lg px-3 py-2.5">
            <span>
              <span className="font-semibold text-foreground">{totalProducts}</span> {totalProducts === 1 ? t('product') : t('products')}
            </span>
            {currentCategory && (
              <span className="text-xs bg-selected text-primary px-2 py-0.5 rounded-full font-medium">
                {categoryName}
              </span>
            )}
          </div>

          {/* Mobile Product Grid */}
          <ProductGrid
            products={gridProducts}
            viewMode="grid"
            preset="mobile-feed"
            density="compact"
          />

          {products.length === 0 && (
            <EmptyStateCTA
              variant={query ? "no-search" : "no-category"}
              {...(query ? { searchQuery: query } : {})}
              {...(categoryName ? { categoryName } : {})}
              className="mt-8"
            />
          )}

          {/* Pagination */}
          {products.length > 0 && (
            <Suspense>
              <SearchPagination
                totalItems={totalProducts}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
              />
            </Suspense>
          )}
        </div>
      </PageShell>

      {/* Desktop Layout with DesktopShell */}
      <DesktopShell
        variant="muted"
        className="hidden lg:block"
        sidebar={sidebarContent}
        sidebarSticky
      >
        {/* Show SubcategoryTabs when in a category, SearchHeader otherwise */}
        {currentCategory ? (
          <Suspense>
            <SubcategoryTabs
              currentCategory={currentCategory}
              subcategories={subcategories}
              parentCategory={parentCategory}
            />
          </Suspense>
        ) : (
          <Suspense>
            <SearchHeader
              query={query}
              category={searchParams.category}
              totalResults={products.length}
            />
          </Suspense>
        )}

        {/* Active Filter Pills */}
        <div className="mb-4">
          <Suspense>
            <FilterChips currentCategory={currentCategory} />
          </Suspense>
        </div>

        {/* Desktop Filter & Sort Row */}
        <div className="flex mb-4 items-center gap-2">
          <div className="max-w-44">
            <SortSelect />
          </div>
          <div className="flex items-center gap-2">
            <Suspense>
              <DesktopFilters />
            </Suspense>
          </div>
          <p className="text-sm text-muted-foreground ml-auto whitespace-nowrap">
            <span className="font-semibold text-foreground">{totalProducts}</span>
            <span> {t('results')}</span>
            {query && (
              <span>
                {" "}{t('for')} <span className="font-medium text-primary">&quot;{query}&quot;</span>
              </span>
            )}
            {currentCategory && !query && (
              <span> {t('in')} <span className="font-medium">{categoryName}</span></span>
            )}
          </p>
        </div>

        {/* Product Grid with container queries */}
        <div>
          {products.length === 0 ? (
            <EmptyStateCTA
              variant={query ? "no-search" : "no-category"}
              {...(query ? { searchQuery: query } : {})}
              {...(categoryName ? { categoryName } : {})}
              className="mt-4"
            />
          ) : (
            <ProductGrid products={gridProducts} viewMode="grid" />
          )}
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <Suspense>
            <SearchPagination
              totalItems={totalProducts}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
            />
          </Suspense>
        )}
      </DesktopShell>
    </>
  )
}
