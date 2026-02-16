"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
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

const PILL_BASE_CLASS =
  "inline-flex min-h-(--control-compact) shrink-0 items-center rounded-full border px-2.5 text-xs font-medium tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const PILL_ACTIVE_CLASS = "border-foreground bg-foreground text-background font-semibold"
const PILL_INACTIVE_CLASS =
  "border-border-subtle bg-surface-subtle text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"

function shouldInterceptLinkClick(event: React.MouseEvent<HTMLAnchorElement>): boolean {
  if (event.defaultPrevented) return false
  if (event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  return true
}

export function CategoryPillRail({
  items,
  ariaLabel,
  stickyTop = "var(--app-header-offset)",
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
            className={cn(PILL_BASE_CLASS, item.active ? PILL_ACTIVE_CLASS : PILL_INACTIVE_CLASS)}
          >
            <span className="max-w-32 truncate">{item.label}</span>
          </Link>
        ))}

        {moreLabel && (onMoreClick || drawer) && (
          <button
            type="button"
            onClick={handleMoreClick}
            className={cn(PILL_BASE_CLASS, PILL_INACTIVE_CLASS)}
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
