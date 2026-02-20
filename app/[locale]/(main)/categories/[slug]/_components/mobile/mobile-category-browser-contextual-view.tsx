import type { CategoryAttribute } from "@/lib/data/categories"
import type { UIProduct } from "@/lib/data/products"
import {
  CategoryOptionRail,
  type CategoryOptionItem,
  type SectionPathSegment,
} from "@/components/mobile/category-nav/category-drilldown-rail"
import {
  MobileFilterControls,
  type QuickAttributePill,
} from "../../../../_components/filters/mobile-filter-controls"
import { PageShell } from "../../../../../_components/page-shell"
import { ProductFeed } from "./product-feed"
import {
  toFilterSubcategories,
  type ScopeCategory,
} from "./mobile-category-browser-contextual-utils"

const MOBILE_FEED_FRAME_CLASS = "mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe"

interface MobileCategoryBrowserContextualViewProps {
  locale: string
  railActiveLabel: string | null
  railOptions: CategoryOptionItem[]
  onOptionSelect: (slug: string) => void
  sectionPath: SectionPathSegment[]
  onSectionBack: () => void
  canOpenScopeDrawer: boolean
  onScopeMoreClick: () => void
  navigationAriaLabel: string
  showMoreLabel: string
  attributes: CategoryAttribute[]
  categorySlug: string
  categoryId: string | null
  railCategories: ScopeCategory[]
  activeCategoryName: string | null
  appliedSearchParams: URLSearchParams
  quickAttributePills: QuickAttributePill[]
  onApplyFilters: (next: { queryString: string; finalPath: string }) => Promise<void>
  onRemoveFilter: (key: string, key2?: string) => Promise<void>
  onClearAllFilters: () => Promise<void>
  products: UIProduct[]
  hasMore: boolean
  isLoading: boolean
  activeSlug: string
  onLoadMore: () => void
}

export function MobileCategoryBrowserContextualView({
  locale,
  railActiveLabel,
  railOptions,
  onOptionSelect,
  sectionPath,
  onSectionBack,
  canOpenScopeDrawer,
  onScopeMoreClick,
  navigationAriaLabel,
  showMoreLabel,
  attributes,
  categorySlug,
  categoryId,
  railCategories,
  activeCategoryName,
  appliedSearchParams,
  quickAttributePills,
  onApplyFilters,
  onRemoveFilter,
  onClearAllFilters,
  products,
  hasMore,
  isLoading,
  activeSlug,
  onLoadMore,
}: MobileCategoryBrowserContextualViewProps) {
  return (
    <PageShell variant="muted" className="w-full">
      <div className={MOBILE_FEED_FRAME_CLASS}>
        <CategoryOptionRail
          activeLabel={railActiveLabel}
          sectionPath={sectionPath}
          onSectionBack={onSectionBack}
          options={railOptions}
          onOptionSelect={onOptionSelect}
          moreLabel={showMoreLabel}
          {...(canOpenScopeDrawer ? { onMoreClick: onScopeMoreClick } : {})}
          ariaLabel={navigationAriaLabel}
          stickyTop="var(--offset-mobile-primary-rail)"
          sticky={true}
          testId="mobile-category-scope-rail"
        />

        <MobileFilterControls
          locale={locale}
          attributes={attributes}
          {...(categorySlug !== "all" ? { categorySlug } : {})}
          {...(categoryId ? { categoryId } : {})}
          subcategories={toFilterSubcategories(railCategories)}
          {...(activeCategoryName ? { categoryName: activeCategoryName } : {})}
          basePath={`/categories/${categorySlug}`}
          appliedSearchParams={appliedSearchParams}
          quickAttributePills={quickAttributePills}
          onApply={onApplyFilters}
          onRemoveFilter={onRemoveFilter}
          onClearAll={onClearAllFilters}
          stickyTop="calc(var(--offset-mobile-primary-rail) + var(--control-compact) + var(--spacing-mobile-rail-gap))"
          sticky={true}
          className="z-20"
        />

        <ProductFeed
          products={products}
          hasMore={hasMore}
          isLoading={isLoading}
          activeSlug={activeSlug}
          locale={locale}
          isAllTab={false}
          activeCategoryName={activeCategoryName}
          onLoadMore={onLoadMore}
          showLoadingOverlay={true}
        />
      </div>
    </PageShell>
  )
}
