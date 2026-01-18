import { useState, useEffect, useCallback, useRef } from "react"

interface CategoryAttribute {
  id: string
  name: string
  nameBg: string | null
  type: string
  required: boolean | null
  filterable: boolean | null
  options: string[] | null
  optionsBg: string[] | null
  placeholder: string | null
  placeholderBg: string | null
  sortOrder: number | null
}

interface UseCategoryAttributesResult {
  attributes: CategoryAttribute[]
  isLoading: boolean
  error: string | null
}

/**
 * Hook to fetch filterable attributes for a category.
 * Automatically handles inheritance (parent/grandparent attrs).
 * Only returns select/multiselect attrs with options (suitable for filter pills).
 */
export function useCategoryAttributes(
  categorySlug: string | null
): UseCategoryAttributesResult {
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Cache to avoid refetching same category
  const cacheRef = useRef<Map<string, CategoryAttribute[]>>(new Map())

  const fetchAttributes = useCallback(async (slug: string) => {
    // Check cache first
    if (cacheRef.current.has(slug)) {
      setAttributes(cacheRef.current.get(slug)!)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/categories/${slug}/attributes`)
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`)
      }

      const data = await res.json()
      
      // Filter to only filterable select/multiselect attrs with options
      const filterable = (data.attributes || []).filter(
        (attr: CategoryAttribute) =>
          attr.filterable &&
          (attr.type === "select" || attr.type === "multiselect") &&
          attr.options &&
          attr.options.length > 0
      )

      // Sort by sortOrder
      filterable.sort((a: CategoryAttribute, b: CategoryAttribute) => 
        (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
      )

      cacheRef.current.set(slug, filterable)
      setAttributes(filterable)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setAttributes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!categorySlug) {
      setAttributes([])
      setIsLoading(false)
      setError(null)
      return
    }

    fetchAttributes(categorySlug)
  }, [categorySlug, fetchAttributes])

  return { attributes, isLoading, error }
}
