"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"

import { useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  clearRecentSearchesStorage,
  loadRecentSearches,
  upsertRecentSearch,
} from "@/hooks/use-product-search.storage"

const FALLBACK_TRENDING_SEARCHES: string[] = [
  "iPhone 15 Pro",
  "PlayStation 5",
  "AirPods Pro",
  "Nike sneakers",
  "Gaming laptop",
  "Winter jacket",
  "Vintage dress",
  "Baby stroller",
  "Coffee machine",
  "Smartwatch",
  "Bluetooth speaker",
  "LEGO",
  "Desk chair",
  "Guitar",
  "Car accessories",
]

interface SearchEmptyStateProps {
  className?: string
  testId?: string
}

export function SearchEmptyState({ className, testId }: SearchEmptyStateProps) {
  const router = useRouter()
  const tOverlay = useTranslations("SearchOverlay")
  const tSearchPage = useTranslations("SearchPage")

  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    setRecentSearches(loadRecentSearches())
  }, [])

  const trendingSearches = useMemo(() => {
    const raw = tSearchPage.raw("trendingSearches") as unknown
    if (!Array.isArray(raw)) return FALLBACK_TRENDING_SEARCHES
    const items = raw.filter((item): item is string => typeof item === "string")
    return items.length > 0 ? items.slice(0, 15) : FALLBACK_TRENDING_SEARCHES
  }, [tSearchPage])

  const handleSelect = useCallback(
    (term: string) => {
      const updated = upsertRecentSearch(term)
      if (updated.length > 0) setRecentSearches(updated)
      router.push(`/search?q=${encodeURIComponent(term)}`)
    },
    [router],
  )

  const handleClearRecent = useCallback(() => {
    clearRecentSearchesStorage()
    setRecentSearches([])
  }, [])

  return (
    <section
      className={cn("px-inset pb-6 pt-2", className)}
      {...(testId ? { "data-testid": testId } : {})}
    >
      {recentSearches.length > 0 ? (
        <div>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-reading font-semibold text-foreground">
              {tOverlay("recentSearches")}
            </h2>
            <button
              type="button"
              onClick={handleClearRecent}
              className="text-xs font-medium text-muted-foreground tap-transparent transition-colors hover:text-foreground active:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            >
              {tOverlay("clear")}
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelect(term)}
                className="inline-flex min-h-(--control-compact) items-center rounded-full bg-surface-subtle px-3 text-xs font-medium text-foreground tap-transparent transition-colors hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <h2 className="text-reading font-semibold text-foreground">{tOverlay("recentSearches")}</h2>
      )}

      <div className={cn(recentSearches.length > 0 ? "mt-5" : "mt-3")}>
        <h2 className="text-reading font-semibold text-foreground">{tOverlay("trending")}</h2>
        <ol className="mt-2 overflow-hidden rounded-2xl border border-border-subtle bg-background">
          {trendingSearches.map((term, index) => (
            <li key={`${term}-${index}`} className={index === 0 ? "" : "border-t border-border-subtle"}>
              <button
                type="button"
                onClick={() => handleSelect(term)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left tap-transparent transition-colors hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              >
                <span className="w-6 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{term}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
