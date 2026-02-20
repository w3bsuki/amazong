"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "@/i18n/routing"
import {
  DrawerBody,
} from "@/components/ui/drawer"
import { Skeleton } from "@/components/ui/skeleton"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { useCategoryDrawer } from "@/components/mobile/category-nav/category-drawer-context"
import { getCategoryName } from "@/lib/category-display"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { ArrowLeft, ChevronRight as CaretRight, Search as MagnifyingGlass, X } from "lucide-react"

import { useTranslations } from "next-intl"
import type { CategoryTreeNode } from "@/lib/category-tree"

// =============================================================================
// Types
// =============================================================================

export interface CategoryBrowseDrawerProps {
  /** Locale for name display */
  locale: string
  /** Callback to fetch children lazily */
  fetchChildren?: (parentId: string) => Promise<CategoryTreeNode[]>
}

// =============================================================================
// Shared styles — matches browse-options drawer pattern
// =============================================================================

const OPTION_BASE =
  "flex w-full min-h-(--spacing-touch-md) items-center justify-between gap-2 rounded-xl border px-3.5 text-left text-sm font-medium tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
const OPTION_DEFAULT =
  "border-border-subtle bg-background text-foreground hover:bg-hover active:bg-active"

const FOOTER_CHIP =
  "inline-flex min-h-(--control-default) items-center gap-1.5 rounded-xl border border-border-subtle bg-background px-3 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"

// =============================================================================
// Component
// =============================================================================

/**
 * Category browse drawer — opened from the bottom nav "Обяви" tab.
 * Shows L1 categories; tapping one drills into subcategories.
 * Uses DrawerShell for consistent header/close pattern.
 */
export function CategoryBrowseDrawer({
  locale,
  fetchChildren,
}: CategoryBrowseDrawerProps) {
  const router = useRouter()
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

  const rootCategory = path[0] ?? null
  const rootCategoryName = rootCategory ? getCategoryName(rootCategory, locale) : null
  const rootCategoryCount = rootCategory ? (categoryCounts[rootCategory.slug] ?? 0) : undefined

  const listItems = rootCategory ? children : rootCategories
  const normalizedQuery = query.trim().toLocaleLowerCase(locale)

  const filteredListItems = useMemo(() => {
    if (!normalizedQuery) return listItems
    return listItems.filter((cat) => {
      const localizedName = getCategoryName(cat, locale).toLocaleLowerCase(locale)
      return localizedName.includes(normalizedQuery)
    })
  }, [listItems, locale, normalizedQuery])

  const handleNavigateToCategory = useCallback((slug: string) => {
    setQuery("")
    close()
    router.push(`/categories/${slug}`)
  }, [close, router])

  const handleOpenScopedCategory = useCallback((category: CategoryTreeNode) => {
    setQuery("")
    openCategory(category)
  }, [openCategory])

  const handleNavigateToSearch = useCallback(() => {
    setQuery("")
    close()
    router.push("/search")
  }, [close, router])

  const handleNavigateToSellers = useCallback(() => {
    setQuery("")
    close()
    router.push("/sellers")
  }, [close, router])

  const handleBackToRoot = useCallback(() => {
    setQuery("")
    openRoot()
  }, [openRoot])

  const formatCategoryWithCount = useCallback((name: string, count?: number) => {
    if (typeof count !== "number") return name
    return `${name} (${count.toLocaleString(locale)})`
  }, [locale])

  // Refetch counts on open
  useEffect(() => {
    if (!isOpen) return
    refetchCategoryCounts()
  }, [isOpen, refetchCategoryCounts])

  // Reset search on open/category change
  useEffect(() => {
    if (!isOpen) return
    setQuery("")
  }, [isOpen, rootCategory?.id])

  const headerText = useMemo(() => {
    if (!rootCategory) return t("title")
    return getCategoryName(rootCategory, locale)
  }, [rootCategory, locale, t])

  const seeAllCategoryLabel = useMemo(() => {
    const baseName = rootCategoryName ?? headerText
    return formatCategoryWithCount(baseName, rootCategoryCount)
  }, [rootCategoryName, headerText, rootCategoryCount, formatCategoryWithCount])

  // Search always available — users may want to jump to a specific category
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
      contentClassName="lg:hidden"
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
        <div className="relative mt-3">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchAriaLabel")}
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
      }
    >
      <DrawerBody className="px-inset py-3">
        {/* Category list */}
        {isLoading ? (
          <div className="space-y-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`${OPTION_BASE} border-border-subtle bg-background`}
              >
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {/* "See all" button at top when drilled into a category */}
            {rootCategory && (
              <button
                type="button"
                onClick={() => handleNavigateToCategory(rootCategory.slug)}
                className={`${OPTION_BASE} border-foreground bg-foreground text-background`}
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
                onClick={() =>
                  rootCategory ? handleNavigateToCategory(cat.slug) : handleOpenScopedCategory(cat)
                }
                className={`${OPTION_BASE} ${OPTION_DEFAULT}`}
              >
                <span className="min-w-0 flex-1 truncate">
                  {rootCategory
                    ? getCategoryName(cat, locale)
                    : formatCategoryWithCount(getCategoryName(cat, locale), categoryCounts[cat.slug])}
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

        {/* Footer nav chips — same pattern as browse-options */}
        <div className="mt-3 border-t border-border-subtle pt-3">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={handleNavigateToSearch} className={FOOTER_CHIP}>
              <span className="truncate">{t("allListings")}</span>
              <CaretRight size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
            <button type="button" onClick={handleNavigateToSellers} className={FOOTER_CHIP}>
              <span className="truncate">{t("topSellers")}</span>
              <CaretRight size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>
        </div>
      </DrawerBody>
    </DrawerShell>
  )
}
