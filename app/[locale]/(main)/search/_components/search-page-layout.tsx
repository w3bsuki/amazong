import { Link } from "@/i18n/routing"
import { ProductGrid, type ProductGridProduct } from "@/components/shared/product/product-grid"
import type { CategoryAttribute } from "@/lib/data/categories"
import { SearchFilters } from "./filters/search-filters"
import { SearchHeader } from "./search-header"
import { DesktopFilters } from "./desktop-filters"
import { FilterChips } from "../../_components/filters/filter-chips"
import { SortSelect } from "../../_components/search-controls/sort-select"
import { SearchPagination } from "../../_components/search-controls/search-pagination"
import { EmptyStateCTA } from "../../../_components/empty-state-cta"
import { DesktopShell } from "../../_components/layout/desktop-shell.server"
import { PageShell } from "../../../_components/page-shell"
import { MobileSellerFilterControls } from "./mobile-seller-filter-controls"
import { SellerResultsList } from "./seller-results-list"
import { MobileSearchSmartRail } from "./mobile-search-smart-rail"
import { SearchHeaderSync } from "./search-header-sync"
import type { BrowseMode, Category, SellerResultCard } from "../_lib/types"

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

interface SearchPageLayoutProps {
  locale: string
  browseMode: BrowseMode
  query: string
  categorySlug: string | null
  currentPage: number
  currentCategory: Category | null
  subcategories: Category[]
  allCategories: Category[]
  allCategoriesWithSubs: { category: Category; subs: Category[] }[]
  categoryIdForFilters?: string | undefined
  categoryName?: string | undefined
  filterableAttributes: CategoryAttribute[]
  gridProducts: ProductGridProduct[]
  productsCount: number
  sellers: SellerResultCard[]
  totalProducts: number
  totalSellers: number
  totalResults: number
  modeListingsHref: string
  modeSellersHref: string
  itemsPerPage: number
  t: Translate
}

export function SearchPageLayout({
  locale,
  browseMode,
  query,
  categorySlug,
  currentPage,
  currentCategory,
  subcategories,
  allCategories,
  allCategoriesWithSubs,
  categoryIdForFilters,
  categoryName,
  filterableAttributes,
  gridProducts,
  productsCount,
  sellers,
  totalProducts,
  totalSellers,
  totalResults,
  modeListingsHref,
  modeSellersHref,
  itemsPerPage,
  t,
}: SearchPageLayoutProps) {
  const sidebarContent = (
    <div className="bg-sidebar rounded-lg p-4">
      <SearchFilters
        categories={allCategories}
        subcategories={subcategories}
        currentCategory={currentCategory}
        allCategoriesWithSubs={allCategoriesWithSubs}
        brands={[]}
      />
    </div>
  )

  const searchHeader = (
    <SearchHeader query={query} category={categorySlug ?? undefined} totalResults={totalResults} />
  )

  const sellerResultsList = (
    <SellerResultsList
      sellers={sellers}
      locale={locale}
      emptyTitle={t("noSellersFound")}
      emptyDescription={t("noSellersFoundDescription")}
      verifiedLabel={t("verifiedSellersBadge")}
      listingsLabel={t("sellerListingsLabel")}
    />
  )

  const pagination = totalResults > 0 && (
    <SearchPagination totalItems={totalResults} itemsPerPage={itemsPerPage} currentPage={currentPage} />
  )

  const emptyStateCTA = (className: string) => (
    <EmptyStateCTA
      variant={query ? "no-search" : "no-category"}
      {...(query ? { searchQuery: query } : {})}
      {...(categoryName ? { categoryName } : {})}
      className={className}
    />
  )

  return (
    <>
      <PageShell variant="muted" className="lg:hidden overflow-x-hidden">
        <SearchHeaderSync query={query} categorySlug={currentCategory?.slug ?? categorySlug} />

        {browseMode === "listings" ? (
          <MobileSearchSmartRail
            locale={locale}
            query={query}
            sellersHref={modeSellersHref}
            {...(currentCategory?.slug ? { categorySlug: currentCategory.slug } : {})}
            {...(categoryIdForFilters ? { categoryId: categoryIdForFilters } : {})}
            {...(categoryName ? { categoryName } : {})}
            attributes={filterableAttributes}
            subcategories={subcategories.map((c) => ({
              id: c.id,
              name: c.name,
              name_bg: c.name_bg,
              slug: c.slug,
            }))}
          />
        ) : (
          <MobileSellerFilterControls basePath="/search" listingsHref={modeListingsHref} className="mb-2" />
        )}

        <div className="container overflow-x-hidden pb-4 pt-2">
          {browseMode === "listings" ? (
            <>
              <ProductGrid products={gridProducts} viewMode="grid" preset="mobile-feed" density="compact" />

              {productsCount === 0 && emptyStateCTA("mt-8")}
            </>
          ) : (
            <>
              {sellerResultsList}
            </>
          )}

          {pagination}
        </div>
      </PageShell>

      <DesktopShell
        variant="muted"
        className="hidden lg:block"
        sidebar={browseMode === "listings" ? sidebarContent : undefined}
        sidebarSticky={browseMode === "listings"}
      >
        {searchHeader}

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
              <FilterChips currentCategory={currentCategory} />
            </div>

            <div className="mb-4 flex items-center gap-2">
              <div className="max-w-44">
                <SortSelect />
              </div>
              <div className="flex items-center gap-2">
                <DesktopFilters
                  attributes={filterableAttributes}
                  {...(categorySlug ? { categorySlug } : {})}
                  {...(categoryIdForFilters ? { categoryId: categoryIdForFilters } : {})}
                />
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
              {productsCount === 0 ? (
                emptyStateCTA("mt-4")
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
            {sellerResultsList}
          </>
        )}

        {pagination}
      </DesktopShell>
    </>
  )
}
