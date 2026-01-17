# Desktop Layout Migration Guide

**Target**: Migrate main landing page to use the integrated desktop layout pattern from `/demo/desktop`

**Stack**: Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Breakdown](#component-breakdown)
3. [Layout System](#layout-system)
4. [Header Component](#header-component)
5. [Sidebar Components](#sidebar-components)
6. [Product Grid](#product-grid)
7. [Toolbar & Controls](#toolbar--controls)
8. [Theming & Tokens](#theming--tokens)
9. [Responsive Patterns](#responsive-patterns)
10. [Migration Steps](#migration-steps)

---

## Architecture Overview

### Current Demo Structure

```
/demo/desktop
├── page.tsx                          # Route entry point
├── layout.tsx                        # Route layout (minimal)
└── _components/                      # Route-private components
    ├── integrated-desktop-layout.tsx # Main orchestrator
    ├── desktop-category-sidebar.tsx  # Category navigation
    ├── desktop-filters-card.tsx      # Price/condition filters
    ├── desktop-quick-pills.tsx       # Subcategory pills
    └── unified-desktop-feed-v2.tsx   # Alternative feed layout
```

### Target Production Structure

```
components/
├── layout/
│   └── desktop/
│       ├── desktop-header.tsx        # Reusable header shell
│       ├── desktop-sidebar.tsx       # Sidebar container
│       └── desktop-layout.tsx        # Layout orchestrator
├── navigation/
│   ├── category-sidebar.tsx          # Category drill-down
│   └── quick-pills.tsx               # Horizontal pill nav
├── filters/
│   ├── filter-card.tsx               # Filter container
│   ├── price-filter.tsx              # Price range inputs
│   └── condition-filter.tsx          # Condition pills
└── shared/
    ├── toolbar/
    │   ├── sort-dropdown.tsx         # Sort options
    │   └── view-toggle.tsx           # Grid/list toggle
    └── product/
        ├── product-card.tsx          # Already exists
        └── product-grid.tsx          # Grid container
```

---

## Component Breakdown

### 1. Layout Orchestrator

The main layout component that composes all pieces together.

```tsx
// components/layout/desktop/desktop-layout.tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DesktopLayoutProps {
  /** Slot for the sticky header */
  header: React.ReactNode
  /** Slot for the left sidebar (categories, filters) */
  sidebar: React.ReactNode
  /** Slot for the main content area */
  children: React.ReactNode
  /** Optional className for the root container */
  className?: string
}

export function DesktopLayout({
  header,
  sidebar,
  children,
  className,
}: DesktopLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-muted/40", className)}>
      {/* Sticky header */}
      {header}

      {/* Main content area */}
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar - hidden on mobile, sticky on desktop */}
          <aside className="hidden lg:flex flex-col shrink-0 gap-4 sticky top-20 self-start">
            {sidebar}
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
```

### 2. Key Layout Decisions

| Decision | Value | Rationale |
|----------|-------|-----------|
| Sidebar width | `280px` | Fits ~20 char labels + icons + counts |
| Grid gap | `gap-6` (24px) | Section-level spacing per design system |
| Sidebar sticky offset | `top-20` (80px) | Clears header height + breathing room |
| Background | `bg-muted/40` | Subtle surface separation |
| Container | Tailwind `container` | Responsive max-width with auto margins |

---

## Layout System

### Grid vs Flexbox Guidelines

```tsx
// ✅ USE GRID FOR: Page-level layouts with defined columns
<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

// ✅ USE GRID FOR: Product grids with responsive columns
<div className="grid grid-cols-2 @[520px]:grid-cols-3 @[720px]:grid-cols-4 gap-4">

// ✅ USE FLEXBOX FOR: Single-axis alignment (toolbars, rows)
<div className="flex items-center gap-3">

// ✅ USE FLEXBOX FOR: Stacking with gap
<aside className="flex flex-col gap-4">
```

### Container Queries (Tailwind v4)

Use `@container` for component-level responsive layouts:

```tsx
// Parent declares container context
<div className="@container">
  {/* Children respond to container width, not viewport */}
  <div className="grid grid-cols-2 @[520px]:grid-cols-3 @[720px]:grid-cols-4 @[960px]:grid-cols-5 gap-4">
    {products.map(p => <ProductCard key={p.id} {...p} />)}
  </div>
</div>
```

### Spacing Tokens (from DESIGN.md)

```tsx
// Component internal padding
className="p-3"           // 12px - cards, containers

// Between items in a group  
className="gap-2"         // 8px - mobile default
className="gap-3"         // 12px - desktop default

// Between sections
className="py-6"          // 24px - section spacing
className="gap-6"         // 24px - grid/layout gaps
```

---

## Header Component

### Slim Top Bar Pattern

```tsx
// components/layout/desktop/desktop-header.tsx
"use client"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Heart,
  ChatCircle,
  Bell,
  Camera,
  ShoppingCart,
  MagnifyingGlass,
  CaretDown,
  User,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface DesktopHeaderProps {
  locale: string
  user?: { id: string; email?: string } | null
  onSearchClick?: () => void
}

export function DesktopHeader({ locale, user, onSearchClick }: DesktopHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + User Cluster */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold tracking-tight text-foreground">
              treido.
            </span>
          </Link>
          
          {user && <UserDropdown user={user} locale={locale} />}
        </div>

        {/* Center: Search Bar */}
        <SearchButton locale={locale} onClick={onSearchClick} />

        {/* Right: Actions */}
        <HeaderActions user={user} locale={locale} />
      </div>
    </header>
  )
}

// Extracted sub-components for maintainability
function UserDropdown({ user, locale }: { user: { email?: string }; locale: string }) {
  const displayName = user.email?.split("@")[0] || "User"
  
  return (
    <div className="hidden lg:block">
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-muted/40 border border-border/30",
          "hover:bg-muted/60 hover:border-border/50",
          "transition-all duration-150"
        )}>
          <div className="size-7 rounded-full bg-muted flex items-center justify-center">
            <User size={14} weight="regular" className="text-muted-foreground" />
          </div>
          <div className="text-left text-sm">
            <span className="text-muted-foreground text-xs block leading-none">
              {locale === "bg" ? "Здравей," : "Hello,"}
            </span>
            <span className="font-medium text-foreground leading-tight">
              {displayName}
            </span>
          </div>
          <CaretDown size={12} weight="bold" className="text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-48">
          <DropdownMenuItem asChild>
            <Link href="/account">
              {locale === "bg" ? "Моят профил" : "My Profile"}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/orders">
              {locale === "bg" ? "Поръчки" : "Orders"}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/auth/logout">
              {locale === "bg" ? "Изход" : "Log out"}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function SearchButton({ locale, onClick }: { locale: string; onClick?: () => void }) {
  return (
    <div className="flex-1 max-w-2xl">
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 h-11 px-4 rounded-full",
          "bg-muted/40 border border-border/50",
          "text-muted-foreground text-sm text-left",
          "hover:bg-muted/60 hover:border-border hover:shadow-sm",
          "active:bg-muted/70",
          "transition-all duration-150",
        )}
      >
        <MagnifyingGlass size={18} weight="regular" className="shrink-0" />
        <span className="flex-1 truncate">
          {locale === "bg" 
            ? "Търсене в продукти, марки и още..." 
            : "Search products, brands and more..."}
        </span>
        <div className="shrink-0 size-8 rounded-full bg-foreground flex items-center justify-center">
          <MagnifyingGlass size={14} weight="bold" className="text-background" />
        </div>
      </button>
    </div>
  )
}

function HeaderActions({ user, locale }: { user?: { id: string } | null; locale: string }) {
  // Shared icon button styles
  const iconButtonClass = cn(
    "size-10 rounded-lg",
    "text-muted-foreground hover:text-foreground",
    "hover:bg-muted/50 border border-transparent hover:border-border/40",
    "transition-all duration-150"
  )

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className={iconButtonClass} asChild>
        <Link href="/wishlist" aria-label={locale === "bg" ? "Любими" : "Wishlist"}>
          <Heart size={22} weight="regular" />
        </Link>
      </Button>
      
      {user && (
        <>
          <Button variant="ghost" size="icon" className={iconButtonClass} asChild>
            <Link href="/messages" aria-label={locale === "bg" ? "Съобщения" : "Messages"}>
              <ChatCircle size={22} weight="regular" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className={cn(iconButtonClass, "relative")}>
            <Bell size={22} weight="regular" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-notification rounded-full" />
          </Button>
        </>
      )}
      
      <Button variant="ghost" size="icon" className={iconButtonClass} asChild>
        <Link href="/sell" aria-label={locale === "bg" ? "Продай" : "Sell"}>
          <Camera size={22} weight="regular" />
        </Link>
      </Button>

      <Button variant="ghost" size="icon" className={cn(iconButtonClass, "relative")} asChild>
        <Link href="/cart" aria-label={locale === "bg" ? "Количка" : "Cart"}>
          <ShoppingCart size={22} weight="regular" />
          <span className="absolute -top-0.5 -right-0.5 size-5 bg-cart-badge text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </Link>
      </Button>

      {!user && (
        <div className="flex items-center gap-2 ml-2">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-foreground hover:text-foreground/80 px-3 py-2"
          >
            {locale === "bg" ? "Вход" : "Sign In"}
          </Link>
          <Link
            href="/auth/sign-up"
            className="text-sm font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-md"
          >
            {locale === "bg" ? "Регистрация" : "Register"}
          </Link>
        </div>
      )}
    </div>
  )
}
```

### Header Design Tokens

```css
/* Already in globals.css - just reference these */
--header-h: 4rem;          /* h-16 = 64px */
--header-bg: var(--background);
--header-border: var(--border);
```

---

## Sidebar Components

### Category Sidebar

```tsx
// components/navigation/category-sidebar.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/lib/category-icons"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { ArrowLeft, SquaresFour, CaretRight, CaretDown, CaretUp } from "@phosphor-icons/react"

export interface CategoryPath {
  slug: string
  name: string
}

interface CategorySidebarProps {
  categories: CategoryTreeNode[]
  locale: string
  selectedPath: CategoryPath[]
  onCategorySelect: (path: CategoryPath[], category: CategoryTreeNode | null) => void
  categoryCounts?: Record<string, number>
  initialVisibleCount?: number
  className?: string
}

export function CategorySidebar({
  categories,
  locale,
  selectedPath,
  onCategorySelect,
  categoryCounts = {},
  initialVisibleCount = 12,
  className,
}: CategorySidebarProps) {
  const [viewLevel, setViewLevel] = useState(0)
  const [currentL0, setCurrentL0] = useState<CategoryTreeNode | null>(null)
  const [currentL1, setCurrentL1] = useState<CategoryTreeNode | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // ... (drill-down logic - see desktop-category-sidebar.tsx)

  // Button style tokens
  const itemBase = cn(
    "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md",
    "text-sm transition-colors text-left min-h-9",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  )
  const itemActive = cn(itemBase, "bg-foreground text-background font-medium")
  const itemInactive = cn(itemBase, "text-muted-foreground hover:bg-muted hover:text-foreground")

  return (
    <div className={cn("rounded-lg border border-border bg-card shadow-sm", className)}>
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          {locale === "bg" ? "Категории" : "Categories"}
        </h2>
      </div>
      
      <nav className="p-1.5 space-y-0.5">
        {/* Category items render here */}
      </nav>
    </div>
  )
}
```

### Filter Card

```tsx
// components/filters/filter-card.tsx
"use client"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface FilterState {
  priceMin: string
  priceMax: string
  condition: string | null
}

interface FilterCardProps {
  locale: string
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onApply: () => void
  className?: string
}

export function FilterCard({
  locale,
  filters,
  onFiltersChange,
  onApply,
  className,
}: FilterCardProps) {
  const conditions = [
    { id: "new", label: locale === "bg" ? "Ново" : "New" },
    { id: "like_new", label: locale === "bg" ? "Като ново" : "Like new" },
    { id: "used", label: locale === "bg" ? "Използвано" : "Used" },
  ]

  const hasActiveFilters = 
    filters.priceMin !== "" || 
    filters.priceMax !== "" || 
    filters.condition !== null

  return (
    <div className={cn("rounded-lg border border-border bg-card shadow-sm", className)}>
      <div className="px-3 py-2.5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          {locale === "bg" ? "Филтри" : "Filters"}
        </h3>
      </div>
      
      <div className="px-3 py-3 space-y-4">
        {/* Price Range */}
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

        {/* Condition Pills */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            {locale === "bg" ? "Състояние" : "Condition"}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {conditions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onFiltersChange({ 
                  ...filters, 
                  condition: filters.condition === c.id ? null : c.id 
                })}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full transition-colors",
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

        <Button 
          size="sm" 
          onClick={onApply} 
          disabled={!hasActiveFilters} 
          className="w-full h-9 text-sm font-medium"
        >
          {locale === "bg" ? "Приложи" : "Apply"}
        </Button>
      </div>
    </div>
  )
}
```

---

## Product Grid

### Grid Container with Container Queries

```tsx
// components/shared/product/product-grid-container.tsx
"use client"

import { cn } from "@/lib/utils"
import { ProductCard } from "./product-card"
import { ProductCardList } from "./product-card-list"

interface ProductGridContainerProps {
  products: Product[]
  viewMode: "grid" | "list"
  className?: string
}

export function ProductGridContainer({
  products,
  viewMode,
  className,
}: ProductGridContainerProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 shadow-sm", className)}>
      <div className="@container" role="list" aria-live="polite">
        <div className={cn(
          viewMode === "list"
            ? "flex flex-col gap-3"
            : cn(
                "grid gap-4",
                // Container query breakpoints
                "grid-cols-2",
                "@[520px]:grid-cols-3",
                "@[720px]:grid-cols-4",
                "@[960px]:grid-cols-5"
              )
        )}>
          {products.map((product, index) => (
            <div key={product.id} role="listitem">
              {viewMode === "list" ? (
                <ProductCardList {...product} />
              ) : (
                <ProductCard {...product} index={index} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Grid Breakpoint Strategy

| Container Width | Columns | Rationale |
|-----------------|---------|-----------|
| < 520px | 2 | Minimum viable for mobile-like |
| 520px+ | 3 | Tablet/narrow desktop |
| 720px+ | 4 | Standard desktop |
| 960px+ | 5 | Wide desktop |

---

## Toolbar & Controls

### Sort Dropdown

```tsx
// components/shared/toolbar/sort-dropdown.tsx
"use client"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  TrendUp,
  ChartLineUp,
  Eye,
  Star,
  Percent,
  Fire,
  Tag,
  CaretDown,
  Check,
} from "@phosphor-icons/react"

type SortOption = "newest" | "best_sellers" | "most_viewed" | "top_rated" | "deals" | "promoted" | "price_low"

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
  locale: string
}

const SORT_OPTIONS: { id: SortOption; labelEn: string; labelBg: string; icon: typeof TrendUp }[] = [
  { id: "newest", labelEn: "Newest", labelBg: "Най-нови", icon: TrendUp },
  { id: "best_sellers", labelEn: "Best Sellers", labelBg: "Топ продажби", icon: ChartLineUp },
  { id: "most_viewed", labelEn: "Most Viewed", labelBg: "Най-гледани", icon: Eye },
  { id: "top_rated", labelEn: "Top Rated", labelBg: "Най-високо оценени", icon: Star },
  { id: "deals", labelEn: "Deals", labelBg: "Намаления", icon: Percent },
  { id: "promoted", labelEn: "Promoted", labelBg: "Промотирани", icon: Fire },
  { id: "price_low", labelEn: "Price: Low to High", labelBg: "Цена: Ниска към висока", icon: Tag },
]

export function SortDropdown({ value, onChange, locale }: SortDropdownProps) {
  const activeOption = SORT_OPTIONS.find(o => o.id === value) ?? SORT_OPTIONS[0]!
  const ActiveIcon = activeOption.icon
  const label = locale === "bg" ? activeOption.labelBg : activeOption.labelEn

  return (
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
          <span>{label}</span>
          <CaretDown size={12} weight="bold" className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {SORT_OPTIONS.map((option) => {
          const Icon = option.icon
          const isActive = value === option.id
          const optionLabel = locale === "bg" ? option.labelBg : option.labelEn
          
          return (
            <DropdownMenuItem
              key={option.id}
              onClick={() => onChange(option.id)}
              className={cn(
                "cursor-pointer flex items-center gap-2",
                isActive && "bg-muted font-medium"
              )}
            >
              <span className="w-4 flex items-center justify-center">
                {isActive && <Check size={14} weight="bold" />}
              </span>
              <Icon size={14} weight={isActive ? "fill" : "regular"} />
              {optionLabel}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### View Toggle

```tsx
// components/shared/toolbar/view-toggle.tsx
"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SquaresFour, Rows } from "@phosphor-icons/react"

interface ViewToggleProps {
  value: "grid" | "list"
  onChange: (value: "grid" | "list") => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="relative flex items-center rounded-lg border border-border/50 bg-muted/30 p-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("grid")}
        className={cn(
          "size-8 rounded-md transition-all duration-150",
          value === "grid"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        aria-label="Grid view"
        aria-pressed={value === "grid"}
      >
        <SquaresFour size={16} weight={value === "grid" ? "fill" : "regular"} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("list")}
        className={cn(
          "size-8 rounded-md transition-all duration-150",
          value === "list"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        aria-label="List view"
        aria-pressed={value === "list"}
      >
        <Rows size={16} weight={value === "list" ? "fill" : "regular"} />
      </Button>
    </div>
  )
}
```

### Toolbar Row

```tsx
// components/shared/toolbar/toolbar-row.tsx
"use client"

import { cn } from "@/lib/utils"
import { SortDropdown } from "./sort-dropdown"
import { ViewToggle } from "./view-toggle"

interface ToolbarRowProps {
  productCount: number
  sortValue: SortOption
  onSortChange: (value: SortOption) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  locale: string
  /** Optional left slot for filter pills */
  filterSlot?: React.ReactNode
  className?: string
}

export function ToolbarRow({
  productCount,
  sortValue,
  onSortChange,
  viewMode,
  onViewModeChange,
  locale,
  filterSlot,
  className,
}: ToolbarRowProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-3", className)}>
      <div className="flex items-center gap-3">
        {/* Left: Filter pills (optional) */}
        {filterSlot && (
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar">
            {filterSlot}
          </div>
        )}
        
        {/* Right: Count + Sort + View */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {productCount.toLocaleString()} {locale === "bg" ? "обяви" : "listings"}
          </span>
          <SortDropdown value={sortValue} onChange={onSortChange} locale={locale} />
          <ViewToggle value={viewMode} onChange={onViewModeChange} />
        </div>
      </div>
    </div>
  )
}
```

---

## Theming & Tokens

### Color Tokens (from globals.css)

```css
/* Semantic colors - ALWAYS use these, never raw colors */
:root {
  /* Surfaces */
  --background: oklch(1.0000 0 0);           /* Page canvas */
  --card: oklch(0.9784 0.0011 197.1387);     /* Elevated surfaces */
  --muted: oklch(0.9222 0.0013 286.3737);    /* Subdued backgrounds */
  
  /* Text */
  --foreground: oklch(0.1884 0.0128 248.5103);        /* Primary text */
  --muted-foreground: oklch(0.1884 0.0128 248.5103);  /* Secondary text */
  
  /* Borders */
  --border: oklch(0.9317 0.0118 231.6594);
  
  /* Interactive */
  --ring: oklch(0.6818 0.1584 243.3540);     /* Focus rings */
}
```

### Usage in Components

```tsx
// ✅ CORRECT - Use semantic tokens
className="bg-background"
className="bg-card"
className="bg-muted/40"
className="text-foreground"
className="text-muted-foreground"
className="border-border"
className="border-border/50"

// ❌ WRONG - Never hardcode colors
className="bg-white"
className="bg-gray-100"
className="text-black"
className="border-gray-200"
```

### Active State Pattern

For pills, tabs, and toggles - use inverted foreground:

```tsx
// Active state
className="bg-foreground text-background"

// Inactive state  
className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
```

### Transition Tokens

```tsx
// Standard hover transitions
className="transition-colors"           // Color only
className="transition-all duration-150" // All properties, 150ms

// Never use transform animations per design system
// ❌ className="hover:scale-105"
```

---

## Responsive Patterns

### Breakpoint Reference

| Breakpoint | Width | Use |
|------------|-------|-----|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets, show desktop header |
| `lg` | 1024px | Desktop, show sidebar |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

### Hide/Show Patterns

```tsx
// Hide on mobile, show on desktop
className="hidden lg:flex"
className="hidden lg:block"

// Show on mobile, hide on desktop  
className="lg:hidden"
className="md:hidden"

// Responsive grid
className="grid-cols-1 lg:grid-cols-[280px_1fr]"
```

### Container Queries vs Media Queries

```tsx
// Container queries - for component-internal layouts
// Responds to parent container width
<div className="@container">
  <div className="grid-cols-2 @[520px]:grid-cols-3">
  
// Media queries - for page-level layouts
// Responds to viewport width
<div className="hidden lg:block">
```

---

## Migration Steps

### Phase 1: Extract Components (Low Risk)

1. **Create shared toolbar components**
   ```bash
   components/shared/toolbar/
   ├── sort-dropdown.tsx
   ├── view-toggle.tsx
   └── toolbar-row.tsx
   ```

2. **Create filter components**
   ```bash
   components/filters/
   ├── filter-card.tsx
   ├── price-filter.tsx
   └── condition-filter.tsx
   ```

3. **Test components in isolation** in `/demo/desktop`

### Phase 2: Create Layout Shell (Medium Risk)

1. **Create desktop layout orchestrator**
   ```bash
   components/layout/desktop/
   ├── desktop-layout.tsx
   ├── desktop-header.tsx
   └── desktop-sidebar.tsx
   ```

2. **Update `/demo/desktop` to use new components**
   - Keep demo as testing ground
   - Verify all features work

### Phase 3: Integrate with Main Pages (Higher Risk)

1. **Create new route group for desktop layout**
   ```bash
   app/[locale]/(desktop)/
   ├── layout.tsx           # Uses DesktopLayout
   ├── page.tsx             # Homepage
   └── categories/
       └── [slug]/page.tsx
   ```

2. **Gradually migrate routes**
   - Start with `/categories` pages
   - Then homepage
   - Keep old routes available during transition

### Phase 4: Cleanup

1. Remove demo-specific code from production components
2. Delete legacy layout components
3. Update documentation
4. Run full E2E test suite

---

## Checklist

```markdown
## Component Extraction
- [ ] SortDropdown extracted and typed
- [ ] ViewToggle extracted and typed
- [ ] ToolbarRow extracted and typed
- [ ] FilterCard extracted and typed
- [ ] CategorySidebar extracted and typed
- [ ] ProductGridContainer extracted and typed

## Layout Shell
- [ ] DesktopLayout created
- [ ] DesktopHeader created
- [ ] Sidebar slot system working

## Integration
- [ ] Demo page using new components
- [ ] Typecheck passing
- [ ] E2E smoke tests passing
- [ ] No visual regressions

## Documentation
- [ ] Component props documented
- [ ] Usage examples added
- [ ] DESIGN.md updated if needed
```

---

## Quick Reference: Copy-Paste Patterns

### Card Container
```tsx
className="rounded-lg border border-border bg-card p-4 shadow-sm"
```

### Icon Button with Hover Border
```tsx
className={cn(
  "size-10 rounded-lg",
  "text-muted-foreground hover:text-foreground",
  "hover:bg-muted/50 border border-transparent hover:border-border/40",
  "transition-all duration-150"
)}
```

### Active Pill
```tsx
className="bg-foreground text-background font-medium"
```

### Inactive Pill
```tsx
className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
```

### Responsive Grid
```tsx
className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6"
```

### Container Query Grid
```tsx
className="grid gap-4 grid-cols-2 @[520px]:grid-cols-3 @[720px]:grid-cols-4 @[960px]:grid-cols-5"
```

### Sticky Sidebar
```tsx
className="hidden lg:flex flex-col gap-4 sticky top-20 self-start"
```
