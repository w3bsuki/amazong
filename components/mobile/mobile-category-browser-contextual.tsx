"use client";

import { useEffect, useState } from "react";
import type { CategoryTreeNode } from "@/lib/category-tree";
import type { UIProduct } from "@/lib/data/products";
import type { CategoryAttribute } from "@/lib/data/categories";
import { useRouter } from "@/i18n/routing";
import { useHeader } from "@/components/providers/header-context";
import { useInstantCategoryBrowse } from "@/hooks/use-instant-category-browse";
import { FilterSortBar } from "./category-nav";
import { FilterHub } from "@/components/shared/filters/filter-hub";
import { FilterChips } from "@/components/shared/filters/filter-chips";
import { ProductFeed } from "@/components/shared/product/product-feed";
import { PageShell } from "@/components/shared/page-shell";

type Category = CategoryTreeNode;

interface MobileCategoryBrowserContextualProps {
  locale: string;
  initialProducts: UIProduct[];
  /** Which category slug the initialProducts are for. Defaults to "all" for homepage. */
  initialProductsSlug: string;
  /**
   * Current category name for contextual header (localized).
   * Required when contextualMode is true.
   */
  contextualCategoryName?: string;
  /**
   * Back navigation href for contextual header.
   * Defaults to parent category or /categories.
   */
  contextualBackHref?: string;
  /**
   * Subcategories to display as horizontal pills in contextual mode.
   * Replaces circles for compact navigation.
   */
  contextualSubcategories: Category[];
  /** Filterable attributes for the current category (for filter drawer) */
  filterableAttributes: CategoryAttribute[];
  /** Current category ID for filter context. */
  categoryId?: string;
  /**
   * Parent category of the current category.
   * Used to determine if we're on L0 (null), L1 (parent is L0), or deeper.
   */
  parentCategory?: {
    id: string;
    slug: string;
    parent_id: string | null;
    name?: string;
    name_bg?: string | null;
  } | null;
}

export function MobileCategoryBrowserContextual({
  locale,
  initialProducts,
  initialProductsSlug,
  contextualCategoryName,
  contextualBackHref,
  contextualSubcategories,
  filterableAttributes,
  categoryId,
  parentCategory,
}: MobileCategoryBrowserContextualProps) {
  const router = useRouter();
  const { setContextualHeader } = useHeader();

  // Filter Hub state
  const [filterHubOpen, setFilterHubOpen] = useState(false);

  const contextualInitialTitle = contextualCategoryName || "";

  // Convert CategoryTreeNode[] to CategoryLite[] for the hook
  const initialChildrenForHook = contextualSubcategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    name_bg: cat.name_bg,
    slug: cat.slug,
    parent_id: cat.parent_id ?? null,
    icon: cat.icon ?? null,
    image_url: cat.image_url ?? null,
  }));

  const instant = useInstantCategoryBrowse({
    enabled: true,
    locale,
    initialSlug: initialProductsSlug,
    initialTitle: contextualInitialTitle,
    initialCategoryId: categoryId,
    initialParent: parentCategory
      ? {
          id: parentCategory.id,
          slug: parentCategory.slug,
          parent_id: parentCategory.parent_id,
          name: parentCategory.name ?? parentCategory.slug,
          name_bg: parentCategory.name_bg ?? null,
        }
      : null,
    initialChildren: initialChildrenForHook,
    initialAttributes: filterableAttributes,
    initialProducts,
  });

  const backHref = contextualBackHref || `/categories`;

  const handleBack = async () => {
    // Use instant client-side navigation (no page reload)
    if (instant.parent?.slug) {
      await instant.setCategorySlug(instant.parent.slug, { clearAttrFilters: true });
      return;
    }
    // Only use router.push for going back to /categories index (no parent)
    router.push(backHref);
  };

  // Use instant client-side navigation for circle clicks
  const handleCircleClick = async (cat: CategoryTreeNode) => {
    if (cat?.slug) {
      await instant.setCategorySlug(cat.slug, { clearAttrFilters: true });
    }
  };

  const handleApplyFilters = async (next: { queryString: string; finalPath: string }) => {
    // finalPath is ignored in instant mode; URL sync is handled by the hook.
    const params = new URLSearchParams(next.queryString);
    await instant.setFilters(params);
  };

  // Remove a single filter (for FilterChips in instant mode)
  const handleRemoveFilter = async (key: string, key2?: string) => {
    const params = new URLSearchParams(instant.appliedSearchParams?.toString() ?? "");
    params.delete(key);
    if (key2) params.delete(key2);
    await instant.setFilters(params);
  };

  // Clear all filters
  const handleClearAllFilters = async () => {
    await instant.setFilters(new URLSearchParams());
  };

  // Provide contextual header state to layout via context
  useEffect(() => {
    setContextualHeader({
      title: instant.categoryTitle || contextualInitialTitle,
      backHref,
      onBack: handleBack,
      activeSlug: instant.activeSlug,
      subcategories: instant.children.length ? instant.children : contextualSubcategories,
      onSubcategoryClick: handleCircleClick,
    });
    return () => setContextualHeader(null);
  }, [
    instant.categoryTitle,
    contextualInitialTitle,
    backHref,
    instant.activeSlug,
    instant.children,
    contextualSubcategories,
    setContextualHeader,
  ]);

  return (
    <PageShell variant="muted" className="w-full">
      {/* Header is rendered by layout with variant="contextual" */}

      {/* Inline Filter Bar (50/50 split: Filters | Sort) */}
      <FilterSortBar
        locale={locale}
        onAllFiltersClick={() => setFilterHubOpen(true)}
        attributes={instant.attributes.length ? instant.attributes : filterableAttributes}
        appliedSearchParams={instant.appliedSearchParams}
        stickyTop="var(--app-header-offset)"
        sticky={true}
        className="z-30"
      />

      {/* Active Filter Chips (removable pills) */}
      <div className="bg-background px-inset py-1">
        <FilterChips
          appliedSearchParams={instant.appliedSearchParams}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
      </div>

      {/* Product Feed */}
      <ProductFeed
        products={instant.feed.products}
        hasMore={instant.feed.hasMore}
        isLoading={instant.isLoading}
        activeSlug={instant.activeSlug}
        locale={locale}
        isAllTab={false}
        activeCategoryName={instant.activeCategoryName}
        onLoadMore={instant.loadMore}
        showLoadingOverlay={true}
      />

      {/* FilterHub Drawer (fallback for complex filters) */}
      <FilterHub
        open={filterHubOpen}
        onOpenChange={setFilterHubOpen}
        locale={locale}
        {...(instant.categorySlug !== "all" ? { categorySlug: instant.categorySlug } : {})}
        {...(instant.categoryId ? { categoryId: instant.categoryId } : {})}
        attributes={instant.attributes.length ? instant.attributes : filterableAttributes}
        appliedSearchParams={instant.appliedSearchParams}
        onApply={handleApplyFilters}
        mode="full"
        initialSection={null}
      />
    </PageShell>
  );
}

export type { MobileCategoryBrowserContextualProps };
