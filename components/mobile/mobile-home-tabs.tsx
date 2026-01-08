"use client"

import { useEffect, useState, useCallback } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import type { UIProduct } from "@/lib/data/products"
import { Link } from "@/i18n/routing"
import { CaretRight } from "@phosphor-icons/react"

// Import extracted components
import { useCategoryNavigation } from "@/hooks/use-category-navigation"
import {
  CategoryTabs,
  CategoryQuickPills,
  CategoryCircles,
  CategoryL3Pills,
  AllTabFilters,
  QuickFilterRow,
} from "./category-nav"
import { ProductFeed } from "@/components/shared/product/product-feed"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

interface MobileHomeTabsProps {
  initialProducts: UIProduct[]
  /** Which category slug the initialProducts are for. Defaults to "all" for homepage. */
  initialProductsSlug?: string
  /** Show the homepage-only "View all" link strip (defaults to true). */
  showViewAllLink?: boolean
  /** Categories with children from server (L0→L1→L2 pre-loaded, L3 lazy) */
  initialCategories?: Category[]
  defaultTab?: string | null
  defaultSubTab?: string | null
  defaultL2?: string | null
  defaultL3?: string | null
  showBanner?: boolean
  pageTitle?: string | null
  /** Hide the L0 sticky tab header (useful when a parent layout already provides tabs). */
  showL0Tabs?: boolean
  /** L0 navigation style: "tabs" (default underline tabs) or "pills" (compact quick pills) */
  l0Style?: "tabs" | "pills"
  /** Show the eBay-style quick filter row (All filters / Sort / priority pills). */
  showQuickFilters?: boolean
  /** Show deep L3 pills row (defaults to true). Category pages may disable this to reduce stacked controls. */
  showL3Pills?: boolean
  /**
   * When true, clicking L0 tabs navigates to a category page URL
   * (e.g. `/categories/{slug}`) instead of updating query params.
   */
  tabsNavigateToPages?: boolean
  /**
   * When true, clicking L1/L2 circles navigates to a category page URL
   * (e.g. `/categories/{slug}`) instead of drilling down within tabs.
   */
  circlesNavigateToPages?: boolean
  /** Locale from server - avoids useLocale() hydration issues */
  locale?: string
  /** Filterable attributes for the current category (for filter drawer) */
  filterableAttributes?: Array<{
    id: string
    category_id: string | null
    name: string
    name_bg: string | null
    attribute_type: "select" | "multiselect" | "boolean" | "number" | "text"
    options: string[] | null
    options_bg: string[] | null
    placeholder?: string | null
    placeholder_bg?: string | null
    is_filterable: boolean | null
    is_required: boolean | null
    sort_order: number | null
    validation_rules?: unknown | null
  }>
}

// =============================================================================
// Main Component
// =============================================================================

