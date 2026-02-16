"use client"

/**
 * Header Context
 * 
 * Allows pages to provide dynamic header props to the layout-rendered header.
 * This enables the "layout owns header" pattern while supporting dynamic content.
 * 
 * Usage in pages:
 * ```tsx
 * const { setContextualHeader } = useHeader()
 * 
 * useEffect(() => {
 *   setContextualHeader({
 *     title: categoryName,
 *     backHref: `/categories/${parentSlug}`,
 *     onBack: handleBack,
 *   })
 *   return () => setContextualHeader(null)
 * }, [categoryName, parentSlug])
 * ```
 */

import { createContext, useContext, useState, type ReactNode } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"

// =============================================================================
// Types
// =============================================================================

export interface HomepageHeaderState {
  activeCategory: string
  onCategorySelect: (slug: string) => void
  onSearchOpen: () => void
  categories: CategoryTreeNode[]
}

export interface ContextualHeaderState {
  title: string
  backHref: string
  onBack?: () => void
  /** Active category slug (for subtle active pill highlight during instant navigation). */
  activeSlug?: string
  subcategories?: CategoryTreeNode[]
  onSubcategoryClick?: (cat: CategoryTreeNode) => void
  hideActions?: boolean
}

export interface ProductHeaderState {
  productTitle: string | null
  sellerName: string | null
  sellerUsername: string | null
  sellerAvatarUrl: string | null
  productId?: string | null
  productPrice?: number | null
  productImage?: string | null
}

export interface ProfileHeaderState {
  displayName: string | null
  username: string | null
  avatarUrl: string | null
  isOwnProfile: boolean
  isFollowing: boolean
  sellerId: string | null
}

interface HeaderContextValue {
  // Homepage header state
  homepageHeader: HomepageHeaderState | null
  setHomepageHeader: (state: HomepageHeaderState | null) => void
  
  // Contextual header state (categories)
  contextualHeader: ContextualHeaderState | null
  setContextualHeader: (state: ContextualHeaderState | null) => void
  
  // Product header state
  productHeader: ProductHeaderState | null
  setProductHeader: (state: ProductHeaderState | null) => void
  
  // Profile header state
  profileHeader: ProfileHeaderState | null
  setProfileHeader: (state: ProfileHeaderState | null) => void
}

// =============================================================================
// Context
// =============================================================================

const HeaderContext = createContext<HeaderContextValue | null>(null)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [homepageHeader, setHomepageHeader] = useState<HomepageHeaderState | null>(null)
  const [contextualHeader, setContextualHeader] = useState<ContextualHeaderState | null>(null)
  const [productHeader, setProductHeader] = useState<ProductHeaderState | null>(null)
  const [profileHeader, setProfileHeader] = useState<ProfileHeaderState | null>(null)

  return (
    <HeaderContext.Provider
      value={{
        homepageHeader,
        setHomepageHeader,
        contextualHeader,
        setContextualHeader,
        productHeader,
        setProductHeader,
        profileHeader,
        setProfileHeader,
      }}
    >
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider")
  }
  return context
}

// Optional hook that doesn't throw - useful for layout where context may not be set yet
export function useHeaderOptional() {
  return useContext(HeaderContext)
}
