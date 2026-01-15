"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { X, Sliders } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { PriceSlider, type PriceSliderValue } from "./price-slider"

interface FilterSidebarProps {
  /** Maximum price for the price range slider */
  maxPrice?: number
  /** Whether there are any active filters */
  className?: string
}

// Condition options
const CONDITIONS = [
  { value: "new", labelEn: "New", labelBg: "Ново" },
  { value: "like_new", labelEn: "Like New", labelBg: "Като ново" },
  { value: "used", labelEn: "Used", labelBg: "Употребявано" },
  { value: "refurbished", labelEn: "Refurbished", labelBg: "Рефърбиш" },
] as const

// Seller type options  
const SELLER_TYPES = [
  { value: "all", labelEn: "All Sellers", labelBg: "Всички" },
  { value: "private", labelEn: "Private Sellers", labelBg: "Частни лица" },
  { value: "business", labelEn: "Business Sellers", labelBg: "Бизнес" },
] as const

/**
 * DesktopFilterSidebar - OLX/Bazar-style persistent filter panel
 * 
 * Features:
 * - Always visible on desktop (lg+)
 * - Price range with slider
 * - Condition checkboxes
 * - Seller type radio
 * - Free shipping toggle
 * - Sticky positioning
 */
export function DesktopFilterSidebar({ maxPrice = 10000, className }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("FilterSidebar")
  const locale = useLocale()
  const isBg = locale === "bg"

  // Current filter values from URL
  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentConditions = searchParams.getAll("condition")
  const currentSellerType = searchParams.get("sellerType") || "all"
  const currentFreeShipping = searchParams.get("freeShipping") === "true"

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (currentMinPrice || currentMaxPrice) count++
    if (currentConditions.length > 0) count += currentConditions.length
    if (currentSellerType !== "all") count++
    if (currentFreeShipping) count++
    return count
  }, [currentMinPrice, currentMaxPrice, currentConditions, currentSellerType, currentFreeShipping])

  // Update URL params
  const updateParams = React.useCallback((updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    for (const [key, value] of Object.entries(updates)) {
      params.delete(key) // Clear existing
      
      if (value === null) continue
      
      if (Array.isArray(value)) {
        for (const v of value) {
          params.append(key, v)
        }
      } else {
        params.set(key, value)
      }
    }
    
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }, [router, pathname, searchParams])

  // Clear all filters
  const clearAllFilters = React.useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("condition")
    params.delete("sellerType")
    params.delete("freeShipping")
    
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }, [router, pathname, searchParams])

  // Handle price change
  const handlePriceChange = React.useCallback((value: PriceSliderValue) => {
    updateParams({
      minPrice: value.min,
      maxPrice: value.max,
    })
  }, [updateParams])

  // Handle condition toggle
  const handleConditionToggle = React.useCallback((condition: string, checked: boolean) => {
    const newConditions = checked
      ? [...currentConditions, condition]
      : currentConditions.filter(c => c !== condition)
    
    updateParams({
      condition: newConditions.length > 0 ? newConditions : null,
    })
  }, [currentConditions, updateParams])

  // Handle seller type change
  const handleSellerTypeChange = React.useCallback((value: string) => {
    updateParams({
      sellerType: value === "all" ? null : value,
    })
  }, [updateParams])

  // Handle free shipping toggle
  const handleFreeShippingToggle = React.useCallback((checked: boolean) => {
    updateParams({
      freeShipping: checked ? "true" : null,
    })
  }, [updateParams])

  return (
    <aside className={cn(
      "w-64 shrink-0 hidden lg:block",
      "sticky top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto",
      "rounded-lg border border-border bg-card p-4",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sliders size={18} weight="regular" className="text-muted-foreground" />
          <h2 className="text-sm font-semibold">{t("title")}</h2>
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <X size={14} className="mr-1" />
            {t("clearAll")}
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">{t("priceRange")}</Label>
        <PriceSlider
          maxLimit={maxPrice}
          value={{
            min: currentMinPrice,
            max: currentMaxPrice,
          }}
          onChange={handlePriceChange}
          className="mt-2"
        />
      </div>

      <Separator className="my-4" />

      {/* Condition */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">{t("conditionLabel")}</Label>
        <div className="space-y-2">
          {CONDITIONS.map(({ value, labelEn, labelBg }) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`condition-${value}`}
                checked={currentConditions.includes(value)}
                onCheckedChange={(checked) => handleConditionToggle(value, !!checked)}
              />
              <label
                htmlFor={`condition-${value}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {isBg ? labelBg : labelEn}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Seller Type */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">{t("sellerType")}</Label>
        <RadioGroup
          value={currentSellerType}
          onValueChange={handleSellerTypeChange}
          className="space-y-2"
        >
          {SELLER_TYPES.map(({ value, labelEn, labelBg }) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={`seller-${value}`} />
              <label
                htmlFor={`seller-${value}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {isBg ? labelBg : labelEn}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator className="my-4" />

      {/* Free Shipping */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="free-shipping"
          checked={currentFreeShipping}
          onCheckedChange={(checked) => handleFreeShippingToggle(!!checked)}
        />
        <label
          htmlFor="free-shipping"
          className="text-sm text-foreground cursor-pointer"
        >
          {t("freeShippingOnly")}
        </label>
      </div>
    </aside>
  )
}
