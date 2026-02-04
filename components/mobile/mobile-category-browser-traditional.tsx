"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { CategoryTreeNode } from "@/lib/category-tree";
import type { UIProduct } from "@/lib/data/products";
import type { CategoryAttribute } from "@/lib/data/categories";
import { StartSellingBanner } from "@/components/sections/start-selling-banner";
import { useCategoryNavigation } from "@/hooks/use-category-navigation";
import {
  CategoryTabs,
  CategoryQuickPills,
  CategoryCircles,
  AllTabFilters,
  QuickFilterRow,
  FilterSortBar,
} from "./category-nav";
import { ProductFeed } from "@/components/shared/product/product-feed";
import { FilterHub } from "@/components/shared/filters/filter-hub";
import { FilterChips } from "@/components/shared/filters/filter-chips";
import { PageShell } from "@/components/shared/page-shell";

type Category = CategoryTreeNode;

interface MobileCategoryBrowserTraditionalProps {
  locale: string;
  initialProducts: UIProduct[];
  /** Which category slug the initialProducts are for. Defaults to "all" for homepage. */
  initialProductsSlug: string;
  /** Show the homepage-only "View all" link strip (defaults to true). */
  showViewAllLink: boolean;
  /** Categories with children from server (L0→L1→L2 pre-loaded, L3 lazy) */
  initialCategories: Category[];
  defaultTab: string | null;
  defaultSubTab: string | null;
  defaultL2: string | null;
  defaultL3: string | null;
  showBanner: boolean;
  pageTitle: string | null;
  /** Hide the L0 sticky tab header (useful when a parent layout already provides tabs). */
  showL0Tabs: boolean;
  /** L0 navigation style: "tabs" (default underline tabs) or "pills" (compact quick pills) */
  l0Style: "tabs" | "pills";
  /** Show the eBay-style quick filter row (All filters / Sort / priority pills). */
  showQuickFilters: boolean;
  /** Show inline filter/sort bar (demo-style 50/50 split). Cleaner than quickFilters. */
  showInlineFilters: boolean;
  /**
   * When true, clicking L0 tabs navigates to a category page URL
   * (e.g. `/categories/{slug}`) instead of updating query params.
   */
  tabsNavigateToPages: boolean;
  /**
   * When true, clicking L1/L2 circles navigates to a category page URL
   * (e.g. `/categories/{slug}`) instead of drilling down within tabs.
   */
  circlesNavigateToPages: boolean;
  /** Filterable attributes for the current category (for filter drawer) */
  filterableAttributes: CategoryAttribute[];
}

