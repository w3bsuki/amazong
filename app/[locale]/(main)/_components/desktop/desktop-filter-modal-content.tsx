import * as React from "react"
import { SlidersHorizontal as Sliders, Star, Tag, X } from "lucide-react";

import { cn } from "@/lib/utils"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import type { CategoryAttribute } from "@/lib/types/categories"
import {
  getCategoryAttributeKey,
  getCategoryAttributeLabel,
  getCategoryAttributeOptions,
} from "@/lib/filters/category-attribute"
import { DesktopFilterSearch } from "./desktop-filter-search"

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

interface DesktopFilterModalContentProps {
  t: Translate
  tHub: Translate
  locale: string
  filterableAttributes: CategoryAttribute[]
  pendingFilters: Record<string, string[]>
  pendingPrice: { min: string; max: string }
  pendingRating: number | null
  setPendingPrice: React.Dispatch<React.SetStateAction<{ min: string; max: string }>>
  setPendingRating: React.Dispatch<React.SetStateAction<number | null>>
  handleAttrChange: (attrName: string, values: string[]) => void
  handleBooleanAttr: (attrName: string, checked: boolean) => void
  clearAll: () => void
  applyFilters: () => void
  hasPendingFilters: boolean
  liveCount: number
  isCountLoading: boolean
}

