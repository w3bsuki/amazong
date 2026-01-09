"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { Sliders, Star, Check, CaretRight, CaretLeft, CaretUp, ArrowsDownUp } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import type { CategoryAttribute } from "@/lib/data/categories"

interface MobileFiltersProps {
  locale: string
  resultsCount?: number
  attributes?: CategoryAttribute[]
  /** Override where filter query params are applied. Defaults to the current pathname. */
  basePath?: string
}

// Attributes to hide from filters (too space-consuming as quick pills)
const HIDDEN_ATTRIBUTE_NAMES = [
  'Cruelty Free',
  'Vegan',
  'cruelty_free',
  'vegan',
]

export function MobileFilters({ locale, resultsCount = 0, attributes = [], basePath }: MobileFiltersProps) {
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

  // Determine the base path - default to current pathname.
  // (This component is used on search, categories, and now mobile tabs.)
  const resolvedBasePath = basePath || pathname
  
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

  // ---------------------------------------------------------------------------
  // Pending state (mobile drawer UX)
  // - Users can select multiple options, then tap "Show results" to apply.
  // - Prevents a full navigation on every tap and matches the button label.
  // ---------------------------------------------------------------------------

  const [pendingPrice, setPendingPrice] = useState<{ min: string | null; max: string | null }>({
    min: null,
    max: null,
  })
  const [pendingRating, setPendingRating] = useState<string | null>(null)
  const [pendingAvailability, setPendingAvailability] = useState<string | null>(null)
  const [pendingAttrs, setPendingAttrs] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!isOpen) return
    setActiveSection(null)
    setPendingPrice({ min: currentMinPrice, max: currentMaxPrice })
    setPendingRating(currentRating)
    setPendingAvailability(currentAvailability)
    const initialAttrs: Record<string, string[]> = {}
    for (const attr of visibleAttributes) {
      const values = getAttributeValues(attr.name)
      if (values.length > 0) {
        initialAttrs[attr.name] = values
      }
    }
    setPendingAttrs(initialAttrs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const shouldForceMultiSelect = (attr: CategoryAttribute) => {
    const name = attr.name.trim().toLowerCase()
    return name === 'brand' || name === 'make' || name === 'model'
  }

  const getPendingAttrValues = (attrName: string): string[] => {
    return pendingAttrs[attrName] || []
  }

  const setPendingAttrValues = (attrName: string, values: string[]) => {
    setPendingAttrs((prev) => {
      const next = { ...prev }
      if (values.length === 0) {
        delete next[attrName]
      } else {
        next[attrName] = values
      }
      return next
    })
  }

  const clearAllPendingFilters = () => {
    setPendingPrice({ min: null, max: null })
    setPendingRating(null)
    setPendingAvailability(null)
    setPendingAttrs({})
  }

  const applyPendingFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Remove all filter params
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('minRating')
    params.delete('availability')
    params.delete('page')
    for (const key of params.keys()) {
      if (key.startsWith('attr_')) params.delete(key)
    }

    // Apply pending base filters
    if (pendingPrice.min) params.set('minPrice', pendingPrice.min)
    if (pendingPrice.max) params.set('maxPrice', pendingPrice.max)
    if (pendingRating) params.set('minRating', pendingRating)
    if (pendingAvailability) params.set('availability', pendingAvailability)

    // Apply pending attribute filters
    for (const [attrName, values] of Object.entries(pendingAttrs)) {
      const paramKey = `attr_${attrName}`
      for (const v of values) {
        if (v) params.append(paramKey, v)
      }
    }

    const queryString = params.toString()
    router.push(`${resolvedBasePath}${queryString ? `?${queryString}` : ''}`)
  }

  // Count active filters (current URL) - used for trigger badge
  const activeAttrCount = useMemo(() => {
    return visibleAttributes.filter(attr => getAttributeValues(attr.name).length > 0).length
  }, [visibleAttributes, searchParams])

  const hasActiveFilters = Boolean(
    currentMinPrice || currentMaxPrice || currentRating || currentAvailability || activeAttrCount > 0
  )

  const filterCount =
    [currentMinPrice || currentMaxPrice, currentRating, currentAvailability].filter(Boolean).length +
    activeAttrCount

  const hasPendingFilters = Boolean(
    pendingPrice.min || pendingPrice.max || pendingRating || pendingAvailability || Object.keys(pendingAttrs).length > 0
  )

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

  const getSelectedSummary = (section: FilterSection) => {
    if (section.id === 'rating') {
      return pendingRating ? `${pendingRating}+ ${t('stars')}` : null
    }
    if (section.id === 'price') {
      if (pendingPrice.min && pendingPrice.max) return `$${pendingPrice.min} - $${pendingPrice.max}`
      if (pendingPrice.min) return `$${pendingPrice.min}+`
      if (pendingPrice.max) return `${t('under')} $${pendingPrice.max}`
      return null
    }
    if (section.id === 'availability') {
      return pendingAvailability === 'instock' ? t('inStock') : null
    }
    if ('attribute' in section && section.attribute) {
      const values = getPendingAttrValues(section.attribute.name)
      if (values.length === 0) return null
      if (values.length === 1) return values[0]
      return `${values.length} ${t('selected')}`
    }
    return null
  }

  const priceRanges = [
    { label: t('under25'), min: null, max: "25" },
    { label: t('range2550'), min: "25", max: "50" },
    { label: t('range50100'), min: "50", max: "100" },
    { label: t('range100200'), min: "100", max: "200" },
    { label: t('above200'), min: "200", max: null }
  ]

  return (
    <>
      {/* Filter Trigger Button - Treido style */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className={cn(
          "h-9 w-full rounded-lg px-3 gap-2 text-[14px] font-medium",
          "bg-white border border-gray-200 text-gray-700 active:bg-gray-50",
          filterCount > 0 && "border-gray-900 text-gray-900"
        )}
      >
        <Sliders size={14} weight="regular" className="shrink-0" />
        <span>{t('filters')}</span>
        {filterCount > 0 && (
          <span className="bg-gray-900 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
            {filterCount}
          </span>
        )}
      </Button>

      {/* Bottom Sheet - Treido pattern: h-[92vh], rounded-t-xl */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent 
          className="h-[92vh] flex flex-col rounded-t-xl px-0 pb-0 lg:hidden"
        >
          {/* Header - Treido: h-[56px] border-b border-gray-100 */}
          <DrawerHeader className={cn(
            "px-4 h-[56px] flex-shrink-0 border-b border-gray-100 flex items-center",
            activeSection ? "justify-start" : "justify-between"
          )}>
            {activeSection ? (
              <button 
                onClick={() => setActiveSection(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100"
              >
                <CaretLeft size={20} weight="bold" className="text-gray-900" />
              </button>
            ) : (
              <DrawerClose asChild>
                <button className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100">
                  <span className="text-[20px] font-bold text-gray-400">×</span>
                </button>
              </DrawerClose>
            )}
            
            <h2 className="text-[16px] font-bold text-gray-900 flex-1 text-center">
              {activeSection 
                ? filterSections.find(s => s.id === activeSection)?.label 
                : t('filters')
              }
            </h2>
            
            {hasPendingFilters && !activeSection ? (
              <button
                onClick={clearAllPendingFilters}
                className="text-[14px] font-medium text-gray-500"
              >
                {t('clearAllFilters')}
              </button>
            ) : (
              <div className="w-8" /> // Spacer for centering
            )}
          </DrawerHeader>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto">
            {!activeSection ? (
              /* Main List View - Treido style */
              <div>
                {filterSections.map((section) => {
                  const summary = getSelectedSummary(section)
                  return (
                    <div
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className="flex items-center justify-between py-2.5 px-4 cursor-pointer active:bg-gray-50 border-b border-gray-100"
                    >
                      <span className="text-[14px] text-gray-700">{section.label}</span>
                      <div className="flex items-center gap-2">
                        {summary && (
                          <span className="text-[14px] text-gray-900 font-medium">{summary}</span>
                        )}
                        <CaretRight 
                          size={16}
                          weight="bold"
                          className="text-gray-400" 
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* Sub-view for specific filter - Treido style */
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-[14px] font-bold text-gray-900 mb-3">
                  {filterSections.find(s => s.id === activeSection)?.label}
                </h3>
                <div className="space-y-2">
                {/* Ratings - Treido chip style */}
                {activeSection === 'rating' && (
                  <div className="flex flex-wrap gap-2">
                    {[4, 3, 2, 1].map((stars) => (
                      <button
                        key={stars}
                        onClick={() => {
                          setPendingRating(pendingRating === stars.toString() ? null : stars.toString())
                        }}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors flex items-center gap-1.5",
                          pendingRating === stars.toString()
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                        )}
                        aria-pressed={pendingRating === stars.toString()}
                      >
                        <div className="flex text-rating">
                          {[...Array(stars)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              weight="fill"
                            />
                          ))}
                        </div>
                        <span>{t('andUp')}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Price - Treido chip style */}
                {activeSection === 'price' && (
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map(({ label, min, max }) => {
                      const isActive = pendingPrice.min === min && pendingPrice.max === max
                      return (
                        <button
                          key={label}
                          onClick={() => setPendingPrice(isActive ? { min: null, max: null } : { min, max })}
                          className={cn(
                            "px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors",
                            isActive
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                          )}
                          aria-pressed={isActive}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Availability - Treido chip style */}
                {activeSection === 'availability' && (
                  <button
                    onClick={() => setPendingAvailability(pendingAvailability === 'instock' ? null : 'instock')}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors",
                      pendingAvailability === "instock"
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                    )}
                    aria-pressed={pendingAvailability === 'instock'}
                  >
                    {t('inStock')}
                  </button>
                )}

                {/* Category Attribute Filters - Treido chip style */}
                {filterSections.find(s => s.id === activeSection)?.attribute && (
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const section = filterSections.find(s => s.id === activeSection) as AttrFilterSection
                      const attr = section.attribute
                      
                      if (attr.attribute_type === 'boolean') {
                        const isChecked = getPendingAttrValues(attr.name).includes('true')
                        return (
                          <button
                            onClick={() => setPendingAttrValues(attr.name, isChecked ? [] : ['true'])}
                            className={cn(
                              "px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors",
                              isChecked
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                            )}
                            aria-pressed={isChecked}
                          >
                            {locale === 'bg' ? 'Да' : 'Yes'}
                          </button>
                        )
                      }
                      
                      if ((attr.attribute_type === 'select' || attr.attribute_type === 'multiselect') && getAttrOptions(attr)) {
                        const allowMulti = attr.attribute_type === 'multiselect' || shouldForceMultiSelect(attr)
                        return getAttrOptions(attr)!.map((option, idx) => {
                          const currentValues = getPendingAttrValues(attr.name)
                          const isActive = currentValues.includes(option)
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (!allowMulti) {
                                  setPendingAttrValues(attr.name, isActive ? [] : [option])
                                  return
                                }
                                const newValues = isActive
                                  ? currentValues.filter(v => v !== option)
                                  : [...currentValues, option]
                                setPendingAttrValues(attr.name, newValues)
                              }}
                              className={cn(
                                "px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors",
                                isActive
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                              )}
                              aria-pressed={isActive}
                            >
                              {option}
                            </button>
                          )
                        })
                      }
                      return null
                    })()}
                  </div>
                )}
              </div>
              </div>
            )}
          </div>

          {/* Footer - Treido: border-t, pb-safe, bg-gray-900 button */}
          <div className="border-t border-gray-100 p-4 pb-safe bg-white flex-shrink-0">
            <DrawerClose asChild>
              <button
                className="w-full h-[48px] bg-gray-900 text-white font-bold rounded-lg text-[15px] active:opacity-90"
                onClick={() => {
                  applyPendingFilters()
                }}
              >
                {resultsCount > 0 
                  ? (locale === 'bg' ? `Покажи ${resultsCount} резултата` : `Show ${resultsCount} Results`)
                  : t('showResults')
                }
              </button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
