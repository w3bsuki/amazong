"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ArrowUpDown, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOBILE_ACTION_CHIP_CLASS, getMobileQuickPillClass } from "@/components/mobile/chrome/mobile-control-recipes"
import type { SellerSortKey } from "../_lib/types"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FilterRadioGroup, FilterRadioItem } from "@/components/shared/filters/controls/filter-radio-group"
import { FilterCheckboxItem } from "@/components/shared/filters/controls/filter-checkbox-item"

interface MobileSellerFilterControlsProps {
  basePath?: string
  stickyTop?: number | string
  className?: string
}

function applySellerSearchParams(
  params: URLSearchParams,
  next: {
    sellerSort?: SellerSortKey | null
    sellerVerified?: boolean
    sellerMinRating?: number | null
    sellerMinListings?: number | null
    q?: string | null
  }
): URLSearchParams {
  const updated = new URLSearchParams(params.toString())

  updated.delete("page")
  updated.set("mode", "sellers")

  if (next.q !== undefined) {
    if (next.q && next.q.trim().length > 0) {
      updated.set("q", next.q.trim())
    } else {
      updated.delete("q")
    }
  }

  if (next.sellerSort !== undefined) {
    if (!next.sellerSort || next.sellerSort === "products") {
      updated.delete("sellerSort")
    } else {
      updated.set("sellerSort", next.sellerSort)
    }
  }

  if (next.sellerVerified !== undefined) {
    if (next.sellerVerified) {
      updated.set("sellerVerified", "true")
    } else {
      updated.delete("sellerVerified")
    }
  }

  if (next.sellerMinRating !== undefined) {
    if (next.sellerMinRating == null || next.sellerMinRating <= 0) {
      updated.delete("sellerMinRating")
    } else {
      updated.set("sellerMinRating", String(next.sellerMinRating))
    }
  }

  if (next.sellerMinListings !== undefined) {
    if (next.sellerMinListings == null || next.sellerMinListings <= 0) {
      updated.delete("sellerMinListings")
    } else {
      updated.set("sellerMinListings", String(next.sellerMinListings))
    }
  }

  return updated
}

