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
// - contextual: Category browsing (back + title; scope pills render in page content)
// - minimal:    Auth/checkout (just logo)
// =============================================================================

import {
  MobileHomepageHeader,
  MobileProductHeader,
  MobileContextualHeader,
  MobileProfileHeader,
  MobileMinimalHeader,
} from "@/components/layout/header/mobile"
import {
  DesktopStandardHeader,
  DesktopMinimalHeader,
} from "@/components/layout/header/desktop"
import { MobileSearchOverlay } from "./search/mobile-search-overlay"
import { useHeaderOptional } from "@/components/providers/header-context"
import { useAuthOptional } from "@/components/providers/auth-state-manager"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale } from "next-intl"
import type { User } from "@supabase/supabase-js"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UserListingStats } from "@/components/layout/sidebar/sidebar-menu"
import type { HeaderVariant } from "@/components/layout/header/types"

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
  /** Active category slug (for subtle active highlight during instant navigation). */
  contextualActiveSlug?: string
  /** Back href for contextual header */
  contextualBackHref?: string
  /** Back handler for instant navigation */
  onContextualBack?: () => void
  /** Subcategories for contextual pill rail state */
  contextualSubcategories?: CategoryTreeNode[]
  /** Callback when subcategory pill is clicked */
  onSubcategoryClick?: (cat: CategoryTreeNode) => void
  
  // Legacy props (for gradual migration)
  hideSubheader?: boolean
  hideOnMobile?: boolean
  hideOnDesktop?: boolean
}

