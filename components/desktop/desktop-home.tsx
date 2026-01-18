"use client"

/**
 * Desktop Home
 * 
 * The desktop homepage layout with unified header + content approach where:
 * - Logo and user actions stay in a slim top bar
 * - Search is integrated INTO the content area (inline with sidebar + grid)
 * - Categories sidebar and product grid share a container
 * - The whole thing feels like one cohesive surface, not header + body
 * 
 * Design principles:
 * - Header is minimal - just logo + user actions
 * - Search lives WHERE the content is (contextual, not global)
 * - Lighter background (muted/30) for the container vs white cards
 * - Grid borders create visual rhythm without heavy separation
 */

import * as React from "react"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/shared/product/product-card"
import { ProductCardList } from "@/components/shared/product/product-card-list"
import { EmptyStateCTA } from "@/components/shared/empty-state-cta"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { useCategoryAttributes } from "@/hooks/use-category-attributes"
import { useViewMode } from "@/hooks/use-view-mode"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/lib/category-icons"

// Real dropdown components from SiteHeader
import {
  AccountDropdown,
  MessagesDropdown,
  NotificationsDropdown,
  WishlistDropdown,
} from "@/components/dropdowns"
import { CartDropdown } from "@/components/layout/header/cart/cart-dropdown"
import { DesktopSearch } from "@/components/desktop/desktop-search"

