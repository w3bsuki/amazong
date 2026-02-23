"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { EmptyStateCTA } from "../../_components/empty-state-cta"
import { getCategoryName } from "@/lib/data/categories/display"
import { FeedToolbar } from "@/components/desktop/feed-toolbar"
import { CompactCategorySidebar } from "./desktop/category-sidebar"
import { FiltersSidebar } from "./desktop/filters-sidebar"
import { ProductGridSkeleton } from "./desktop/product-grid-skeleton"
import { PromotedSection } from "./desktop/promoted-section"
import { DesktopShell } from "./layout/desktop-shell"
import { ProductGrid } from "@/components/shared/product/product-grid"
import { SubcategoryCircles } from "./category/subcategory-circles"
import { useDesktopHomeController } from "./desktop/use-desktop-home-controller"
import type { DesktopHomeProps } from "./desktop/desktop-home.types"

export function DesktopHome({
  locale,
  categories,
  initialProducts = [],
  promotedProducts = [],
}: DesktopHomeProps) {
  const t = useTranslations("TabbedProductFeed")

  const {
    activeTab,
    setActiveTab,
    categoryPath,
    activeCategorySlug,
    activeCategoryNode,
    siblingCategories,
    isLoading,
    hasMore,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    userCity,
    handleCityChange,
    categoryCounts,
    categoryAttributes,
    isLoadingAttributes,
    handleSubcategorySelect,
    handleSiblingSelect,
    handleCategorySelect,
    loadMore,
    refreshCurrent,
    finalGridProducts,
    activePromotedProducts,
  } = useDesktopHomeController({
    locale,
    categories,
    initialProducts,
    promotedProducts,
  })

  const sidebarContent = (
    <>
      <CompactCategorySidebar
        categories={categories}
        locale={locale}
        selectedPath={categoryPath}
        onCategorySelect={handleCategorySelect}
        categoryCounts={categoryCounts}
      />
      {categoryPath.length > 0 && (
        <FiltersSidebar
          locale={locale}
          filters={filters}
          onFiltersChange={setFilters}
          onApply={refreshCurrent}
        />
      )}
    </>
  )

  return (
    <DesktopShell
      variant="muted"
      sidebar={sidebarContent}
      sidebarSticky
    >
      {activeCategoryNode && (
        <div className="rounded-xl bg-card border border-border p-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight text-foreground leading-tight">
                {getCategoryName(activeCategoryNode, locale)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {finalGridProducts.length.toLocaleString(locale)}{" "}
                {t("sectionAriaLabel").toLocaleLowerCase(locale)}
              </p>
            </div>
          </div>

          {Array.isArray(activeCategoryNode.children) && activeCategoryNode.children.length > 0 ? (
            <SubcategoryCircles
              className="mt-3"
              variant="desktop"
              currentCategory={{
                id: activeCategoryNode.id,
                name: activeCategoryNode.name,
                name_bg: activeCategoryNode.name_bg,
                slug: activeCategoryNode.slug,
                parent_id: activeCategoryNode.parent_id ?? null,
                image_url: activeCategoryNode.image_url ?? null,
                ...(typeof categoryCounts[activeCategoryNode.slug] === "number"
                  ? { subtree_product_count: categoryCounts[activeCategoryNode.slug] }
                  : {}),
              }}
              subcategories={activeCategoryNode.children.map((category) => ({
                id: category.id,
                name: category.name,
                name_bg: category.name_bg,
                slug: category.slug,
                parent_id: category.parent_id ?? activeCategoryNode.id ?? null,
                image_url: category.image_url ?? null,
                ...(typeof categoryCounts[category.slug] === "number"
                  ? { subtree_product_count: categoryCounts[category.slug] }
                  : {}),
              }))}
              onSelectCategory={handleSubcategorySelect}
            />
          ) : siblingCategories.length > 0 ? (
            <SubcategoryCircles
              className="mt-3"
              variant="desktop"
              currentCategory={{
                id: activeCategoryNode.id,
                name: activeCategoryNode.name,
                name_bg: activeCategoryNode.name_bg,
                slug: activeCategoryNode.slug,
                parent_id: activeCategoryNode.parent_id ?? null,
                image_url: activeCategoryNode.image_url ?? null,
                ...(typeof categoryCounts[activeCategoryNode.slug] === "number"
                  ? { subtree_product_count: categoryCounts[activeCategoryNode.slug] }
                  : {}),
              }}
              subcategories={siblingCategories.map((category) => ({
                id: category.id,
                name: category.name,
                name_bg: category.name_bg,
                slug: category.slug,
                parent_id: category.parent_id ?? null,
                image_url: category.image_url ?? null,
                ...(typeof categoryCounts[category.slug] === "number"
                  ? { subtree_product_count: categoryCounts[category.slug] }
                  : {}),
              }))}
              activeSubcategorySlug={activeCategoryNode.slug}
              onSelectCategory={handleSiblingSelect}
            />
          ) : null}
        </div>
      )}

      {!activeCategorySlug && activePromotedProducts.length > 0 && (
        <PromotedSection
          products={activePromotedProducts}
          locale={locale}
          maxProducts={5}
        />
      )}

      <FeedToolbar
        locale={locale}
        productCount={finalGridProducts.length}
        showCount={categoryPath.length === 0}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categorySlug={activeCategorySlug}
        userCity={userCity}
        onCityChange={handleCityChange}
        filters={filters}
        onFiltersChange={setFilters}
        categoryAttributes={categoryAttributes}
        isLoadingAttributes={isLoadingAttributes}
      />

      <div className="rounded-xl bg-card border border-border p-4">
        {finalGridProducts.length === 0 && isLoading ? (
          <ProductGridSkeleton viewMode={viewMode} />
        ) : finalGridProducts.length === 0 ? (
          <EmptyStateCTA
            variant={activeCategorySlug ? "no-category" : "no-listings"}
            {...(activeCategorySlug ? { categoryName: activeCategorySlug } : {})}
          />
        ) : (
          <>
            <ProductGrid
              products={finalGridProducts}
              viewMode={viewMode}
            />

            {hasMore && (
              <div className="mt-8 text-center">
                <Button onClick={loadMore} disabled={isLoading} size="lg" className="min-w-36">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {t("loading")}
                    </span>
                  ) : (
                    t("loadMore")
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DesktopShell>
  )
}
