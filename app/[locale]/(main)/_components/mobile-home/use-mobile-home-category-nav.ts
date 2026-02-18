import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { CategoryTreeNode } from "@/lib/category-tree"

const MAX_VISIBLE_CATEGORY_TABS = 5

interface CategoryChildrenResponse {
  children?: CategoryTreeNode[]
}

interface UseMobileHomeCategoryNavParams {
  categories: CategoryTreeNode[]
  activeCategorySlug: string | null
  activeSubcategorySlug: string | null
}

export function useMobileHomeCategoryNav({
  categories,
  activeCategorySlug,
  activeSubcategorySlug,
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

  const visibleCategoryTabs = useMemo(
    () => categories.slice(0, MAX_VISIBLE_CATEGORY_TABS),
    [categories]
  )

  const overflowCategories = useMemo(
    () => categories.slice(MAX_VISIBLE_CATEGORY_TABS),
    [categories]
  )

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === activeCategorySlug) ?? null,
    [activeCategorySlug, categories]
  )

  const activeSubcategories = useMemo(() => {
    if (!activeCategory) return []
    if (Object.prototype.hasOwnProperty.call(childrenByParentId, activeCategory.id)) {
      return childrenByParentId[activeCategory.id] ?? []
    }
    return activeCategory.children ?? []
  }, [activeCategory, childrenByParentId])

  const activeSubcategory = activeSubcategories.find((sub) => sub.slug === activeSubcategorySlug) ?? null

  const activeL2Categories = useMemo(() => {
    if (!activeSubcategory) return []
    if (Object.prototype.hasOwnProperty.call(childrenByParentId, activeSubcategory.id)) {
      return childrenByParentId[activeSubcategory.id] ?? []
    }
    return activeSubcategory.children ?? []
  }, [activeSubcategory, childrenByParentId])

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

  useEffect(() => {
    if (!activeSubcategory) return
    if (Object.prototype.hasOwnProperty.call(childrenByParentIdRef.current, activeSubcategory.id)) return

    const seededChildren = activeSubcategory.children ?? []
    if (seededChildren.length > 0) {
      setChildrenByParentId((previous) =>
        Object.prototype.hasOwnProperty.call(previous, activeSubcategory.id)
          ? previous
          : { ...previous, [activeSubcategory.id]: seededChildren }
      )
      return
    }

    void fetchChildrenByParentId(activeSubcategory.id)
  }, [activeSubcategory, fetchChildrenByParentId])

  return {
    visibleCategoryTabs,
    overflowCategories,
    activeCategory,
    activeSubcategories,
    activeSubcategory,
    activeL2Categories,
  }
}
