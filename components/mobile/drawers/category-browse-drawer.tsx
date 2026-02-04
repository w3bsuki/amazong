"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo } from "react"
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
import { cn } from "@/lib/utils"
import { useCategoryDrawer } from "@/components/mobile/category-nav/category-drawer-context"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/components/shared/category/category-icons"
import { CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react"
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
    activeCategory,
    path,
    children,
    isLoading,
    close,
    setChildren,
    setLoading,
  } = useCategoryDrawer()

  const [query, setQuery] = React.useState("")

  // Handle drawer open state change
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
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

  const filteredChildren = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return children
    return children.filter((cat) => getCategoryName(cat, locale).toLowerCase().includes(q))
  }, [children, locale, query])

  const handleNavigateToCategory = useCallback((slug: string) => {
    close()
    router.push(`/categories/${slug}`)
  }, [close, router])

  // Header text (L0 category name)
  const headerText = useMemo(() => {
    if (!rootCategory) return t("title")
    return getCategoryName(rootCategory, locale)
  }, [rootCategory, locale, t])

  // Don't render anything when closed - prevents broken overlay
  if (!isOpen) {
    return null
  }

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
          <DrawerTitle className="text-base font-semibold">
            {headerText}
          </DrawerTitle>
          <DrawerClose asChild>
            <button
              type="button"
              className={cn(
                "p-2 -mr-2 rounded-full",
                "hover:bg-muted transition-colors",
                "shrink-0"
              )}
              aria-label={t("close")}
            >
              <X size={20} weight="bold" className="text-muted-foreground" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <DrawerDescription className="sr-only">{t("description")}</DrawerDescription>

        <DrawerBody className="pt-0 pb-safe-max">
          {/* Search */}
          <div className="px-inset pb-3">
            <div className="relative">
              <MagnifyingGlass
                size={16}
                weight="regular"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchAriaLabel")}
                className="pl-9"
              />
            </div>
          </div>

          {/* "All" - first row */}
          {rootCategory && (
            <button
              type="button"
              onClick={() => handleNavigateToCategory(rootCategory.slug)}
              className={cn(
                "w-full flex items-center gap-3 px-inset",
                "min-h-(--spacing-touch-md) rounded-lg",
                "active:bg-active transition-colors"
              )}
            >
              <span className="flex items-center justify-center rounded-full bg-surface-subtle border border-border/40 size-(--spacing-touch-sm) text-foreground shrink-0">
                {getCategoryIcon("all", { size: 18, weight: "bold" })}
              </span>
              <span className="flex-1 min-w-0 text-sm font-semibold text-foreground truncate">
                {tCommon("all")}
              </span>
              <CaretRight size={16} weight="bold" className="text-muted-foreground/60 shrink-0" aria-hidden="true" />
            </button>
          )}

          {/* Subcategory label */}
          {filteredChildren.length > 0 && (
            <p className="px-inset text-xs text-muted-foreground font-medium uppercase tracking-wide pb-2">
              {t("subcategories")}
            </p>
          )}

          {/* Subcategory list */}
          {isLoading ? (
            <div className="px-inset space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-(--spacing-touch-md) rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChildren.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleNavigateToCategory(cat.slug)}
                  className={cn(
                    "w-full flex items-center gap-3",
                    "min-h-(--spacing-touch-md) rounded-lg px-inset",
                    "active:bg-active transition-colors"
                  )}
                >
                  <span className="flex items-center justify-center rounded-full bg-surface-subtle border border-border/40 size-(--spacing-touch-sm) text-muted-foreground shrink-0">
                    {getCategoryIcon(cat.slug, { size: 18, weight: "bold" })}
                  </span>
                  <span className="flex-1 min-w-0 text-sm font-medium text-foreground line-clamp-2 text-left">
                    {getCategoryName(cat, locale)}
                  </span>
                  <CaretRight size={16} weight="bold" className="text-muted-foreground/60 shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && children.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("noSubcategories")}
              </p>
            </div>
          )}

          {!isLoading && children.length > 0 && filteredChildren.length === 0 && (
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
