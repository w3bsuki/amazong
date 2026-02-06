"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { useRouter } from "@/i18n/routing"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"
import { useCategoryDrawer } from "@/components/mobile/category-nav/category-drawer-context"
import { getCategoryName } from "@/lib/category-display"
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

  const [query, setQuery] = React.useState("")
  const [showSearch, setShowSearch] = React.useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Handle drawer open state change
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setQuery("")
      setShowSearch(false)
      close()
    }
  }, [close])

  // Fetch children when category changes
  useEffect(() => {
    if (!activeCategory || !fetchChildren) return
    if (activeCategory.children && activeCategory.children.length > 0) {
      // Already have children from initial data
      setChildren(activeCategory.children)
      return
    }

    // Lazy load children
    setLoading(true)
    fetchChildren(activeCategory.id)
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
  }, [activeCategory, fetchChildren, setChildren, setLoading])

  const rootCategory = path[0] ?? null
  const rootCategoryName = rootCategory ? getCategoryName(rootCategory, locale) : null

  const listItems = rootCategory ? children : rootCategories

  const filteredChildren = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return listItems
    return listItems.filter((cat) => getCategoryName(cat, locale).toLowerCase().includes(q))
  }, [listItems, locale, query])

  // Auto-focus the search input when it appears
  useEffect(() => {
    if (!showSearch) return
    searchInputRef.current?.focus()
  }, [showSearch])

  const handleNavigateToCategory = useCallback((slug: string) => {
    close()
    router.push(`/categories/${slug}`)
  }, [close, router])

  const handleOpenScopedCategory = useCallback((category: CategoryTreeNode) => {
    openCategory(category)
  }, [openCategory])

  const handleBackToRoot = useCallback(() => {
    openRoot()
  }, [openRoot])

  // Header text (L0 category name)
  const headerText = useMemo(() => {
    if (!rootCategory) return t("title")
    return getCategoryName(rootCategory, locale)
  }, [rootCategory, locale, t])

  const toggleSearch = useCallback(() => {
    setShowSearch((prev) => {
      if (prev) {
        setQuery("")
      }
      return !prev
    })
  }, [])

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleOpenChange}
      modal={true}
    >
      <DrawerContent
        className={className}
        aria-label={t("ariaLabel")}
      >
        <DrawerHeader className="flex-row items-center justify-between gap-2 py-2">
          <div className="flex min-w-0 items-center gap-1">
            {rootCategory && (
              <IconButton
                aria-label={tCommon("back")}
                variant="ghost"
                onClick={handleBackToRoot}
                className="-ml-2 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground active:bg-active"
              >
                <ArrowLeft size={20} weight="bold" aria-hidden="true" />
              </IconButton>
            )}
            <DrawerTitle className="min-w-0 truncate text-base font-semibold">
              {headerText}
            </DrawerTitle>
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              aria-label={tCommon("search")}
              variant="ghost"
              onClick={toggleSearch}
              className="shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground active:bg-active"
            >
              <MagnifyingGlass size={20} weight="regular" />
            </IconButton>
            <DrawerClose asChild>
              <IconButton
                aria-label={t("close")}
                variant="ghost"
                className="-mr-2 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground active:bg-active"
              >
                <X size={20} weight="bold" />
              </IconButton>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <DrawerDescription className="sr-only">{t("description")}</DrawerDescription>

        <DrawerBody className="px-0 pt-0 pb-safe-max">
          {/* Search (collapsed by default) */}
          {showSearch && (
            <div className="px-inset pb-3 pt-2">
              <div className="relative">
                <MagnifyingGlass
                  size={16}
                  weight="regular"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  aria-label={t("searchAriaLabel")}
                  className="pl-9"
                />
              </div>
            </div>
          )}

          {/* Label */}
          {filteredChildren.length > 0 && (
            <p className="px-inset pb-3 text-2xs font-medium text-muted-foreground">
              {rootCategory ? t("subcategories") : t("categories")}
            </p>
          )}

          {/* List */}
          {isLoading ? (
            <div className="divide-y divide-border-subtle">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex min-h-(--spacing-touch-md) items-center px-inset">
                  <Skeleton className="h-4 w-44" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {/* "All" - first row */}
              {rootCategory && (
                <button
                  type="button"
                  onClick={() => handleNavigateToCategory(rootCategory.slug)}
                  className={cn(
                    "w-full flex min-h-(--spacing-touch-md) items-center justify-between gap-3 px-inset",
                    "tap-transparent transition-colors",
                    "hover:bg-hover active:bg-active",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  )}
                >
                  <span className="flex-1 min-w-0 truncate text-left text-sm font-semibold text-foreground">
                    {t("seeAllIn", { category: rootCategoryName ?? headerText })}
                  </span>
                  <CaretRight
                    size={16}
                    weight="bold"
                    className="shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </button>
              )}

              {filteredChildren.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    rootCategory ? handleNavigateToCategory(cat.slug) : handleOpenScopedCategory(cat)
                  }
                  className={cn(
                    "w-full flex min-h-(--spacing-touch-md) items-center justify-between gap-3 px-inset",
                    "tap-transparent transition-colors",
                    "hover:bg-hover active:bg-active",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  )}
                >
                  <span className="flex-1 min-w-0 truncate text-left text-sm font-medium text-foreground">
                    {getCategoryName(cat, locale)}
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

          {/* Empty state */}
          {!isLoading && listItems.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {rootCategory ? t("noSubcategories") : t("noCategories")}
              </p>
            </div>
          )}

          {!isLoading && listItems.length > 0 && filteredChildren.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("noMatches")}
              </p>
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
