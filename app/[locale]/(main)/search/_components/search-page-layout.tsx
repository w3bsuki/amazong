import { Suspense } from "react"

import { Link } from "@/i18n/routing"
import { CategoryPillRail, type CategoryPillRailItem } from "@/components/mobile/category-nav/category-pill-rail"
import { ProductGrid, type ProductGridProduct } from "@/components/grid/product-grid"
import type { CategoryAttribute } from "@/lib/data/categories"
import { SearchFilters } from "./filters/search-filters"
import { SearchHeader } from "./search-header"
import { DesktopFilters } from "./desktop-filters"
import { MobileFilterControls } from "../../_components/filters/mobile-filter-controls"
import { FilterChips } from "../../_components/filters/filter-chips"
import { SortSelect } from "../../_components/search-controls/sort-select"
import { SearchPagination } from "../../_components/search-controls/search-pagination"
import { EmptyStateCTA } from "../../../_components/empty-state-cta"
import { DesktopShell } from "../../_components/layout/desktop-shell.server"
import { PageShell } from "../../../_components/page-shell"
import { MobileBrowseModeSwitch } from "./mobile-browse-mode-switch"
import { MobileSellerFilterControls } from "./mobile-seller-filter-controls"
import { SellerResultsList } from "./seller-results-list"
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
  userZone: string | null
  gridProducts: ProductGridProduct[]
  productsCount: number
  sellers: SellerResultCard[]
  totalProducts: number
  totalSellers: number
  totalResults: number
  modeListingsHref: string
  modeSellersHref: string
  railItems: CategoryPillRailItem[]
  itemsPerPage: number
  t: Translate
  tCategories: Translate
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
  userZone,
  gridProducts,
  productsCount,
  sellers,
  totalProducts,
  totalSellers,
  totalResults,
  modeListingsHref,
  modeSellersHref,
  railItems,
  itemsPerPage,
  t,
  tCategories,
}: SearchPageLayoutProps) {
  const sidebarContent = (
    <div className="bg-sidebar rounded-lg p-4">
      <Suspense>
        <SearchFilters
          categories={allCategories}
          subcategories={subcategories}
          currentCategory={currentCategory}
          allCategoriesWithSubs={allCategoriesWithSubs}
          brands={[]}
        />
      </Suspense>
    </div>
  )

  return (
    <>
      <PageShell variant="muted" className="lg:hidden overflow-x-hidden">
        <div className="container overflow-x-hidden py-4">
          <Suspense>
            <SearchHeader query={query} category={categorySlug ?? undefined} totalResults={totalResults} />
          </Suspense>

          <MobileBrowseModeSwitch mode={browseMode} basePath="/search" className="mb-1" />

          <CategoryPillRail
            items={railItems}
            ariaLabel={tCategories("navigationAriaLabel")}
            stickyTop="var(--offset-mobile-secondary-rail)"
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
                  stickyTop="var(--offset-mobile-tertiary-rail)"
                  sticky={true}
                  userZone={userZone}
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

              {productsCount === 0 && (
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
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
              />
            </Suspense>
          )}
        </div>
      </PageShell>

      <DesktopShell
        variant="muted"
        className="hidden lg:block"
        sidebar={browseMode === "listings" ? sidebarContent : undefined}
        sidebarSticky={browseMode === "listings"}
      >
        <Suspense>
          <SearchHeader query={query} category={categorySlug ?? undefined} totalResults={totalResults} />
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
              {productsCount === 0 ? (
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
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
            />
          </Suspense>
        )}
      </DesktopShell>
    </>
  )
}
