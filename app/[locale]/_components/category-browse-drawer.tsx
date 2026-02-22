"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "@/i18n/routing"
import {
  DrawerBody,
} from "@/components/ui/drawer"
import { Skeleton } from "@/components/ui/skeleton"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useCategoryDrawer } from "@/components/mobile/category-nav/category-drawer-context"
import { useHeaderOptional } from "@/components/providers/header-context"
import { getCategoryName } from "@/lib/data/categories/display"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { getCategoryIcon } from "@/components/shared/category-icons"
import {
  MOBILE_SEGMENTED_CONTAINER_CLASS,
  getMobileSegmentedTriggerClass,
} from "@/components/mobile/chrome/mobile-control-recipes"
import { ArrowLeft, ChevronRight as CaretRight, Search as MagnifyingGlass, Star, X } from "lucide-react"

import { useTranslations } from "next-intl"
import type { CategoryTreeNode } from "@/lib/data/categories/types"

// =============================================================================
// Types
// =============================================================================

type BrowseTab = "listings" | "sellers"

interface DrawerSeller {
  id: string
  username: string | null
  store_name: string
  description: string | null
  verified: boolean
  product_count: number
  total_rating: number | null
  avatar_url: string | null
}

export interface CategoryBrowseDrawerProps {
  /** Locale for name display */
  locale: string
  /** Callback to fetch children lazily */
  fetchChildren?: (parentId: string) => Promise<CategoryTreeNode[]>
}

// =============================================================================
// Shared styles
// =============================================================================

/** Full-width row item for subcategory lists (drilled-in view) */
const SUBCATEGORY_ROW =
  "flex w-full min-h-(--spacing-touch-md) items-center justify-between gap-2 rounded-xl border px-3.5 text-left text-sm font-medium tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
const SUBCATEGORY_ROW_DEFAULT =
  "border-border-subtle bg-background text-foreground hover:bg-hover active:bg-active"

/** Compact action chip for quick links */
const ACTION_CHIP =
  "inline-flex shrink-0 min-h-(--control-compact) items-center gap-1.5 rounded-full border border-border-subtle bg-surface-subtle px-3 text-xs font-semibold leading-none text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover hover:border-border active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"

// =============================================================================
// Subcomponents
// =============================================================================

/** Icon circle — clean monochromatic brand style (accent bg + primary icon) */
function CategoryIconCircle({ slug }: { slug: string }) {
  return (
    <span
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
      aria-hidden="true"
    >
      {getCategoryIcon(slug, { size: 20 })}
    </span>
  )
}

/** 2-col grid cell for a root category */
function CategoryGridCell({
  category,
  locale,
  count,
  onClick,
}: {
  category: CategoryTreeNode
  locale: string
  count?: number | undefined
  onClick: () => void
}) {
  const name = getCategoryName(category, locale)
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-2.5 rounded-xl border border-border-subtle bg-background p-2.5 text-left tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
    >
      <CategoryIconCircle slug={category.slug} />
      <div className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold leading-tight text-foreground">
          {name}
        </span>
        {typeof count === "number" && (
          <span className="mt-0.5 block text-2xs text-muted-foreground">
            {count.toLocaleString(locale)}
          </span>
        )}
      </div>
    </button>
  )
}