// Re-export types
export type { HeaderVariant } from "@/components/layout/header/types"

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

  // Search: reuse the homepage mobile header (inline search) to avoid the legacy "search bar under header" layout
  if (pathWithoutLocale.startsWith("/search")) {
    return { variant: "homepage" }
  }

  // Sellers directory uses the shopping-style mobile header.
  if (pathWithoutLocale.startsWith("/sellers")) {
    return { variant: "homepage" }
  }

  // Known routes start with: /search, /cart, /checkout, /account, /sell, /plans, /auth
  const segments = pathWithoutLocale.split("/").filter(Boolean)
  const knownRoutes = ["search", "sellers", "cart", "checkout", "account", "sell", "plans", "auth", "categories", "api", "assistant"]
  
  // Product pages: /{username}/{productSlug} (2+ segments, not a known route)
  if (segments.length >= 2 && segments[0] && !knownRoutes.includes(segments[0])) {
    return { variant: "product" }
  }
  
  // Profile pages: /{username} (1 segment, not a known route) - use profile header
  if (segments.length === 1 && segments[0] && !knownRoutes.includes(segments[0])) {
    return { variant: "profile" }
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
  contextualActiveSlug,
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
  const router = useRouter()
  const pathname = usePathname()
  
  // Get dynamic header state from context (if provided by pages)
  const headerContext = useHeaderOptional()
  const hydratedHeaderState = isHydrated ? headerContext?.headerState ?? null : null
  const homepageHeaderState = hydratedHeaderState?.type === "homepage" ? hydratedHeaderState.value : null
  const contextualHeaderState = hydratedHeaderState?.type === "contextual" ? hydratedHeaderState.value : null
  const productHeaderState = hydratedHeaderState?.type === "product" ? hydratedHeaderState.value : null
  const profileHeaderState = hydratedHeaderState?.type === "profile" ? hydratedHeaderState.value : null
  
  // Auto-detect route config from pathname
  const routeConfig = detectRouteConfig(pathname, explicitVariant)
  const variant = routeConfig.variant

  // Merge props with context values (context takes precedence for dynamic state)
  const effectiveHomepageCategory = homepageHeaderState?.activeCategory ?? activeCategory
  const effectiveHomepageCategorySelect = homepageHeaderState?.onCategorySelect ?? onCategorySelect
  const effectiveHomepageSearchOpen = homepageHeaderState?.onSearchOpen ?? onSearchOpen
  
  // Avoid hydration mismatch when other client boundaries update HeaderProvider state
  // before the header boundary itself hydrates (e.g., ProductHeaderSync on PDP).
  const effectiveContextualTitle = contextualHeaderState?.title ?? contextualTitle
  const effectiveContextualActiveSlug =
    contextualHeaderState?.activeSlug ?? contextualActiveSlug
  const effectiveContextualBackHref = contextualHeaderState?.backHref ?? contextualBackHref
  const effectiveContextualBack = contextualHeaderState?.onBack ?? onContextualBack
  const effectiveContextualSubcategories =
    contextualHeaderState?.subcategories ?? contextualSubcategories
  const effectiveContextualSubcategoryClick =
    contextualHeaderState?.onSubcategoryClick ?? onSubcategoryClick
  const effectiveContextualHideActions = contextualHeaderState?.hideActions ?? false

  const effectiveProductTitle = productHeaderState?.productTitle ?? productTitle
  const effectiveSellerName = productHeaderState?.sellerName ?? sellerName
  const effectiveSellerUsername = productHeaderState?.sellerUsername ?? sellerUsername
  const effectiveSellerAvatarUrl = productHeaderState?.sellerAvatarUrl ?? sellerAvatarUrl
  const effectiveProductId = productHeaderState?.productId ?? productId
  const effectiveProductPrice = productHeaderState?.productPrice ?? productPrice
  const effectiveProductImage = productHeaderState?.productImage ?? productImage

  // Profile header context (for profile pages)
  const effectiveProfileDisplayName = profileHeaderState?.displayName ?? null
  const effectiveProfileUsername = profileHeaderState?.username ?? null
  const effectiveProfileAvatarUrl = profileHeaderState?.avatarUrl ?? null
  const effectiveProfileIsOwn = profileHeaderState?.isOwnProfile ?? false
  const effectiveProfileIsFollowing = profileHeaderState?.isFollowing ?? false
  const effectiveProfileSellerId = profileHeaderState?.sellerId ?? null

  // Mark header as hydrated for E2E tests
  useEffect(() => {
    headerRef.current?.setAttribute("data-hydrated", "true")
    setIsHydrated(true)
  }, [])

  // Mobile header is fixed (not sticky) to avoid scroll-lock breaking sticky positioning
  // when drawers/sheets open. Keep content alignment via a measured CSS var.
  useEffect(() => {
    const headerEl = headerRef.current
    if (!headerEl) return

    const updateOffset = () => {
      const height = headerEl.getBoundingClientRect().height
      if (!Number.isFinite(height) || height <= 0) return
      document.documentElement.style.setProperty("--app-header-offset", `${Math.ceil(height)}px`)
    }

    updateOffset()

    const ro = new ResizeObserver(() => {
      updateOffset()
    })
    ro.observe(headerEl)

    return () => {
      ro.disconnect()
    }
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

  const homepageMobileHeader = (
    <MobileHomepageHeader
      user={effectiveUser}
      userStats={userStats}
      activeCategory={effectiveHomepageCategory}
      onCategorySelect={effectiveHomepageCategorySelect}
      onSearchOpen={handleSearchOpen}
      locale={locale}
    />
  )

  const renderMobileHeader = () => {
    switch (variant) {
      case "homepage":
        return homepageMobileHeader
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
      case "profile":
        return (
          <MobileProfileHeader
            user={effectiveUser}
            categories={categories}
            userStats={userStats}
            displayName={effectiveProfileDisplayName}
            username={effectiveProfileUsername}
            avatarUrl={effectiveProfileAvatarUrl}
            isOwnProfile={effectiveProfileIsOwn}
            isFollowing={effectiveProfileIsFollowing}
            sellerId={effectiveProfileSellerId}
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
            activeSlug={effectiveContextualActiveSlug}
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
        // Fallback to homepage header (inline search + pills)
        return homepageMobileHeader
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
        data-hide-subheader={hideSubheader ? "true" : undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-40 w-full flex flex-col md:sticky",
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