import {
  Camera,
  MagnifyingGlass,
  CaretDown,
  CaretRight,
  CaretUp,
  ArrowLeft,
  SquaresFour,
  TrendUp,
  ChartLineUp,
  Eye,
  Star,
  Percent,
  Fire,
  Tag,
  Rows,
  X,
  Check,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type { User } from "@supabase/supabase-js"

// =============================================================================
// TYPES
// =============================================================================

type FeedTab =
  | "all"
  | "newest"
  | "promoted"
  | "deals"
  | "top_rated"
  | "best_sellers"
  | "most_viewed"
  | "price_low"

interface CategoryPath {
  slug: string
  name: string
}

interface FilterState {
  priceMin: string
  priceMax: string
  condition: string | null
  /** Dynamic attribute filters: attributeName -> selected value */
  attributes: Record<string, string | null>
}

interface Product {
  id: string
  title: string
  price: number
  listPrice?: number
  isOnSale?: boolean
  salePercent?: number
  saleEndDate?: string | null
  createdAt?: string | null
  image: string
  rating?: number
  reviews?: number
  slug?: string | null
  storeSlug?: string | null
  sellerId?: string | null
  sellerName?: string | null
  sellerAvatarUrl?: string | null
  sellerVerified?: boolean
  location?: string
  condition?: string
  isBoosted?: boolean
  tags?: string[]
}

interface DesktopHomeProps {
  locale: string
  categories: CategoryTreeNode[]
  initialProducts?: Product[]
  user?: User | null
}

// =============================================================================
// SLIM TOP BAR - With real dropdown components from SiteHeader
// =============================================================================

function SlimTopBar({ 
  locale, 
  user,
}: { 
  locale: string
  user?: User | null
}) {
  const t = useTranslations('Navigation')
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Account */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold tracking-tight text-foreground">treido.</span>
          </Link>
          {/* Account dropdown with full variant (shows greeting) */}
          <div className="hidden lg:block">
            <AccountDropdown user={user ?? null} variant="full" />
          </div>
        </div>

        {/* Center: Desktop Search with real dropdown overlay */}
        <div className="flex-1 max-w-2xl">
          <DesktopSearch />
        </div>

        {/* Right: Actions with real dropdown components */}
        <div className="flex items-center gap-0.5">
          {user ? (
            <>
              {/* Wishlist Dropdown */}
              <WishlistDropdown />
              
              {/* Messages Dropdown */}
              <MessagesDropdown user={user} />
              
              {/* Notifications Dropdown */}
              <NotificationsDropdown user={user} />
              
              {/* Sell Button */}
              <Link href="/sell" aria-label={locale === "bg" ? "Създай обява" : "Create listing"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 [&_svg]:size-6 border border-transparent hover:border-border/40 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <Camera weight="regular" aria-hidden="true" />
                </Button>
              </Link>
              
              {/* Account (icon only, for md-lg screens) */}
              <div className="hidden md:block lg:hidden">
                <AccountDropdown user={user} />
              </div>
              
              {/* Cart Dropdown */}
              <CartDropdown />
            </>
          ) : (
            <>
              {/* Unauthenticated: Sign In / Register + Sell + Cart */}
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-foreground hover:bg-muted/50 px-3 py-2 rounded-md transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="text-sm font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-md transition-colors"
                >
                  {t('register')}
                </Link>
                <Link href="/sell" aria-label={locale === "bg" ? "Създай обява" : "Create listing"}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 [&_svg]:size-6 border border-transparent hover:border-border/40 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <Camera weight="regular" aria-hidden="true" />
                  </Button>
                </Link>
                <CartDropdown />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

// =============================================================================
// INLINE SEARCH ROW - Search bar that lives with the content
// =============================================================================

function FeedToolbar({
  locale,
  productCount,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  categorySlug,
  filters,
  onFiltersChange,
  categoryAttributes,
  isLoadingAttributes,
}: {
  locale: string
  productCount: number
  activeTab: FeedTab
  onTabChange: (tab: FeedTab) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  categorySlug: string | null
  filters: FilterState
  onFiltersChange: (f: FilterState) => void
  categoryAttributes: Array<{
    id: string
    name: string
    nameBg: string | null
    type: string
    options: string[] | null
    optionsBg: string[] | null
    sortOrder: number | null
  }>
  isLoadingAttributes: boolean
}) {
  const tabs: { id: FeedTab; label: string; icon: typeof TrendUp }[] = [
    { id: "newest", label: locale === "bg" ? "Най-нови" : "Newest", icon: TrendUp },
    { id: "best_sellers", label: locale === "bg" ? "Топ продажби" : "Best Sellers", icon: ChartLineUp },
    { id: "most_viewed", label: locale === "bg" ? "Най-гледани" : "Most Viewed", icon: Eye },
    { id: "top_rated", label: locale === "bg" ? "Най-високо оценени" : "Top Rated", icon: Star },
    { id: "deals", label: locale === "bg" ? "Намаления" : "Deals", icon: Percent },
    { id: "promoted", label: locale === "bg" ? "Промотирани" : "Promoted", icon: Fire },
  ]

  const activeTabData = tabs.find((t) => t.id === activeTab) ?? tabs[0]!
  const ActiveIcon = activeTabData.icon

  // Build contextual filter pills from category attributes (max 5 for UI cleanliness)
  const categoryFilters = useMemo(() => {
    if (!categorySlug || categoryAttributes.length === 0) return []

    // Skip Gender when already in a gendered category (e.g., men-clothing, women-shoes)
    const isGenderedCategory = /^(men|women|kids|boys|girls)-/.test(categorySlug) ||
      categorySlug.includes("-mens") || categorySlug.includes("-womens")
    
    // Filter out Gender if redundant, then sort by priority
    const filtered = categoryAttributes.filter(attr => {
      if (attr.name.toLowerCase() === "gender" && isGenderedCategory) return false
      return true
    })

    // Priority order: Condition first, then Size, Color, then by sortOrder
    const priorityMap: Record<string, number> = {
      "condition": 0,
      "size": 1,
      "color": 2,
    }
    const sorted = [...filtered].sort((a, b) => {
      const aPriority = priorityMap[a.name.toLowerCase()] ?? (a.sortOrder ?? 999)
      const bPriority = priorityMap[b.name.toLowerCase()] ?? (b.sortOrder ?? 999)
      return aPriority - bPriority
    })

    // Take first 5 attributes for filter pills
    return sorted.slice(0, 5).map((attr) => ({
      id: attr.name.toLowerCase().replace(/\s+/g, "_"),
      label: locale === "bg" && attr.nameBg ? attr.nameBg : attr.name,
      name: attr.name,
      options: (locale === "bg" && attr.optionsBg && attr.optionsBg.length > 0
        ? attr.optionsBg
        : attr.options || []
      ).slice(0, 8).map((opt) => ({
        value: opt.toLowerCase().replace(/\s+/g, "_"),
        label: opt,
      })),
    }))
  }, [categorySlug, categoryAttributes, locale])

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Get active attribute filters for badge display
  const activeAttributeFilters = useMemo(() => {
    const active: { id: string; label: string; value: string; displayLabel: string }[] = []
    for (const filter of categoryFilters) {
      const selectedValue = filters.attributes[filter.id]
      if (selectedValue) {
        const opt = filter.options.find((o) => o.value === selectedValue)
        if (opt) {
          active.push({
            id: filter.id,
            label: filter.label,
            value: selectedValue,
            displayLabel: opt.label,
          })
        }
      }
    }
    return active
  }, [categoryFilters, filters.attributes])

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* LEFT: Product count + Category filter pills */}
      <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar">
        <span className="text-sm font-medium text-foreground whitespace-nowrap shrink-0">
          {productCount.toLocaleString()}{" "}
          <span className="text-muted-foreground font-normal">
            {locale === "bg" ? "обяви" : "listings"}
          </span>
        </span>

        {/* Category filter pills - loading skeleton */}
        {isLoadingAttributes && categorySlug && (
          <>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full shrink-0" />
            ))}
          </>
        )}

        {/* Category filter pills - only show when category selected */}
        {!isLoadingAttributes && categoryFilters.map((filter) => (
          <DropdownMenu 
            key={filter.id} 
            open={activeDropdown === filter.id} 
            onOpenChange={(open) => setActiveDropdown(open ? filter.id : null)}
          >
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 h-9 text-sm rounded-full border whitespace-nowrap shrink-0",
                  "bg-background border-border hover:bg-muted/50 transition-colors",
                  filters.attributes[filter.id] && "border-foreground/20 bg-foreground/5",
                )}
              >
                {filter.label}
                <CaretDown size={12} weight="bold" className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-36">
              {filter.options.map((opt) => {
                const isSelected = filters.attributes[filter.id] === opt.value
                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => {
                      const newAttributes = { ...filters.attributes }
                      if (newAttributes[filter.id] === opt.value) {
                        delete newAttributes[filter.id]
                      } else {
                        newAttributes[filter.id] = opt.value
                      }
                      onFiltersChange({ ...filters, attributes: newAttributes })
                    }}
                    className={cn("cursor-pointer", isSelected && "bg-muted font-medium")}
                  >
                    <span className="w-4 flex items-center justify-center mr-1">
                      {isSelected && <Check size={14} weight="bold" />}
                    </span>
                    {opt.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        {/* Active filter badges */}
        {activeAttributeFilters.map((af) => (
          <button
            key={af.id}
            type="button"
            onClick={() => {
              const newAttributes = { ...filters.attributes }
              delete newAttributes[af.id]
              onFiltersChange({ ...filters, attributes: newAttributes })
            }}
            className="inline-flex items-center gap-1.5 px-3 h-9 text-sm rounded-full bg-foreground text-background font-medium whitespace-nowrap shrink-0"
          >
            {af.displayLabel}
            <X size={14} weight="bold" className="text-background/70" />
          </button>
        ))}
      </div>

      {/* RIGHT: Sort + View Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 h-9",
                "text-sm font-medium whitespace-nowrap",
                "bg-muted/40 text-foreground border border-border/50",
                "hover:bg-muted/60 hover:border-border transition-all duration-150",
              )}
            >
              <ActiveIcon size={14} weight="fill" />
              <span>{activeTabData.label}</span>
              <CaretDown size={12} weight="bold" className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "cursor-pointer flex items-center gap-2",
                    isActive && "bg-muted font-medium"
                  )}
                >
                  <span className="w-4 flex items-center justify-center">
                    {isActive && <Check size={14} weight="bold" />}
                  </span>
                  <Icon size={14} weight={isActive ? "fill" : "regular"} />
                  {tab.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Toggle */}
        <div className="relative flex items-center rounded-lg border border-border/50 bg-muted/30 p-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "size-8 rounded-md transition-all duration-150",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent"
            )}
            aria-label="Grid view"
          >
            <SquaresFour size={16} weight={viewMode === "grid" ? "fill" : "regular"} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "size-8 rounded-md transition-all duration-150",
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent"
            )}
            aria-label="List view"
          >
            <Rows size={16} weight={viewMode === "list" ? "fill" : "regular"} />
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// COMPACT CATEGORY SIDEBAR - Replaces full-height drill-down
// =============================================================================

function CompactCategorySidebar({
  categories,
  locale,
  selectedPath,
  onCategorySelect,
  categoryCounts,
}: {
  categories: CategoryTreeNode[]
  locale: string
  selectedPath: CategoryPath[]
  onCategorySelect: (path: CategoryPath[], category: CategoryTreeNode | null) => void
  categoryCounts: Record<string, number>
}) {
  const [viewLevel, setViewLevel] = useState(0)
  const [currentL0, setCurrentL0] = useState<CategoryTreeNode | null>(null)
  const [currentL1, setCurrentL1] = useState<CategoryTreeNode | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const initialVisibleCount = 12

  // Sync with selected path
  useEffect(() => {
    if (selectedPath.length === 0) {
      setViewLevel(0)
      setCurrentL0(null)
      setCurrentL1(null)
    } else if (selectedPath.length >= 1) {
      const l0 = categories.find((c) => c.slug === selectedPath[0]?.slug)
      if (l0) {
        setCurrentL0(l0)
        setViewLevel(1)
        if (selectedPath.length >= 2) {
          const l1 = l0.children?.find((c) => c.slug === selectedPath[1]?.slug)
          if (l1) {
            setCurrentL1(l1)
            setViewLevel(2)
          }
        }
      }
    }
  }, [selectedPath, categories])

  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  const currentItems = useMemo(() => {
    if (viewLevel === 0) return categories.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    if (viewLevel === 1 && currentL0?.children) return currentL0.children.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    if (viewLevel === 2 && currentL1?.children) return currentL1.children.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    return []
  }, [viewLevel, currentL0, currentL1, categories])

  const visibleItems = useMemo(() => {
    if (isExpanded || currentItems.length <= initialVisibleCount) return currentItems
    return currentItems.slice(0, initialVisibleCount)
  }, [currentItems, isExpanded, initialVisibleCount])

  const hiddenCount = currentItems.length - visibleItems.length

  const headerCategory = viewLevel === 2 ? currentL1 : viewLevel === 1 ? currentL0 : null

  const handleBack = () => {
    if (viewLevel === 2) {
      setViewLevel(1)
      setCurrentL1(null)
      if (currentL0) {
        onCategorySelect([{ slug: currentL0.slug, name: getCategoryName(currentL0, locale) }], currentL0)
      }
    } else if (viewLevel === 1) {
      setViewLevel(0)
      setCurrentL0(null)
      onCategorySelect([], null)
    }
  }

  const handleItemClick = (item: CategoryTreeNode) => {
    const hasChildren = item.children && item.children.length > 0
    
    if (viewLevel === 0) {
      setCurrentL0(item)
      const path = [{ slug: item.slug, name: getCategoryName(item, locale) }]
      if (hasChildren) setViewLevel(1)
      onCategorySelect(path, item)
    } else if (viewLevel === 1 && currentL0) {
      setCurrentL1(item)
      const path = [
        { slug: currentL0.slug, name: getCategoryName(currentL0, locale) },
        { slug: item.slug, name: getCategoryName(item, locale) },
      ]
      if (hasChildren) setViewLevel(2)
      onCategorySelect(path, item)
    } else if (viewLevel === 2 && currentL0 && currentL1) {
      const path = [
        { slug: currentL0.slug, name: getCategoryName(currentL0, locale) },
        { slug: currentL1.slug, name: getCategoryName(currentL1, locale) },
        { slug: item.slug, name: getCategoryName(item, locale) },
      ]
      onCategorySelect(path, item)
    }
  }

  const isSelected = (slug: string) => {
    if (selectedPath.length === 0) return false
    return selectedPath[selectedPath.length - 1]?.slug === slug
  }

  const itemBase = "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors text-left min-h-9"
  const itemActive = cn(itemBase, "bg-foreground text-background font-medium")
  const itemInactive = cn(itemBase, "text-muted-foreground hover:bg-muted hover:text-foreground")

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="px-3 py-2.5 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          {locale === "bg" ? "Категории" : "Categories"}
        </h2>
      </div>

      <nav className="p-1.5 space-y-0.5">
        {/* Back button */}
        {viewLevel > 0 && (
          <button type="button" onClick={handleBack} className={itemInactive}>
            <ArrowLeft size={18} weight="bold" className="shrink-0" />
            <span className="flex-1 truncate">
              {viewLevel === 1
                ? locale === "bg" ? "Всички категории" : "All Categories"
                : currentL0 ? getCategoryName(currentL0, locale) : ""}
            </span>
          </button>
        )}

        {/* "All" at L0 */}
        {viewLevel === 0 && (
          <button
            type="button"
            onClick={() => onCategorySelect([], null)}
            className={selectedPath.length === 0 ? itemActive : itemInactive}
          >
            <SquaresFour size={20} weight={selectedPath.length === 0 ? "fill" : "regular"} className="shrink-0" />
            <span className="flex-1">{locale === "bg" ? "Всички" : "All"}</span>
            <span className="text-xs tabular-nums opacity-70">{totalCount || "—"}</span>
          </button>
        )}

        {/* Header category when drilled */}
        {viewLevel > 0 && headerCategory && (
          <button type="button" onClick={() => {}} className={itemActive}>
            <SquaresFour size={18} weight="fill" className="shrink-0" />
            <span className="flex-1 truncate">
              {locale === "bg" ? "Всички в " : "All in "}
              {getCategoryName(headerCategory, locale)}
            </span>
            {categoryCounts[headerCategory.slug] !== undefined && (
              <span className="text-xs tabular-nums opacity-70">{categoryCounts[headerCategory.slug]}</span>
            )}
          </button>
        )}

        {/* Items */}
        {visibleItems.map((item) => {
          const name = getCategoryName(item, locale)
          const count = categoryCounts[item.slug]
          const hasChildren = item.children && item.children.length > 0
          const selected = isSelected(item.slug)

          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => handleItemClick(item)}
              className={selected ? itemActive : itemInactive}
            >
              {viewLevel === 0 && (
                <span className={selected ? "text-background" : "text-muted-foreground"}>
                  {getCategoryIcon(item.slug, { size: 20, weight: selected ? "fill" : "regular" })}
                </span>
              )}
              <span className="flex-1 truncate">{name}</span>
              {typeof count === "number" && (
                <span className="text-xs tabular-nums opacity-70">{count}</span>
              )}
              {hasChildren && (
                <CaretRight size={14} weight="bold" className={cn("shrink-0", selected ? "text-background/70" : "text-muted-foreground/50")} />
              )}
            </button>
          )
        })}

        {/* Show more */}
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-1.5 py-2 mt-1 text-xs font-medium rounded-md bg-foreground text-background hover:bg-foreground/90"
          >
            {isExpanded ? (
              <>
                <CaretUp size={14} weight="bold" />
                {locale === "bg" ? "По-малко" : "Show less"}
              </>
            ) : (
              <>
                <CaretDown size={14} weight="bold" />
                {locale === "bg" ? `Още ${hiddenCount}` : `${hiddenCount} more`}
              </>
            )}
          </button>
        )}
      </nav>
    </div>
  )
}

