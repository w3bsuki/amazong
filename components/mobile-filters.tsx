"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, Sliders, Star, Check, CaretDown } from "@phosphor-icons/react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
}

interface MobileFiltersProps {
  categories: Category[]
  currentCategory: Category | null
  locale: string
  resultsCount?: number
}

export function MobileFilters({ categories, currentCategory, locale, resultsCount = 0 }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")
  const currentPrime = searchParams.get("prime")
  const currentAvailability = searchParams.get("availability")

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/search?${params.toString()}`)
  }

  const toggleParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.has(key)) {
      params.delete(key)
    } else {
      params.set(key, "true")
    }
    router.push(`/search?${params.toString()}`)
  }

  const handlePriceClick = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min) params.set("minPrice", min)
    else params.delete("minPrice")
    if (max) params.set("maxPrice", max)
    else params.delete("maxPrice")
    router.push(`/search?${params.toString()}`)
    setIsOpen(false)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    const category = searchParams.get("category")
    const q = searchParams.get("q")
    if (category) params.set("category", category)
    if (q) params.set("q", q)
    router.push(`/search?${params.toString()}`)
    setIsOpen(false)
  }

  const hasActiveFilters = currentMinPrice || currentMaxPrice || currentRating || currentPrime || currentAvailability
  const filterCount = [currentMinPrice || currentMaxPrice, currentRating, currentPrime, currentAvailability].filter(Boolean).length

  const filterSections = [
    { id: 'prime', label: t('deliveryDay') },
    { id: 'category', label: t('department') },
    { id: 'rating', label: t('customerReviews') },
    { id: 'price', label: t('price') },
    { id: 'availability', label: t('availability') },
  ]

  const priceRanges = [
    { label: t('under25'), min: null, max: "25" },
    { label: t('range2550'), min: "25", max: "50" },
    { label: t('range50100'), min: "50", max: "100" },
    { label: t('range100200'), min: "100", max: "200" },
    { label: t('above200'), min: "200", max: null }
  ]

  return (
    <>
      {/* Filter Button - Amazon/Target style */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-full",
          "bg-card border border-border",
          "hover:bg-muted hover:border-ring",
          "active:bg-muted/80 active:scale-[0.98]",
          "text-sm font-medium text-foreground",
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-blue",
          filterCount > 0 && "border-brand-blue bg-brand-blue/5"
        )}
      >
        <Sliders size={16} weight="regular" className={cn(
          filterCount > 0 ? "text-brand-blue" : "text-muted-foreground"
        )} />
        <span>{t('filters')}</span>
        {filterCount > 0 && (
          <span className="bg-brand-blue text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
            {filterCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/40 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 bg-card lg:hidden",
          "max-h-[85vh] flex flex-col rounded-t-2xl border-t border-border",
          "transition-transform duration-200 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{t('filters')}</h2>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm font-medium text-brand-blue hover:text-brand-blue-dark hover:underline transition-colors"
              >
                {t('clearAllFilters')}
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-muted rounded-full min-h-10 min-w-10 flex items-center justify-center transition-colors"
            >
              <X size={20} weight="regular" className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-muted/30">
          {/* Filter Sections */}
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
                      "text-muted-foreground",
                      activeSection === section.id && "rotate-180"
                    )} 
                  />
                </button>

                {/* Section Content */}
                {activeSection === section.id && (
                  <div className="px-4 pb-4 space-y-2 bg-muted/30">
                    {/* Prime/Delivery */}
                    {section.id === 'prime' && (
                      <>
                        <label className="flex items-center gap-3 min-h-11 cursor-pointer hover:bg-muted rounded-lg px-2 -mx-2 transition-colors">
                          <Checkbox
                            checked={currentPrime === "true"}
                            onCheckedChange={() => toggleParam("prime")}
                            className="size-5"
                          />
                          <span className="text-sm text-foreground">{t('getPrimeDelivery')}</span>
                        </label>
                        <label className="flex items-center gap-3 min-h-11 cursor-pointer hover:bg-muted rounded-lg px-2 -mx-2 transition-colors">
                          <Checkbox className="size-5" />
                          <span className="text-sm text-foreground">{t('freeShipping')}</span>
                        </label>
                      </>
                    )}

                    {/* Categories */}
                    {section.id === 'category' && (
                      <div className="space-y-0.5 max-h-60 overflow-y-auto">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              const params = new URLSearchParams(searchParams.toString())
                              params.set("category", cat.slug)
                              router.push(`/search?${params.toString()}`)
                              setIsOpen(false)
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2.5 min-h-11 rounded-lg text-sm transition-colors",
                              currentCategory?.slug === cat.slug
                                ? "bg-brand-blue/10 text-brand-blue font-medium"
                                : "text-foreground hover:bg-muted"
                            )}
                          >
                            {getCategoryName(cat)}
                            {currentCategory?.slug === cat.slug && (
                              <Check className="inline-block ml-2 h-4 w-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

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
                              "w-full flex items-center gap-2 px-3 py-2.5 min-h-11 rounded-lg transition-colors",
                              currentRating === stars.toString()
                                ? "bg-brand-blue/10"
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
                            <span className="text-sm text-foreground">{t('andUp')}</span>
                            {currentRating === stars.toString() && (
                              <Check size={16} weight="regular" className="ml-auto text-brand-blue" />
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
                                "w-full text-left px-3 py-2.5 min-h-11 rounded-lg text-sm flex items-center justify-between transition-colors",
                                isActive
                                  ? "bg-brand-blue/10 text-brand-blue font-medium"
                                  : "text-foreground hover:bg-muted"
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
                      <label className="flex items-center gap-3 min-h-11 cursor-pointer hover:bg-muted rounded-lg px-2 -mx-2 transition-colors">
                        <Checkbox
                          checked={currentAvailability === "instock"}
                          onCheckedChange={() => updateParams("availability", currentAvailability === "instock" ? null : "instock")}
                          className="size-5"
                        />
                        <span className="text-sm text-foreground">{t('includeOutOfStock')}</span>
                      </label>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card pb-safe">
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full h-12 bg-brand-blue text-white font-semibold rounded-full"
          >
            {resultsCount > 0 
              ? (locale === 'bg' ? `Покажи ${resultsCount}` : `Show ${resultsCount} results`)
              : t('showResults')
            }
          </button>
        </div>
      </div>
    </>
  )
}
