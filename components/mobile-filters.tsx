"use client"

import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Sliders, Star, Check, CaretDown } from "@phosphor-icons/react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import type { CategoryAttribute } from "@/lib/data/categories"

interface MobileFiltersProps {
  locale: string
  resultsCount?: number
  attributes?: CategoryAttribute[]
}

// Attributes to hide from filters (too space-consuming as quick pills)
const HIDDEN_ATTRIBUTE_NAMES = [
  'Cruelty Free',
  'Vegan',
  'cruelty_free',
  'vegan',
]

export function MobileFilters({ locale, resultsCount = 0, attributes = [] }: MobileFiltersProps) {
  // Filter out hidden attributes
  const visibleAttributes = attributes.filter(
    attr => !HIDDEN_ATTRIBUTE_NAMES.includes(attr.name)
  )
  
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")
  const currentAvailability = searchParams.get("availability")

  // Determine the base path - use current pathname for category pages
  const basePath = pathname.includes('/categories/') ? pathname : '/search'
  
  // Get attribute display name
  const getAttrName = (attr: CategoryAttribute) => {
    return locale === 'bg' && attr.name_bg ? attr.name_bg : attr.name
  }
  
  // Get attribute options
  const getAttrOptions = (attr: CategoryAttribute) => {
    return locale === 'bg' && attr.options_bg ? attr.options_bg : attr.options
  }

  // Get current attribute filter values
  const getAttributeValues = (attrName: string): string[] => {
    return searchParams.getAll(`attr_${attrName}`)
  }

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    const queryString = params.toString()
    router.push(`${basePath}${queryString ? `?${queryString}` : ''}`)
  }

  const handlePriceClick = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min) params.set("minPrice", min)
    else params.delete("minPrice")
    if (max) params.set("maxPrice", max)
    else params.delete("maxPrice")
    const queryString = params.toString()
    router.push(`${basePath}${queryString ? `?${queryString}` : ''}`)
    setIsOpen(false)
  }

  // Handle attribute filter changes
  const handleAttributeChange = (attrName: string, value: string | string[] | boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    const paramKey = `attr_${attrName}`
    
    if (Array.isArray(value)) {
      params.delete(paramKey)
      if (value.length > 0) {
        value.forEach(v => params.append(paramKey, v))
      }
    } else if (typeof value === 'boolean') {
      if (value) {
        params.set(paramKey, 'true')
      } else {
        params.delete(paramKey)
      }
    } else if (value) {
      params.set(paramKey, value)
    } else {
      params.delete(paramKey)
    }
    
    const queryString = params.toString()
    router.push(`${basePath}${queryString ? `?${queryString}` : ''}`)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    const category = searchParams.get("category")
    const q = searchParams.get("q")
    if (category) params.set("category", category)
    if (q) params.set("q", q)
    const queryString = params.toString()
    router.push(`${basePath}${queryString ? `?${queryString}` : ''}`)
    setIsOpen(false)
  }

  // Count active attribute filters
  const activeAttrCount = visibleAttributes.filter(attr => getAttributeValues(attr.name).length > 0).length
  const hasActiveFilters = currentMinPrice || currentMaxPrice || currentRating || currentAvailability || activeAttrCount > 0
  const filterCount = [currentMinPrice || currentMaxPrice, currentRating, currentAvailability].filter(Boolean).length + activeAttrCount

  // Type for filter sections
  type BaseFilterSection = { id: string; label: string; attribute?: undefined }
  type AttrFilterSection = { id: string; label: string; attribute: CategoryAttribute }
  type FilterSection = BaseFilterSection | AttrFilterSection

  // Build filter sections dynamically including category attributes
  const baseFilterSections: BaseFilterSection[] = [
    { id: 'rating', label: t('customerReviews') },
    { id: 'price', label: t('price') },
    { id: 'availability', label: t('availability') },
  ]
  
  // Add attribute sections
  const attrFilterSections: AttrFilterSection[] = visibleAttributes.map(attr => ({
    id: `attr_${attr.id}`,
    label: getAttrName(attr),
    attribute: attr
  }))
  
  const filterSections: FilterSection[] = [...baseFilterSections, ...attrFilterSections]

  const priceRanges = [
    { label: t('under25'), min: null, max: "25" },
    { label: t('range2550'), min: "25", max: "50" },
    { label: t('range50100'), min: "50", max: "100" },
    { label: t('range100200'), min: "100", max: "200" },
    { label: t('above200'), min: "200", max: null }
  ]

  return (
    <>
      {/* Filter Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={cn(
          "h-11 rounded-full px-4",
          filterCount > 0 && "border-primary bg-primary/5"
        )}
      >
        <Sliders size={16} weight="regular" className={cn(
          filterCount > 0 ? "text-primary" : "text-muted-foreground"
        )} />
        <span>{t('filters')}</span>
        {filterCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
            {filterCount}
          </span>
        )}
      </Button>

      {/* Bottom Sheet using shadcn Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="bottom" 
          className="max-h-[85vh] flex flex-col rounded-t-2xl px-0 pb-0 lg:hidden"
        >
          {/* Drag Handle */}
          <div className="flex justify-center pb-2">
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
          </div>

          <SheetHeader className="px-4 pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-bold">{t('filters')}</SheetTitle>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t('clearAllFilters')}
                </button>
              )}
            </div>
          </SheetHeader>

          {/* Filter Sections */}
          <div className="flex-1 overflow-y-auto bg-muted/30">
            <div className="divide-y divide-border">
              {filterSections.map((section) => (
                <div key={section.id} className="bg-card">
                  <button
                    onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between px-4 py-3.5 min-h-12 hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-foreground">{section.label}</span>
                    <CaretDown 
                      size={20}
                      weight="regular"
                      className={cn(
                        "text-muted-foreground transition-transform",
                        activeSection === section.id && "rotate-180"
                      )} 
                    />
                  </button>

                  {activeSection === section.id && (
                    <div className="px-4 pb-4 space-y-2 bg-muted/30">
                      {/* Ratings */}
                      {section.id === 'rating' && (
                        <div className="space-y-0.5">
                          {[4, 3, 2, 1].map((stars) => (
                            <button
                              key={stars}
                              onClick={() => {
                                updateParams("minRating", currentRating === stars.toString() ? null : stars.toString())
                              }}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2.5 min-h-11 rounded-lg",
                                currentRating === stars.toString()
                                  ? "bg-primary/10"
                                  : "hover:bg-muted"
                              )}
                            >
                              <div className="flex text-rating">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    weight={i < stars ? "fill" : "regular"}
                                  />
                                ))}
                              </div>
                              <span className="text-sm">{t('andUp')}</span>
                              {currentRating === stars.toString() && (
                                <Check size={16} weight="regular" className="ml-auto text-primary" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Price */}
                      {section.id === 'price' && (
                        <div className="space-y-0.5">
                          {priceRanges.map(({ label, min, max }) => {
                            const isActive = currentMinPrice === min && currentMaxPrice === max
                            return (
                              <button
                                key={label}
                                onClick={() => handlePriceClick(min, max)}
                                className={cn(
                                  "w-full text-left px-3 py-2.5 min-h-11 rounded-lg text-sm flex items-center justify-between",
                                  isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-muted"
                                )}
                              >
                                {label}
                                {isActive && <Check className="h-4 w-4" />}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {/* Availability */}
                      {section.id === 'availability' && (
                        <label className="flex items-center gap-3 min-h-11 cursor-pointer hover:bg-muted rounded-lg px-2 -mx-2">
                          <Checkbox
                            checked={currentAvailability === "instock"}
                            onCheckedChange={() => updateParams("availability", currentAvailability === "instock" ? null : "instock")}
                            className="size-5"
                          />
                          <span className="text-sm">{t('includeOutOfStock')}</span>
                        </label>
                      )}

                      {/* Category Attribute Filters */}
                      {'attribute' in section && section.attribute && (
                        <>
                          {/* Boolean attributes */}
                          {section.attribute.attribute_type === 'boolean' && (
                            <label className="flex items-center gap-3 min-h-11 cursor-pointer hover:bg-muted rounded-lg px-2 -mx-2">
                              <Checkbox
                                checked={getAttributeValues(section.attribute.name).includes('true')}
                                onCheckedChange={(checked) => handleAttributeChange(section.attribute!.name, !!checked)}
                                className="size-5"
                              />
                              <span className="text-sm">{locale === 'bg' ? 'Да' : 'Yes'}</span>
                            </label>
                          )}
                          
                          {/* Select attributes */}
                          {section.attribute.attribute_type === 'select' && getAttrOptions(section.attribute) && (
                            <div className="space-y-0.5">
                              {getAttrOptions(section.attribute)!.map((option, idx) => {
                                const isActive = getAttributeValues(section.attribute!.name).includes(option)
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => handleAttributeChange(section.attribute!.name, isActive ? '' : option)}
                                    className={cn(
                                      "w-full text-left px-3 py-2.5 min-h-11 rounded-lg text-sm flex items-center justify-between",
                                      isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "hover:bg-muted"
                                    )}
                                  >
                                    {option}
                                    {isActive && <Check className="h-4 w-4" />}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                          
                          {/* Multiselect attributes */}
                          {section.attribute.attribute_type === 'multiselect' && getAttrOptions(section.attribute) && (
                            <div className="space-y-0.5">
                              {getAttrOptions(section.attribute)!.map((option, idx) => {
                                const currentValues = getAttributeValues(section.attribute!.name)
                                const isChecked = currentValues.includes(option)
                                return (
                                  <label
                                    key={idx}
                                    className={cn(
                                      "flex items-center gap-3 min-h-11 cursor-pointer hover:bg-muted rounded-lg px-2 -mx-2",
                                      isChecked && "bg-primary/5"
                                    )}
                                  >
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        const newValues = checked
                                          ? [...currentValues, option]
                                          : currentValues.filter(v => v !== option)
                                        handleAttributeChange(section.attribute!.name, newValues)
                                      }}
                                      className="size-5"
                                    />
                                    <span className="text-sm">{option}</span>
                                  </label>
                                )
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer with Show Results button */}
          <div className="p-4 border-t border-border bg-card">
            <SheetClose asChild>
              <Button className="w-full h-12 rounded-full">
                {resultsCount > 0 
                  ? (locale === 'bg' ? `Покажи ${resultsCount}` : `Show ${resultsCount} results`)
                  : t('showResults')
                }
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