export function DesktopFilterModalContent({
  t,
  tHub,
  locale,
  filterableAttributes,
  pendingFilters,
  pendingPrice,
  pendingRating,
  setPendingPrice,
  setPendingRating,
  handleAttrChange,
  handleBooleanAttr,
  clearAll,
  applyFilters,
  hasPendingFilters,
  liveCount,
  isCountLoading,
}: DesktopFilterModalContentProps) {
  const priceRanges = [
    { label: t("under25"), min: "", max: "25" },
    { label: t("range2550"), min: "25", max: "50" },
    { label: t("range50100"), min: "50", max: "100" },
    { label: t("range100200"), min: "100", max: "200" },
    { label: t("above200"), min: "200", max: "" },
  ]

  return (
    <DialogContent
      className="sm:max-w-(--container-modal-lg) h-(--dialog-h-85vh) max-h-(--dialog-h-85vh) p-0 gap-0 flex flex-col overflow-hidden"
      showCloseButton={false}
    >
      <DialogDescription className="sr-only">{t("filterProductsByAttributes")}</DialogDescription>

      <div className="flex shrink-0 items-center justify-between px-6 py-5 border-b bg-background">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-selected">
            <Sliders size={22} className="text-primary" />
          </div>
          <div>
            <DialogTitle className="text-lg font-semibold tracking-tight">{t("filters")}</DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{t("customizeSearchResults")}</p>
          </div>
        </div>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted"
            aria-label={t("closeFilters")}
          >
            <X size={20} aria-hidden="true" />
          </Button>
        </DialogClose>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth scrollbar-soft">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-md border border-border-subtle bg-secondary/20">
              <h4 className="text-sm font-semibold tracking-tight flex items-center gap-2 mb-3">
                <Tag size={15} className="text-primary" />
                {t("price")}
              </h4>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {priceRanges.map(({ label, min, max }) => {
                  const isActive = pendingPrice.min === min && pendingPrice.max === max
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setPendingPrice(isActive ? { min: "", max: "" } : { min, max })}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-muted text-muted-foreground"
                      )}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                  <Input
                    type="number"
                    placeholder={t("min")}
                    value={pendingPrice.min}
                    onChange={(event) => setPendingPrice((previous) => ({ ...previous, min: event.target.value }))}
                    className="pl-6 h-8 text-sm bg-background border-border-subtle"
                  />
                </div>
                <span className="text-muted-foreground text-sm">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                  <Input
                    type="number"
                    placeholder={t("max")}
                    value={pendingPrice.max}
                    onChange={(event) => setPendingPrice((previous) => ({ ...previous, max: event.target.value }))}
                    className="pl-6 h-8 text-sm bg-background border-border-subtle"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-md border border-border-subtle bg-secondary/20">
              <h4 className="text-sm font-semibold tracking-tight flex items-center gap-2 mb-3">
                <Star size={15} className="text-rating" />
                {t("customerReviews")}
              </h4>
              <div className="grid grid-cols-4 gap-1.5">
                {[4, 3, 2, 1].map((stars) => {
                  const isActive = pendingRating === stars
                  return (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setPendingRating(isActive ? null : stars)}
                      className={cn(
                        "flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive
                          ? "bg-accent"
                          : "bg-background hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <div className="flex">
                        {[...Array(stars)].map((_, index) => (
                          <Star
                            key={index}
                            size={10}
                            className="text-rating"
                          />
                        ))}
                      </div>
                      <span className="text-2xs font-medium text-muted-foreground">{t("andUp")}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filterableAttributes.map((attribute) => {
              const attrName = getCategoryAttributeLabel(attribute, locale)
              const options = getCategoryAttributeOptions(attribute, locale) ?? []
              const attrKey = getCategoryAttributeKey(attribute)
              const currentValues = pendingFilters[attrKey] || []
              const selectedCount = currentValues.length

              if (attribute.attribute_type === "boolean") {
                const isChecked = currentValues.includes("true")
                return (
                  <div key={attribute.id} className="p-4 rounded-md border border-border-subtle bg-secondary/20">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold tracking-tight">{attrName}</h5>
                      <Switch
                        checked={isChecked}
                        onCheckedChange={(checked) => handleBooleanAttr(attrKey, checked)}
                      />
                    </div>
                  </div>
                )
              }

              if (attribute.attribute_type === "number") {
                const min = attribute.min_value ?? 0
                const max = attribute.max_value ?? 100
                const value = currentValues[0] ? Number.parseInt(currentValues[0]) : min
                return (
                  <div key={attribute.id} className="p-4 rounded-md border border-border-subtle bg-secondary/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold tracking-tight">{attrName}</h5>
                      <span className="text-sm font-bold text-primary">{value}</span>
                    </div>
                    <Slider
                      min={min}
                      max={max}
                      value={[value]}
                      onValueChange={(values) => {
                        const nextValue = values[0]
                        if (nextValue === undefined) return
                        handleAttrChange(attrKey, [nextValue.toString()])
                      }}
                    />
                    <div className="flex justify-between text-2xs text-muted-foreground">
                      <span>{min}</span>
                      <span>{max}</span>
                    </div>
                  </div>
                )
              }

              if ((attribute.attribute_type === "select" || attribute.attribute_type === "multiselect") && options.length > 0) {
                const isSingleSelect = attribute.attribute_type === "select"

                return (
                  <div key={attribute.id} className="p-4 rounded-md border border-border-subtle bg-secondary/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold tracking-tight">{attrName}</h5>
                      {selectedCount > 0 && (
                        <Badge className="h-5 min-w-5 px-1.5 text-xs bg-primary">{selectedCount}</Badge>
                      )}
                    </div>

                    <DesktopFilterSearch
                      options={options}
                      selectedValues={currentValues}
                      onChange={(values) => handleAttrChange(attrKey, isSingleSelect ? values.slice(-1) : values)}
                      placeholder={t("searchAttributePlaceholder", { attribute: attrName })}
                      isSingleSelect={isSingleSelect}
                    />
                  </div>
                )
              }

              return null
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-6 py-4 border-t bg-background flex items-center justify-between">
        <button
          type="button"
          onClick={clearAll}
          disabled={!hasPendingFilters}
          className={cn(
            "text-sm font-medium transition-colors px-4 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            hasPendingFilters
              ? "text-destructive hover:bg-destructive-subtle"
              : "text-muted-foreground cursor-not-allowed opacity-50"
          )}
        >
          {t("clearAllFilters")}
        </button>
        <Button
          onClick={applyFilters}
          size="lg"
          disabled={liveCount === 0 && hasPendingFilters}
          className="px-8 rounded-full transition-colors min-w-40"
        >
          {isCountLoading ? (
            <span className="animate-pulse">{tHub("showResults", { count: "..." })}</span>
          ) : liveCount === 0 && hasPendingFilters ? (
            tHub("noResults")
          ) : (
            tHub("showResults", { count: liveCount.toLocaleString() })
          )}
        </Button>
      </div>
    </DialogContent>
  )
}
