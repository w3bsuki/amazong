"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { CategoryTreeNode } from "@/lib/data/categories/types"

export interface HomepageHeaderState {
  activeCategory: string
  onCategorySelect: (slug: string) => void
  onSearchOpen: () => void
  categories: CategoryTreeNode[]
  contextLabel?: string
}

export interface ContextualHeaderState {
  title: ReactNode
  backHref: string
  onBack?: () => void
  activeSlug?: string
  subcategories?: CategoryTreeNode[]
  onSubcategoryClick?: (category: CategoryTreeNode) => void
  hideActions?: boolean
  /** When true, title area expands to fill available space (for search bar). */
  expandTitle?: boolean
  /** Custom trailing actions (replaces default search/wishlist/cart). */
  trailingActions?: ReactNode
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

export type HeaderState =
  | { type: "homepage"; value: HomepageHeaderState }
  | { type: "contextual"; value: ContextualHeaderState }
  | { type: "product"; value: ProductHeaderState }
  | { type: "profile"; value: ProfileHeaderState }
  | null

interface HeaderContextValue {
  headerState: HeaderState
  setHeaderState: (state: HeaderState) => void
}

const HeaderContext = createContext<HeaderContextValue | null>(null)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerState, setHeaderState] = useState<HeaderState>(null)

  return (
    <HeaderContext.Provider
      value={{
        headerState,
        setHeaderState,
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

export function useHeaderOptional() {
  return useContext(HeaderContext)
}
