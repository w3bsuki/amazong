"use client"

import { useRef, useEffect } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { SidebarMenuV2 } from "@/components/layout/sidebar/sidebar-menu-v2"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { CategoryNavItem } from "@/components/mobile/category-nav"
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
      <div className="h-12 px-4 flex items-center gap-2">
        {/* Hamburger Menu - uses SidebarMenuV2 (shadcn Drawer with full a11y) */}
        <SidebarMenuV2 user={user as User | null} />

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
        </Link>

        {/* Search Bar - Takes remaining space */}
        <button
          type="button"
          onClick={onSearchOpen}
          className={cn(
            "flex-1 min-w-0 flex items-center gap-1.5 h-9 px-3 rounded-full",
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

        {/* Action Icons: Wishlist + Cart (with drawer components) */}
        <div className="flex items-center shrink-0">
          <MobileWishlistButton />
          <MobileCartDropdown />
        </div>
      </div>

      {/* Row 2: Category Pills */}
      <div ref={pillsRef} className="overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-1.5 px-4">
          {/* "All" Pill */}
          <CategoryNavItem
            onClick={() => onCategorySelect("all")}
            isActive={activeCategory === "all"}
            variant="pill"
            data-slug="all"
          >
            {allLabel}
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
                {label}
              </CategoryNavItem>
            )
          })}
        </div>
      </div>
    </header>
  )
}
