"use client";

import { useEffect } from "react";
import type { CategoryTreeNode } from "@/lib/category-tree";
import type { UIProduct } from "@/lib/data/products";
import type { CategoryAttribute } from "@/lib/data/categories";
import { useRouter } from "@/i18n/routing";
import { useHeader } from "@/components/providers/header-context";
import { useInstantCategoryBrowse } from "@/hooks/use-instant-category-browse";
import { ProductFeed } from "./product-feed";
import { PageShell } from "../../../../../_components/page-shell";
import { MobileFilterControls } from "../../../../_components/filters/mobile-filter-controls";

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

      <MobileFilterControls
        locale={locale}
        attributes={instant.attributes.length ? instant.attributes : filterableAttributes}
        {...(instant.categorySlug !== "all" ? { categorySlug: instant.categorySlug } : {})}
        {...(instant.categoryId ? { categoryId: instant.categoryId } : {})}
        subcategories={(instant.children.length ? instant.children : contextualSubcategories).map((child) => ({
          id: child.id,
          name: child.name,
          name_bg: child.name_bg,
          slug: child.slug,
        }))}
        {...(instant.activeCategoryName ? { categoryName: instant.activeCategoryName } : {})}
        basePath={`/categories/${instant.categorySlug}`}
        appliedSearchParams={instant.appliedSearchParams}
        onApply={handleApplyFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
        stickyTop="var(--app-header-offset)"
        sticky={true}
        className="z-30"
      />

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
    </PageShell>
  );
}

export type { MobileCategoryBrowserContextualProps };

