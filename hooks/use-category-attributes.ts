import { useState, useEffect, useCallback, useRef } from "react"
import type { CategoryAttribute } from "@/lib/data/categories"

interface ApiAttribute {
  id: string
  name: string
  nameBg: string | null
  type: string
  attributeKey: string | null
  required: boolean | null
  filterable: boolean | null
  isHeroSpec: boolean | null
  heroPriority: number | null
  isBadgeSpec: boolean | null
  badgePriority: number | null
  unitSuffix: string | null
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

/** Transform API response to CategoryAttribute format */
function transformAttribute(api: ApiAttribute): CategoryAttribute {
  return {
    id: api.id,
    category_id: null,
    name: api.name,
    name_bg: api.nameBg,
    attribute_type: api.type as CategoryAttribute["attribute_type"],
    attribute_key: api.attributeKey ?? api.name.toLowerCase().replace(/\s+/g, "_"),
    options: api.options,
    options_bg: api.optionsBg,
    placeholder: api.placeholder,
    placeholder_bg: api.placeholderBg,
    is_filterable: api.filterable,
    is_required: api.required,
    is_hero_spec: api.isHeroSpec,
    hero_priority: api.heroPriority,
    is_badge_spec: api.isBadgeSpec,
    badge_priority: api.badgePriority,
    unit_suffix: api.unitSuffix,
    sort_order: api.sortOrder,
    validation_rules: null,
  }
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
    const cached = cacheRef.current.get(slug)
    if (cached) {
      setAttributes(cached)
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
        (attr: ApiAttribute) =>
          attr.filterable &&
          (attr.type === "select" || attr.type === "multiselect") &&
          attr.options &&
          attr.options.length > 0
      )

      // Sort by sortOrder and transform to CategoryAttribute format
      filterable.sort((a: ApiAttribute, b: ApiAttribute) => 
        (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
      )
      
      const transformed = filterable.map(transformAttribute)

      cacheRef.current.set(slug, transformed)
      setAttributes(transformed)
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
