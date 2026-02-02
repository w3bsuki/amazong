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
import { cn } from "@/lib/utils"
import { useCategoryDrawer } from "@/components/mobile/category-nav/category-drawer-context"
import { CategoryPillGrid } from "@/components/mobile/category-nav/category-pill-grid"
import { QuickPicksRow, type QuickPick } from "@/components/mobile/category-nav/quick-picks-row"
import { getCategoryName } from "@/lib/category-display"
import { X } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { CategoryTreeNode } from "@/lib/category-tree"

// =============================================================================
// Types
// =============================================================================

export interface CategoryBrowseDrawerProps {
  /** Locale for name display */
  locale: string
  /** Called when quick pick is selected */
  onQuickPick?: (pick: QuickPick) => void
  /** Called when category changes (for feed filtering) */
  onCategoryChange?: (category: CategoryTreeNode | null) => void
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
  onQuickPick,
  onCategoryChange,
  fetchChildren,
  className,
}: CategoryBrowseDrawerProps) {
  const router = useRouter()
  const t = useTranslations("CategoryDrawer")
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

  const [selectedQuickPick, setSelectedQuickPick] = React.useState<string | null>(null)

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

  // Handle quick pick selection
  const handleQuickPick = useCallback((pick: QuickPick) => {
    setSelectedQuickPick(prev => prev === pick.id ? null : pick.id)
    onQuickPick?.(pick)
  }, [onQuickPick])

  // Handle category pill selection - navigate to full page
  const handleCategorySelect = useCallback((category: CategoryTreeNode) => {
    // Close drawer and navigate to category page for full-screen browsing
    close()
    router.push(`/categories/${category.slug}`)
  }, [close, router])

  // Header text (L0 category name)
  const headerText = useMemo(() => {
    if (path.length === 0 || !path[0]) return t("title")
    return getCategoryName(path[0], locale)
  }, [path, locale, t])

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
        aria-label="Browse categories"
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
          {/* Quick picks row */}
          <QuickPicksRow
            locale={locale}
            selectedId={selectedQuickPick}
            onSelect={handleQuickPick}
            className="pb-4"
          />

          {/* Subcategory label */}
          {children.length > 0 && (
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide pb-2">
              {t("subcategories")}
            </p>
          )}

          {/* L1 Category pills - tapping navigates to full page */}
          <CategoryPillGrid
            categories={children}
            selectedSlug={null}
            locale={locale}
            onSelect={handleCategorySelect}
            isLoading={isLoading}
          />

          {/* Empty state */}
          {!isLoading && children.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("noSubcategories")}
              </p>
            </div>
          )}

          {/* See all link */}
          {path.length > 0 && path[0] && (
            <button
              type="button"
              onClick={() => {
                close()
                router.push(`/categories/${path[0]!.slug}`)
              }}
              className={cn(
                "w-full mt-4 py-3 rounded-lg",
                "bg-foreground text-background",
                "text-sm font-medium",
                "active:opacity-90 transition-opacity"
              )}
            >
              {t("seeAllIn", { category: getCategoryName(path[0], locale) })}
            </button>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