// =============================================================================
// FILTERS SIDEBAR - Only shown when category is selected
// =============================================================================

function FiltersSidebar({
  locale,
  filters,
  onFiltersChange,
  onApply,
}: {
  locale: string
  filters: FilterState
  onFiltersChange: (f: FilterState) => void
  onApply: () => void
}) {
  const conditions = [
    { id: "new", label: locale === "bg" ? "Ново" : "New" },
    { id: "like_new", label: locale === "bg" ? "Като ново" : "Like new" },
    { id: "used", label: locale === "bg" ? "Използвано" : "Used" },
  ]

  const hasActive = filters.priceMin !== "" || filters.priceMax !== "" || filters.condition !== null

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="px-3 py-2.5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          {locale === "bg" ? "Филтри" : "Filters"}
        </h3>
      </div>
      <div className="px-3 py-3 space-y-4">
        {/* Price */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            {locale === "bg" ? "Цена" : "Price"}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={locale === "bg" ? "Мин" : "Min"}
              value={filters.priceMin}
              onChange={(e) => onFiltersChange({ ...filters, priceMin: e.target.value })}
              className="h-9 text-sm"
            />
            <span className="text-muted-foreground text-sm">–</span>
            <Input
              type="number"
              placeholder={locale === "bg" ? "Макс" : "Max"}
              value={filters.priceMax}
              onChange={(e) => onFiltersChange({ ...filters, priceMax: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            {locale === "bg" ? "Състояние" : "Condition"}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {conditions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onFiltersChange({ ...filters, condition: filters.condition === c.id ? null : c.id })}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full transition-colors min-h-9",
                  filters.condition === c.id
                    ? "bg-foreground text-background font-medium"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <Button size="sm" onClick={onApply} disabled={!hasActive} className="w-full h-9 text-sm font-medium">
          {locale === "bg" ? "Приложи" : "Apply"}
        </Button>
      </div>
    </div>
  )
}



// =============================================================================
// PRODUCT GRID SKELETON
// =============================================================================

function ProductGridSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  return (
    <div className={cn(
      viewMode === "list"
        ? "flex flex-col gap-3"
        : "grid gap-4 grid-cols-2 @[520px]:grid-cols-3 @[720px]:grid-cols-4 @[960px]:grid-cols-5"
    )}>
      {Array.from({ length: 18 }).map((_, i) =>
        viewMode === "list" ? (
          <div key={i} className="flex gap-4 rounded-md border border-border p-3 bg-card">
            <Skeleton className="w-32 h-32 rounded-md shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-24 mt-auto" />
            </div>
          </div>
        ) : (
          <div key={i} className="space-y-2 bg-card rounded-lg p-2">
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )
      )}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DesktopHome({
  locale,
  categories,
  initialProducts = [],
  user,
}: DesktopHomeProps) {
  const t = useTranslations("TabbedProductFeed")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // State
  const [activeTab, setActiveTab] = useState<FeedTab>("newest")
  const [categoryPath, setCategoryPath] = useState<CategoryPath[]>([])
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    priceMin: "",
    priceMax: "",
    condition: null,
    attributes: {},
  })
  const [viewMode, setViewMode] = useViewMode("grid")

  const { counts: categoryCounts } = useCategoryCounts()
  const pageSize = 24

  const activeCategorySlug = useMemo(() => {
    if (categoryPath.length > 0) return categoryPath[categoryPath.length - 1]?.slug ?? null
    return null
  }, [categoryPath])

  const { attributes: categoryAttributes, isLoading: isLoadingAttributes } = useCategoryAttributes(activeCategorySlug)

  // Clear attribute filters when category changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, attributes: {} }))
  }, [activeCategorySlug])

  // Fetch products
  const fetchProducts = useCallback(
    async (tab: FeedTab, pageNum: number, limit: number, append = false, catSlug?: string | null) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          type: tab,
          page: String(pageNum),
          limit: String(limit),
        })
        if (catSlug) params.set("category", catSlug)

        const res = await fetch(`/api/products/feed?${params.toString()}`)
        if (!res.ok) return

        const data = await res.json()
        if (!Array.isArray(data.products)) return

        const transformed: Product[] = data.products.map((p: Record<string, unknown>) => ({
          id: p.id as string,
          title: p.title as string,
          price: typeof p.price === "number" ? p.price : Number(p.price ?? 0),
          image: (p.image as string) ?? (Array.isArray(p.images) ? (p.images as string[])[0] : "/placeholder.svg") ?? "/placeholder.svg",
          slug: (p.slug as string | null) ?? null,
          storeSlug: (p.storeSlug as string | null) ?? (p.store_slug as string | null) ?? null,
          sellerId: typeof p.sellerId === "string" ? p.sellerId : null,
          sellerName: typeof p.sellerName === "string" ? p.sellerName : null,
          sellerAvatarUrl: typeof p.sellerAvatarUrl === "string" ? p.sellerAvatarUrl : null,
          isBoosted: Boolean(p.isBoosted || p.is_boosted),
          listPrice: typeof p.listPrice === "number" ? p.listPrice : typeof p.list_price === "number" ? p.list_price : undefined,
          rating: typeof p.rating === "number" ? p.rating : undefined,
          reviews: typeof p.reviews === "number" ? p.reviews : undefined,
          createdAt: typeof p.createdAt === "string" ? p.createdAt : typeof p.created_at === "string" ? p.created_at : null,
          tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
        }))

        if (append) {
          setProducts((prev) => [...prev, ...transformed])
        } else {
          setProducts(transformed)
        }
        setHasMore(data.hasMore ?? transformed.length === limit)
      } catch {
        // Silent
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Initial fetch
  const initialFetchDone = useRef(initialProducts.length > 0)
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true
      fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug)
    }
  }, [])

  // Fetch on tab/category change
  const prevTab = useRef(activeTab)
  const prevCat = useRef<string | null>(null)
  useEffect(() => {
    const tabChanged = prevTab.current !== activeTab
    const catChanged = prevCat.current !== activeCategorySlug
    prevTab.current = activeTab
    prevCat.current = activeCategorySlug

    if (tabChanged || catChanged) {
      setPage(1)
      fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug)
    }
  }, [activeTab, activeCategorySlug, fetchProducts])

  const handleCategorySelect = (path: CategoryPath[], _cat: CategoryTreeNode | null) => {
    setCategoryPath(path)
    setPage(1)
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const next = page + 1
      setPage(next)
      fetchProducts(activeTab, next, pageSize, true, activeCategorySlug)
    }
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header is rendered by layout - no duplicate here */}

      {/* Main content - unified container */}
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:flex flex-col shrink-0 gap-4 sticky top-20 self-start">
            <CompactCategorySidebar
              categories={categories}
              locale={locale}
              selectedPath={categoryPath}
              onCategorySelect={handleCategorySelect}
              categoryCounts={categoryCounts}
            />
            {categoryPath.length > 0 && (
              <FiltersSidebar
                locale={locale}
                filters={filters}
                onFiltersChange={setFilters}
                onApply={() => fetchProducts(activeTab, 1, pageSize, false, activeCategorySlug)}
              />
            )}
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 @container">
            {/* Feed toolbar: count + category pills (left) | sort + view toggle (right) */}
            <FeedToolbar
              locale={locale}
              productCount={products.length}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              categorySlug={activeCategorySlug}
              filters={filters}
              onFiltersChange={setFilters}
              categoryAttributes={categoryAttributes}
              isLoadingAttributes={isLoadingAttributes}
            />

            {/* Product Grid - with proper container styling */}
            <div className="rounded-xl bg-card border border-border p-4 shadow-sm">
              <div role="list" aria-live="polite">
                {products.length === 0 && isLoading ? (
                  <ProductGridSkeleton viewMode={viewMode} />
                ) : products.length === 0 ? (
                  <EmptyStateCTA
                    variant={activeCategorySlug ? "no-category" : "no-listings"}
                    {...(activeCategorySlug ? { categoryName: activeCategorySlug } : {})}
                  />
                ) : (
                  <>
                    <div
                      className={cn(
                        viewMode === "list"
                          ? "flex flex-col gap-3"
                          : "grid gap-4 grid-cols-2 @[520px]:grid-cols-3 @[720px]:grid-cols-4 @[960px]:grid-cols-5"
                      )}
                    >
                      {products.map((product, index) => (
                        <div key={product.id} role="listitem">
                          {viewMode === "list" ? (
                            <ProductCardList
                              id={product.id}
                              title={product.title}
                              price={product.price}
                              originalPrice={product.listPrice ?? null}
                              image={product.image}
                              createdAt={product.createdAt ?? null}
                              slug={product.slug ?? null}
                              username={product.storeSlug ?? null}
                              sellerId={product.sellerId ?? null}
                              sellerName={product.sellerName || product.storeSlug || undefined}
                              sellerVerified={Boolean(product.sellerVerified)}
                              location={product.location}
                              condition={product.condition}
                              freeShipping={false}
                            />
                          ) : (
                            <ProductCard
                              id={product.id}
                              title={product.title}
                              price={product.price}
                              originalPrice={product.listPrice ?? null}
                              isOnSale={Boolean(product.isOnSale)}
                              salePercent={product.salePercent ?? 0}
                              saleEndDate={product.saleEndDate ?? null}
                              createdAt={product.createdAt ?? null}
                              image={product.image}
                              rating={product.rating ?? 0}
                              reviews={product.reviews ?? 0}
                              slug={product.slug ?? null}
                              username={product.storeSlug ?? null}
                              sellerId={product.sellerId ?? null}
                              sellerName={product.sellerName || product.storeSlug || undefined}
                              sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                              sellerVerified={Boolean(product.sellerVerified)}
                              {...(product.location ? { location: product.location } : {})}
                              {...(product.condition ? { condition: product.condition } : {})}
                              tags={product.tags ?? []}
                              state={product.isBoosted ? "promoted" : undefined}
                              index={index}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {hasMore && (
                      <div className="mt-8 text-center">
                        <Button onClick={loadMore} disabled={isLoading} size="lg" className="min-w-36">
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              {t("loading")}
                            </span>
                          ) : (
                            t("loadMore")
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DesktopHomeSkeleton() {
  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="container h-14 flex items-center justify-between gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 flex-1 max-w-2xl rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:flex flex-col shrink-0 space-y-4">
            <div className="rounded-lg border border-border bg-card p-1.5 shadow-sm">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-md mb-1" />
              ))}
            </div>
          </aside>

          {/* Main skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-9 flex-1 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
            <div className="rounded-xl bg-card border border-border p-4 shadow-sm">
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
