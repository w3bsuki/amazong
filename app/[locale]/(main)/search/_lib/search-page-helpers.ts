import { z } from "zod"

import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import type { BrowseMode } from "./types"

export const BrowseModeSchema = z.enum(["listings", "sellers"])

const SELLER_FILTER_KEYS = new Set([
  "sellerSort",
  "sellerVerified",
  "sellerMinRating",
  "sellerMinListings",
])

const LISTING_FILTER_KEYS = new Set([
  "minPrice",
  "maxPrice",
  "minRating",
  "subcategory",
  "tag",
  "deals",
  "promoted",
  "verified",
  "brand",
  "availability",
  "sort",
])

export function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

export function toUrlSearchParams(input: Record<string, string | string[] | undefined>): URLSearchParams {
  const next = new URLSearchParams()
  for (const [key, value] of Object.entries(input)) {
    if (!value) continue
    if (Array.isArray(value)) {
      for (const entry of value) {
        next.append(key, entry)
      }
      continue
    }
    next.set(key, value)
  }
  return next
}

function normalizeModeParams(params: URLSearchParams, mode: BrowseMode): URLSearchParams {
  const next = new URLSearchParams(params.toString())
  next.delete("page")

  if (mode === "sellers") {
    next.set("mode", "sellers")
    for (const key of next.keys()) {
      if (LISTING_FILTER_KEYS.has(key) || key.startsWith("attr_")) next.delete(key)
    }
    return next
  }

  next.delete("mode")
  for (const key of next.keys()) {
    if (SELLER_FILTER_KEYS.has(key)) next.delete(key)
  }
  return next
}

export function buildModeHref(params: URLSearchParams, mode: BrowseMode): string {
  const normalized = normalizeModeParams(params, mode)
  const queryString = normalized.toString()
  return queryString ? `/search?${queryString}` : "/search"
}

export function buildCategoryHref(
  params: URLSearchParams,
  mode: BrowseMode,
  categorySlug: string | null
): string {
  const next = normalizeModeParams(params, mode)
  if (categorySlug) {
    next.set("category", categorySlug)
  } else {
    next.delete("category")
  }
  const queryString = next.toString()
  return queryString ? `/search?${queryString}` : "/search"
}

export function extractAttributeFilters(
  searchParams: Record<string, string | string[] | undefined>
): Record<string, string | string[]> {
  const filters: Record<string, string | string[]> = {}

  for (const [key, value] of Object.entries(searchParams)) {
    if (!key.startsWith("attr_") || !value) continue
    const rawName = key.replace("attr_", "")
    const attrKey = normalizeAttributeKey(rawName) || rawName
    const nextValues = Array.isArray(value) ? value : [value]
    const existing = filters[attrKey]
    if (!existing) {
      filters[attrKey] = nextValues
      continue
    }
    const existingValues = Array.isArray(existing) ? existing : [existing]
    filters[attrKey] = [...new Set([...existingValues, ...nextValues])]
  }

  return filters
}
