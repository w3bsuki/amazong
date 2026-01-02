"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { Sliders, Star, Check, CaretRight, CaretLeft, CaretUp } from "@phosphor-icons/react"
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
      {/* Filter Trigger Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className={cn(
          "h-8 rounded-full px-3 gap-1 text-sm bg-secondary hover:bg-secondary/80 hover:text-foreground transition-colors border border-border/50",
          filterCount > 0 && "bg-primary/10 text-primary border-primary/20"
        )}
      >
        <Sliders size={14} weight="regular" className={cn(
          filterCount > 0 ? "text-primary" : "text-muted-foreground"
        )} />
        <span className={cn(filterCount > 0 ? "text-primary" : "text-foreground")}>{t('filters')}</span>
        {filterCount > 0 ? (
          <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center ml-0.5 text-[10px]">
            {filterCount}
          </span>
        ) : (
          <CaretUp size={12} weight="bold" className="text-muted-foreground" />
        )}
      </Button>

      {/* Bottom Sheet using shadcn Drawer (Vaul) for drag-to-close */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent 
          className="max-h-[90vh] flex flex-col rounded-t-2xl px-0 pb-0 lg:hidden"
        >
          <DrawerHeader className={cn(
            "px-4 pb-3 border-b border-border/50",
            activeSection ? "pt-4" : "pt-1"
          )}>
            <div className="flex items-center justify-between min-h-touch-sm">
              {activeSection ? (
                <button 
                  onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2 text-foreground font-semibold active:opacity-70 transition-opacity"
                >
                  <CaretLeft size={20} weight="bold" />
                  <span className="text-lg">
                    {filterSections.find(s => s.id === activeSection)?.label}
                  </span>
                </button>
              ) : (
                <DrawerTitle className="text-lg font-bold">{t('filters')}</DrawerTitle>
              )}
              
              {hasPendingFilters && !activeSection && (
                <button
                  onClick={clearAllPendingFilters}
                  className="text-sm font-medium text-primary active:opacity-70 transition-opacity"
                >
                  {t('clearAllFilters')}
                </button>
              )}
            </div>
          </DrawerHeader>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain bg-background">
            {!activeSection ? (
              /* Main List View */
              <div className="divide-y divide-border/30">
                {filterSections.map((section) => {
                  const summary = getSelectedSummary(section)
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className="w-full flex items-center justify-between px-4 h-touch active:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground">{section.label}</span>
                        {summary && (
                          <span className="text-xs text-primary font-medium">{summary}</span>
                        )}
                      </div>
                      <CaretRight 
                        size={16}
                        weight="bold"
                        className="text-muted-foreground/60" 
                      />
                    </button>
                  )
                })}
              </div>
            ) : (
              /* Sub-view for specific filter */
              <div className="p-4 space-y-2">
                {/* Ratings */}
                {activeSection === 'rating' && (
                  <div className="space-y-1">
                    {[4, 3, 2, 1].map((stars) => (
                      <button
                        key={stars}
                        onClick={() => {
                          setPendingRating(pendingRating === stars.toString() ? null : stars.toString())
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 h-touch rounded-md transition-colors",
                          pendingRating === stars.toString()
                            ? "bg-secondary text-primary font-medium"
                            : "active:bg-muted"
                        )}
                        aria-pressed={pendingRating === stars.toString()}
                      >
                        <div className="flex text-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              weight={i < stars ? "fill" : "regular"}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{t('andUp')}</span>
                        {pendingRating === stars.toString() && (
                          <Check size={16} weight="bold" className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Price */}
                {activeSection === 'price' && (
                  <div className="space-y-1">
                    {priceRanges.map(({ label, min, max }) => {
                      const isActive = pendingPrice.min === min && pendingPrice.max === max
                      return (
                        <button
                          key={label}
                          onClick={() => setPendingPrice(isActive ? { min: null, max: null } : { min, max })}
                          className={cn(
                            "w-full flex items-center justify-between px-3 h-touch rounded-md transition-colors",
                            isActive
                              ? "bg-secondary text-primary font-medium"
                              : "active:bg-muted"
                          )}
                          aria-pressed={isActive}
                        >
                          <span className="text-sm">{label}</span>
                          {isActive && <Check size={16} weight="bold" />}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Availability */}
                {activeSection === 'availability' && (
                  <button
                    onClick={() => setPendingAvailability(pendingAvailability === 'instock' ? null : 'instock')}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 h-touch rounded-md transition-colors",
                      pendingAvailability === "instock" ? "bg-secondary text-primary font-medium" : "active:bg-muted"
                    )}
                    aria-pressed={pendingAvailability === 'instock'}
                  >
                    <div className={cn(
                      "size-5 rounded border flex items-center justify-center transition-colors",
                      pendingAvailability === "instock" ? "bg-primary border-primary" : "border-input"
                    )}>
                      {pendingAvailability === "instock" && <Check size={12} weight="bold" className="text-primary-foreground" />}
                    </div>
                    <span className="text-sm font-medium">{t('inStock')}</span>
                  </button>
                )}

                {/* Category Attribute Filters */}
                {filterSections.find(s => s.id === activeSection)?.attribute && (
                  <div className="space-y-1">
                    {(() => {
                      const section = filterSections.find(s => s.id === activeSection) as AttrFilterSection
                      const attr = section.attribute
                      
                      if (attr.attribute_type === 'boolean') {
                        const isChecked = getPendingAttrValues(attr.name).includes('true')
                        return (
                          <button
                            onClick={() => setPendingAttrValues(attr.name, isChecked ? [] : ['true'])}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 h-touch rounded-md transition-colors",
                              isChecked ? "bg-secondary text-primary font-medium" : "active:bg-muted"
                            )}
                            aria-pressed={isChecked}
                          >
                            <div className={cn(
                              "size-5 rounded border flex items-center justify-center transition-colors",
                              isChecked ? "bg-primary border-primary" : "border-input"
                            )}>
                              {isChecked && <Check size={12} weight="bold" className="text-primary-foreground" />}
                            </div>
                            <span className="text-sm font-medium">{locale === 'bg' ? 'Да' : 'Yes'}</span>
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
                                "w-full flex items-center justify-between px-3 h-touch rounded-md transition-colors",
                                isActive ? "bg-secondary text-primary font-medium" : "active:bg-muted"
                              )}
                              aria-pressed={isActive}
                            >
                              <span className="text-sm">{option}</span>
                              {isActive && <Check size={16} weight="bold" />}
                            </button>
                          )
                        })
                      }
                      return null
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with Show Results button - includes safe area */}
          <div className="p-4 border-t border-border/50 bg-background pb-[max(1rem,env(safe-area-inset-bottom))]">
            <DrawerClose asChild>
              <Button
                className="w-full h-10 rounded-full text-sm font-bold"
                onClick={() => {
                  applyPendingFilters()
                }}
              >
                {resultsCount > 0 
                  ? (locale === 'bg' ? `Покажи ${resultsCount} резултата` : `Show ${resultsCount} results`)
                  : t('showResults')
                }
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
