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
import { useAuthOptional } from "@/components/providers/auth-state-manager"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
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
  /** Product ID for wishlist */
  productId?: string | null
  /** Product price for wishlist */
  productPrice?: number | null
  /** Product image for wishlist */
  productImage?: string | null
  
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
  
  // Assistant: /assistant - AI shopping assistant
  if (pathWithoutLocale.startsWith("/assistant")) {
    return { variant: "contextual" }
  }
  
  // Product pages: /{username}/{productSlug} (2+ segments, not a known route)
  // Known routes start with: /search, /cart, /checkout, /account, /sell, /plans, /auth
  const segments = pathWithoutLocale.split("/").filter(Boolean)
  const knownRoutes = ["search", "cart", "checkout", "account", "sell", "plans", "auth", "categories", "api", "assistant"]
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
  productId,
  productPrice,
  productImage,
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
  const auth = useAuthOptional()
  const effectiveUser = auth ? (auth.isLoading ? user : auth.user) : user

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const locale = useLocale()
  const tNav = useTranslations("Navigation")
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
  
  // Avoid hydration mismatch when other client boundaries update HeaderProvider state
  // before the header boundary itself hydrates (e.g., ProductHeaderSync on PDP).
  const hydratedContextualHeader = isHydrated ? headerContext?.contextualHeader : null
  const effectiveContextualTitle = hydratedContextualHeader?.title ?? contextualTitle
  const effectiveContextualBackHref = hydratedContextualHeader?.backHref ?? contextualBackHref
  const effectiveContextualBack = hydratedContextualHeader?.onBack ?? onContextualBack
  const effectiveContextualSubcategories =
    hydratedContextualHeader?.subcategories ?? contextualSubcategories
  const effectiveContextualSubcategoryClick =
    hydratedContextualHeader?.onSubcategoryClick ?? onSubcategoryClick
  const effectiveContextualHideActions = hydratedContextualHeader?.hideActions ?? false

  const hydratedProductHeader = isHydrated ? headerContext?.productHeader : null
  const effectiveProductTitle = hydratedProductHeader?.productTitle ?? productTitle
  const effectiveSellerName = hydratedProductHeader?.sellerName ?? sellerName
  const effectiveSellerUsername = hydratedProductHeader?.sellerUsername ?? sellerUsername
  const effectiveSellerAvatarUrl = hydratedProductHeader?.sellerAvatarUrl ?? sellerAvatarUrl
  const effectiveProductId = hydratedProductHeader?.productId ?? productId
  const effectiveProductPrice = hydratedProductHeader?.productPrice ?? productPrice
  const effectiveProductImage = hydratedProductHeader?.productImage ?? productImage

  const searchPlaceholder = tNav("searchPlaceholderShort")

  // Mark header as hydrated for E2E tests
  useEffect(() => {
    headerRef.current?.setAttribute("data-hydrated", "true")
    setIsHydrated(true)
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
            user={effectiveUser}
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
            user={effectiveUser}
            categories={categories}
            userStats={userStats}
            productTitle={effectiveProductTitle}
            sellerName={effectiveSellerName}
            sellerUsername={effectiveSellerUsername}
            sellerAvatarUrl={effectiveSellerAvatarUrl}
            productId={effectiveProductId}
            productPrice={effectiveProductPrice}
            productImage={effectiveProductImage}
            onBack={() => router.back()}
            locale={locale}
          />
        )
      case "contextual":
        return (
          <MobileContextualHeader
            user={effectiveUser}
            categories={categories}
            userStats={userStats}
            title={effectiveContextualTitle}
            backHref={effectiveContextualBackHref}
            onBack={effectiveContextualBack}
            subcategories={effectiveContextualSubcategories}
            onSubcategoryClick={effectiveContextualSubcategoryClick}
            hideActions={effectiveContextualHideActions}
            locale={locale}
          />
        )
      case "minimal":
        return <MobileMinimalHeader locale={locale} />
      default:
        return (
          <MobileDefaultHeader
            user={effectiveUser}
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
    return <DesktopStandardHeader user={effectiveUser} locale={locale} />
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
        data-slot="app-header"
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

