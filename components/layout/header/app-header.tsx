"use client"

// =============================================================================
// APP HEADER — Main entry point for all header variants
//
// Single source of truth for headers across the app.
// Uses CSS-based responsive design (md:hidden / hidden md:block).
// Auto-detects route via usePathname() and renders appropriate variant.
// Uses HeaderContext for dynamic props from pages.
//
// Variants:
// - default:    Standard pages (hamburger + logo + search below + actions)
// - homepage:   Homepage (inline search + category pills on mobile)
// - product:    Product pages (back + seller + share on mobile)
// - contextual: Category browsing (back + title + subcategory circles)
// - minimal:    Auth/checkout (just logo)
// =============================================================================

import {
  MobileDefaultHeader,
  MobileHomepageHeader,
  MobileProductHeader,
  MobileContextualHeader,
  MobileMinimalHeader,
} from "./mobile"
import {
  DesktopStandardHeader,
  DesktopMinimalHeader,
} from "./desktop"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { useHeaderOptional } from "@/components/providers/header-context"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale } from "next-intl"
import type { User } from "@supabase/supabase-js"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UserListingStats } from "@/components/layout/sidebar/sidebar-menu-v2"
import type { HeaderVariant } from "./types"

// =============================================================================
// Props
// =============================================================================

export interface AppHeaderProps {
  /** Header rendering variant */
  variant?: HeaderVariant
  /** Authenticated user */
  user: User | null
  /** Categories for navigation */
  categories?: CategoryTreeNode[]
  /** User listing stats for hamburger menu footer */
  userStats?: UserListingStats
  
  // Homepage variant props
  /** Active category slug for homepage pills */
  activeCategory?: string
  /** Callback when category pill is selected */
  onCategorySelect?: (slug: string) => void
  /** Callback to open search overlay */
  onSearchOpen?: () => void
  
  // Product variant props
  /** Product title for product header */
  productTitle?: string | null
  /** Seller name for product header */
  sellerName?: string | null
  /** Seller username for profile link */
  sellerUsername?: string | null
  /** Seller avatar URL */
  sellerAvatarUrl?: string | null
  
  // Contextual variant props
  /** Title for contextual header (category name) */
  contextualTitle?: string
  /** Back href for contextual header */
  contextualBackHref?: string
  /** Back handler for instant navigation */
  onContextualBack?: () => void
  /** Subcategories for contextual circles */
  contextualSubcategories?: CategoryTreeNode[]
  /** Callback when subcategory circle is clicked */
  onSubcategoryClick?: (cat: CategoryTreeNode) => void
  
  // Legacy props (for gradual migration)
  hideSubheader?: boolean
  hideOnMobile?: boolean
  hideOnDesktop?: boolean
}

// Re-export types
export type { HeaderVariant } from "./types"

// =============================================================================
// Route Detection Helper
// =============================================================================

type RouteConfig = {
  variant: HeaderVariant
}

function detectRouteConfig(pathname: string, explicitVariant?: HeaderVariant): RouteConfig {
  // If explicit variant is provided, use it
  if (explicitVariant) {
    return { variant: explicitVariant }
  }
  
  // Strip locale prefix (e.g., /en, /bg)
  const pathWithoutLocale = pathname.replace(/^\/(en|bg)/, "") || "/"
  
  // Homepage: / or empty
  if (pathWithoutLocale === "/" || pathWithoutLocale === "") {
    return { variant: "homepage" }
  }
  
  // Categories: /categories or /categories/* 
  if (pathWithoutLocale.startsWith("/categories")) {
    return { variant: "contextual" }
  }
  
  // Product pages: /{username}/{productSlug} (2+ segments, not a known route)
  // Known routes start with: /search, /cart, /checkout, /account, /sell, /plans, /auth
  const segments = pathWithoutLocale.split("/").filter(Boolean)
  const knownRoutes = ["search", "cart", "checkout", "account", "sell", "plans", "auth", "categories", "api"]
  if (segments.length >= 2 && segments[0] && !knownRoutes.includes(segments[0])) {
    return { variant: "product" }
  }
  
  // Default for everything else
  return { variant: "default" }
}

// =============================================================================
// Main Component
// =============================================================================

