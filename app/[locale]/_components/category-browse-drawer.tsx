"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "@/i18n/routing"
import { DrawerBody } from "@/components/ui/drawer"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { useCategoryDrawer } from "@/components/mobile/category-nav/category-drawer-context"
import { useHeaderOptional } from "@/components/providers/header-context"
import { getCategoryName } from "@/lib/data/categories/display"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import {
  MOBILE_SEGMENTED_CONTAINER_CLASS,
  getMobileSegmentedTriggerClass,
} from "@/components/mobile/chrome/mobile-control-recipes"
import { ArrowLeft, Search as MagnifyingGlass, X } from "lucide-react"

import { useTranslations } from "next-intl"
import type { CategoryTreeNode } from "@/lib/data/categories/types"

import { CategoryBrowseDrawerListingsTab } from "./category-browse-drawer/category-browse-drawer-listings-tab"
import { CategoryBrowseDrawerSellersTab } from "./category-browse-drawer/category-browse-drawer-sellers-tab"
import type {
  BrowseTab,
  CategoryBrowseDrawerProps,
  DrawerSeller,
} from "./category-browse-drawer/category-browse-drawer.types"

export type { CategoryBrowseDrawerProps } from "./category-browse-drawer/category-browse-drawer.types"

// =============================================================================
// Component
// =============================================================================

/**
 * Category browse drawer — opened from the bottom nav "Обяви" tab.
 *
 * Listings tab: segmented toggle, quick links, root grid + leaf list.
 * Sellers tab: top sellers list with avatars, search, "view all" link.
 * Uses DrawerShell for consistent header/close pattern.
 */