export function MobileSellerFilterControls({
  basePath = "/search",
  stickyTop = "var(--offset-mobile-tertiary-rail)",
  className,
}: MobileSellerFilterControlsProps) {
  const t = useTranslations("SearchFilters")
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = (searchParams.get("sellerSort") || "products") as SellerSortKey
  const currentVerified = searchParams.get("sellerVerified") === "true"
  const currentMinRating = Number(searchParams.get("sellerMinRating") || "0")
  const currentMinListings = Number(searchParams.get("sellerMinListings") || "0")
  const currentQuery = searchParams.get("q") || ""

  const [searchInput, setSearchInput] = useState(currentQuery)
  const [sortOpen, setSortOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [pendingVerified, setPendingVerified] = useState(currentVerified)
  const [pendingRating, setPendingRating] = useState(currentMinRating)
  const [pendingListings, setPendingListings] = useState(currentMinListings)

  useEffect(() => {
    setSearchInput(currentQuery)
  }, [currentQuery])

  const replaceUrl = useCallback(
    (next: URLSearchParams) => {
      const queryString = next.toString()
      router.replace(queryString ? `${basePath}?${queryString}` : basePath)
    },
    [basePath, router]
  )

  const submitSellerQuery = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const next = applySellerSearchParams(new URLSearchParams(searchParams.toString()), {
        q: searchInput,
      })
      replaceUrl(next)
    },
    [replaceUrl, searchInput, searchParams]
  )

  const applySort = useCallback(
    (sort: SellerSortKey) => {
      const next = applySellerSearchParams(new URLSearchParams(searchParams.toString()), {
        sellerSort: sort,
      })
      replaceUrl(next)
      setSortOpen(false)
    },
    [replaceUrl, searchParams]
  )

  const openFilters = useCallback(() => {
    setPendingVerified(currentVerified)
    setPendingRating(currentMinRating)
    setPendingListings(currentMinListings)
    setFiltersOpen(true)
  }, [currentMinListings, currentMinRating, currentVerified])

  const applyFilters = useCallback(() => {
    const next = applySellerSearchParams(new URLSearchParams(searchParams.toString()), {
      sellerVerified: pendingVerified,
      sellerMinRating: pendingRating > 0 ? pendingRating : null,
      sellerMinListings: pendingListings > 0 ? pendingListings : null,
    })
    replaceUrl(next)
    setFiltersOpen(false)
  }, [pendingListings, pendingRating, pendingVerified, replaceUrl, searchParams])

  const clearFilters = useCallback(() => {
    const next = applySellerSearchParams(new URLSearchParams(searchParams.toString()), {
      sellerVerified: false,
      sellerMinRating: null,
      sellerMinListings: null,
      sellerSort: "products",
    })
    replaceUrl(next)
    setFiltersOpen(false)
  }, [replaceUrl, searchParams])

  const hasActiveFilters = currentVerified || currentMinRating > 0 || currentMinListings > 0

  const sortLabel = useMemo(() => {
    if (currentSort === "rating") return t("sortSellerRating")
    if (currentSort === "newest") return t("sortSellerNewest")
    return t("sortSellerProducts")
  }, [currentSort, t])

  const actionButtonClass = cn(
    MOBILE_ACTION_CHIP_CLASS,
    "flex-1 min-h-(--control-default) justify-center text-sm font-medium"
  )

  const chipClass = getMobileQuickPillClass(
    false,
    "gap-1 text-foreground hover:bg-hover hover:text-foreground active:bg-active"
  )

  return (
    <section
      className={cn("sticky z-20 bg-background px-inset pt-1.5 pb-1", className)}
      style={{ top: stickyTop }}
      data-testid="mobile-seller-filter-controls"
    >
      <form onSubmit={submitSellerQuery} className="mb-1.5 flex items-center gap-2">
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t("searchSellersPlaceholder")}
          className="h-(--control-default) rounded-full"
          aria-label={t("searchSellersPlaceholder")}
        />
        <Button type="submit" size="sm" className="h-(--control-default) rounded-full px-3">
          {t("go")}
        </Button>
      </form>

      <div className="mb-1.5 flex items-center gap-1.5" role="group" aria-label={t("sellerFilters")}>
        <button
          type="button"
          onClick={() => setSortOpen(true)}
          className={cn(actionButtonClass, currentSort !== "products" && "border-foreground")}
          aria-haspopup="dialog"
          aria-expanded={sortOpen}
          data-testid="mobile-seller-sort-button"
        >
          <ArrowUpDown className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate min-w-0">{sortLabel}</span>
        </button>

        <button
          type="button"
          onClick={openFilters}
          className={cn(actionButtonClass, hasActiveFilters && "border-foreground")}
          aria-haspopup="dialog"
          aria-expanded={filtersOpen}
          data-testid="mobile-seller-filters-button"
        >
          <SlidersHorizontal className="size-4 shrink-0" aria-hidden="true" />
          <span>{t("filters")}</span>
        </button>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {currentVerified && (
            <button
              type="button"
              onClick={() =>
                replaceUrl(
                  applySellerSearchParams(new URLSearchParams(searchParams.toString()), {
                    sellerVerified: false,
                  })
                )
              }
              className={chipClass}
            >
              <span>{t("verifiedSellers")}</span>
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
          {currentMinRating > 0 && (
            <button
              type="button"
              onClick={() =>
                replaceUrl(
                  applySellerSearchParams(new URLSearchParams(searchParams.toString()), {
                    sellerMinRating: null,
                  })
                )
              }
              className={chipClass}
            >
              <span>{t("sellerMinRatingChip", { rating: currentMinRating })}</span>
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
          {currentMinListings > 0 && (
            <button
              type="button"
              onClick={() =>
                replaceUrl(
                  applySellerSearchParams(new URLSearchParams(searchParams.toString()), {
                    sellerMinListings: null,
                  })
                )
              }
              className={chipClass}
            >
              <span>{t("sellerMinListingsChip", { count: currentMinListings })}</span>
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
          <button type="button" onClick={clearFilters} className={chipClass}>
            <span>{t("clear")}</span>
          </button>
        </div>
      )}

      <Drawer open={sortOpen} onOpenChange={setSortOpen}>
        <DrawerContent aria-label={t("sellerSort")}>
          <DrawerHeader className="border-b border-border-subtle px-inset py-3">
            <DrawerTitle className="text-base font-semibold">{t("sellerSort")}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="px-0">
            <FilterRadioGroup value={currentSort} onValueChange={(value) => applySort(value as SellerSortKey)}>
              <FilterRadioItem value="products" fullBleed>
                {t("sortSellerProducts")}
              </FilterRadioItem>
              <FilterRadioItem value="rating" fullBleed>
                {t("sortSellerRating")}
              </FilterRadioItem>
              <FilterRadioItem value="newest" fullBleed>
                {t("sortSellerNewest")}
              </FilterRadioItem>
            </FilterRadioGroup>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DrawerContent aria-label={t("sellerFilters")}>
          <DrawerHeader className="border-b border-border-subtle px-inset py-3">
            <DrawerTitle className="text-base font-semibold">{t("sellerFilters")}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="px-0 pb-safe-max">
            <div className="-mx-inset">
              <FilterCheckboxItem
                checked={pendingVerified}
                onCheckedChange={(checked) => setPendingVerified(Boolean(checked))}
                fullBleed
              >
                {t("verifiedSellers")}
              </FilterCheckboxItem>

              <div className="border-t border-border-subtle px-inset py-2">
                <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("minSellerRating")}
                </p>
                <FilterRadioGroup
                  value={String(pendingRating)}
                  onValueChange={(value) => setPendingRating(Number(value))}
                  className="rounded-xl border border-border-subtle"
                >
                  <FilterRadioItem value="0">{t("anyRating")}</FilterRadioItem>
                  <FilterRadioItem value="4">{t("rating4Plus")}</FilterRadioItem>
                  <FilterRadioItem value="4.5">{t("rating45Plus")}</FilterRadioItem>
                </FilterRadioGroup>
              </div>

              <div className="border-t border-border-subtle px-inset py-2">
                <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("minSellerListings")}
                </p>
                <FilterRadioGroup
                  value={String(pendingListings)}
                  onValueChange={(value) => setPendingListings(Number(value))}
                  className="rounded-xl border border-border-subtle"
                >
                  <FilterRadioItem value="0">{t("anyListings")}</FilterRadioItem>
                  <FilterRadioItem value="5">{t("listings5Plus")}</FilterRadioItem>
                  <FilterRadioItem value="10">{t("listings10Plus")}</FilterRadioItem>
                  <FilterRadioItem value="20">{t("listings20Plus")}</FilterRadioItem>
                </FilterRadioGroup>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter className="border-t border-border-subtle px-inset py-2">
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={clearFilters}>
                {t("clear")}
              </Button>
              <Button type="button" onClick={applyFilters}>
                {t("apply")}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  )
}

export type { MobileSellerFilterControlsProps }
