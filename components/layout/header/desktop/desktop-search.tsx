"use client"

import * as React from "react"
import { useRef, useCallback } from "react"
import { Search as MagnifyingGlass, Bot as Robot, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { FieldLabel } from "@/components/shared/field"
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover"
import { useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import { useProductSearch } from "@/hooks/use-product-search"

import { buildSearchHref } from "@/components/shared/search/search-context"
import { getProductUrl } from "@/lib/url-utils"
import { cn } from "@/lib/utils"
import { DesktopSearchPopoverPanel } from "./desktop-search-popover-panel"

export function DesktopSearch() {
  const router = useRouter()
  const locale = useLocale()
  const tNav = useTranslations("Navigation")
  const tSearch = useTranslations("SearchOverlay")
  const inputRef = useRef<HTMLInputElement>(null)
  const searchInputId = "treido-desktop-search-input"

  const [isOpen, setIsOpen] = React.useState(false)
  const [aiMode, setAiMode] = React.useState(false)

  const { products: recentlyViewed, clearProducts: clearRecentlyViewed } = useRecentlyViewed()

  const {
    query,
    setQuery,
    products,
    isSearching,
    recentProducts,
    trendingSearches,
    formatPrice,
    saveSearch,
    saveProduct,
    clearRecentProducts,
    minSearchLength,
  } = useProductSearch(6)

  const buildSearchHrefFromQuery = useCallback((searchQuery: string) => buildSearchHref({ query: searchQuery }), [])

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    const raw = new FormData(e.currentTarget).get("q")
    const q = (typeof raw === "string" ? raw : (inputRef.current?.value ?? query)).trim()
    if (!q) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    saveSearch(q)
    setIsOpen(false)
    router.push(buildSearchHrefFromQuery(q))
  }, [query, router, saveSearch, buildSearchHrefFromQuery])

  const handleSelectSearch = useCallback((search: string) => {
    setQuery(search)
    saveSearch(search)
    setIsOpen(false)
    router.push(buildSearchHrefFromQuery(search))
  }, [setQuery, saveSearch, router, buildSearchHrefFromQuery])

  const handleSelectProduct = useCallback((product: {
    id: string
    slug?: string
    storeSlug?: string | null
    title: string
    price: number
    images: string[]
  }) => {
    saveProduct({ ...product, slug: product.slug || product.id })
    setIsOpen(false)
    setQuery("")
    router.push(getProductUrl(product))
  }, [setQuery, router, saveProduct])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }, [])

  const handleClearInput = useCallback(() => {
    setQuery("")
    inputRef.current?.focus()
  }, [setQuery])

  return (
    <div className="w-full" data-desktop-search>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <form
            onSubmit={handleSearch}
            action={`/${locale}/search`}
            method="get"
            className="relative flex h-11 w-full items-center rounded-full border border-search-border bg-search-bg motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none focus-within:border-search-focus-border focus-within:bg-background focus-within:ring-2 focus-within:ring-search-focus-ring/30"
          >
            <MagnifyingGlass
              size={18}
              className="absolute left-4 text-search-placeholder pointer-events-none"
            />

            <FieldLabel htmlFor={searchInputId} className="sr-only">
              {tNav("search")}
            </FieldLabel>
            <Input
              id={searchInputId}
              ref={inputRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              name="q"
              placeholder={tNav("searchPlaceholder")}
              className="h-full w-full rounded-full border-0 bg-transparent pl-11 pr-24 text-sm text-search-text placeholder:text-search-placeholder focus-visible:border-0 focus-visible:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onClick={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              aria-label={tNav("search")}
            />

            {query && (
              <IconButton
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleClearInput}
                aria-label={tNav("clearSearch")}
                className="absolute top-1/2 right-24 -translate-y-1/2 rounded-sm text-foreground"
              >
                <X size={16} />
              </IconButton>
            )}

            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <Robot
                size={14}
                className={cn(aiMode ? "text-primary" : "text-muted-foreground")}
              />
              <Switch
                checked={aiMode}
                onCheckedChange={(checked) => {
                  setAiMode(checked)
                  setIsOpen(true)
                }}
                aria-label={tSearch("aiMode")}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              size="icon-sm"
              aria-label={tNav("search")}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none"
            >
              <MagnifyingGlass size={16} />
            </Button>
          </form>
        </PopoverAnchor>

        <PopoverContent
          className="w-(--radix-popover-trigger-width) overflow-hidden rounded-lg border border-border p-0"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DesktopSearchPopoverPanel
            aiMode={aiMode}
            query={query}
            products={products}
            recentlyViewed={recentlyViewed}
            recentProducts={recentProducts}
            trendingSearches={trendingSearches}
            isSearching={isSearching}
            minSearchLength={minSearchLength}
            formatPrice={formatPrice}
            buildSearchHref={buildSearchHrefFromQuery}
            buildProductUrl={getProductUrl}
            onClose={() => setIsOpen(false)}
            onSelectSearch={handleSelectSearch}
            onSelectProduct={handleSelectProduct}
            onClearRecentlyViewed={clearRecentlyViewed}
            onClearRecentProducts={clearRecentProducts}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
