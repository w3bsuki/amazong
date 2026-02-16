import { z } from "zod"
import { cookies } from "next/headers"
import { Suspense } from "react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import type { Metadata } from "next"

import { Link } from "@/i18n/routing"
import { createStaticClient } from "@/lib/supabase/server"
import { getShippingFilter, parseShippingRegion } from "@/lib/shipping"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import { getCategoryContext } from "@/lib/data/categories"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { CategoryPillRail, type CategoryPillRailItem } from "@/components/mobile/category-nav"
import { ProductGrid, type ProductGridProduct } from "@/components/grid"

import { SearchFilters } from "./_components/filters/search-filters"
import { SearchHeader } from "./_components/search-header"
import { DesktopFilters } from "./_components/desktop-filters"
import { MobileFilterControls } from "../_components/filters/mobile-filter-controls"
import { FilterChips } from "../_components/filters/filter-chips"
import { SortSelect } from "../_components/search-controls/sort-select"
import { SearchPagination } from "../_components/search-controls/search-pagination"
import { EmptyStateCTA } from "../../_components/empty-state-cta"
import { DesktopShell } from "../_components/layout/desktop-shell.server"
import { PageShell } from "../../_components/page-shell"
import { searchProducts } from "./_lib/search-products"
import { parseSellerSearchFilters, searchSellers } from "./_lib/search-sellers"
import type {
  BrowseMode,
  Category,
  Product,
  SellerResultCard,
} from "./_lib/types"
import type { CategoryAttribute } from "@/lib/data/categories"
import { ITEMS_PER_PAGE } from "../_lib/pagination"
import { MobileBrowseModeSwitch } from "./_components/mobile-browse-mode-switch"
import { MobileSellerFilterControls } from "./_components/mobile-seller-filter-controls"
import { SellerResultsList } from "./_components/seller-results-list"

const BrowseModeSchema = z.enum(["listings", "sellers"])

const SELLER_FILTER_KEYS = new Set([
  "sellerSort",
  "sellerVerified",
  "sellerMinRating",
  "sellerMinListings",
])

const LISTING_FILTER_KEYS = new Set([
  "minPrice",
  "maxPrice",
  "minRating",
  "subcategory",
  "tag",
  "deals",
  "promoted",
  "verified",
  "brand",
  "availability",
  "sort",
])

function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

function toUrlSearchParams(input: Record<string, string | string[] | undefined>): URLSearchParams {
  const next = new URLSearchParams()
  for (const [key, value] of Object.entries(input)) {
    if (!value) continue
    if (Array.isArray(value)) {
      for (const entry of value) {
        next.append(key, entry)
      }
      continue
    }
    next.set(key, value)
  }
  return next
}

function normalizeModeParams(params: URLSearchParams, mode: BrowseMode): URLSearchParams {
  const next = new URLSearchParams(params.toString())
  next.delete("page")

  if (mode === "sellers") {
    next.set("mode", "sellers")
    for (const key of next.keys()) {
      if (LISTING_FILTER_KEYS.has(key) || key.startsWith("attr_")) next.delete(key)
    }
    return next
  }

  next.delete("mode")
  for (const key of next.keys()) {
    if (SELLER_FILTER_KEYS.has(key)) next.delete(key)
  }
  return next
}

function buildModeHref(params: URLSearchParams, mode: BrowseMode): string {
  const normalized = normalizeModeParams(params, mode)
  const queryString = normalized.toString()
  return queryString ? `/search?${queryString}` : "/search"
}

function buildCategoryHref(
  params: URLSearchParams,
  mode: BrowseMode,
  categorySlug: string | null
): string {
  const next = normalizeModeParams(params, mode)
  if (categorySlug) {
    next.set("category", categorySlug)
  } else {
    next.delete("category")
  }
  const queryString = next.toString()
  return queryString ? `/search?${queryString}` : "/search"
}

