"use client"

import * as React from "react"
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import type { CategoryTreeNode } from "@/lib/data/categories/types"

// =============================================================================
// Types
// =============================================================================

export type DrawerSnap = "collapsed" | "half" | "full"

export interface CategoryDrawerState {
  /** Whether the drawer is open */
  isOpen: boolean
  /** Current snap point */
  snap: DrawerSnap
  /** Root L0 categories (passed from server) */
  rootCategories: CategoryTreeNode[]
  /** Currently selected category (deepest level) */
  activeCategory: CategoryTreeNode | null
  /** Full breadcrumb path from L0 to current */
  path: CategoryTreeNode[]
  /** Loading state for lazy-loaded children */
  isLoading: boolean
  /** Children of the active category (for pill display) */
  children: CategoryTreeNode[]
}

export interface CategoryDrawerActions {
  /** Open drawer at the root ("All categories") view */
  openRoot: () => void
  /** Open drawer with a specific L0 category */
  openCategory: (category: CategoryTreeNode) => void
  /** Drill down into a subcategory */
  drillDown: (category: CategoryTreeNode) => void
  /** Go back one level */
  goBack: () => void
  /** Clear selection and close drawer */
  close: () => void
  /** Collapse drawer to mini-bar */
  collapse: () => void
  /** Expand drawer from mini-bar */
  expand: () => void
  /** Set snap point directly (for vaul integration) */
  setSnap: (snap: DrawerSnap) => void
  /** Set children (called after lazy load) */
  setChildren: (children: CategoryTreeNode[]) => void
  /** Set loading state */
  setLoading: (loading: boolean) => void
}

export type CategoryDrawerContextValue = CategoryDrawerState & CategoryDrawerActions

// =============================================================================
// Context
// =============================================================================

const CategoryDrawerContext = createContext<CategoryDrawerContextValue | null>(null)

export function useCategoryDrawer(): CategoryDrawerContextValue {
  const context = useContext(CategoryDrawerContext)
  if (!context) {
    throw new Error("useCategoryDrawer must be used within a CategoryDrawerProvider")
  }
  return context
}

// Optional hook that doesn't throw (for conditional rendering)
export function useCategoryDrawerOptional(): CategoryDrawerContextValue | null {
  return useContext(CategoryDrawerContext)
}

// =============================================================================
// Provider
// =============================================================================

export interface CategoryDrawerProviderProps {
  children: React.ReactNode
  /** Initial L0 categories (passed from server) */
  rootCategories?: CategoryTreeNode[]
  /** Callback when category selection changes (for feed filtering) */
  onCategoryChange?: (category: CategoryTreeNode | null, path: CategoryTreeNode[]) => void
}

export function CategoryDrawerProvider({
  children,
  rootCategories = [],
  onCategoryChange,
}: CategoryDrawerProviderProps) {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [snap, setSnapState] = useState<DrawerSnap>("half")
  const [rootCats, setRootCats] = useState<CategoryTreeNode[]>(rootCategories)
  const [activeCategory, setActiveCategory] = useState<CategoryTreeNode | null>(null)
  const [path, setPath] = useState<CategoryTreeNode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [categoryChildren, setCategoryChildren] = useState<CategoryTreeNode[]>([])

  useEffect(() => {
    setRootCats(rootCategories)
  }, [rootCategories])

  // Actions
  const openRoot = useCallback(() => {
    setIsOpen(true)
    setSnapState("half")
    setActiveCategory(null)
    setPath([])
    setCategoryChildren(rootCats)
    onCategoryChange?.(null, [])
  }, [onCategoryChange, rootCats])

  const openCategory = useCallback((category: CategoryTreeNode) => {
    setIsOpen(true)
    setSnapState("collapsed")
    setActiveCategory(category)
    setPath([category])
    setCategoryChildren(category.children ?? [])
    onCategoryChange?.(category, [category])
  }, [onCategoryChange])

  const drillDown = useCallback((category: CategoryTreeNode) => {
    setActiveCategory(category)
    setPath((prev) => {
      const nextPath = [...prev, category]
      onCategoryChange?.(category, nextPath)
      return nextPath
    })
    setCategoryChildren(category.children ?? [])
  }, [onCategoryChange])

  const goBack = useCallback(() => {
    if (path.length <= 1) {
      // At L0 level, close drawer
      setIsOpen(false)
      setActiveCategory(null)
      setPath([])
      setCategoryChildren([])
      onCategoryChange?.(null, [])
      return
    }

    // Go back one level
    const newPath = path.slice(0, -1)
    const newActive = newPath[newPath.length - 1] ?? null
    setActiveCategory(newActive)
    setPath(newPath)
    setCategoryChildren(newActive?.children ?? [])
    onCategoryChange?.(newActive, newPath)
  }, [path, onCategoryChange])

  const close = useCallback(() => {
    setIsOpen(false)
    setSnapState("half")
    setActiveCategory(null)
    setPath([])
    setCategoryChildren([])
    onCategoryChange?.(null, [])
  }, [onCategoryChange])

  const collapse = useCallback(() => {
    setSnapState("collapsed")
  }, [])

  const expand = useCallback(() => {
    setSnapState("half")
  }, [])

  const setSnap = useCallback((newSnap: DrawerSnap) => {
    setSnapState(newSnap)
  }, [])

  const setChildren = useCallback((children: CategoryTreeNode[]) => {
    setCategoryChildren(children)
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  // Memoized value
  const value = useMemo<CategoryDrawerContextValue>(() => ({
    // State
    isOpen,
    snap,
    rootCategories: rootCats,
    activeCategory,
    path,
    isLoading,
    children: categoryChildren,
    // Actions
    openRoot,
    openCategory,
    drillDown,
    goBack,
    close,
    collapse,
    expand,
    setSnap,
    setChildren,
    setLoading,
  }), [
    isOpen,
    snap,
    rootCats,
    activeCategory,
    path,
    isLoading,
    categoryChildren,
    openRoot,
    openCategory,
    drillDown,
    goBack,
    close,
    collapse,
    expand,
    setSnap,
    setChildren,
    setLoading,
  ])

  return (
    <CategoryDrawerContext.Provider value={value}>
      {children}
    </CategoryDrawerContext.Provider>
  )
}