export function AppHeader({
  variant: explicitVariant,
  user,
  categories = [],
  userStats,
  // Homepage props
  activeCategory = "all",
  onCategorySelect,
  onSearchOpen,
  // Product props
  productTitle,
  sellerName,
  sellerUsername,
  sellerAvatarUrl,
  // Contextual props
  contextualTitle,
  contextualBackHref = "/categories",
  onContextualBack,
  contextualSubcategories = [],
  onSubcategoryClick,
  // Legacy
  hideSubheader = false,
  hideOnMobile = false,
  hideOnDesktop = false,
}: AppHeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  
  // Get dynamic header state from context (if provided by pages)
  const headerContext = useHeaderOptional()
  
  // Auto-detect route config from pathname
  const routeConfig = detectRouteConfig(pathname, explicitVariant)
  const variant = routeConfig.variant

  // Merge props with context values (context takes precedence for dynamic state)
  const effectiveHomepageCategory = headerContext?.homepageHeader?.activeCategory ?? activeCategory
  const effectiveHomepageCategorySelect = headerContext?.homepageHeader?.onCategorySelect ?? onCategorySelect
  const effectiveHomepageSearchOpen = headerContext?.homepageHeader?.onSearchOpen ?? onSearchOpen
  const effectiveHomepageCategories = headerContext?.homepageHeader?.categories ?? categories
  
  const effectiveContextualTitle = headerContext?.contextualHeader?.title ?? contextualTitle
  const effectiveContextualBackHref = headerContext?.contextualHeader?.backHref ?? contextualBackHref
  const effectiveContextualBack = headerContext?.contextualHeader?.onBack ?? onContextualBack
  const effectiveContextualSubcategories = headerContext?.contextualHeader?.subcategories ?? contextualSubcategories
  const effectiveContextualSubcategoryClick = headerContext?.contextualHeader?.onSubcategoryClick ?? onSubcategoryClick

  const effectiveProductTitle = headerContext?.productHeader?.productTitle ?? productTitle
  const effectiveSellerName = headerContext?.productHeader?.sellerName ?? sellerName
  const effectiveSellerUsername = headerContext?.productHeader?.sellerUsername ?? sellerUsername
  const effectiveSellerAvatarUrl = headerContext?.productHeader?.sellerAvatarUrl ?? sellerAvatarUrl

  const searchPlaceholder = locale === "bg" ? "Търсене..." : "Search..."

  // Mark header as hydrated for E2E tests
  useEffect(() => {
    headerRef.current?.setAttribute("data-hydrated", "true")
  }, [])

  // Handle search open
  const handleSearchOpen = () => {
    if (effectiveHomepageSearchOpen) {
      effectiveHomepageSearchOpen()
    } else if (onSearchOpen) {
      onSearchOpen()
    } else {
      setIsMobileSearchOpen(true)
    }
  }

  // ==========================================================================
  // MOBILE HEADER VARIANTS
  // ==========================================================================

  const renderMobileHeader = () => {
    switch (variant) {
      case "homepage":
        return (
          <MobileHomepageHeader
            user={user}
            categories={effectiveHomepageCategories}
            userStats={userStats}
            activeCategory={effectiveHomepageCategory}
            onCategorySelect={effectiveHomepageCategorySelect}
            onSearchOpen={handleSearchOpen}
            locale={locale}
          />
        )
      case "product":
        return (
          <MobileProductHeader
            user={user}
            categories={categories}
            userStats={userStats}
            productTitle={effectiveProductTitle}
            sellerName={effectiveSellerName}
            sellerUsername={effectiveSellerUsername}
            sellerAvatarUrl={effectiveSellerAvatarUrl}
            onBack={() => router.back()}
            locale={locale}
          />
        )
      case "contextual":
        return (
          <MobileContextualHeader
            user={user}
            categories={categories}
            userStats={userStats}
            title={effectiveContextualTitle}
            backHref={effectiveContextualBackHref}
            onBack={effectiveContextualBack}
            subcategories={effectiveContextualSubcategories}
            onSubcategoryClick={effectiveContextualSubcategoryClick}
            locale={locale}
          />
        )
      case "minimal":
        return <MobileMinimalHeader locale={locale} />
      default:
        return (
          <MobileDefaultHeader
            user={user}
            categories={categories}
            userStats={userStats}
            onSearchOpen={handleSearchOpen}
            searchPlaceholder={searchPlaceholder}
            locale={locale}
          />
        )
    }
  }

  // ==========================================================================
  // DESKTOP HEADER VARIANTS
  // ==========================================================================

  const renderDesktopHeader = () => {
    // Minimal shows simplified desktop header
    if (variant === "minimal") return <DesktopMinimalHeader locale={locale} />
    // Homepage, contextual, and default use standard desktop layout
    return <DesktopStandardHeader user={user} locale={locale} />
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  // Hide conditions
  const shouldHide = hideOnMobile && hideOnDesktop

  if (shouldHide) return null

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 w-full flex flex-col",
          variant !== "homepage" && variant !== "contextual" && "bg-header-bg",
          hideOnMobile && "hidden md:flex md:flex-col",
          hideOnDesktop && "md:hidden"
        )}
      >
        {renderMobileHeader()}
        {renderDesktopHeader()}
      </header>

      {/* Search Overlay - for variants that use internal search state */}
      {(variant === "default" || (!effectiveHomepageSearchOpen && !onSearchOpen)) && (
        <MobileSearchOverlay
          hideDefaultTrigger
          externalOpen={isMobileSearchOpen}
          onOpenChange={setIsMobileSearchOpen}
        />
      )}
    </>
  )
}

