"use client"

import { useRef, useEffect } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { SidebarMenuV2 } from "@/components/layout/sidebar/sidebar-menu-v2"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { CategoryNavItem } from "@/components/mobile/category-nav"
import { getCategoryIcon } from "@/lib/category-icons"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryShortName } from "@/lib/category-display"
import type { User } from "@supabase/supabase-js"

// =============================================================================
// Types
// =============================================================================

export interface MobileHeaderProps {
  user?: User | { id: string } | null
  categories: CategoryTreeNode[]
  activeCategory: string
  locale: string
  onCategorySelect: (slug: string) => void
  onSearchOpen: () => void
}

// =============================================================================
// MobileHeader - Unified header with hamburger, search, and category pills
// =============================================================================

export function MobileHeader({
  user,
  categories,
  activeCategory,
  locale,
  onCategorySelect,
  onSearchOpen,
}: MobileHeaderProps) {
  const pillsRef = useRef<HTMLDivElement>(null)
  const searchPlaceholder = locale === "bg" ? "Търсене..." : "Search..."
  const allLabel = locale === "bg" ? "Всички" : "All"

  // Scroll active pill into view
  useEffect(() => {
    const container = pillsRef.current
    if (!container) return

    const activeEl = container.querySelector(`[data-slug="${activeCategory}"]`) as HTMLElement
    if (activeEl) {
      const containerRect = container.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()

      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
      }
    }
  }, [activeCategory])

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 pt-safe">
      {/* Row 1: Hamburger + Logo + Search + Wishlist + Cart (h-12) */}
      <div className="h-12 px-1 flex items-center">
        {/* Hamburger Menu - 40px touch target, -ml-2 pulls icon to 4px edge */}
        <SidebarMenuV2 user={user as User | null} triggerClassName="-ml-2" />

        {/* Logo - tight to hamburger */}
        <Link href="/" className="shrink-0 -ml-1">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
        </Link>

        {/* Search Bar - Takes remaining space, ml-2 for breathing room */}
        <button
          type="button"
          onClick={onSearchOpen}
          className={cn(
            "flex-1 min-w-0 flex items-center gap-1.5 h-9 ml-2 px-3 rounded-full",
            "bg-muted/50 border border-border/30",
            "text-muted-foreground text-sm text-left",
            "active:bg-muted/70 transition-colors"
          )}
          aria-label={searchPlaceholder}
          aria-haspopup="dialog"
        >
          <MagnifyingGlass size={16} weight="regular" className="text-muted-foreground shrink-0" />
          <span className="flex-1 truncate font-normal text-xs">{searchPlaceholder}</span>
        </button>

        {/* Action Icons: Wishlist + Cart - -mr-1 gives badge room, negative margins tighten gap */}
        <div className="flex items-center shrink-0 -mr-1">
          <div className="-mr-1">
            <MobileWishlistButton />
          </div>
          <div className="-ml-1">
            <MobileCartDropdown />
          </div>
        </div>
      </div>

      {/* Row 2: Category Pills */}
      <div ref={pillsRef} className="overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-2 px-1">
          {/* "All" Pill */}
          <CategoryNavItem
            onClick={() => onCategorySelect("all")}
            isActive={activeCategory === "all"}
            variant="pill"
            data-slug="all"
          >
            {getCategoryIcon("all", { size: 14 })}
            <span>{allLabel}</span>
          </CategoryNavItem>

          {/* Category Pills */}
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug
            const label = getCategoryShortName(cat, locale)

            return (
              <CategoryNavItem
                key={cat.id}
                onClick={() => onCategorySelect(cat.slug)}
                isActive={isActive}
                variant="pill"
                data-slug={cat.slug}
              >
                {getCategoryIcon(cat.slug, { size: 14 })}
                <span>{label}</span>
              </CategoryNavItem>
            )
          })}
        </div>
      </div>
    </header>
  )
}
