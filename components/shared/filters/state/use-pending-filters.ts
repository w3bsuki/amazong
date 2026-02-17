import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReadonlyURLSearchParams } from "next/navigation"
import type { CategoryAttribute } from "@/lib/data/categories"
import { getCategoryAttributeKey } from "@/lib/filters/category-attribute"
import { setPendingAttributeValues } from "@/lib/filters/pending-attributes"

export interface PendingFilters {
  minPrice: string | null
  maxPrice: string | null
  minRating: string | null
  availability: string | null
  deals: string | null
  verified: string | null
  city: string | null
  nearby: string | null
  attributes: Record<string, string[]>
}

interface UsePendingFiltersOptions {
  open: boolean
  searchParams: URLSearchParams | ReadonlyURLSearchParams
  attributes?: CategoryAttribute[]
  includeExtendedFields?: boolean
}

function createEmptyPendingFilters(): PendingFilters {
  return {
    minPrice: null,
    maxPrice: null,
    minRating: null,
    availability: null,
    deals: null,
    verified: null,
    city: null,
    nearby: null,
    attributes: {},
  }
}

export function buildPendingFiltersFromSearchParams({
  searchParams,
  attributes = [],
  includeExtendedFields = true,
}: {
  searchParams: URLSearchParams | ReadonlyURLSearchParams
  attributes?: CategoryAttribute[]
  includeExtendedFields?: boolean
}): PendingFilters {
  const pending = createEmptyPendingFilters()

  pending.minPrice = searchParams.get("minPrice")
  pending.maxPrice = searchParams.get("maxPrice")
  pending.minRating = searchParams.get("minRating")
  pending.availability = searchParams.get("availability")

  if (includeExtendedFields) {
    pending.deals = searchParams.get("deals")
    pending.verified = searchParams.get("verified")
    pending.city = searchParams.get("city")
    pending.nearby = searchParams.get("nearby")
  }

  for (const attr of attributes) {
    const attrKey = getCategoryAttributeKey(attr)
    const values = Array.from(
      new Set([
        ...searchParams.getAll(`attr_${attrKey}`),
        // Backward compatibility for legacy links that used raw attribute names.
        ...searchParams.getAll(`attr_${attr.name}`),
      ])
    ).filter((value) => Boolean(value))

    if (values.length > 0) {
      pending.attributes[attrKey] = values
    }
  }

  return pending
}

export function usePendingFilters({
  open,
  searchParams,
  attributes = [],
  includeExtendedFields = true,
}: UsePendingFiltersOptions) {
  const [pending, setPending] = useState<PendingFilters>(() => createEmptyPendingFilters())

  const resetPendingFromSearchParams = useCallback(() => {
    setPending(
      buildPendingFiltersFromSearchParams({
        searchParams,
        attributes,
        includeExtendedFields,
      })
    )
  }, [searchParams, attributes, includeExtendedFields])

  useEffect(() => {
    if (!open) return
    resetPendingFromSearchParams()
  }, [open, resetPendingFromSearchParams])

  const clearPendingFilters = useCallback(() => {
    setPending(createEmptyPendingFilters())
  }, [])

  const getPendingAttrValues = useCallback(
    (attrName: string): string[] => pending.attributes[attrName] || [],
    [pending.attributes]
  )

  const setPendingAttrValues = useCallback((attrName: string, values: string[]) => {
    setPending((prev) => ({
      ...prev,
      attributes: setPendingAttributeValues(prev.attributes, attrName, values),
    }))
  }, [])

  const hasPendingFilterValues = useMemo(() => {
    if (pending.minPrice !== null) return true
    if (pending.maxPrice !== null) return true
    if (pending.minRating !== null) return true
    if (pending.availability !== null) return true
    if (includeExtendedFields) {
      if (pending.deals !== null) return true
      if (pending.verified !== null) return true
      if (pending.city !== null) return true
      if (pending.nearby !== null) return true
    }
    return Object.keys(pending.attributes).length > 0
  }, [pending, includeExtendedFields])

  return {
    pending,
    setPending,
    getPendingAttrValues,
    setPendingAttrValues,
    resetPendingFromSearchParams,
    clearPendingFilters,
    hasPendingFilterValues,
  }
}