export function MobileCategoryBrowserTraditional({
  locale,
  initialProducts,
  initialProductsSlug,
  showViewAllLink: _showViewAllLink,
  initialCategories,
  defaultTab,
  defaultSubTab,
  defaultL2,
  defaultL3,
  showBanner,
  pageTitle,
  showL0Tabs,
  l0Style,
  showQuickFilters,
  showInlineFilters,
  tabsNavigateToPages,
  circlesNavigateToPages,
  filterableAttributes,
}: MobileCategoryBrowserTraditionalProps) {
  const [headerHeight, setHeaderHeight] = useState(0);

  // Filter state for "All" tab
  const [activeAllFilter, setActiveAllFilter] = useState<string>("newest");

  // Filter Hub state (inline filter mode)
  const [filterHubOpen, setFilterHubOpen] = useState(false);

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
  });

  // Measure header height for sticky positioning (before paint to avoid overlap/jank)
  useLayoutEffect(() => {
    // Be precise: multiple components may render <header> tags.
    // The site header marks itself as hydrated, so prefer that.
    const header =
      document.querySelector('header[data-hydrated="true"]') || document.querySelector("header");

    const update = () => {
      if (!(header instanceof HTMLElement)) {
        setHeaderHeight(0);
        return;
      }

      // The site header is typically `position: sticky` and already occupies space
      // in normal document flow. Applying its height as a sticky `top` offset would
      // make our own sticky bars become "stuck" immediately and visually slide down.
      const headerPosition = getComputedStyle(header).position;
      setHeaderHeight(headerPosition === "fixed" || headerPosition === "sticky" ? header.offsetHeight : 0);
    };

    update();

    // Header height can change after hydration (auth, country, subheader, etc.).
    // ResizeObserver keeps sticky offsets stable.
    const ro = header && typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => update()) : null;

    if (ro && header) ro.observe(header);

    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, []);

  // Handle All tab filter click
  const handleAllFilterClick = useCallback(
    (id: string) => {
      setActiveAllFilter(id);
      nav.setTabData((prev) => ({
        ...prev,
        all: { products: [], page: 0, hasMore: true },
      }));
    },
    [nav]
  );

  return (
    <PageShell variant="muted" className="w-full">
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
        <div className="mt-2">
          <StartSellingBanner locale={locale} variant="full-bleed" />
        </div>
      )}

      {/* Optional Page Title (for category pages) */}
      {pageTitle && (
        <div className="bg-background px-inset py-3 border-b border-border/40">
          <h1 className="text-lg font-bold">{pageTitle}</h1>
        </div>
      )}

      {/* 3. Subcategory Circles (L1 or L2) OR "All" Tab Quick Filters */}
      <div className={cn("bg-background", !nav.isDrilledDown && "py-1")}>
        {nav.isAllTab ? (
          <AllTabFilters activeFilter={activeAllFilter} locale={locale} onFilterClick={handleAllFilterClick} />
        ) : (
          <CategoryCircles
            circles={nav.circlesToDisplay}
            activeL1={nav.activeL1}
            activeL2={nav.activeL2}
            activeL2Category={nav.currentL2 ?? null}
            activeCategoryName={nav.activeCategoryName}
            showL2Circles={nav.showL2Circles}
            isDrilledDown={nav.isDrilledDown}
            l3Categories={nav.l3Categories}
            selectedPill={nav.selectedPill}
            isL3Loading={nav.isL3Loading}
            locale={locale}
            circlesNavigateToPages={circlesNavigateToPages}
            activeTab={nav.activeTab}
            onCircleClick={nav.handleCircleClick}
            onBack={nav.handleBack}
            onPillClick={nav.handlePillClick}
            onAllPillClick={() => nav.setSelectedPill(null)}
          />
        )}
      </div>

      {/* Quick Filter Pills (enabled per-page) */}
      {showQuickFilters && (
        <QuickFilterRow
          locale={locale}
          {...(nav.activeSlug !== "all" ? { categorySlug: nav.activeSlug } : {})}
          {...(() => {
            if (nav.selectedPill) {
              const id = nav.l3Categories.find((c) => c.slug === nav.selectedPill)?.id;
              return id ? { categoryId: id } : {};
            }
            if (nav.activeL2 && nav.currentL2) return { categoryId: nav.currentL2.id };
            if (nav.activeL1 && nav.currentL1) return { categoryId: nav.currentL1.id };
            if (nav.activeTab !== "all" && nav.currentL0) return { categoryId: nav.currentL0.id };
            return {};
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

      {/* Inline Filter Bar (demo-style 50/50 split: Filters | Sort) */}
      {showInlineFilters && (
        <FilterSortBar
          locale={locale}
          onAllFiltersClick={() => setFilterHubOpen(true)}
          attributes={filterableAttributes}
          sticky={false}
        />
      )}

      {/* Active Filter Chips (Tiny Badges) */}
      <div className="bg-background px-inset pb-1">
        <FilterChips />
      </div>

      {/* Product Feed */}
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

      {/* FilterHub Drawer (for inline filter mode) */}
      {showInlineFilters && (
        <FilterHub
          open={filterHubOpen}
          onOpenChange={setFilterHubOpen}
          locale={locale}
          {...(nav.activeSlug !== "all" ? { categorySlug: nav.activeSlug } : {})}
          {...(() => {
            if (nav.selectedPill) {
              const id = nav.l3Categories.find((c) => c.slug === nav.selectedPill)?.id;
              return id ? { categoryId: id } : {};
            }
            if (nav.activeL2 && nav.currentL2) return { categoryId: nav.currentL2.id };
            if (nav.activeL1 && nav.currentL1) return { categoryId: nav.currentL1.id };
            if (nav.activeTab !== "all" && nav.currentL0) return { categoryId: nav.currentL0.id };
            return {};
          })()}
          attributes={filterableAttributes}
          mode="full"
          initialSection={null}
        />
      )}
    </PageShell>
  );
}

export type { MobileCategoryBrowserTraditionalProps };
