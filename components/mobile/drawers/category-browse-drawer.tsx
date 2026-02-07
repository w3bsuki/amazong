"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "@/i18n/routing"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Skeleton } from "@/components/ui/skeleton"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCategoryDrawer } from "@/components/mobile/category-nav/category-drawer-context"
import { getCategoryName } from "@/lib/category-display"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { ArrowLeft, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react"
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
  /** Additional class name */
  className?: string
}

// =============================================================================
// Component
// =============================================================================

/**
 * Simplified category drawer - shows L1 categories only.
 * Tapping an L1 pill navigates to /categories/[slug] for full-screen browsing.
 * This follows Temu/Vinted pattern: drawer for quick browse, full-screen for deep IA.
 */
export function CategoryBrowseDrawer({
  locale,
  fetchChildren,
  className,
}: CategoryBrowseDrawerProps) {
  const router = useRouter()
  const t = useTranslations("CategoryDrawer")
  const tCommon = useTranslations("Common")
  const { counts: categoryCounts, refetch: refetchCategoryCounts } = useCategoryCounts()
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
  const [query, setQuery] = useState("")

  // Handle drawer open state change
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

  // Fetch children when category changes
  useEffect(() => {
    if (!activeCategory) return
    if (activeCategory.children && activeCategory.children.length > 0) {
      // Already have children from initial data
      setChildren(activeCategory.children)
      return
    }

    // Lazy load children
    setLoading(true)
    fetchChildrenSafe(activeCategory.id)
      .then((fetched) => {
        setChildren(fetched)
      })
      .catch((err) => {
        console.error("Failed to fetch category children:", err)
        setChildren([])
      })
      .finally(() => {
        setLoading(false)
      })
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

  const handleBackToRoot = useCallback(() => {
    setQuery("")
    openRoot()
  }, [openRoot])

  const formatCategoryWithCount = useCallback((name: string, count?: number) => {
    if (typeof count !== "number") return name
    return `${name} (${count.toLocaleString(locale)})`
  }, [locale])

  // Ensure scoped drawer attempts a fresh counts fetch on open.
  useEffect(() => {
    if (!isOpen) return
    refetchCategoryCounts()
  }, [isOpen, refetchCategoryCounts])

  useEffect(() => {
    if (!isOpen) return
    setQuery("")
  }, [isOpen, rootCategory?.id])

  // Header text (L0 category name)
  const headerText = useMemo(() => {
    if (!rootCategory) return t("title")
    return formatCategoryWithCount(getCategoryName(rootCategory, locale), rootCategoryCount)
  }, [rootCategory, rootCategoryCount, locale, t, formatCategoryWithCount])

  const seeAllCategoryLabel = useMemo(() => {
    const baseName = rootCategoryName ?? headerText
    return formatCategoryWithCount(baseName, rootCategoryCount)
  }, [rootCategoryName, headerText, rootCategoryCount, formatCategoryWithCount])

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleOpenChange}
      modal={true}
      noBodyStyles={true}
      disablePreventScroll={false}
    >
      <DrawerContent
        className={cn("max-h-dialog rounded-t-2xl", className)}
        aria-label={t("ariaLabel")}
        data-testid="mobile-category-drawer"
      >
        <DrawerHeader className="border-b border-border-subtle px-inset py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            {rootCategory ? (
              <IconButton
                aria-label={tCommon("back")}
                variant="ghost"
                size="icon-compact"
                onClick={handleBackToRoot}
                className="shrink-0 text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              </IconButton>
            ) : (
              <span className="size-(--control-compact) shrink-0" aria-hidden="true" />
            )}

            <DrawerTitle className="min-w-0 flex-1 truncate text-center text-base font-semibold text-foreground">
              {headerText}
            </DrawerTitle>

            <DrawerClose asChild>
              <IconButton
                aria-label={t("close")}
                variant="ghost"
                size="icon-compact"
                className="shrink-0 text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <X size={16} />
              </IconButton>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <DrawerDescription className="sr-only">{t("description")}</DrawerDescription>

        <DrawerBody className="px-inset py-3 pb-4">
          <div className="pb-3">
            <div className="relative">
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
          </div>

          {rootCategory && listItems.length > 0 && (
            <p className="pb-2 text-2xs font-medium text-muted-foreground">
              {t("subcategories")}
            </p>
          )}

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex min-h-(--spacing-touch-md) items-center rounded-xl border border-border-subtle bg-background px-3.5"
                >
                  <Skeleton className="h-4 w-44" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredListItems.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    rootCategory ? handleNavigateToCategory(cat.slug) : handleOpenScopedCategory(cat)
                  }
                  className={cn(
                    "flex w-full min-h-(--spacing-touch-md) items-center justify-between gap-3 rounded-xl border border-border-subtle bg-background px-3.5 text-left",
                    "tap-transparent transition-colors",
                    "hover:border-border hover:bg-hover active:bg-active",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  )}
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {formatCategoryWithCount(getCategoryName(cat, locale), categoryCounts[cat.slug] ?? 0)}
                  </span>
                  <CaretRight
                    size={16}
                    weight="bold"
                    className="shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          )}

          {!isLoading && filteredListItems.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {normalizedQuery ? t("noMatches") : rootCategory ? t("noSubcategories") : t("noCategories")}
              </p>
            </div>
          )}
        </DrawerBody>

        {rootCategory && (
          <div className="shrink-0 border-t border-border bg-surface-elevated px-inset py-3 pb-safe-max">
            <button
              type="button"
              onClick={() => handleNavigateToCategory(rootCategory.slug)}
              className={cn(
                "flex w-full min-h-(--spacing-touch-md) items-center justify-center rounded-xl border border-foreground bg-foreground px-4 text-center",
                "tap-transparent transition-colors",
                "hover:bg-foreground active:opacity-90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              )}
            >
              <span className="min-w-0 truncate text-sm font-semibold text-background">
                {t("seeAllIn", { category: seeAllCategoryLabel })}
              </span>
            </button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
