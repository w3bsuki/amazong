import { ChevronRight as CaretRight, Ellipsis as DotsThree, Funnel as FunnelSimple } from "lucide-react";

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryIcon } from "../category/category-icons"
import type { HomeDiscoveryScope } from "./use-home-discovery-feed"
import {
  MOBILE_ACTION_CHIP_CLASS as ACTION_CHIP_CLASS,
  getMobileQuickPillClass as getPillClass,
  getMobilePrimaryTabClass as getPrimaryTabClass,
} from "@/components/mobile/chrome/mobile-control-recipes"

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

interface MobileHomeRailsProps {
  tCategories: Translate
  tV4: Translate
  scope: HomeDiscoveryScope
  activeCategorySlug: string | null
  activeSubcategorySlug: string | null
  visibleCategoryTabs: CategoryTreeNode[]
  overflowCategories: CategoryTreeNode[]
  activeSubcategories: CategoryTreeNode[]
  contextTitle: string
  fullBrowseHref: string
  showBrowseOptionsTrigger: boolean
  hasActiveFilters: boolean
  activeFilterCount: number
  onPrimaryTab: (slug: string | null) => void
  onScopeSelect: (scope: HomeDiscoveryScope) => void
  onSubcategoryPill: (slug: string | null) => void
  onCategoryPickerOpen: () => void
  onBrowseOptionsOpen: () => void
  onFilterOpen: () => void
  getCategoryLabel: (category: CategoryTreeNode) => string
}

const DISCOVERY_SCOPES: readonly HomeDiscoveryScope[] = [
  "forYou",
  "newest",
  "promoted",
  "nearby",
  "deals",
]

export function MobileHomeRails({
  tCategories,
  tV4,
  scope,
  activeCategorySlug,
  activeSubcategorySlug,
  visibleCategoryTabs,
  overflowCategories,
  activeSubcategories,
  contextTitle,
  fullBrowseHref,
  showBrowseOptionsTrigger,
  hasActiveFilters,
  activeFilterCount,
  onPrimaryTab,
  onScopeSelect,
  onSubcategoryPill,
  onCategoryPickerOpen,
  onBrowseOptionsOpen,
  onFilterOpen,
  getCategoryLabel,
}: MobileHomeRailsProps) {
  return (
    <>
      <div
        data-testid="home-v4-rails"
        className="sticky top-(--offset-mobile-primary-rail) z-30 border-b border-border-subtle bg-background"
      >
        <nav
          data-testid="home-v4-primary-rail"
          className="overflow-x-auto no-scrollbar"
          aria-label={tV4("aria.primaryCategories")}
        >
          <div className="flex w-max min-w-full items-stretch">
            <button
              type="button"
              aria-pressed={activeCategorySlug === null}
              onClick={() => onPrimaryTab(null)}
              className={getPrimaryTabClass(activeCategorySlug === null)}
            >
              {getCategoryIcon("categories", {
                size: 16,
                weight: activeCategorySlug === null ? "fill" : "regular",
                className: "shrink-0",
              })}
              <span>{tCategories("all")}</span>
              {activeCategorySlug === null && (
                <span
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground"
                  aria-hidden="true"
                />
              )}
            </button>

            {visibleCategoryTabs.map((category) => {
              const active = activeCategorySlug === category.slug
              return (
                <button
                  key={category.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onPrimaryTab(category.slug)}
                  className={getPrimaryTabClass(active)}
                >
                  {getCategoryIcon(category.slug, {
                    size: 16,
                    weight: active ? "fill" : "regular",
                    className: "shrink-0",
                  })}
                  <span className="whitespace-nowrap">{getCategoryLabel(category)}</span>
                  {active && (
                    <span
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}

            {overflowCategories.length > 0 && (
              <button
                type="button"
                data-testid="home-v4-more-categories-trigger"
                onClick={onCategoryPickerOpen}
                aria-label={tV4("actions.moreCategories")}
                className={getPrimaryTabClass(false, {
                  className: "border-l border-border-subtle",
                })}
              >
                <DotsThree size={18} className="shrink-0" />
                <span>{tV4("actions.moreCategories")}</span>
              </button>
            )}
          </div>
        </nav>

        <section
          data-testid="home-v4-secondary-rail"
          className="bg-background"
        >
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex w-max items-center gap-1.5 px-inset py-1.5">
              {activeCategorySlug === null ? (
                DISCOVERY_SCOPES.map((entry) => {
                  const active = scope === entry
                  return (
                    <button
                      key={entry}
                      type="button"
                      data-testid={`home-v4-scope-${entry}`}
                      aria-pressed={active}
                      onClick={() => onScopeSelect(entry)}
                      className={getPillClass(active)}
                    >
                      {tV4(`scopes.${entry}`)}
                    </button>
                  )
                })
              ) : (
                <>
                  <button
                    type="button"
                    aria-pressed={activeSubcategorySlug === null}
                    onClick={() => onSubcategoryPill(null)}
                    className={getPillClass(activeSubcategorySlug === null)}
                  >
                    {tCategories("all")}
                  </button>
                  {activeSubcategories.map((subcategory) => {
                    const active = activeSubcategorySlug === subcategory.slug
                    return (
                      <button
                        key={subcategory.slug}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSubcategoryPill(subcategory.slug)}
                        className={getPillClass(active)}
                      >
                        {getCategoryLabel(subcategory)}
                      </button>
                    )
                  })}
                </>
              )}

              <div aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-border-subtle" />

              {showBrowseOptionsTrigger && (
                <button
                  type="button"
                  data-testid="home-v4-browse-options-trigger"
                  onClick={onBrowseOptionsOpen}
                  className={ACTION_CHIP_CLASS}
                >
                  <DotsThree size={14} aria-hidden="true" />
                  <span>{tV4("actions.browseOptions")}</span>
                </button>
              )}

              <button
                type="button"
                data-testid="home-v4-filter-trigger"
                aria-pressed={hasActiveFilters}
                onClick={onFilterOpen}
                className={cn(ACTION_CHIP_CLASS, hasActiveFilters && "border-foreground")}
              >
                <FunnelSimple size={14} aria-hidden="true" />
                <span>{tV4("actions.filter")}</span>
                {hasActiveFilters && (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 py-0.5 text-2xs font-semibold text-background">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>

      <section
        data-testid="home-v4-context-banner"
        className="flex min-h-9 items-center justify-between gap-2 bg-surface-section-header px-inset py-2"
      >
        <h2 data-testid="home-v4-context-title" className="min-w-0 truncate text-sm font-semibold text-muted-foreground">
          {contextTitle}
        </h2>
        <Link
          href={fullBrowseHref}
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-muted-foreground tap-transparent transition-colors duration-fast ease-smooth hover:text-foreground active:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:rounded-sm"
        >
          <span>{tV4("actions.seeAll")}</span>
          <CaretRight size={12} className="shrink-0" aria-hidden="true" />
        </Link>
      </section>
    </>
  )
}
