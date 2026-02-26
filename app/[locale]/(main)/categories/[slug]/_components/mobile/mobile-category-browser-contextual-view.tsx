
"use client"

import type { CategoryAttribute } from "@/lib/data/categories"
import type { UIProduct } from "@/lib/data/products"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import {
  SmartRail,
  type SmartRailAction,
  type SmartRailPill,
} from "@/components/mobile/chrome/smart-rail"
import { PageShell } from "../../../../../_components/page-shell"
import { ProductFeed } from "./product-feed"
import {
  toFilterSubcategories,
  type ScopeCategory,
} from "./mobile-category-browser-contextual-utils"

const FilterHub = dynamic(
  () => import("../../../../_components/filters/filter-hub").then((mod) => mod.FilterHub),
  { ssr: false },
)

const MOBILE_FEED_FRAME_CLASS = "mx-auto w-full max-w-screen-md pb-tabbar-safe"

interface MobileCategoryBrowserContextualViewProps {
  locale: string
  railPills: SmartRailPill[]
  railLeadingAction?: SmartRailAction | undefined
  railTrailingAction?: SmartRailAction | undefined
  filterOpen: boolean
  onFilterOpenChange: (open: boolean) => void
  navigationAriaLabel: string
  attributes: CategoryAttribute[]
  categorySlug: string
  categoryId: string | null
  railCategories: ScopeCategory[]
  activeCategoryName: string | null
  appliedSearchParams: URLSearchParams
  onApplyFilters: (next: { queryString: string; finalPath: string }) => Promise<void>
  products: UIProduct[]
  hasMore: boolean
  isLoading: boolean
  activeSlug: string
  onLoadMore: () => void
}

export function MobileCategoryBrowserContextualView({
  locale,
  railPills,
  railLeadingAction,
  railTrailingAction,
  filterOpen,
  onFilterOpenChange,
  navigationAriaLabel,
  attributes,
  categorySlug,
  categoryId,
  railCategories,
  activeCategoryName,
  appliedSearchParams,
  onApplyFilters,
  products,
  hasMore,
  isLoading,
  activeSlug,
  onLoadMore,
}: MobileCategoryBrowserContextualViewProps) {
  const tDrawer = useTranslations("CategoryDrawer")
  const listingsCountLabel = tDrawer("listingsCount", {
    count: hasMore ? `${products.length}+` : products.length,
  })

  return (
    <PageShell variant="muted" className="w-full">
      <div className={MOBILE_FEED_FRAME_CLASS}>
        <SmartRail
          ariaLabel={navigationAriaLabel}
          pills={railPills}
          {...(railLeadingAction ? { leadingAction: railLeadingAction } : {})}
          {...(railTrailingAction ? { filterAction: railTrailingAction } : {})}
          stickyTop="var(--offset-mobile-primary-rail)"
          sticky={true}
          testId="mobile-category-scope-rail"
        />

        <p className="px-inset pt-1 text-xs text-muted-foreground" data-testid="mobile-category-listings-count">
          {listingsCountLabel}
        </p>

        <div className="px-inset pt-2">
          <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated">
            <ProductFeed
              products={products}
              hasMore={hasMore}
              isLoading={isLoading}
              activeSlug={activeSlug}
              gridBatchKey={`${activeSlug}|${appliedSearchParams.toString()}`}
              locale={locale}
              isAllTab={false}
              activeCategoryName={activeCategoryName}
              onLoadMore={onLoadMore}
              showLoadingOverlay={true}
            />
          </div>
        </div>
      </div>

      {filterOpen ? (
        <FilterHub
          open={filterOpen}
          onOpenChange={onFilterOpenChange}
          locale={locale}
          attributes={attributes}
          {...(categorySlug !== "all" ? { categorySlug } : {})}
          {...(categoryId ? { categoryId } : {})}
          subcategories={toFilterSubcategories(railCategories)}
          {...(activeCategoryName ? { categoryName: activeCategoryName } : {})}
          basePath={`/categories/${categorySlug}`}
          appliedSearchParams={appliedSearchParams}
          onApply={onApplyFilters}
          mode="full"
          initialSection={null}
        />
      ) : null}
    </PageShell>
  )
}
