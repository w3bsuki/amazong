"use client"

import { SidebarMenuV2 as SidebarMenu } from "@/components/layout/sidebar/sidebar-menu-v2"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { CategoryNavItem } from "@/components/mobile/category-nav"
import { getCategoryIcon } from "@/lib/category-icons"
import { getCategoryShortName } from "@/lib/category-display"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useRef, useEffect } from "react"
import type { HomepageHeaderProps } from "../types"

/**
 * Mobile Homepage Header
 * 
 * Homepage-specific mobile header with:
 * - Hamburger + Logo + Inline search + Cart/Wishlist
 * - Category pills row for quick filtering
 * 
 * Used for: Homepage (mobile only)
 */
export function MobileHomepageHeader({
  user,
  categories = [],
  userStats,
  activeCategory,
  onCategorySelect,
  onSearchOpen,
  locale,
}: HomepageHeaderProps) {
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
    <div className="md:hidden bg-background/95 backdrop-blur-md pt-safe">
      <div className="h-12 px-1 flex items-center">
        <SidebarMenu user={user} categories={categories} triggerClassName="-ml-2" {...(userStats && { userStats })} />
        <Link href="/" className="shrink-0 -ml-1">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
        </Link>
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
        <div className="flex items-center shrink-0 -mr-1">
          <div className="-mr-1"><MobileWishlistButton /></div>
          <div className="-ml-1"><MobileCartDropdown /></div>
        </div>
      </div>
      {/* Category Pills */}
      <div ref={pillsRef} className="overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 px-1">
          <CategoryNavItem
            onClick={() => onCategorySelect?.("all")}
            isActive={activeCategory === "all"}
            variant="pill"
            data-slug="all"
          >
            {getCategoryIcon("all", { size: 14 })}
            <span>{allLabel}</span>
          </CategoryNavItem>
          {categories.map((cat) => (
            <CategoryNavItem
              key={cat.id}
              onClick={() => onCategorySelect?.(cat.slug)}
              isActive={activeCategory === cat.slug}
              variant="pill"
              data-slug={cat.slug}
            >
              {getCategoryIcon(cat.slug, { size: 14 })}
              <span>{getCategoryShortName(cat, locale)}</span>
            </CategoryNavItem>
          ))}
        </div>
      </div>
    </div>
  )
}
