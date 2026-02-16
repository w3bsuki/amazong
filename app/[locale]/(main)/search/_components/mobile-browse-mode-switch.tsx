"use client"

import { useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import {
  MOBILE_SEGMENTED_CONTAINER_CLASS,
  getMobileSegmentedTriggerClass,
} from "@/components/mobile/chrome/mobile-control-recipes"
import type { BrowseMode } from "../_lib/types"

interface MobileBrowseModeSwitchProps {
  mode: BrowseMode
  basePath?: string
  stickyTop?: number | string
  className?: string
}

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

function normalizeForMode(params: URLSearchParams, nextMode: BrowseMode): URLSearchParams {
  const next = new URLSearchParams(params.toString())

  next.delete("page")
  next.delete("mode")

  for (const key of next.keys()) {
    if (nextMode === "sellers") {
      if (LISTING_FILTER_KEYS.has(key) || key.startsWith("attr_")) {
        next.delete(key)
      }
      continue
    }

    if (SELLER_FILTER_KEYS.has(key)) {
      next.delete(key)
    }
  }

  if (nextMode === "sellers") {
    next.set("mode", "sellers")
  }

  return next
}

export function MobileBrowseModeSwitch({
  mode,
  basePath = "/search",
  stickyTop = "var(--offset-mobile-primary-rail)",
  className,
}: MobileBrowseModeSwitchProps) {
  const t = useTranslations("SearchFilters")
  const router = useRouter()
  const searchParams = useSearchParams()

  const switchMode = useCallback(
    (nextMode: BrowseMode) => {
      if (nextMode === mode) return
      const normalized = normalizeForMode(new URLSearchParams(searchParams.toString()), nextMode)
      const queryString = normalized.toString()
      router.push(queryString ? `${basePath}?${queryString}` : basePath)
    },
    [basePath, mode, router, searchParams]
  )

  return (
    <div
      className={cn("sticky z-30 bg-background px-inset py-1.5", className)}
      style={{ top: stickyTop }}
      data-testid="mobile-browse-mode-switch"
    >
      <div
        className={MOBILE_SEGMENTED_CONTAINER_CLASS}
        role="tablist"
        aria-label={t("browseMode")}
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "listings"}
          onClick={() => switchMode("listings")}
          className={getMobileSegmentedTriggerClass(mode === "listings")}
          data-testid="browse-mode-listings"
        >
          {t("listingsMode")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sellers"}
          onClick={() => switchMode("sellers")}
          className={getMobileSegmentedTriggerClass(mode === "sellers")}
          data-testid="browse-mode-sellers"
        >
          {t("sellersMode")}
        </button>
      </div>
    </div>
  )
}

export type { MobileBrowseModeSwitchProps }
