"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { CategoryTreeNode } from "@/lib/category-tree";
import type { UIProduct } from "@/lib/data/products";
import type { CategoryAttribute } from "@/lib/data/categories";
import { CaretRight } from "@/lib/icons/phosphor";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useHeader } from "@/components/providers/header-context";
import { useInstantCategoryBrowse } from "@/hooks/use-instant-category-browse";
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display";
import {
  getCategoryAttributeKey,
  getCategoryAttributeLabel,
  getCategoryAttributeOptions,
} from "@/lib/filters/category-attribute";
import { ProductFeed } from "./product-feed";
import { PageShell } from "../../../../../_components/page-shell";
import {
  MobileFilterControls,
  type QuickAttributePill,
} from "../../../../_components/filters/mobile-filter-controls";
import { getFilterPillsForCategory } from "../../_lib/filter-priority";
import { ACTION_CHIP_CLASS } from "../../../../_lib/mobile-rail-class-recipes";

type Category = CategoryTreeNode;
const MOBILE_FEED_FRAME_CLASS = "mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe";
const MAX_QUICK_ATTRIBUTE_PILLS = 5;

function buildQuickAttributePills(options: {
  locale: string;
  categorySlug: string;
  attributes: CategoryAttribute[];
  appliedSearchParams: URLSearchParams;
}): QuickAttributePill[] {
  const { locale, categorySlug, attributes, appliedSearchParams } = options;
  if (attributes.length === 0) return [];

  const withOptions = attributes.filter((attr) => {
    const attrOptions = getCategoryAttributeOptions(attr, locale);
    return (
      attr.is_filterable &&
      (attr.attribute_type === "select" || attr.attribute_type === "multiselect") &&
      Array.isArray(attrOptions) &&
      attrOptions.length > 0
    );
  });
  if (withOptions.length === 0) return [];

  const priorityKeys = getFilterPillsForCategory(categorySlug, withOptions).filter(
    (key) => key !== "price" && key !== "category"
  );

  const ordered: CategoryAttribute[] = [];
  const used = new Set<string>();

  for (const priorityKey of priorityKeys) {
    const match = withOptions.find(
      (attr) => getCategoryAttributeKey(attr) === priorityKey
    );
    if (!match) continue;
    used.add(match.id);
    ordered.push(match);
  }

  for (const attr of withOptions) {
    if (used.has(attr.id)) continue;
    ordered.push(attr);
  }

  return ordered.slice(0, MAX_QUICK_ATTRIBUTE_PILLS).map((attr) => {
    const attrKey = getCategoryAttributeKey(attr);
    const selectedCount = appliedSearchParams.getAll(`attr_${attrKey}`).filter(Boolean).length;
    return {
      sectionId: `attr_${attr.id}`,
      label: getCategoryAttributeLabel(attr, locale),
      active: selectedCount > 0,
      ...(selectedCount > 0 ? { selectedCount } : {}),
    };
  });
}

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
  const tCategories = useTranslations("Categories");
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

  // Route-level parent is stable while instant browsing updates transient context.
  const routeParentContext = useMemo(
    () =>
      parentCategory
        ? {
            id: parentCategory.id,
            slug: parentCategory.slug,
            parent_id: parentCategory.parent_id,
            name: parentCategory.name ?? parentCategory.slug,
            name_bg: parentCategory.name_bg ?? null,
          }
        : null,
    [parentCategory]
  );

  const instant = useInstantCategoryBrowse({
    enabled: true,
    locale,
    initialSlug: initialProductsSlug,
    initialTitle: contextualInitialTitle,
    initialCategoryId: categoryId,
    initialParent: routeParentContext,
    initialChildren: initialChildrenForHook,
    initialAttributes: filterableAttributes,
    initialProducts,
  });

  const fallbackParentHref = routeParentContext?.slug
    ? `/categories/${routeParentContext.slug}`
    : null;
  const backHref = contextualBackHref || fallbackParentHref || `/categories`;
  const categoryNavigationRef = useRef({
    parentSlug: instant.parent?.slug ?? null,
    fallbackParentHref,
    backHref,
    setCategorySlug: instant.setCategorySlug,
  });

  const routeParentContextName = routeParentContext
    ? tCategories("shortName", {
        slug: getCategorySlugKey(routeParentContext.slug),
        name: getCategoryName(routeParentContext, locale),
      })
    : null;
  const showParentContextBanner = Boolean(routeParentContext?.slug && routeParentContextName);
  const effectiveAttributes = instant.attributes.length ? instant.attributes : filterableAttributes;

  const quickAttributePills = useMemo(
    () =>
      buildQuickAttributePills({
        locale,
        categorySlug: instant.categorySlug,
        attributes: effectiveAttributes,
        appliedSearchParams: new URLSearchParams(
          instant.appliedSearchParams?.toString() ?? ""
        ),
      }),
    [effectiveAttributes, instant.appliedSearchParams, instant.categorySlug, locale]
  );

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

  const handleViewAllInParent = async () => {
    if (!routeParentContext?.slug) return;
    await instant.setCategorySlug(routeParentContext.slug, { clearAttrFilters: true });
  };

  useEffect(() => {
    categoryNavigationRef.current = {
      parentSlug: instant.parent?.slug ?? null,
      fallbackParentHref,
      backHref,
      setCategorySlug: instant.setCategorySlug,
    };
  }, [backHref, fallbackParentHref, instant.parent?.slug, instant.setCategorySlug]);

  const handleBack = useCallback(async () => {
    const navigation = categoryNavigationRef.current;
    if (navigation.parentSlug) {
      await navigation.setCategorySlug(navigation.parentSlug, { clearAttrFilters: true });
      return;
    }
    if (navigation.fallbackParentHref) {
      router.push(navigation.fallbackParentHref);
      return;
    }
    router.push(navigation.backHref);
  }, [router]);

  const handleCircleClick = useCallback(async (cat: CategoryTreeNode) => {
    if (cat?.slug) {
      await categoryNavigationRef.current.setCategorySlug(cat.slug, { clearAttrFilters: true });
    }
  }, []);

  const headerSubcategories = useMemo(
    () => (instant.children.length ? instant.children : contextualSubcategories),
    [instant.children, contextualSubcategories]
  );
  const headerSubcategorySignature = useMemo(
    () => headerSubcategories.map((cat) => `${cat.id}:${cat.slug}`).join("|"),
    [headerSubcategories]
  );
  const headerSubcategoriesRef = useRef<CategoryTreeNode[]>(headerSubcategories);

  useEffect(() => {
    headerSubcategoriesRef.current = headerSubcategories;
  });

  // Provide contextual header state to layout via context
  useEffect(() => {
    setContextualHeader({
      title: instant.categoryTitle || contextualInitialTitle,
      backHref,
      onBack: handleBack,
      activeSlug: instant.activeSlug,
      subcategories: headerSubcategoriesRef.current,
      onSubcategoryClick: handleCircleClick,
    });
  }, [
    backHref,
    contextualInitialTitle,
    handleBack,
    handleCircleClick,
    headerSubcategorySignature,
    instant.activeSlug,
    instant.categoryTitle,
    setContextualHeader,
  ]);

  useEffect(() => {
    return () => setContextualHeader(null);
  }, [setContextualHeader]);

  return (
    <PageShell variant="muted" className="w-full">
      {/* Header is rendered by layout with variant="contextual" */}
      <div className={MOBILE_FEED_FRAME_CLASS}>
        {showParentContextBanner && routeParentContextName && (
          <div className="px-inset pt-1.5">
            <button
              type="button"
              onClick={handleViewAllInParent}
              className={`${ACTION_CHIP_CLASS} w-full min-h-(--control-default) justify-between gap-2 rounded-xl px-3 text-left touch-manipulation`}
            >
              <span className="min-w-0 truncate text-xs font-semibold text-foreground">
                {tCategories("allIn", { category: routeParentContextName })}
              </span>
              <CaretRight size={14} weight="bold" className="shrink-0 text-muted-foreground" />
            </button>
          </div>
        )}

        <MobileFilterControls
          locale={locale}
          attributes={effectiveAttributes}
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
          quickAttributePills={quickAttributePills}
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
      </div>
    </PageShell>
  );
}

export type { MobileCategoryBrowserContextualProps };

