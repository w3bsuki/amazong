"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, ChevronDown, ChevronRight, Check, Package, Percent, Truck } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useState, useEffect } from "react"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
}

interface SearchFiltersProps {
  categories: Category[]
  subcategories: Category[]
  currentCategory: Category | null
  allCategoriesWithSubs?: { category: Category; subs: Category[] }[]
  brands?: string[]
}

export function SearchFilters({ 
  categories, 
  subcategories, 
  currentCategory,
  allCategoriesWithSubs = [],
  brands = []
}: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations('SearchFilters')

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")
  const currentPrime = searchParams.get("prime")
  const currentDeals = searchParams.get("deals")
  const currentBrand = searchParams.get("brand")
  const currentAvailability = searchParams.get("availability")
  
  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  
  // Auto-expand current category
  useEffect(() => {
    if (currentCategory) {
      // If we're in a subcategory, expand its parent
      if (currentCategory.parent_id) {
        const parentSlug = categories.find(c => c.id === currentCategory.parent_id)?.slug
        if (parentSlug && !expandedCategories.includes(parentSlug)) {
          setExpandedCategories(prev => [...prev, parentSlug])
        }
      } else {
        // If we're in a main category, expand it
        if (!expandedCategories.includes(currentCategory.slug)) {
          setExpandedCategories(prev => [...prev, currentCategory.slug])
        }
      }
    }
  }, [currentCategory])

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    )
  }

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
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    const category = searchParams.get("category")
    const q = searchParams.get("q")
    if (category) params.set("category", category)
    if (q) params.set("q", q)
    router.push(`/search?${params.toString()}`)
  }

  const hasActiveFilters = currentMinPrice || currentMaxPrice || currentRating || currentPrime || currentDeals || currentBrand || currentAvailability

  // Get subcategories for a given category from allCategoriesWithSubs
  const getSubcategoriesFor = (categoryId: string) => {
    const found = allCategoriesWithSubs.find(c => c.category.id === categoryId)
    return found?.subs || []
  }

  return (
    <div className="space-y-5 text-[#0F1111]">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full text-left text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-medium"
        >
          {t('clearAllFilters')}
        </button>
      )}

      {/* Delivery & Prime Section */}
      <div className="pb-4 border-b border-[#e7e7e7]">
        <h3 className="font-bold text-sm mb-3">{t('deliveryDay')}</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="prime" 
              checked={currentPrime === "true"}
              onCheckedChange={() => toggleParam("prime")}
              className="border-[#888] data-[state=checked]:bg-[#007185] data-[state=checked]:border-[#007185]" 
            />
            <Label htmlFor="prime" className="text-sm font-medium flex items-center gap-1.5 cursor-pointer">
              <img src="https://m.media-amazon.com/images/G/01/prime/marketing/slashPrime/amazon-prime-delivery-checkmark._CB611051915_.png" alt="Prime" className="h-3.5" />
              <span className="text-[#007185]">{t('getPrimeDelivery')}</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="freeShipping" 
              className="border-[#888] data-[state=checked]:bg-[#007185] data-[state=checked]:border-[#007185]" 
            />
            <Label htmlFor="freeShipping" className="text-sm cursor-pointer flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-[#565959]" />
              {t('freeShipping')}
            </Label>
          </div>
        </div>
      </div>

      {/* Department/Category Navigation - Always show all main categories */}
      <div className="pb-4 border-b border-[#e7e7e7]">
        <h3 className="font-bold text-sm mb-3">{t('department')}</h3>
        
        <div className="space-y-1">
          {/* Show all main categories with expandable subcategories */}
          {categories.map((cat) => {
            const isExpanded = expandedCategories.includes(cat.slug)
            const catSubs = allCategoriesWithSubs.length > 0 
              ? getSubcategoriesFor(cat.id) 
              : (currentCategory?.id === cat.id ? subcategories : [])
            const hasSubs = catSubs.length > 0
            const isCurrentCategory = currentCategory?.slug === cat.slug || currentCategory?.parent_id === cat.id
            
            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between group">
                  <Link
                    href={`/search?category=${cat.slug}`}
                    className={`text-sm cursor-pointer hover:text-[#c7511f] flex-1 py-0.5 ${
                      isCurrentCategory ? 'font-bold text-[#c7511f]' : 'text-[#0F1111]'
                    }`}
                  >
                    {getCategoryName(cat)}
                  </Link>
                  {hasSubs && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleCategory(cat.slug)
                      }}
                      className="p-1 hover:bg-[#f7fafa] rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-[#565959]" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-[#565959]" />
                      )}
                    </button>
                  )}
                </div>
                
                {/* Subcategories */}
                {isExpanded && hasSubs && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#e7e7e7] pl-3">
                    {catSubs.map((subcat) => (
                      <Link
                        key={subcat.id}
                        href={`/search?category=${subcat.slug}`}
                        className={`block text-sm cursor-pointer hover:text-[#c7511f] py-0.5 ${
                          currentCategory?.slug === subcat.slug ? 'font-bold text-[#c7511f]' : 'text-[#565959]'
                        }`}
                      >
                        {getCategoryName(subcat)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="pb-4 border-b border-[#e7e7e7]">
        <h3 className="font-bold text-sm mb-3">{t('customerReviews')}</h3>
        {[4, 3, 2, 1].map((stars) => (
          <div
            key={stars}
            className={`flex items-center gap-1 mb-1.5 cursor-pointer hover:opacity-80 group ${
              currentRating === stars.toString() ? 'font-bold' : ''
            }`}
            onClick={() => updateParams("minRating", currentRating === stars.toString() ? null : stars.toString())}
          >
            <div className="flex text-[#f08804]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < stars ? "fill-current" : "fill-none stroke-current stroke-1"}`}
                />
              ))}
            </div>
            <span className="text-sm text-[#007185] group-hover:text-[#c7511f] group-hover:underline">{t('andUp')}</span>
            {currentRating === stars.toString() && (
              <Check className="h-3.5 w-3.5 text-[#007185] ml-1" />
            )}
          </div>
        ))}
        {currentRating && (
          <button
            className="pt-1 text-[#007185] text-xs hover:underline"
            onClick={() => updateParams("minRating", null)}
          >
            {t('clearRating')}
          </button>
        )}
      </div>

      {/* Brands - only show if brands are available */}
      {brands.length > 0 && (
        <div className="pb-4 border-b border-[#e7e7e7]">
          <h3 className="font-bold text-sm mb-3">{t('brand')}</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.slice(0, 10).map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox 
                  id={`brand-${brand}`}
                  checked={currentBrand === brand}
                  onCheckedChange={() => updateParams("brand", currentBrand === brand ? null : brand)}
                  className="border-[#888] data-[state=checked]:bg-[#007185] data-[state=checked]:border-[#007185]" 
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
          {currentBrand && (
            <button
              className="pt-2 text-[#007185] text-xs hover:underline"
              onClick={() => updateParams("brand", null)}
            >
              {t('clearBrand')}
            </button>
          )}
        </div>
      )}

      {/* Price */}
      <div className="pb-4 border-b border-[#e7e7e7]">
        <h3 className="font-bold text-sm mb-3">{t('price')}</h3>
        <div className="space-y-1.5 text-sm text-[#0F1111]">
          {[
            { label: t('under25'), min: null, max: "25" },
            { label: t('range2550'), min: "25", max: "50" },
            { label: t('range50100'), min: "50", max: "100" },
            { label: t('range100200'), min: "100", max: "200" },
            { label: t('above200'), min: "200", max: null }
          ].map(({ label, min, max }) => {
            const isActive = currentMinPrice === min && currentMaxPrice === max
            return (
              <div
                key={label}
                className={`cursor-pointer hover:text-[#c7511f] hover:underline flex items-center gap-1.5 ${isActive ? 'font-bold text-[#c7511f]' : ''}`}
                onClick={() => handlePriceClick(min, max)}
              >
                {label}
                {isActive && <Check className="h-3.5 w-3.5" />}
              </div>
            )
          })}
        </div>
        
        {/* Custom price range input */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-sm text-[#565959] mr-1">$</span>
            <input 
              type="number" 
              placeholder={t('min')}
              className="w-16 text-sm border border-[#888] rounded px-2 py-1 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none"
            />
          </div>
          <span className="text-sm text-[#565959]">-</span>
          <div className="flex items-center">
            <span className="text-sm text-[#565959] mr-1">$</span>
            <input 
              type="number" 
              placeholder={t('max')}
              className="w-16 text-sm border border-[#888] rounded px-2 py-1 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none"
            />
          </div>
          <button className="text-sm px-2 py-1 bg-[#f0f2f2] border border-[#d5d9d9] rounded hover:bg-[#e3e6e6]">
            {t('go')}
          </button>
        </div>
        
        {(currentMinPrice || currentMaxPrice) && (
          <button
            className="pt-2 text-[#007185] text-xs hover:underline"
            onClick={() => handlePriceClick(null, null)}
          >
            {t('clearPrice')}
          </button>
        )}
      </div>

      {/* Deals & Discounts */}
      <div className="pb-4 border-b border-[#e7e7e7]">
        <h3 className="font-bold text-sm mb-3">{t('dealsDiscounts')}</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="deals" 
              checked={currentDeals === "true"}
              onCheckedChange={() => toggleParam("deals")}
              className="border-[#888] data-[state=checked]:bg-[#007185] data-[state=checked]:border-[#007185]" 
            />
            <Label htmlFor="deals" className="text-sm cursor-pointer flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-[#cc0c39]" />
              {t('todaysDeals')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="lightning" 
              className="border-[#888] data-[state=checked]:bg-[#007185] data-[state=checked]:border-[#007185]" 
            />
            <Label htmlFor="lightning" className="text-sm cursor-pointer">
              {t('lightningDeals')}
            </Label>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="pb-4 border-b border-[#e7e7e7]">
        <h3 className="font-bold text-sm mb-3">{t('availability')}</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="instock" 
              checked={currentAvailability === "instock"}
              onCheckedChange={() => updateParams("availability", currentAvailability === "instock" ? null : "instock")}
              className="border-[#888] data-[state=checked]:bg-[#007185] data-[state=checked]:border-[#007185]" 
            />
            <Label htmlFor="instock" className="text-sm cursor-pointer flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-[#007600]" />
              {t('includeOutOfStock')}
            </Label>
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div>
        <h3 className="font-bold text-sm mb-3">{t('newArrivals')}</h3>
        <div className="space-y-1.5 text-sm">
          <div className="cursor-pointer text-[#0F1111] hover:text-[#c7511f] hover:underline">
            {t('last30Days')}
          </div>
          <div className="cursor-pointer text-[#0F1111] hover:text-[#c7511f] hover:underline">
            {t('last90Days')}
          </div>
        </div>
      </div>
    </div>
  )
}
