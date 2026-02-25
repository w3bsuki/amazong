import { useState, useEffect, useCallback, useRef } from "react"
import type { CategoryAttribute } from "@/lib/data/categories"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"

interface UseCategoryAttributesResult {
  attributes: CategoryAttribute[]
  isLoading: boolean
  error: string | null
}

/** Transform API response to CategoryAttribute format */
function normalizeAttribute(api: CategoryAttribute): CategoryAttribute {
  return {
    ...api,
    attribute_key: api.attribute_key ?? (normalizeAttributeKey(api.name) || null),
    options: Array.isArray(api.options) ? api.options : null,
    options_bg: Array.isArray(api.options_bg) ? api.options_bg : null,
  }
}

/**
 * Hook to fetch filterable attributes for a category.
 * Automatically handles inheritance (parent/grandparent attrs).
 * Only returns select/multiselect attrs with options (suitable for filter pills).
 */
export function useCategoryAttributes(
  categoryId: string | null
): UseCategoryAttributesResult {
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cache to avoid refetching same category
  const cacheRef = useRef<Map<string, CategoryAttribute[]>>(new Map())

  const fetchAttributes = useCallback(async (nextCategoryId: string) => {
    // Check cache first
    const cached = cacheRef.current.get(nextCategoryId)
    if (cached) {
      setAttributes(cached)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(nextCategoryId)}/attributes`)
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`)
      }

      const data = (await res.json()) as { attributes?: CategoryAttribute[] }
      const attributesFromApi = Array.isArray(data.attributes) ? data.attributes : []

      // Filter to only filterable select/multiselect attrs with options
      const filterable = attributesFromApi.filter(
        (attr: CategoryAttribute) =>
          attr.is_filterable &&
          (attr.attribute_type === "select" || attr.attribute_type === "multiselect") &&
          Array.isArray(attr.options) &&
          attr.options.length > 0
      )

      // Sort by sortOrder and transform to CategoryAttribute format
      filterable.sort((a: CategoryAttribute, b: CategoryAttribute) =>
        (a.sort_order ?? 999) - (b.sort_order ?? 999)
      )

      const transformed = filterable.map(normalizeAttribute)

      cacheRef.current.set(nextCategoryId, transformed)
      setAttributes(transformed)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setAttributes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!categoryId) {
      setAttributes([])
      setIsLoading(false)
      setError(null)
      return
    }

    fetchAttributes(categoryId)
  }, [categoryId, fetchAttributes])

  return { attributes, isLoading, error }
}
