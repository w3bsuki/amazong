import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { CategoryTreeNode } from "@/lib/data/categories/types"

const MAX_ROOT_CHIPS = 8
const MAX_POPULAR_LEAF_CHIPS = 8

interface CategoryChildrenResponse {
  children?: CategoryTreeNode[]
}

interface UseMobileHomeCategoryNavParams {
  categories: CategoryTreeNode[]
  activeCategorySlug: string | null
  activeSubcategorySlug: string | null
  categoryCounts: Record<string, number>
}

function sortByDisplayOrder(nodes: CategoryTreeNode[]) {
  return [...nodes].sort((a, b) => {
    const orderA = a.display_order ?? 999
    const orderB = b.display_order ?? 999
    if (orderA !== orderB) return orderA - orderB
    return a.name.localeCompare(b.name)
  })
}

function sortLeavesByPopularity(nodes: CategoryTreeNode[], categoryCounts: Record<string, number>) {
  return [...nodes].sort((a, b) => {
    const countA = categoryCounts[a.slug] ?? 0
    const countB = categoryCounts[b.slug] ?? 0
    if (countA !== countB) return countB - countA

    const orderA = a.display_order ?? 999
    const orderB = b.display_order ?? 999
    if (orderA !== orderB) return orderA - orderB

    return a.name.localeCompare(b.name)
  })
}

export function useMobileHomeCategoryNav({
  categories,
  activeCategorySlug,
  activeSubcategorySlug,
  categoryCounts,
}: UseMobileHomeCategoryNavParams) {
  const [childrenByParentId, setChildrenByParentId] = useState<Record<string, CategoryTreeNode[]>>({})
  const loadingParentIdsRef = useRef<Set<string>>(new Set())
  const childrenByParentIdRef = useRef(childrenByParentId)
  childrenByParentIdRef.current = childrenByParentId

  const fetchChildrenByParentId = useCallback(async (parentId: string) => {
    if (!parentId) return
    if (Object.prototype.hasOwnProperty.call(childrenByParentIdRef.current, parentId)) return
    if (loadingParentIdsRef.current.has(parentId)) return

    loadingParentIdsRef.current.add(parentId)
    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(parentId)}/children`, {
        method: "GET",
        credentials: "same-origin",
      })

      if (!response.ok) {
        setChildrenByParentId((previous) =>
          Object.prototype.hasOwnProperty.call(previous, parentId)
            ? previous
            : { ...previous, [parentId]: [] }
        )
        return
      }

      const payload = (await response.json()) as CategoryChildrenResponse
      const children = Array.isArray(payload.children) ? payload.children : []

      setChildrenByParentId((previous) =>
        Object.prototype.hasOwnProperty.call(previous, parentId)
          ? previous
          : { ...previous, [parentId]: children }
      )
    } catch {
      setChildrenByParentId((previous) =>
        Object.prototype.hasOwnProperty.call(previous, parentId)
          ? previous
          : { ...previous, [parentId]: [] }
      )
    } finally {
      loadingParentIdsRef.current.delete(parentId)
    }
  }, [])

  const rootCategories = useMemo(() => sortByDisplayOrder(categories), [categories])

  const rootCategoryChips = useMemo(
    () => rootCategories.slice(0, MAX_ROOT_CHIPS),
    [rootCategories]
  )

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === activeCategorySlug) ?? null,
    [activeCategorySlug, categories]
  )

  const activeSubcategories = useMemo(() => {
    if (!activeCategory) return []

    const children = Object.prototype.hasOwnProperty.call(childrenByParentId, activeCategory.id)
      ? childrenByParentId[activeCategory.id] ?? []
      : activeCategory.children ?? []

    return sortLeavesByPopularity(children, categoryCounts)
  }, [activeCategory, categoryCounts, childrenByParentId])

  const popularLeafChips = useMemo(
    () => activeSubcategories.slice(0, MAX_POPULAR_LEAF_CHIPS),
    [activeSubcategories]
  )

  const activeSubcategory = useMemo(
    () => activeSubcategories.find((sub) => sub.slug === activeSubcategorySlug) ?? null,
    [activeSubcategories, activeSubcategorySlug]
  )

  useEffect(() => {
    if (!activeCategory) return
    if (Object.prototype.hasOwnProperty.call(childrenByParentIdRef.current, activeCategory.id)) return

    const seededChildren = activeCategory.children ?? []
    if (seededChildren.length > 0) {
      setChildrenByParentId((previous) =>
        Object.prototype.hasOwnProperty.call(previous, activeCategory.id)
          ? previous
          : { ...previous, [activeCategory.id]: seededChildren }
      )
      return
    }

    void fetchChildrenByParentId(activeCategory.id)
  }, [activeCategory, fetchChildrenByParentId])

  return {
    rootCategoryChips,
    activeCategory,
    activeSubcategories,
    popularLeafChips,
    activeSubcategory,
  }
}
