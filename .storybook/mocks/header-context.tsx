"use client"

import * as React from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"

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

export interface HeaderContextValue {
  homepageHeader: HomepageHeaderState | null
  setHomepageHeader: (state: HomepageHeaderState | null) => void
  contextualHeader: ContextualHeaderState | null
  setContextualHeader: (state: ContextualHeaderState | null) => void
  productHeader: ProductHeaderState | null
  setProductHeader: (state: ProductHeaderState | null) => void
}

const defaultHeaderContext: HeaderContextValue = {
  homepageHeader: null,
  setHomepageHeader: () => {},
  contextualHeader: null,
  setContextualHeader: () => {},
  productHeader: null,
  setProductHeader: () => {},
}

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useHeader(): HeaderContextValue {
  return defaultHeaderContext
}

export function useHeaderOptional(): HeaderContextValue | null {
  return defaultHeaderContext
}

