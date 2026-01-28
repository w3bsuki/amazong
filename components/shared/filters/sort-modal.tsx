"use client"

import { useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"

// =============================================================================
// SORT MODAL — Bottom sheet for sort options
//
// Per UI_UX_CODEX.md:
// - Sort opens a small bottom menu
// - Selection applies immediately and closes the modal
// =============================================================================

interface SortModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string
  /** Override base path for sort query params */
  basePath?: string | undefined
  /** Sort options to hide from the list (e.g., when already handled by UI tabs) */
  excludeOptions?: string[] | undefined
}

const SORT_OPTIONS = [
  { value: "featured", labelKey: "featured" },
  { value: "price-asc", labelKey: "priceLowHigh" },
  { value: "price-desc", labelKey: "priceHighLow" },
  { value: "rating", labelKey: "avgReview" },
  { value: "newest", labelKey: "newestArrivals" },
] as const

export function SortModal({
  open,
  onOpenChange,
  locale,
  basePath,
  excludeOptions = [],
}: SortModalProps) {
  const t = useTranslations("SearchFilters")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get("sort") || "featured"
  
  // Filter out excluded options
  const visibleOptions = SORT_OPTIONS.filter(
    (option) => !excludeOptions.includes(option.value)
  )

  // Resolve the base path (strip locale if present)
  const resolvedBasePath = basePath || (() => {
    const segments = pathname.split("/").filter(Boolean)
    const maybeLocale = segments[0]
    if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
      segments.shift()
    }
    return `/${segments.join("/")}` || "/"
  })()

  const handleSortChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === "featured") {
        params.delete("sort")
      } else {
        params.set("sort", value)
      }

      // Reset to page 1 when sort changes
      params.delete("page")

      const queryString = params.toString()
      router.push(queryString ? `${resolvedBasePath}?${queryString}` : resolvedBasePath)
      onOpenChange(false)
    },
    [router, resolvedBasePath, searchParams, onOpenChange]
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-dialog-sm rounded-t-2xl lg:hidden">
        <DrawerHeader className="px-inset pt-4 pb-3 border-b border-border/50">
          <DrawerTitle className="text-base font-semibold text-center">
            {t("sortBy")}
          </DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto py-2 pb-safe-max">
          <div className="space-y-0.5">
            {visibleOptions.map((option) => {
              const isActive = currentSort === option.value
              return (
                <DrawerClose key={option.value} asChild>
                  <button
                    type="button"
                    onClick={() => handleSortChange(option.value)}
                    className={cn(
                      "w-full flex items-center justify-between",
                      "px-inset h-11",
                      "text-sm font-medium text-left",
                      "transition-colors",
                      isActive
                        ? "bg-selected text-foreground"
                        : "text-foreground active:bg-active"
                    )}
                    aria-pressed={isActive}
                  >
                    <span>{t(option.labelKey)}</span>
                    {isActive && (
                      <Check size={16} weight="bold" className="shrink-0" />
                    )}
                  </button>
                </DrawerClose>
              )
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
