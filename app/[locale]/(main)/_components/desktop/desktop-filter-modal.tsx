"use client"

import dynamic from "next/dynamic"
import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useRouter, usePathname } from "@/i18n/routing"
import { SlidersHorizontal as Sliders } from "lucide-react";

import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useFilterCount } from "../filters/use-filter-count"
import type { CategoryAttribute } from "@/lib/types/categories"
import { getCategoryAttributeKey } from "@/lib/filters/category-attribute"

const DesktopFilterModalContent = dynamic(
  () => import("./desktop-filter-modal-content").then((mod) => mod.DesktopFilterModalContent),
  {
    ssr: false,
    loading: () => (
      <DialogContent
        className="sm:max-w-(--container-modal-lg) h-(--dialog-h-85vh) max-h-(--dialog-h-85vh) p-0 gap-0 flex flex-col overflow-hidden"
        showCloseButton={false}
      >
        <DialogDescription className="sr-only">Loading filters</DialogDescription>
        <div className="border-b bg-background px-6 py-5">
          <DialogTitle className="text-lg font-semibold tracking-tight">Loading…</DialogTitle>
          <p className="mt-1 text-xs text-muted-foreground">Preparing filter options.</p>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-6">
          <div className="space-y-3">
            <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
            <div className="h-5 w-64 animate-pulse rounded-md bg-muted" />
            <div className="h-5 w-52 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </DialogContent>
    ),
  },
)

interface DesktopFilterModalProps {
  attributes?: CategoryAttribute[]
  categorySlug?: string | undefined
  categoryId?: string | undefined
  className?: string
  trigger?: React.ReactNode
}

export function DesktopFilterModal({
  attributes = [],
  categorySlug,
  categoryId,
  className,
  trigger
}: DesktopFilterModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("SearchFilters")
  const tHub = useTranslations("FilterHub")
  const locale = useLocale()

  const [isOpen, setIsOpen] = React.useState(false)
  const [pendingFilters, setPendingFilters] = React.useState<Record<string, string[]>>({})
  const [pendingPrice, setPendingPrice] = React.useState<{ min: string; max: string }>({ min: "", max: "" })
  const [pendingRating, setPendingRating] = React.useState<number | null>(null)

  const filterableAttributes = attributes.filter((attr) => attr.is_filterable)
  const basePath = categorySlug ? pathname : "/search"

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")

  const getCurrentAttrValues = React.useCallback(
    (attr: CategoryAttribute): string[] => {
      const attrKey = getCategoryAttributeKey(attr)
      return [
        ...new Set([
          ...searchParams.getAll(`attr_${attrKey}`),
          ...searchParams.getAll(`attr_${attr.name}`),
        ]),
      ]
    },
    [searchParams],
  )

  const didInitOnOpenRef = React.useRef(false)

  const countParams = React.useMemo(() => ({
    categoryId: categoryId ?? null,
    filters: {
      minPrice: pendingPrice.min ? Number(pendingPrice.min) : null,
      maxPrice: pendingPrice.max ? Number(pendingPrice.max) : null,
      minRating: pendingRating ?? null,
      attributes: pendingFilters,
    },
  }), [categoryId, pendingPrice, pendingRating, pendingFilters])

  const { count: liveCount, isLoading: isCountLoading } = useFilterCount(
    isOpen ? countParams : { categoryId: null, filters: {} }
  )

  React.useEffect(() => {
    if (!isOpen) {
      didInitOnOpenRef.current = false
      return
    }

    if (didInitOnOpenRef.current) return
    didInitOnOpenRef.current = true

    const initial: Record<string, string[]> = {}
    filterableAttributes.forEach((attr) => {
      const attrKey = getCategoryAttributeKey(attr)
      const values = getCurrentAttrValues(attr)
      if (values.length > 0) {
        initial[attrKey] = values
      }
    })
    setPendingFilters(initial)
    setPendingPrice({ min: currentMinPrice || "", max: currentMaxPrice || "" })
    setPendingRating(currentRating ? Number.parseInt(currentRating) : null)
  }, [
    currentMaxPrice,
    currentMinPrice,
    currentRating,
    filterableAttributes,
    getCurrentAttrValues,
    isOpen,
  ])

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    filterableAttributes.forEach((attr) => {
      if (getCurrentAttrValues(attr).length > 0) count++
    })
    if (currentMinPrice || currentMaxPrice) count++
    if (currentRating) count++
    return count
  }, [
    currentMaxPrice,
    currentMinPrice,
    currentRating,
    filterableAttributes,
    getCurrentAttrValues,
  ])

  const handleAttrChange = (attrName: string, values: string[]) => {
    setPendingFilters((previous) => ({ ...previous, [attrName]: values }))
  }

  const handleBooleanAttr = (attrName: string, checked: boolean) => {
    setPendingFilters((previous) => ({ ...previous, [attrName]: checked ? ["true"] : [] }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    searchParams.forEach((value, key) => {
      if (!key.startsWith("attr_") && !["minPrice", "maxPrice", "minRating"].includes(key)) {
        params.append(key, value)
      }
    })

    Object.entries(pendingFilters).forEach(([name, values]) => {
      values.forEach((value) => params.append(`attr_${name}`, value))
    })

    if (pendingPrice.min) params.set("minPrice", pendingPrice.min)
    if (pendingPrice.max) params.set("maxPrice", pendingPrice.max)
    if (pendingRating) params.set("minRating", pendingRating.toString())

    const query = params.toString()
    const route = query ? `${basePath}?${query}` : basePath
    router.push(route)
    setIsOpen(false)
  }

  const clearAll = () => {
    setPendingFilters({})
    setPendingPrice({ min: "", max: "" })
    setPendingRating(null)
  }

  const hasPendingFilters =
    Object.values(pendingFilters).some((values) => values.length > 0) ||
    Boolean(pendingPrice.min) || Boolean(pendingPrice.max) ||
    pendingRating !== null

  const defaultTrigger = (
    <Button
      variant="ghost"
      className={cn(
        "h-9 px-4 rounded-full gap-2 bg-secondary/50 hover:bg-secondary",
        activeFilterCount > 0 && "bg-selected text-primary hover:bg-hover",
        className
      )}
    >
      <Sliders size={16} />
      <span>{t("filters")}</span>
      {activeFilterCount > 0 && (
        <Badge variant="default" className="h-5 min-w-5 px-1.5 text-xs">
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ?? defaultTrigger}
      </DialogTrigger>

      {isOpen ? (
        <DesktopFilterModalContent
          t={t}
          tHub={tHub}
          locale={locale}
          filterableAttributes={filterableAttributes}
          pendingFilters={pendingFilters}
          pendingPrice={pendingPrice}
          pendingRating={pendingRating}
          setPendingPrice={setPendingPrice}
          setPendingRating={setPendingRating}
          handleAttrChange={handleAttrChange}
          handleBooleanAttr={handleBooleanAttr}
          clearAll={clearAll}
          applyFilters={applyFilters}
          hasPendingFilters={hasPendingFilters}
          liveCount={liveCount}
          isCountLoading={isCountLoading}
        />
      ) : null}
    </Dialog>
  )
}