export function CategoryBrowseDrawer({
  locale,
  fetchChildren,
}: CategoryBrowseDrawerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const header = useHeaderOptional()
  const headerState = header?.headerState ?? null
  const t = useTranslations("CategoryDrawer")
  const tCommon = useTranslations("Common")
  const {
    isOpen,
    rootCategories,
    activeCategory,
    path,
    children,
    isLoading,
    openRoot,
    openCategory,
    close,
    setChildren,
    setLoading,
  } = useCategoryDrawer()
  const { counts: categoryCounts, refetch: refetchCategoryCounts } = useCategoryCounts({ enabled: isOpen })
  const [query, setQuery] = useState("")
  const [browseTab, setBrowseTab] = useState<BrowseTab>("listings")

  const homepageCategorySelect = useMemo(() => {
    const pathWithoutLocale = pathname.replace(/^\/(en|bg)/, "") || "/"
    const isHomepageRoute = pathWithoutLocale === "/" || pathWithoutLocale === ""
    if (!isHomepageRoute) return null
    if (headerState?.type !== "homepage") return null
    return headerState.value.onCategorySelect
  }, [headerState, pathname])

  // ── Sellers state ──
  const [sellers, setSellers] = useState<DrawerSeller[]>([])
  const [sellersLoading, setSellersLoading] = useState(false)
  const sellersFetchedRef = useRef(false)

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setQuery("")
      close()
    }
  }, [close])

  const fetchChildrenFallback = useCallback(async (parentId: string) => {
    try {
      const res = await fetch(`/api/categories/${parentId}/children`)
      if (!res.ok) return []
      const data = await res.json()
      return (data.children ?? []) as CategoryTreeNode[]
    } catch {
      return []
    }
  }, [])

  const fetchChildrenSafe = fetchChildren ?? fetchChildrenFallback

  // Fetch children when active category changes
  useEffect(() => {
    if (!activeCategory) return
    if (activeCategory.children && activeCategory.children.length > 0) {
      setChildren(activeCategory.children)
      return
    }
    setLoading(true)
    fetchChildrenSafe(activeCategory.id)
      .then((fetched) => setChildren(fetched))
      .catch(() => setChildren([]))
      .finally(() => setLoading(false))
  }, [activeCategory, fetchChildrenSafe, setChildren, setLoading])

  // Fetch sellers when sellers tab is activated
  useEffect(() => {
    if (browseTab !== "sellers" || sellersFetchedRef.current) return
    setSellersLoading(true)
    fetch("/api/seller/top")
      .then((res) => (res.ok ? res.json() : { sellers: [] }))
      .then((data) => {
        setSellers((data.sellers ?? []) as DrawerSeller[])
        sellersFetchedRef.current = true
      })
      .catch(() => setSellers([]))
      .finally(() => setSellersLoading(false))
  }, [browseTab])

  const rootCategory = path[0] ?? null
  const rootCategoryName = rootCategory ? getCategoryName(rootCategory, locale) : null
  const rootCategoryCount = rootCategory ? (categoryCounts[rootCategory.slug] ?? 0) : undefined
  const isAtRoot = !rootCategory

  const listItems = rootCategory ? children : rootCategories
  const normalizedQuery = query.trim().toLocaleLowerCase(locale)

  const filteredListItems = useMemo(() => {
    if (!normalizedQuery) return listItems
    return listItems.filter((cat) => {
      const localizedName = getCategoryName(cat, locale).toLocaleLowerCase(locale)
      return localizedName.includes(normalizedQuery)
    })
  }, [listItems, locale, normalizedQuery])

  const filteredSellers = useMemo(() => {
    if (!normalizedQuery) return sellers
    return sellers.filter((s) =>
      s.store_name.toLocaleLowerCase(locale).includes(normalizedQuery),
    )
  }, [sellers, locale, normalizedQuery])

  const handleNavigateToRootCategory = useCallback((rootSlug: string) => {
    setQuery("")
    close()
    router.push(`/categories/${rootSlug}`)
  }, [close, router])

  const handleNavigateToLeafCategory = useCallback((rootSlug: string, leafSlug: string) => {
    setQuery("")
    close()
    router.push(`/categories/${rootSlug}/${leafSlug}`)
  }, [close, router])

  const handleOpenScopedCategory = useCallback((category: CategoryTreeNode) => {
    setQuery("")
    if (homepageCategorySelect) {
      homepageCategorySelect(category.slug)
      close()
      return
    }
    openCategory(category)
  }, [close, homepageCategorySelect, openCategory])

  const handleNavigateToSearch = useCallback(() => {
    setQuery("")
    close()
    router.push("/search")
  }, [close, router])

  const handleNavigateToCategories = useCallback(() => {
    setQuery("")
    close()
    router.push("/categories")
  }, [close, router])

  const handleNavigateToSellers = useCallback(() => {
    setQuery("")
    close()
    router.push("/sellers")
  }, [close, router])

  const handleNavigateToSeller = useCallback((seller: DrawerSeller) => {
    setQuery("")
    close()
    if (seller.username) {
      router.push(`/${seller.username}`)
    } else {
      router.push("/sellers")
    }
  }, [close, router])

  const handleBackToRoot = useCallback(() => {
    setQuery("")
    openRoot()
  }, [openRoot])

  const handleSwitchTab = useCallback((tab: BrowseTab) => {
    setQuery("")
    setBrowseTab(tab)
  }, [])

  // Refetch counts on open
  useEffect(() => {
    if (!isOpen) return
    refetchCategoryCounts()
  }, [isOpen, refetchCategoryCounts])

  // Reset search and tab on open/category change
  useEffect(() => {
    if (!isOpen) return
    setQuery("")
    setBrowseTab("listings")
  }, [isOpen, rootCategory?.id])

  const headerText = useMemo(() => {
    if (browseTab === "sellers" && isAtRoot) return t("sellers")
    if (!rootCategory) return t("title")
    return getCategoryName(rootCategory, locale)
  }, [browseTab, isAtRoot, rootCategory, locale, t])

  const seeAllCategoryLabel = useMemo(() => {
    const baseName = rootCategoryName ?? headerText
    if (typeof rootCategoryCount !== "number") return t("seeAllIn", { category: baseName })
    return `${t("seeAllIn", { category: baseName })} (${rootCategoryCount.toLocaleString(locale)})`
  }, [rootCategoryName, headerText, rootCategoryCount, locale, t])

  const searchPlaceholder = browseTab === "sellers"
    ? t("searchSellersPlaceholder")
    : t("searchPlaceholder")

  return (
    <DrawerShell
      open={isOpen}
      onOpenChange={handleOpenChange}
      title={headerText}
      headerLayout="centered"
      closeLabel={t("close")}
      contentAriaLabel={t("ariaLabel")}
      description={t("description")}
      descriptionClassName="text-sm text-muted-foreground max-w-xs"
      contentClassName="max-h-dialog lg:hidden"
      headerClassName="border-border-subtle px-inset pt-4 pb-3"
      titleClassName="text-base font-semibold tracking-tight"
      closeButtonClassName="text-muted-foreground hover:text-foreground hover:bg-hover active:bg-active"
      closeIconSize={18}
      dataTestId="mobile-category-drawer"
      headerLeading={
        rootCategory ? (
          <IconButton
            aria-label={tCommon("back")}
            variant="ghost"
            size="icon-default"
            onClick={handleBackToRoot}
            className="-ml-1 text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </IconButton>
        ) : undefined
      }
      headerExtra={
        <div className="mt-3 space-y-3">
          {/* Listings / Sellers segmented toggle — root view only */}
          {isAtRoot && (
            <div
              className={MOBILE_SEGMENTED_CONTAINER_CLASS}
              role="tablist"
              aria-label={t("browseMode")}
            >
              <button
                type="button"
                role="tab"
                aria-selected={browseTab === "listings"}
                onClick={() => handleSwitchTab("listings")}
                className={getMobileSegmentedTriggerClass(browseTab === "listings")}
                data-testid="category-drawer-tab-listings"
              >
                {t("listings")}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={browseTab === "sellers"}
                onClick={() => handleSwitchTab("sellers")}
                className={getMobileSegmentedTriggerClass(browseTab === "sellers")}
                data-testid="category-drawer-tab-sellers"
              >
                {t("sellers")}
              </button>
            </div>
          )}

          {/* Search input */}
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-10 rounded-full border-border-subtle bg-surface-subtle pl-9 pr-9 text-sm"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-1.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active"
                aria-label={tCommon("clearSearch")}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      }
    >
      <DrawerBody data-testid="home-v4-category-picker" className="px-inset py-3">
        {browseTab === "sellers" ? (
          <CategoryBrowseDrawerSellersTab
            normalizedQuery={normalizedQuery}
            sellersLoading={sellersLoading}
            filteredSellers={filteredSellers}
            onNavigateToSeller={handleNavigateToSeller}
            onNavigateToSellers={handleNavigateToSellers}
            verifiedLabel={t("verified")}
            listingsLabel={t("listings")}
            viewAllSellersLabel={t("viewAllSellers")}
            noMatchesLabel={t("noMatches")}
            noSellersLabel={t("noSellers")}
          />
        ) : (
          <CategoryBrowseDrawerListingsTab
            locale={locale}
            isAtRoot={isAtRoot}
            normalizedQuery={normalizedQuery}
            isLoading={isLoading}
            filteredListItems={filteredListItems}
            categoryCounts={categoryCounts}
            rootCategory={rootCategory}
            seeAllCategoryLabel={seeAllCategoryLabel}
            onNavigateToSearch={handleNavigateToSearch}
            onNavigateToCategories={handleNavigateToCategories}
            onNavigateToRootCategory={handleNavigateToRootCategory}
            onNavigateToLeafCategory={handleNavigateToLeafCategory}
            onOpenScopedCategory={handleOpenScopedCategory}
            allListingsLabel={t("allListings")}
            categoriesLabel={t("categories")}
            noMatchesLabel={t("noMatches")}
            noSubcategoriesLabel={t("noSubcategories")}
            noCategoriesLabel={t("noCategories")}
          />
        )}
      </DrawerBody>
    </DrawerShell>
  )
}
