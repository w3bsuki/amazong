"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, SlidersHorizontal, Star, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
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
}

export function MobileFilters({ categories, currentCategory, locale }: MobileFiltersProps) {
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
      {/* Filter Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 min-h-10 px-3 border-border"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span>{t('filters')}</span>
        {filterCount > 0 && (
          <span className="bg-brand-deal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {filterCount}
          </span>
        )}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl transition-transform duration-300 ease-out lg:hidden",
          "max-h-[85vh] flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-lg font-bold">{t('filters')}</h2>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-brand-blue hover:underline"
              >
                {t('clearAllFilters')}
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-muted rounded-full min-h-10 min-w-10 flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Filter Sections */}
          <div className="divide-y divide-border">
            {filterSections.map((section) => (
              <div key={section.id} className="py-1">
                <button
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between px-4 py-3 min-h-12"
                >
                  <span className="font-medium">{section.label}</span>
                  <ChevronDown 
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      activeSection === section.id && "rotate-180"
                    )} 
                  />
                </button>

                {/* Section Content */}
                {activeSection === section.id && (
                  <div className="px-4 pb-4 space-y-2">
                    {/* Prime/Delivery */}
                    {section.id === 'prime' && (
                      <>
                        <label className="flex items-center gap-3 min-h-11 cursor-pointer">
                          <Checkbox
                            checked={currentPrime === "true"}
                            onCheckedChange={() => toggleParam("prime")}
                            className="size-5"
                          />
                          <span className="text-sm">{t('getPrimeDelivery')}</span>
                        </label>
                        <label className="flex items-center gap-3 min-h-11 cursor-pointer">
                          <Checkbox className="size-5" />
                          <span className="text-sm">{t('freeShipping')}</span>
                        </label>
                      </>
                    )}

                    {/* Categories */}
                    {section.id === 'category' && (
                      <div className="space-y-1 max-h-60 overflow-y-auto">
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
                              "w-full text-left px-2 py-2.5 min-h-11 rounded-md text-sm",
                              currentCategory?.slug === cat.slug
                                ? "bg-brand-blue/10 text-brand-blue font-medium"
                                : "hover:bg-muted"
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
                      <div className="space-y-1">
                        {[4, 3, 2, 1].map((stars) => (
                          <button
                            key={stars}
                            onClick={() => {
                              updateParams("minRating", currentRating === stars.toString() ? null : stars.toString())
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-2.5 min-h-11 rounded-md",
                              currentRating === stars.toString()
                                ? "bg-brand-blue/10"
                                : "hover:bg-muted"
                            )}
                          >
                            <div className="flex text-rating">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < stars ? "fill-current" : "fill-none stroke-current stroke-1"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm">{t('andUp')}</span>
                            {currentRating === stars.toString() && (
                              <Check className="ml-auto h-4 w-4 text-brand-blue" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Price */}
                    {section.id === 'price' && (
                      <div className="space-y-1">
                        {priceRanges.map(({ label, min, max }) => {
                          const isActive = currentMinPrice === min && currentMaxPrice === max
                          return (
                            <button
                              key={label}
                              onClick={() => handlePriceClick(min, max)}
                              className={cn(
                                "w-full text-left px-2 py-2.5 min-h-11 rounded-md text-sm flex items-center justify-between",
                                isActive
                                  ? "bg-brand-blue/10 text-brand-blue font-medium"
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
                      <label className="flex items-center gap-3 min-h-11 cursor-pointer">
                        <Checkbox
                          checked={currentAvailability === "instock"}
                          onCheckedChange={() => updateParams("availability", currentAvailability === "instock" ? null : "instock")}
                          className="size-5"
                        />
                        <span className="text-sm">{t('includeOutOfStock')}</span>
                      </label>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-background">
          <Button 
            onClick={() => setIsOpen(false)}
            className="w-full min-h-12 bg-brand-blue hover:bg-brand-blue-dark text-white font-medium"
          >
            {t('showResults')}
          </Button>
        </div>
      </div>
    </>
  )
}
