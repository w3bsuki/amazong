"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ChevronDown as CaretDown, Ellipsis as DotsThree, Package, Percent, SlidersHorizontal as Sliders, Star } from "lucide-react";
import { cn } from "@/lib/utils"
import type { CategoryAttribute } from "@/lib/data/categories"
import { getFilterPillsForCategory } from "../_lib/filter-priority"
import { getCategoryAttributeKey } from "@/lib/filters/category-attribute"
import { DesktopFilterModal } from "../../../_components/desktop/desktop-filter-modal"

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

type SearchParamsLike = {
  get: (key: string) => string | null
  keys: () => IterableIterator<string>
}

type QuickFilterId = "deals" | "nearby" | "top_rated" | "free_shipping"

const QUICK_FILTERS: Array<{
  id: QuickFilterId
  labelKey: string
  icon: typeof Percent
  paramKey: string
  paramValue: string
}> = [
  { id: "deals", labelKey: "tabs.deals", icon: Percent, paramKey: "tag", paramValue: "deal" },
  { id: "top_rated", labelKey: "tabs.top_rated", icon: Star, paramKey: "minRating", paramValue: "4" },
  { id: "free_shipping", labelKey: "tabs.free_shipping", icon: Package, paramKey: "freeShipping", paramValue: "true" },
]

const pillBase = cn(
  "h-11 px-4 gap-2 rounded-full",
  "text-sm font-medium whitespace-nowrap",
  "flex items-center justify-center",
  "border transition-colors",
  "focus-visible:ring-2 focus-visible:ring-focus-ring"
)
const pillInactive = cn(
  "border-border bg-muted text-muted-foreground",
  "hover:bg-hover hover:text-foreground"
)
const pillActive = cn(
  "border-selected-border bg-selected text-primary"
)

interface DesktopFilterToolbarFilterPillsProps {
  locale: string
  categorySlug?: string | undefined
  categoryId?: string | undefined
  attributes: CategoryAttribute[]
  searchParams: SearchParamsLike
  updateParams: (updates: Record<string, string | null>) => void
  t: Translate
  tFilters: Translate
}

