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
// =============================================================================

import {
  DesktopStandardHeader,
} from "@/components/layout/header/desktop/standard-header"
import { MobileSearchOverlay } from "./search/mobile-search-overlay"
import { detectRouteConfig } from "./app-header-route-config"
import { AppHeaderMobileVariants } from "./app-header-mobile-variants"
import type { AppHeaderProps } from "./app-header.types"
import { useHeaderOptional } from "@/components/providers/header-context"
import { useAuthOptional } from "@/components/providers/auth-state-manager"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"

// Re-export types
export type { AppHeaderProps } from "./app-header.types"
export type { HeaderVariant } from "@/components/layout/header/types"

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
  const tProfile = useTranslations("ProfilePage")
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
  const profileUsernameFromRoute = routeConfig.profileUsername ?? null

  // Merge props with context values (context takes precedence for dynamic state)
  const effectiveHomepageCategory = homepageHeaderState?.activeCategory ?? activeCategory
  const effectiveHomepageCategorySelect = homepageHeaderState?.onCategorySelect ?? onCategorySelect
  const effectiveHomepageSearchOpen = homepageHeaderState?.onSearchOpen ?? onSearchOpen
  // Context chip removed from header — SmartRail shows category context instead.
  
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
  const effectiveContextualExpandTitle = contextualHeaderState?.expandTitle ?? false
  const effectiveContextualTrailingActions = contextualHeaderState?.trailingActions ?? undefined

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
  const effectiveProfileIsOwn = profileHeaderState?.isOwnProfile ?? false
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

  const handleBack = () => router.back()

  const handleShareProfile = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (!url) return

    const title =
      effectiveProfileDisplayName ||
      effectiveProfileUsername ||
      profileUsernameFromRoute ||
      tProfile("profile")

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
        return
      } catch {
        // User cancelled or share failed - silently ignore
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
    }
  }

  // ==========================================================================
  // DESKTOP HEADER VARIANTS
  // ==========================================================================

  const renderDesktopHeader = () => {
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
        <AppHeaderMobileVariants
          variant={variant}
          user={effectiveUser}
          categories={categories}
          userStats={userStats}
          locale={locale}
          homepage={{
            activeCategory: effectiveHomepageCategory,
            onCategorySelect: effectiveHomepageCategorySelect,
            onSearchOpen: handleSearchOpen,
          }}
          product={{
            title: effectiveProductTitle,
            sellerName: effectiveSellerName,
            sellerUsername: effectiveSellerUsername,
            sellerAvatarUrl: effectiveSellerAvatarUrl,
            productId: effectiveProductId,
            productPrice: effectiveProductPrice,
            productImage: effectiveProductImage,
          }}
          contextual={{
            title: effectiveContextualTitle,
            activeSlug: effectiveContextualActiveSlug,
            backHref: effectiveContextualBackHref,
            onBack: effectiveContextualBack,
            subcategories: effectiveContextualSubcategories,
            onSubcategoryClick: effectiveContextualSubcategoryClick,
            trailingActions: effectiveContextualTrailingActions,
            hideActions: effectiveContextualHideActions,
            expandTitle: effectiveContextualExpandTitle,
          }}
          profile={{
            usernameFromRoute: profileUsernameFromRoute,
            displayName: effectiveProfileDisplayName,
            username: effectiveProfileUsername,
            isOwnProfile: effectiveProfileIsOwn,
            sellerId: effectiveProfileSellerId,
            labels: {
              profile: tProfile("profile"),
              share: tProfile("share"),
              settings: tProfile("settings"),
              message: tProfile("message"),
            },
            onShare: handleShareProfile,
          }}
          onBack={handleBack}
        />
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

