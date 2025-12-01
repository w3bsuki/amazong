"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, CaretDown, CaretRight, Check, Package, Percent, Truck } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useState, useEffect } from "react"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

interface SearchFiltersProps {
  categories: Category[]
  subcategories: Category[]
  currentCategory: Category | null
  allCategoriesWithSubs?: { category: Category; subs: Category[] }[]
  brands?: string[]
  basePath?: string // e.g., "/categories/electronics" or undefined for "/search"
}

export function SearchFilters({ 
  categories, 
  subcategories, 
  currentCategory,
  allCategoriesWithSubs = [],
  brands = [],
  basePath
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
    if (basePath) {
      router.push(`${basePath}?${params.toString()}`)
    } else {
      router.push(`/search?${params.toString()}`)
    }
  }

  const toggleParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.has(key)) {
      params.delete(key)
    } else {
      params.set(key, "true")
    }
    if (basePath) {
      router.push(`${basePath}?${params.toString()}`)
    } else {
      router.push(`/search?${params.toString()}`)
    }
  }

  const handlePriceClick = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min) params.set("minPrice", min)
    else params.delete("minPrice")

    if (max) params.set("maxPrice", max)
    else params.delete("maxPrice")

    if (basePath) {
      router.push(`${basePath}?${params.toString()}`)
    } else {
      router.push(`/search?${params.toString()}`)
    }
  }

  const clearAllFilters = () => {
    if (basePath) {
      router.push(basePath)
    } else {
      const params = new URLSearchParams()
      const category = searchParams.get("category")
      const q = searchParams.get("q")
      if (category) params.set("category", category)
      if (q) params.set("q", q)
      router.push(`/search?${params.toString()}`)
    }
  }

  const hasActiveFilters = currentMinPrice || currentMaxPrice || currentRating || currentPrime || currentDeals || currentBrand || currentAvailability

  // Get subcategories for a given category from allCategoriesWithSubs
  const getSubcategoriesFor = (categoryId: string) => {
    const found = allCategoriesWithSubs.find(c => c.category.id === categoryId)
    return found?.subs || []
  }

  return (
    <div className="space-y-5 text-foreground">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full text-left text-sm text-link hover:text-primary hover:underline font-medium min-h-10 flex items-center"
        >
          {t('clearAllFilters')}
        </button>
      )}

      {/* Delivery & Prime Section */}
      <div className="pb-4 border-b border-border">
        <h3 className="font-bold text-sm mb-3">{t('deliveryDay')}</h3>
        <div className="space-y-1">
          <label htmlFor="prime" className="min-h-10 flex items-center gap-2.5 cursor-pointer hover:bg-muted/50 rounded-md px-1 -mx-1">
            <Checkbox 
              id="prime" 
              checked={currentPrime === "true"}
              onCheckedChange={() => toggleParam("prime")}
              className="size-5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
            />
            <span className="text-sm font-medium flex items-center gap-1.5">
              <img src="https://m.media-amazon.com/images/G/01/prime/marketing/slashPrime/amazon-prime-delivery-checkmark._CB611051915_.png" alt="Prime" className="h-3.5" />
              <span className="text-primary">{t('getPrimeDelivery')}</span>
            </span>
          </label>
          <label htmlFor="freeShipping" className="min-h-10 flex items-center gap-2.5 cursor-pointer hover:bg-muted/50 rounded-md px-1 -mx-1">
            <Checkbox 
              id="freeShipping" 
              className="size-5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
            />
            <span className="text-sm flex items-center gap-1.5">
              <Truck size={16} weight="regular" className="text-muted-foreground" />
              {t('freeShipping')}
            </span>
          </label>
        </div>
      </div>

      {/* Department/Category Navigation - Always show all main categories */}
      <div className="pb-4 border-b border-border">
        <h3 className="font-bold text-sm mb-3">{t('department')}</h3>
        
        <div className="space-y-0.5">
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
                    href={`/categories/${cat.slug}`}
                    className={`text-sm cursor-pointer hover:text-primary flex-1 min-h-9 flex items-center ${
                      isCurrentCategory ? 'font-bold text-primary' : 'text-foreground'
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
                      className="min-h-9 min-w-9 flex items-center justify-center hover:bg-muted rounded-md"
                    >
                      {isExpanded ? (
                        <CaretDown size={16} weight="regular" className="text-muted-foreground" />
                      ) : (
                        <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>
                
                {/* Subcategories */}
                {isExpanded && hasSubs && (
                  <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-border pl-3">
                    {catSubs.map((subcat) => (
                      <Link
                        key={subcat.id}
                        href={`/categories/${subcat.slug}`}
                        className={`text-sm cursor-pointer hover:text-primary min-h-9 flex items-center ${
                          currentCategory?.slug === subcat.slug ? 'font-bold text-primary' : 'text-muted-foreground'
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
      <div className="pb-4 border-b border-border">
        <h3 className="font-bold text-sm mb-3">{t('customerReviews')}</h3>
        {[4, 3, 2, 1].map((stars) => (
          <button
            key={stars}
            className={`min-h-10 w-full flex items-center gap-1.5 cursor-pointer hover:bg-muted/50 rounded-md px-1 -mx-1 group ${
              currentRating === stars.toString() ? 'font-bold' : ''
            }`}
            onClick={() => updateParams("minRating", currentRating === stars.toString() ? null : stars.toString())}
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
            <span className="text-sm text-link group-hover:text-primary group-hover:underline">{t('andUp')}</span>
            {currentRating === stars.toString() && (
              <Check size={16} weight="regular" className="text-primary ml-1" />
            )}
          </button>
        ))}
        {currentRating && (
          <button
            className="pt-1 text-primary text-xs hover:underline min-h-8 flex items-center"
            onClick={() => updateParams("minRating", null)}
          >
            {t('clearRating')}
          </button>
        )}
      </div>

      {/* Brands - only show if brands are available */}
      {brands.length > 0 && (
        <div className="pb-4 border-b border-border">
          <h3 className="font-bold text-sm mb-3">{t('brand')}</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {brands.slice(0, 10).map((brand) => (
              <label key={brand} htmlFor={`brand-${brand}`} className="min-h-10 flex items-center gap-2.5 cursor-pointer hover:bg-muted/50 rounded-md px-1 -mx-1">
                <Checkbox 
                  id={`brand-${brand}`}
                  checked={currentBrand === brand}
                  onCheckedChange={() => updateParams("brand", currentBrand === brand ? null : brand)}
                  className="size-5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
          {currentBrand && (
            <button
              className="pt-2 text-primary text-xs hover:underline min-h-8 flex items-center"
              onClick={() => updateParams("brand", null)}
            >
              {t('clearBrand')}
            </button>
          )}
        </div>
      )}

      {/* Price */}
      <div className="pb-4 border-b border-border">
        <h3 className="font-bold text-sm mb-3">{t('price')}</h3>
        <div className="space-y-0.5 text-sm text-foreground">
          {[
            { label: t('under25'), min: null, max: "25" },
            { label: t('range2550'), min: "25", max: "50" },
            { label: t('range50100'), min: "50", max: "100" },
            { label: t('range100200'), min: "100", max: "200" },
            { label: t('above200'), min: "200", max: null }
          ].map(({ label, min, max }) => {
            const isActive = currentMinPrice === min && currentMaxPrice === max
            return (
              <button
                key={label}
                className={`min-h-10 w-full text-left cursor-pointer hover:text-primary hover:underline flex items-center gap-1.5 px-1 -mx-1 hover:bg-muted/50 rounded-md ${isActive ? 'font-bold text-primary' : ''}`}
                onClick={() => handlePriceClick(min, max)}
              >
                {label}
                {isActive && <Check size={16} weight="regular" />}
              </button>
            )
          })}
        </div>
        
        {/* Custom price range input */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-1">$</span>
            <input 
              type="number" 
              placeholder={t('min')}
              className="w-16 text-sm border border-input rounded-md px-2 py-2 min-h-10 focus:border-ring focus:ring-1 focus:ring-ring outline-none bg-background"
            />
          </div>
          <span className="text-sm text-muted-foreground">-</span>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-1">$</span>
            <input 
              type="number" 
              placeholder={t('max')}
              className="w-16 text-sm border border-input rounded-md px-2 py-2 min-h-10 focus:border-ring focus:ring-1 focus:ring-ring outline-none bg-background"
            />
          </div>
          <button className="text-sm px-3 min-h-10 bg-secondary border border-border rounded-md hover:bg-muted transition-colors font-medium">
            {t('go')}
          </button>
        </div>
        
        {(currentMinPrice || currentMaxPrice) && (
          <button
            className="pt-2 text-primary text-xs hover:underline min-h-8 flex items-center"
            onClick={() => handlePriceClick(null, null)}
          >
            {t('clearPrice')}
          </button>
        )}
      </div>

      {/* Deals & Discounts */}
      <div className="pb-4 border-b border-border">
        <h3 className="font-bold text-sm mb-3">{t('dealsDiscounts')}</h3>
        <div className="space-y-1">
          <label htmlFor="deals" className="min-h-10 flex items-center gap-2.5 cursor-pointer hover:bg-muted/50 rounded-md px-1 -mx-1">
            <Checkbox 
              id="deals" 
              checked={currentDeals === "true"}
              onCheckedChange={() => toggleParam("deals")}
              className="size-5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
            />
            <span className="text-sm flex items-center gap-1.5">
              <Percent size={16} weight="regular" className="text-deal" />
              {t('todaysDeals')}
            </span>
          </label>
          <label htmlFor="lightning" className="min-h-10 flex items-center gap-2.5 cursor-pointer hover:bg-muted/50 rounded-md px-1 -mx-1">
            <Checkbox 
              id="lightning" 
              className="size-5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
            />
            <span className="text-sm">{t('lightningDeals')}</span>
          </label>
        </div>
      </div>

      {/* Availability */}
      <div className="pb-4 border-b border-border">
        <h3 className="font-bold text-sm mb-3">{t('availability')}</h3>
        <div className="space-y-1">
          <label htmlFor="instock" className="min-h-10 flex items-center gap-2.5 cursor-pointer hover:bg-muted/50 rounded-md px-1 -mx-1">
            <Checkbox 
              id="instock" 
              checked={currentAvailability === "instock"}
              onCheckedChange={() => updateParams("availability", currentAvailability === "instock" ? null : "instock")}
              className="size-5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
            />
            <span className="text-sm flex items-center gap-1.5">
              <Package size={16} weight="regular" className="text-stock-available" />
              {t('includeOutOfStock')}
            </span>
          </label>
        </div>
      </div>

      {/* New Arrivals */}
      <div>
        <h3 className="font-bold text-sm mb-3">{t('newArrivals')}</h3>
        <div className="space-y-0.5 text-sm">
          <button className="min-h-10 w-full text-left cursor-pointer text-foreground hover:text-primary hover:underline px-1 -mx-1 hover:bg-muted/50 rounded-md flex items-center">
            {t('last30Days')}
          </button>
          <button className="min-h-10 w-full text-left cursor-pointer text-foreground hover:text-primary hover:underline px-1 -mx-1 hover:bg-muted/50 rounded-md flex items-center">
            {t('last90Days')}
          </button>
        </div>
      </div>
    </div>
  )
}
