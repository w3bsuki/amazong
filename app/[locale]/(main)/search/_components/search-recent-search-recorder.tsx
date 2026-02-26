"use client"

import { useEffect } from "react"

import { upsertRecentSearch } from "@/hooks/use-product-search.storage"

export function SearchRecentSearchRecorder({ query }: { query: string }) {
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) return
    upsertRecentSearch(trimmed)
  }, [query])

  return null
}