export function DesktopFilterToolbarFilterPills({
  locale,
  categorySlug,
  categoryId,
  attributes,
  searchParams,
  updateParams,
  t,
  tFilters,
}: DesktopFilterToolbarFilterPillsProps) {
  const activeQuickFilters = React.useMemo(() => {
    const active: QuickFilterId[] = []
    for (const filter of QUICK_FILTERS) {
      if (searchParams.get(filter.paramKey) === filter.paramValue) {
        active.push(filter.id)
      }
    }
    return active
  }, [searchParams])

  const toggleQuickFilter = React.useCallback((filter: typeof QUICK_FILTERS[number]) => {
    const isActive = searchParams.get(filter.paramKey) === filter.paramValue
    updateParams({ [filter.paramKey]: isActive ? null : filter.paramValue })
  }, [searchParams, updateParams])

  const priorityFilters = React.useMemo(
    () => getFilterPillsForCategory(categorySlug, attributes),
    [categorySlug, attributes]
  )

  const attributeDropdowns = React.useMemo(() => {
    if (!attributes.length) return []

    const result: Array<{
      key: string
      label: string
      paramKey: string
      options: Array<{ value: string; label: string }>
    }> = []

    const usedKeys = new Set<string>()

    for (const filterKey of priorityFilters) {
      if (filterKey === "price" || filterKey === "category") continue

      const attr = attributes.find(
        (attribute) => getCategoryAttributeKey(attribute).toLowerCase() === filterKey.toLowerCase()
      )
      if (!attr) continue

      const attrKey = getCategoryAttributeKey(attr)
      if (usedKeys.has(attrKey)) continue

      const options = (locale === "bg" && attr.options_bg?.length ? attr.options_bg : attr.options || [])
        .slice(0, 10)
        .map((option) => ({ value: option, label: option }))

      if (options.length > 0) {
        usedKeys.add(attrKey)
        result.push({
          key: attrKey,
          label: locale === "bg" && attr.name_bg ? attr.name_bg : attr.name,
          paramKey: `attr_${attrKey}`,
          options,
        })
      }
    }

    for (const attr of attributes) {
      if (result.length >= 6) break

      const attrKey = getCategoryAttributeKey(attr)
      if (usedKeys.has(attrKey)) continue

      const options = (locale === "bg" && attr.options_bg?.length ? attr.options_bg : attr.options || [])
        .slice(0, 10)
        .map((option) => ({ value: option, label: option }))

      if (options.length > 0) {
        usedKeys.add(attrKey)
        result.push({
          key: attrKey,
          label: locale === "bg" && attr.name_bg ? attr.name_bg : attr.name,
          paramKey: `attr_${attrKey}`,
          options,
        })
      }
    }

    return result.slice(0, 6)
  }, [attributes, priorityFilters, locale])

  const activeAttributeCount = React.useMemo(() => {
    let count = 0
    for (const key of searchParams.keys()) {
      if (key.startsWith("attr_")) count++
    }
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++
    if (searchParams.get("minRating")) count++
    return count
  }, [searchParams])

  const totalActiveFilters = activeQuickFilters.length + activeAttributeCount
  const overflowCount = activeQuickFilters.length > 0 ? activeQuickFilters.length : QUICK_FILTERS.length

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar ml-auto">
      {attributeDropdowns.map((dropdown) => {
        const selectedValue = searchParams.get(dropdown.paramKey)
        const hasValue = Boolean(selectedValue)

        return (
          <DropdownMenu key={dropdown.key}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="default"
                className={cn(pillBase, hasValue ? pillActive : pillInactive)}
              >
                <span className="max-w-20 truncate">
                  {hasValue ? selectedValue : dropdown.label}
                </span>
                <CaretDown className="size-3 opacity-50 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-36 max-h-64 overflow-y-auto">
              {dropdown.options.map((option) => {
                const isSelected = selectedValue === option.value
                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => {
                      updateParams({
                        [dropdown.paramKey]: isSelected ? null : option.value,
                      })
                    }}
                    className={cn(isSelected && "bg-accent")}
                  >
                    <span className="flex-1">{option.label}</span>
                    {isSelected && <Check className="size-4 text-primary" />}
                  </DropdownMenuItem>
                )
              })}
              {hasValue && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => updateParams({ [dropdown.paramKey]: null })}
                    variant="destructive"
                  >
                    {tFilters("clear")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      })}

      {attributes.length > 0 && categorySlug && (
        <DesktopFilterModal
          attributes={attributes}
          categorySlug={categorySlug}
          categoryId={categoryId}
          trigger={
            <Button
              variant="ghost"
              size="default"
              className={cn(pillBase, totalActiveFilters > 0 ? pillActive : pillInactive)}
            >
              <Sliders size={14} className="shrink-0" />
              <span>{tFilters("filters")}</span>
              {totalActiveFilters > 0 && (
                <Badge variant="default" className="h-4 min-w-4 px-1 text-2xs rounded-full">
                  {totalActiveFilters}
                </Badge>
              )}
            </Button>
          }
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className={cn(pillBase, activeQuickFilters.length > 0 ? pillActive : pillInactive)}
          >
            <DotsThree size={14} className="shrink-0" />
            <span>{t("tabs.moreFilters", { count: overflowCount })}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          {QUICK_FILTERS.map((filter) => {
            const Icon = filter.icon
            const isActive = activeQuickFilters.includes(filter.id)
            return (
              <DropdownMenuItem
                key={filter.id}
                onClick={() => toggleQuickFilter(filter)}
                className={cn(isActive && "bg-accent")}
              >
                <Icon size={16} className="shrink-0 mr-2" />
                <span className="flex-1">{t(filter.labelKey)}</span>
                {isActive && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