/** Compact seller card for the sellers tab */
function SellerDrawerCard({
  seller,
  onClick,
  verifiedLabel,
  listingsLabel,
}: {
  seller: DrawerSeller
  onClick: () => void
  verifiedLabel: string
  listingsLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-xl border border-border-subtle bg-background p-2.5 text-left tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
    >
      <UserAvatar
        name={seller.store_name}
        avatarUrl={seller.avatar_url}
        className="size-10 shrink-0"
        fallbackClassName="text-xs font-semibold"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-foreground">
            {seller.store_name}
          </span>
          {seller.verified && (
            <Badge variant="success-subtle" className="shrink-0">
              {verifiedLabel}
            </Badge>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2.5 text-2xs text-muted-foreground">
          <span>{seller.product_count} {listingsLabel}</span>
          {seller.total_rating != null && (
            <span className="inline-flex items-center gap-0.5">
              <Star size={10} className="fill-current text-rating" />
              {seller.total_rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <CaretRight size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
    </button>
  )
}

// =============================================================================
// Component
// =============================================================================

/**
 * Category browse drawer — opened from the bottom nav "Обяви" tab.
 *
 * Listings tab: segmented toggle, quick links, 2-col icon grid, drill-down.
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

  const handleNavigateToCategory = useCallback((slug: string) => {
    setQuery("")
    close()
    router.push(`/categories/${slug}`)
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
      <DrawerBody className="px-inset py-3">
        {browseTab === "sellers" ? (
          /* ============================================ */
          /* Sellers tab                                  */
          /* ============================================ */
          <>
            {sellersLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-xl border border-border-subtle bg-background p-2.5"
                  >
                    <Skeleton className="size-10 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredSellers.length > 0 ? (
              <div className="space-y-1.5">
                {filteredSellers.map((seller) => (
                  <SellerDrawerCard
                    key={seller.id}
                    seller={seller}
                    onClick={() => handleNavigateToSeller(seller)}
                    verifiedLabel={t("verified")}
                    listingsLabel={t("listings")}
                  />
                ))}

                {/* View all sellers link */}
                <button
                  type="button"
                  onClick={handleNavigateToSellers}
                  className={`${SUBCATEGORY_ROW} mt-2 border-foreground bg-foreground text-background`}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {t("viewAllSellers")}
                  </span>
                  <CaretRight size={16} className="shrink-0 opacity-60" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {normalizedQuery ? t("noMatches") : t("noSellers")}
                </p>
              </div>
            )}
          </>
        ) : (
          /* ============================================ */
          /* Listings (categories) tab                    */
          /* ============================================ */
          <>
            {/* Quick action chips — root view only, no active search */}
            {isAtRoot && !normalizedQuery && (
              <div className="mb-3 flex items-center gap-2">
                <button type="button" onClick={handleNavigateToSearch} className={ACTION_CHIP}>
                  {t("allListings")}
                </button>
                <button type="button" onClick={handleNavigateToCategories} className={ACTION_CHIP}>
                  {t("categories")}
                </button>
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-xl border border-border-subtle bg-background p-2.5"
                  >
                    <Skeleton className="size-10 rounded-xl" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-2 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isAtRoot ? (
              /* Root view — 2-column category grid */
              <div className="grid grid-cols-2 gap-2">
                {filteredListItems.map((cat) => (
                  <CategoryGridCell
                    key={cat.id}
                    category={cat}
                    locale={locale}
                    count={categoryCounts[cat.slug]}
                    onClick={() => handleOpenScopedCategory(cat)}
                  />
                ))}
              </div>
            ) : (
              /* Drilled view — subcategory list */
              <div className="space-y-1.5">
                {/* "See all in X" primary CTA */}
                {rootCategory && (
                  <button
                    type="button"
                    onClick={() => handleNavigateToCategory(rootCategory.slug)}
                    className={`${SUBCATEGORY_ROW} border-foreground bg-foreground text-background`}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {seeAllCategoryLabel}
                    </span>
                  </button>
                )}

                {filteredListItems.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleNavigateToCategory(cat.slug)}
                    className={`${SUBCATEGORY_ROW} ${SUBCATEGORY_ROW_DEFAULT}`}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {getCategoryName(cat, locale)}
                    </span>
                    <CaretRight size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && filteredListItems.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {normalizedQuery ? t("noMatches") : rootCategory ? t("noSubcategories") : t("noCategories")}
                </p>
              </div>
            )}

            {/* Footer quick nav — drilled view only */}
            {!isAtRoot && (
              <div className="mt-3 border-t border-border-subtle pt-3">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={handleNavigateToCategories} className={ACTION_CHIP}>
                    <span className="truncate">{t("categories")}</span>
                    <CaretRight size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </DrawerBody>
    </DrawerShell>
  )
}
