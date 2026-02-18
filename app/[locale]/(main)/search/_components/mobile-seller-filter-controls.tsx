"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ArrowUpDown, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOBILE_ACTION_CHIP_CLASS, getMobileQuickPillClass } from "@/components/mobile/chrome/mobile-control-recipes"
import type { SellerSortKey } from "../_lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MobileSellerFilterDrawer, MobileSellerSortDrawer } from "./mobile-seller-filter-drawers"
import { MobileSellerActiveChips } from "./mobile-seller-active-chips"

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
  const clearSingleFilter = useCallback(
    (next: { sellerVerified?: boolean; sellerMinRating?: number | null; sellerMinListings?: number | null }) => {
      replaceUrl(applySellerSearchParams(new URLSearchParams(searchParams.toString()), next))
    },
    [replaceUrl, searchParams]
  )

  const hasActiveFilters = currentVerified || currentMinRating > 0 || currentMinListings > 0

  const sortLabel = useMemo(() => {
    if (currentSort === "rating") return t("sortSellerRating")
    if (currentSort === "newest") return t("sortSellerNewest")
    return t("sortSellerProducts")
  }, [currentSort, t])

  const applyLabel = useMemo(() => {
    try {
      return t("apply")
    } catch {
      return t("showResults")
    }
  }, [t])

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

      <MobileSellerActiveChips
        currentVerified={currentVerified}
        currentMinRating={currentMinRating}
        currentMinListings={currentMinListings}
        chipClass={chipClass}
        t={t}
        onClearVerified={() => clearSingleFilter({ sellerVerified: false })}
        onClearMinRating={() => clearSingleFilter({ sellerMinRating: null })}
        onClearMinListings={() => clearSingleFilter({ sellerMinListings: null })}
        onClearAll={clearFilters}
      />

      <MobileSellerSortDrawer
        open={sortOpen}
        onOpenChange={setSortOpen}
        currentSort={currentSort}
        applySort={applySort}
        t={t}
      />

      <MobileSellerFilterDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        pendingVerified={pendingVerified}
        setPendingVerified={setPendingVerified}
        pendingRating={pendingRating}
        setPendingRating={setPendingRating}
        pendingListings={pendingListings}
        setPendingListings={setPendingListings}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
        applyLabel={applyLabel}
        t={t}
      />
    </section>
  )
}

export type { MobileSellerFilterControlsProps }