function extractAttributeFilters(
  searchParams: Record<string, string | string[] | undefined>
): Record<string, string | string[]> {
  const filters: Record<string, string | string[]> = {}

  for (const [key, value] of Object.entries(searchParams)) {
    if (!key.startsWith("attr_") || !value) continue
    const rawName = key.replace("attr_", "")
    const attrKey = normalizeAttributeKey(rawName) || rawName
    const nextValues = Array.isArray(value) ? value : [value]
    const existing = filters[attrKey]
    if (!existing) {
      filters[attrKey] = nextValues
      continue
    }
    const existingValues = Array.isArray(existing) ? existing : [existing]
    filters[attrKey] = [...new Set([...existingValues, ...nextValues])]
  }

  return filters
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string; mode?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q || ""
  const category = resolvedSearchParams.category || ""
  const parsedMode = BrowseModeSchema.safeParse(resolvedSearchParams.mode)
  const mode: BrowseMode = parsedMode.success ? parsedMode.data : "listings"

  let title = "Search Results"
  if (mode === "sellers") {
    title = query ? `"${query}" - Seller Results` : "Browse Sellers"
  } else if (query) {
    title = `"${query}" - Search Results`
  } else if (category) {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} - Shop`
  }

  return {
    title,
    description:
      mode === "sellers"
        ? query
          ? `Browse top sellers for "${query}" on Treido.`
          : "Discover trusted sellers and browse their listings on Treido."
        : query
          ? `Find the best deals on "${query}" at Treido. Fast shipping and great prices.`
          : "Browse our wide selection of products. Find electronics, fashion, home goods and more.",
  }
}

export default async function SearchPage({
  params,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const searchParams = await searchParamsPromise
  const supabase = createStaticClient()

  const parsedMode = BrowseModeSchema.safeParse(toSingleValue(searchParams.mode))
  const browseMode: BrowseMode = parsedMode.success ? parsedMode.data : "listings"

  const query = toSingleValue(searchParams.q) || ""
  const categorySlug = toSingleValue(searchParams.category)
  const currentPage = Math.max(1, Number.parseInt(toSingleValue(searchParams.page) || "1", 10))

  // Read shipping zone from cookie (set by header "Доставка до" dropdown)
  // Only filter if user has selected a specific zone (not WW = worldwide = show all)
  const cookieStore = await cookies()
  const userZone = cookieStore.get("user-zone")?.value
  const parsedZone = parseShippingRegion(userZone)
  const shippingFilter = parsedZone !== "WW" ? (getShippingFilter(parsedZone) || undefined) : undefined

  let products: Product[] = []
  let totalProducts = 0
  let sellers: SellerResultCard[] = []
  let totalSellers = 0
  let currentCategory: Category | null = null
  let siblingCategories: Category[] = []
  let subcategories: Category[] = []
  let allCategories: Category[] = []
  let allCategoriesWithSubs: { category: Category; subs: Category[] }[] = []
  const brands: string[] = []
  let filterableAttributes: CategoryAttribute[] = []
  let categoryIdForFilters: string | undefined

  // Build rails and desktop mode links from current URL params
  const searchUrlParams = toUrlSearchParams(searchParams)

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
      const rootIds = rootCats.map((c) => c.id)
      const { data: subCats } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug, parent_id, image_url, display_order")
        .in("parent_id", rootIds)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true })

      // Build the hierarchical structure for the sidebar
      allCategoriesWithSubs = rootCats.map((cat) => ({
        category: cat,
        subs: (subCats || []).filter((c) => c.parent_id === cat.id),
      }))

      // Also store subCats for category lookup
      const allCats = [...rootCats, ...(subCats || [])]

      // If a category is specified, get its details and subcategories
      if (categorySlug) {
        const categoryData = allCats.find((c) => c.slug === categorySlug) || null

        if (categoryData) {
          currentCategory = categoryData
          categoryIdForFilters = categoryData.id

          if (categoryData.parent_id) {
            siblingCategories = allCats.filter((c) => c.parent_id === categoryData.parent_id)
            subcategories = []
          } else {
            subcategories = allCats.filter((c) => c.parent_id === categoryData.id)
            siblingCategories = []
          }
        }
      }

      if (browseMode === "listings") {
        const attributeFilters = extractAttributeFilters(searchParams)
        const categoryIds =
          currentCategory != null
            ? currentCategory.parent_id
              ? [currentCategory.id]
              : [currentCategory.id, ...subcategories.map((s) => s.id)]
            : null

        const result = await searchProducts(
          supabase,
          query,
          categoryIds,
          {
            minPrice: toSingleValue(searchParams.minPrice),
            maxPrice: toSingleValue(searchParams.maxPrice),
            tag: toSingleValue(searchParams.tag),
            minRating: toSingleValue(searchParams.minRating),
            deals: toSingleValue(searchParams.deals),
            promoted: toSingleValue(searchParams.promoted),
            nearby: toSingleValue(searchParams.nearby),
            city: toSingleValue(searchParams.city),
            verified: toSingleValue(searchParams.verified),
            availability: toSingleValue(searchParams.availability),
            sort: toSingleValue(searchParams.sort),
            attributes: Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined,
          },
          currentPage,
          ITEMS_PER_PAGE,
          shippingFilter
        )

        products = result.products
        totalProducts = result.total
      } else {
        const sellerSortParam = toSingleValue(searchParams.sellerSort)
        const sellerVerifiedParam = toSingleValue(searchParams.sellerVerified)
        const sellerMinRatingParam = toSingleValue(searchParams.sellerMinRating)
        const sellerMinListingsParam = toSingleValue(searchParams.sellerMinListings)
        const cityParam = toSingleValue(searchParams.city)
        const nearbyParam = toSingleValue(searchParams.nearby)

        const sellerFilters = parseSellerSearchFilters({
          ...(sellerSortParam ? { sellerSort: sellerSortParam } : {}),
          ...(sellerVerifiedParam ? { sellerVerified: sellerVerifiedParam } : {}),
          ...(sellerMinRatingParam ? { sellerMinRating: sellerMinRatingParam } : {}),
          ...(sellerMinListingsParam ? { sellerMinListings: sellerMinListingsParam } : {}),
          ...(cityParam ? { city: cityParam } : {}),
          ...(nearbyParam ? { nearby: nearbyParam } : {}),
        })

        const sellerCategorySlug = currentCategory?.slug ?? categorySlug
        const sellerResults = await searchSellers(supabase, {
          query,
          ...(sellerCategorySlug ? { categorySlug: sellerCategorySlug } : {}),
          filters: sellerFilters,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        })
        sellers = sellerResults.sellers
        totalSellers = sellerResults.total
      }
    }
  }

  // For mobile quick filters, fetch filterable attributes for the active category (if any)
  if (browseMode === "listings" && categorySlug) {
    const ctx = await getCategoryContext(categorySlug)
    if (ctx) {
      filterableAttributes = ctx.attributes
      categoryIdForFilters = ctx.current.id
    }
  }

  const t = await getTranslations("SearchFilters")
  const tCategories = await getTranslations("Categories")

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
    sellerName:
      product.profiles?.display_name || product.profiles?.business_name || product.profiles?.username || undefined,
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
    ? locale === "bg" && currentCategory.name_bg
      ? currentCategory.name_bg
      : currentCategory.name
    : undefined

  const totalResults = browseMode === "sellers" ? totalSellers : totalProducts

  const modeListingsHref = buildModeHref(searchUrlParams, "listings")
  const modeSellersHref = buildModeHref(searchUrlParams, "sellers")

  const railCategories = currentCategory
    ? (subcategories.length > 0 ? subcategories : siblingCategories).filter((cat) => cat.slug !== currentCategory.slug)
    : allCategories.slice(0, 8)

  const allRailLabel = currentCategory
    ? tCategories("allIn", {
        category:
          categoryName ??
          tCategories("shortName", {
            slug: currentCategory ? getCategorySlugKey(currentCategory.slug) : "other",
            name: currentCategory?.name ?? "",
          }),
      })
    : tCategories("headerTitleAll")

  const railItems: CategoryPillRailItem[] = [
    {
      id: "all-categories",
      label: allRailLabel,
      href: buildCategoryHref(searchUrlParams, browseMode, currentCategory ? currentCategory.slug : null),
      active: !currentCategory || Boolean(currentCategory),
      title: allRailLabel,
    },
    ...railCategories.map((category) => ({
      id: category.id,
      label: tCategories("shortName", {
        slug: getCategorySlugKey(category.slug),
        name: getCategoryName(category, locale),
      }),
      href: buildCategoryHref(searchUrlParams, browseMode, category.slug),
      active: currentCategory?.slug === category.slug,
      title: locale === "bg" && category.name_bg ? category.name_bg : category.name,
    })),
  ]

  // Sidebar content for desktop listings mode
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
          <Suspense>
            <SearchHeader query={query} category={categorySlug} totalResults={totalResults} />
          </Suspense>

          <MobileBrowseModeSwitch mode={browseMode} basePath="/search" className="mb-1" />

          <CategoryPillRail
            items={railItems}
            ariaLabel={tCategories("navigationAriaLabel")}
            stickyTop="calc(var(--app-header-offset) + var(--control-default) + 12px)"
            sticky={true}
            moreLabel={tCategories("showMore")}
            testId="mobile-search-category-rail"
          />

          {browseMode === "listings" ? (
            <>
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
                  stickyTop="calc(var(--app-header-offset) + var(--control-default) + var(--control-compact) + 24px)"
                  sticky={true}
                  userZone={userZone ?? null}
                  className="mb-3 z-20"
                />
              </Suspense>

              <div className="mb-4 flex items-center justify-between rounded-lg bg-surface-subtle px-3 py-2.5 text-sm text-muted-foreground sm:hidden">
                <span>
                  <span className="font-semibold text-foreground">{totalProducts}</span>{" "}
                  {totalProducts === 1 ? t("product") : t("products")}
                </span>
                {currentCategory && (
                  <span className="rounded-full bg-selected px-2 py-0.5 text-xs font-medium text-primary">
                    {categoryName}
                  </span>
                )}
              </div>

              <ProductGrid products={gridProducts} viewMode="grid" preset="mobile-feed" density="compact" />

              {products.length === 0 && (
                <EmptyStateCTA
                  variant={query ? "no-search" : "no-category"}
                  {...(query ? { searchQuery: query } : {})}
                  {...(categoryName ? { categoryName } : {})}
                  className="mt-8"
                />
              )}
            </>
          ) : (
            <>
              <MobileSellerFilterControls basePath="/search" className="mb-3" />

              <div className="mb-4 flex items-center justify-between rounded-lg bg-surface-subtle px-3 py-2.5 text-sm text-muted-foreground sm:hidden">
                <span>
                  <span className="font-semibold text-foreground">{totalSellers}</span>{" "}
                  {t("sellersFound")}
                </span>
                <span className="rounded-full bg-selected px-2 py-0.5 text-xs font-medium text-primary">
                  {t("sellersMode")}
                </span>
              </div>

              <SellerResultsList
                sellers={sellers}
                locale={locale}
                emptyTitle={t("noSellersFound")}
                emptyDescription={t("noSellersFoundDescription")}
                verifiedLabel={t("verifiedSellersBadge")}
                listingsLabel={t("sellerListingsLabel")}
              />
            </>
          )}

          {totalResults > 0 && (
            <Suspense>
              <SearchPagination
                totalItems={totalResults}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
              />
            </Suspense>
          )}
        </div>
      </PageShell>

      {/* Desktop Layout */}
      <DesktopShell
        variant="muted"
        className="hidden lg:block"
        sidebar={browseMode === "listings" ? sidebarContent : undefined}
        sidebarSticky={browseMode === "listings"}
      >
        <Suspense>
          <SearchHeader query={query} category={categorySlug} totalResults={totalResults} />
        </Suspense>

        <div className="mb-2 flex items-center gap-2">
          <Link
            href={modeListingsHref}
            className={browseMode === "listings"
              ? "inline-flex min-h-(--control-compact) items-center rounded-full border border-foreground bg-foreground px-3 text-xs font-semibold text-background"
              : "inline-flex min-h-(--control-compact) items-center rounded-full border border-border-subtle bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-hover hover:text-foreground"}
          >
            {t("listingsMode")}
          </Link>
          <Link
            href={modeSellersHref}
            className={browseMode === "sellers"
              ? "inline-flex min-h-(--control-compact) items-center rounded-full border border-foreground bg-foreground px-3 text-xs font-semibold text-background"
              : "inline-flex min-h-(--control-compact) items-center rounded-full border border-border-subtle bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-hover hover:text-foreground"}
          >
            {t("sellersMode")}
          </Link>
        </div>

        {browseMode === "listings" ? (
          <>
            <div className="mb-4">
              <Suspense>
                <FilterChips currentCategory={currentCategory} />
              </Suspense>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <div className="max-w-44">
                <SortSelect />
              </div>
              <div className="flex items-center gap-2">
                <Suspense>
                  <DesktopFilters />
                </Suspense>
              </div>
              <p className="ml-auto whitespace-nowrap text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{totalProducts}</span>
                <span> {t("results")}</span>
                {query && (
                  <span>
                    {" "}
                    {t("for")} <span className="font-medium text-primary">&quot;{query}&quot;</span>
                  </span>
                )}
                {currentCategory && !query && (
                  <span>
                    {" "}
                    {t("in")} <span className="font-medium">{categoryName}</span>
                  </span>
                )}
              </p>
            </div>

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
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{totalSellers}</span>{" "}
              {t("sellersFound")}
            </p>
            <SellerResultsList
              sellers={sellers}
              locale={locale}
              emptyTitle={t("noSellersFound")}
              emptyDescription={t("noSellersFoundDescription")}
              verifiedLabel={t("verifiedSellersBadge")}
              listingsLabel={t("sellerListingsLabel")}
            />
          </>
        )}

        {totalResults > 0 && (
          <Suspense>
            <SearchPagination
              totalItems={totalResults}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
            />
          </Suspense>
        )}
      </DesktopShell>
    </>
  )
}