export function MobileHomeTabs({
  initialProducts,
  initialProductsSlug = "all",
  showViewAllLink = true,
  initialCategories = [],
  defaultTab = null,
  defaultSubTab = null,
  defaultL2 = null,
  defaultL3 = null,
  showBanner = true,
  pageTitle = null,
  showL0Tabs = true,
  l0Style = "tabs",
  showQuickFilters = false,
  showL3Pills = true,
  tabsNavigateToPages = false,
  circlesNavigateToPages = false,
  locale: localeProp,
  filterableAttributes = [],
}: MobileHomeTabsProps) {
  const intlLocale = useLocale()
  const locale = localeProp || intlLocale
  const [headerHeight, setHeaderHeight] = useState(0)

  // Filter state for "All" tab
  const [activeAllFilter, setActiveAllFilter] = useState<string>("newest")

  // Use the extracted navigation hook
  const nav = useCategoryNavigation({
    initialCategories,
    defaultTab,
    defaultSubTab,
    defaultL2,
    defaultL3,
    tabsNavigateToPages,
    l0Style,
    initialProducts,
    initialProductsSlug,
    locale,
    activeAllFilter,
  })

  // Measure header height for sticky positioning
  useEffect(() => {
    const header = document.querySelector("header")

    const update = () => {
      if (!(header instanceof HTMLElement)) {
        setHeaderHeight(0)
        return
      }

      // The site header is typically `position: sticky` and already occupies space
      // in normal document flow. Applying its height as a sticky `top` offset would
      // make our own sticky bars become "stuck" immediately and visually slide down.
      const headerPosition = getComputedStyle(header).position
      setHeaderHeight(
        headerPosition === "fixed" || headerPosition === "sticky"
          ? header.offsetHeight
          : 0
      )
    }

    update()

    // Header height can change after hydration (auth, country, subheader, etc.).
    // ResizeObserver keeps sticky offsets stable.
    const ro =
      header && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => update())
        : null

    if (ro && header) ro.observe(header)

    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
      ro?.disconnect()
    }
  }, [])

  // Handle All tab filter click
  const handleAllFilterClick = useCallback(
    (id: string) => {
      setActiveAllFilter(id)
      nav.setTabData((prev) => ({
        ...prev,
        all: { products: [], page: 0, hasMore: true },
      }))
    },
    [nav]
  )

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 1. Sticky Tabs Header (L0) - Two variants: tabs or pills */}
      {showL0Tabs && l0Style === "tabs" && (
        <CategoryTabs
          categories={initialCategories}
          activeTab={nav.activeTab}
          locale={locale}
          headerHeight={headerHeight}
          tabsNavigateToPages={tabsNavigateToPages}
          onTabChange={nav.handleTabChange}
        />
      )}

      {showL0Tabs && l0Style === "pills" && (
        <CategoryQuickPills
          categories={initialCategories}
          activeTab={nav.activeTab}
          locale={locale}
          headerHeight={headerHeight}
          tabsNavigateToPages={tabsNavigateToPages}
          onTabChange={nav.handleTabChange}
        />
      )}

      {/* 2. Seller Banner (All tab only) */}
      {showBanner && nav.isAllTab && (
        <StartSellingBanner locale={locale} variant="full-bleed" />
      )}

      {/* Optional Page Title (for category pages) */}
      {pageTitle && (
        <div className="bg-background px-(--page-inset) py-3 border-b border-border/40">
          <h1 className="text-lg font-bold">{pageTitle}</h1>
        </div>
      )}

      {/* 3. Subcategory Circles (L1 or L2) OR "All" Tab Quick Filters */}
      <div
        className={cn(
          "bg-background border-b border-border/30",
          "py-1.5"
        )}
      >
        {nav.isAllTab ? (
          <AllTabFilters
            activeFilter={activeAllFilter}
            locale={locale}
            onFilterClick={handleAllFilterClick}
          />
        ) : (
          <CategoryCircles
            circles={nav.circlesToDisplay}
            activeL1={nav.activeL1}
            activeL2={nav.activeL2}
            showL2Circles={nav.showL2Circles}
            locale={locale}
            circlesNavigateToPages={circlesNavigateToPages}
            activeTab={nav.activeTab}
            onCircleClick={nav.handleCircleClick}
            onBack={nav.handleBack}
          />
        )}
      </div>

      {/* 4. Deep Navigation Pills (L3) */}
      {showL3Pills && nav.showPills && (
        <CategoryL3Pills
          categories={nav.l3Categories}
          selectedPill={nav.selectedPill}
          locale={locale}
          isLoading={nav.isL3Loading}
          onPillClick={nav.handlePillClick}
          onAllClick={() => nav.setSelectedPill(null)}
        />
      )}

      {/* Quick Filter Pills (enabled per-page) */}
      {showQuickFilters && (
        <QuickFilterRow
          locale={locale}
          {...(nav.activeSlug !== "all" ? { categorySlug: nav.activeSlug } : {})}
          {...(() => {
            if (nav.selectedPill) {
              const id = nav.l3Categories.find((c) => c.slug === nav.selectedPill)?.id
              return id ? { categoryId: id } : {}
            }
            if (nav.activeL2 && nav.currentL2) return { categoryId: nav.currentL2.id }
            if (nav.activeL1 && nav.currentL1) return { categoryId: nav.currentL1.id }
            if (nav.activeTab !== "all" && nav.currentL0) return { categoryId: nav.currentL0.id }
            return {}
          })()}
          attributes={filterableAttributes}
          subcategories={nav.circlesToDisplay.map((c) => ({
            id: c.id,
            name: c.name,
            name_bg: c.name_bg,
            slug: c.slug,
          }))}
          {...(nav.activeCategoryName ? { categoryName: nav.activeCategoryName } : {})}
        />
      )}

      {/* "View all" link - homepage-only helper to jump into /categories/[slug]. */}
      {showViewAllLink &&
        initialProductsSlug === "all" &&
        l0Style === "tabs" &&
        !tabsNavigateToPages &&
        !nav.isAllTab &&
        nav.activeSlug !== "all" && (
        <div className="bg-background px-(--page-inset) pt-2 pb-3 border-b border-border/40">
          <Link
            href={`/categories/${nav.activeSlug}`}
            aria-label={locale === "bg" ? "Виж всички" : "View all"}
            className={cn(
              "w-full",
              "h-8 rounded-lg",
              "inline-flex items-center justify-between gap-2",
              "bg-secondary text-secondary-foreground",
              "border border-border/50",
              "px-3",
              "text-xs font-medium",
              "hover:bg-secondary/80",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            )}
          >
            <span className="whitespace-nowrap">
              {locale === "bg" ? "Виж всички" : "View all"}
            </span>
            <CaretRight size={14} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      )}

      {/* 5. Product Feed */}
      <ProductFeed
        products={nav.activeFeed.products}
        hasMore={nav.activeFeed.hasMore}
        isLoading={nav.isLoading}
        activeSlug={nav.activeSlug}
        locale={locale}
        isAllTab={nav.isAllTab}
        activeCategoryName={nav.activeCategoryName}
        onLoadMore={nav.loadMoreProducts}
      />
    </div>
  )
}
