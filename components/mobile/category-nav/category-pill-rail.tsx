"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getMobileQuickPillClass } from "@/components/mobile/chrome/mobile-control-recipes"
import { useCategoryDrawerOptional } from "./category-drawer-context"

export interface CategoryPillRailItem {
  id: string
  label: string
  href: string
  active?: boolean
  title?: string
  onSelect?: (() => void) | undefined
}

interface CategoryPillRailProps {
  items: CategoryPillRailItem[]
  ariaLabel: string
  stickyTop?: number | string
  sticky?: boolean
  className?: string
  moreLabel?: string
  drawerRootSlug?: string | null
  onMoreClick?: (() => void) | undefined
  testId?: string
}

function shouldInterceptLinkClick(event: React.MouseEvent<HTMLAnchorElement>): boolean {
  if (event.defaultPrevented) return false
  if (event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  return true
}

export function CategoryPillRail({
  items,
  ariaLabel,
  stickyTop = "var(--offset-mobile-primary-rail)",
  sticky = true,
  className,
  moreLabel,
  drawerRootSlug = null,
  onMoreClick,
  testId,
}: CategoryPillRailProps) {
  const drawer = useCategoryDrawerOptional()

  const handleMoreClick = React.useCallback(() => {
    if (onMoreClick) {
      onMoreClick()
      return
    }

    if (!drawer) return

    if (drawerRootSlug) {
      const rootCategory = drawer.rootCategories.find((cat) => cat.slug === drawerRootSlug)
      if (rootCategory) {
        drawer.openCategory(rootCategory)
        return
      }
    }

    drawer.openRoot()
  }, [drawer, drawerRootSlug, onMoreClick])

  if (items.length === 0) return null

  return (
    <nav
      aria-label={ariaLabel}
      className={cn("bg-background px-inset py-1.5", sticky && "sticky z-30", className)}
      style={sticky ? { top: stickyTop } : undefined}
      {...(testId ? { "data-testid": testId } : {})}
    >
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            title={item.title ?? item.label}
            aria-current={item.active ? "page" : undefined}
            aria-label={item.label}
            onClick={(event) => {
              if (!item.onSelect) return
              if (!shouldInterceptLinkClick(event)) return
              event.preventDefault()
              item.onSelect()
            }}
            className={getMobileQuickPillClass(Boolean(item.active), !item.active ? "hover:bg-hover hover:text-foreground active:bg-active" : undefined)}
          >
            <span className="max-w-32 truncate">{item.label}</span>
          </Link>
        ))}

        {moreLabel && (onMoreClick || drawer) && (
          <button
            type="button"
            onClick={handleMoreClick}
            className={getMobileQuickPillClass(false, "hover:bg-hover hover:text-foreground active:bg-active")}
            aria-label={moreLabel}
          >
            <span className="max-w-32 truncate">{moreLabel}</span>
          </button>
        )}
      </div>
    </nav>
  )
}

export type { CategoryPillRailProps }
