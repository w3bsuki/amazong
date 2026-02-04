"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Star, CaretDown, CaretRight, Check, Package, MapPin, Crosshair } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CategoryBreadcrumbTrail } from "@/components/category/category-breadcrumb-trail"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

interface BreadcrumbCategory {
  slug: string
  name: string
  name_bg: string | null
}

interface SearchFiltersProps {
  categories: Category[]
  subcategories: Category[]
  currentCategory: Category | null
  parentCategory?: Category | null
  allCategoriesWithSubs?: { category: Category; subs: Category[] }[]
  brands?: string[]
  basePath?: string // e.g., "/categories/electronics" or undefined for "/search"
  /** Full ancestry chain from L0 to current category (for breadcrumb display) */
  ancestry?: BreadcrumbCategory[]
}

export function SearchFilters({ 
  categories, 
  subcategories, 
  currentCategory,
  parentCategory,
  allCategoriesWithSubs = [],
  brands: _brands = [],
  basePath,
  ancestry = []
}: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations('SearchFilters')
  const tCommon = useTranslations("Common")

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")
  const currentBrand = searchParams.get("brand")
  const currentAvailability = searchParams.get("availability")
  const currentCity = searchParams.get("city")
  const currentNearby = searchParams.get("nearby") === "true"
  
  // Price input state (controlled inputs that sync with URL)
  const [priceMin, setPriceMin] = useState(currentMinPrice ?? "")
  const [priceMax, setPriceMax] = useState(currentMaxPrice ?? "")
  
  // Sync price inputs with URL on mount/change
  useEffect(() => {
    setPriceMin(currentMinPrice ?? "")
    setPriceMax(currentMaxPrice ?? "")
  }, [currentMinPrice, currentMaxPrice])
  
  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  // Track if "All Categories" is expanded (for context-aware view)
  const [showAllCategories, setShowAllCategories] = useState(false)
  
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
  
  // Apply price from min/max inputs
  const applyPriceInputs = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (priceMin && priceMin !== "0") params.set("minPrice", priceMin)
    else params.delete("minPrice")
    if (priceMax && priceMax !== "0") params.set("maxPrice", priceMax)
    else params.delete("maxPrice")
    
    if (basePath) {
      router.push(`${basePath}?${params.toString()}`)
    } else {
      router.push(`/search?${params.toString()}`)
    }
  }, [priceMin, priceMax, searchParams, basePath, router])
  
  // Handle location changes
  const handleCityChange = useCallback((city: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (city && city !== "all") {
      params.set("city", city)
    } else {
      params.delete("city")
    }
    if (basePath) {
      router.push(`${basePath}?${params.toString()}`)
    } else {
      router.push(`/search?${params.toString()}`)
    }
  }, [searchParams, basePath, router])
  
  const toggleNearby = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (currentNearby) {
      params.delete("nearby")
    } else {
      params.set("nearby", "true")
    }
    if (basePath) {
      router.push(`${basePath}?${params.toString()}`)
    } else {
      router.push(`/search?${params.toString()}`)
    }
  }, [currentNearby, searchParams, basePath, router])

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

  const hasActiveFilters = currentMinPrice || currentMaxPrice || currentRating || currentBrand || currentAvailability || currentCity || currentNearby

  // Get subcategories for a given category from allCategoriesWithSubs
  const getSubcategoriesFor = (categoryId: string) => {
    const found = allCategoriesWithSubs.find(c => c.category.id === categoryId)
    return found?.subs || []
  }

  // Filter out deprecated/moved categories
  const isValidCategory = (cat: Category) => {
    const name = cat.name.toLowerCase()
    return !name.includes('[deprecated]') && 
           !name.includes('[moved]') && 
           !name.includes('[duplicate]')
  }

  // Filter categories and subcategories
  const validCategories = categories.filter(isValidCategory)
  const validSubcategories = subcategories.filter(isValidCategory)

  return (
    <div className="text-sidebar-foreground">
      {/* ================================================================
          SECTION 1: Category Navigation with Breadcrumb Trail
          ================================================================ */}
      <div className="pb-4">
        {/* Context-aware navigation */}
        {currentCategory ? (
          <>
            {/* Breadcrumb trail - shows full hierarchy when available */}
            {ancestry.length > 1 ? (
              <CategoryBreadcrumbTrail ancestry={ancestry} className="mb-4" />
            ) : (
              /* Fallback: Back link to parent or show all categories toggle */
              parentCategory ? (
                <Link
                  href={`/categories/${parentCategory.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline min-h-11 flex items-center gap-1 mb-2"
                >
                  <CaretRight size={14} weight="bold" className="rotate-180" />
                  {getCategoryName(parentCategory)}
                </Link>
              ) : (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="text-sm text-muted-foreground hover:text-primary min-h-11 flex items-center gap-1 w-full mb-2"
                >
                  <CaretRight size={14} weight="bold" className={showAllCategories ? "rotate-90" : "rotate-180"} />
                  <span className="hover:underline">
                    {tCommon("allCategories")}
                  </span>
                </button>
              )
            )}
            
            {/* Show all L0 categories when expanded (only when no ancestry) */}
            {showAllCategories && !parentCategory && ancestry.length <= 1 && (
              <div className="ml-2 mb-3 space-y-0.5 pl-3 py-1">
                {validCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className={`text-sm cursor-pointer min-h-11 flex items-center px-2 -mx-2 rounded-md transition-colors ${
                      cat.id === currentCategory.id 
                        ? 'font-semibold text-sidebar-foreground bg-sidebar-accent' 
                        : 'text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    {getCategoryName(cat)}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Subcategories section header */}
            {validSubcategories.length > 0 && (
              <>
                <h3 className="text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wide mb-2 mt-4">
                  {t("subcategories")}
                </h3>
                <nav className="space-y-0.5">
                  {validSubcategories.map((subcat) => (
                    <Link
                      key={subcat.id}
                      href={`/categories/${subcat.slug}`}
                      className="text-sm cursor-pointer text-sidebar-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent min-h-11 flex items-center px-2 -mx-2 rounded-md transition-colors"
                    >
                      {getCategoryName(subcat)}
                    </Link>
                  ))}
                </nav>
              </>
            )}
          </>
        ) : (
          /* Full category list for search page */
          <>
            <h3 className="font-semibold text-base mb-3 text-sidebar-foreground">{t('department')}</h3>
            <nav className="space-y-0.5">
              {validCategories.map((cat) => {
                const isExpanded = expandedCategories.includes(cat.slug)
                const catSubs = allCategoriesWithSubs.length > 0 
                  ? getSubcategoriesFor(cat.id).filter(isValidCategory)
                  : []
                const hasSubs = catSubs.length > 0
                
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between group">
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="text-sm cursor-pointer hover:text-sidebar-accent-foreground flex-1 min-h-11 flex items-center text-sidebar-foreground"
                      >
                        {getCategoryName(cat)}
                      </Link>
                      {hasSubs && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleCategory(cat.slug)
                          }}
                          className="size-11 flex items-center justify-center hover:bg-sidebar-accent rounded-md transition-colors"
                          aria-label={
                            isExpanded
                              ? t("collapseSubcategories", { category: getCategoryName(cat) })
                              : t("expandSubcategories", { category: getCategoryName(cat) })
                          }
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <CaretDown size={16} weight="regular" className="text-sidebar-muted-foreground" aria-hidden="true" />
                          ) : (
                            <CaretRight size={16} weight="regular" className="text-sidebar-muted-foreground" aria-hidden="true" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Subcategories */}
                    {isExpanded && hasSubs && (
                      <div className="ml-3 mt-1 space-y-0.5 pl-3">
                        {catSubs.map((subcat) => (
                          <Link
                            key={subcat.id}
                            href={`/categories/${subcat.slug}`}
                            className="text-sm cursor-pointer min-h-11 flex items-center px-2 -mx-2 rounded-md text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                          >
                            {getCategoryName(subcat)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </>
        )}
      </div>

      {/* ================================================================
          SECTION 2-4: Filters using Accordion (cleaner UI)
          ================================================================ */}
      <Accordion type="multiple" defaultValue={["reviews", "price", "location", "availability"]} className="w-full mt-4">
        {/* Customer Reviews */}
        <AccordionItem value="reviews" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-semibold text-sidebar-foreground hover:no-underline hover:text-sidebar-accent-foreground">
            {t('customerReviews')}
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-0.5">
              {[4, 3, 2, 1].map((stars) => {
                const isActive = currentRating === stars.toString()
                return (
                  <button
                    key={stars}
                    className={cn(
                      "w-full flex items-center gap-2 py-2 px-2 -mx-2 rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-sidebar-muted text-sidebar-foreground"
                    )}
                    onClick={() => updateParams("minRating", isActive ? null : stars.toString())}
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
                    {isActive && (
                      <Check size={16} weight="regular" className="ml-auto text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price - Min/Max inputs */}
        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-semibold text-sidebar-foreground hover:no-underline hover:text-sidebar-accent-foreground">
            {t('price')}
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-3">
              {/* Min/Max input row */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={t('min')}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyPriceInputs()}
                    className="text-sm"
                    min={0}
                  />
                </div>
                <span className="text-muted-foreground text-sm">–</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={t('max')}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyPriceInputs()}
                    className="text-sm"
                    min={0}
                  />
                </div>
                <Button
                  size="default"
                  variant="secondary"
                  onClick={applyPriceInputs}
                  className="px-3"
                >
                  {t('go')}
                </Button>
              </div>
              
              {/* Quick price presets */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: locale === "bg" ? "Под 25" : "Under 25", min: null, max: "25" },
                  { label: "25-50", min: "25", max: "50" },
                  { label: "50-100", min: "50", max: "100" },
                  { label: "100-200", min: "100", max: "200" },
                  { label: locale === "bg" ? "Над 200" : "200+", min: "200", max: null }
                ].map(({ label, min, max }) => {
                  const isActive = currentMinPrice === min && currentMaxPrice === max
                  return (
                    <button
                      key={label}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-muted"
                      )}
                      onClick={() => handlePriceClick(min, max)}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Location */}
        <AccordionItem value="location" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-semibold text-sidebar-foreground hover:no-underline hover:text-sidebar-accent-foreground">
            {t('location')}
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-3">
              {/* City selector */}
              <Select
                value={currentCity ?? "all"}
                onValueChange={(value) => handleCityChange(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('selectCity')} />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <MapPin size={14} weight="regular" />
                      {t('anyLocation')}
                    </span>
                  </SelectItem>
                  {BULGARIAN_CITIES.filter(c => c.value !== "other").map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {locale === "bg" ? city.labelBg : city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Nearby toggle */}
              <label
                htmlFor="nearby"
                className={cn(
                  "flex min-h-11 items-center gap-3 px-2 -mx-2 rounded-md cursor-pointer transition-colors",
                  currentNearby
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-muted text-sidebar-foreground"
                )}
              >
                <Checkbox
                  id="nearby"
                  checked={currentNearby}
                  onCheckedChange={toggleNearby}
                />
                <span className="text-sm flex items-center gap-1.5">
                  <Crosshair size={16} weight="regular" className="text-primary" />
                  {t('nearMe')}
                </span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-semibold text-sidebar-foreground hover:no-underline hover:text-sidebar-accent-foreground">
            {t('availability')}
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <label
              htmlFor="instock"
              className={cn(
                "flex min-h-11 items-center gap-3 px-2 -mx-2 rounded-md cursor-pointer transition-colors",
                currentAvailability === "instock"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-muted text-sidebar-foreground"
              )}
            >
              <Checkbox
                id="instock"
                checked={currentAvailability === "instock"}
                onCheckedChange={() => updateParams("availability", currentAvailability === "instock" ? null : "instock")}
              />
              <span className="text-sm flex items-center gap-1.5">
                <Package size={16} weight="regular" className="text-stock-available" />
                {t('includeOutOfStock')}
              </span>
            </label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear All Filters Button - Show at bottom when filters are active */}
        {hasActiveFilters && (
          <div className="pt-4 mt-2">
            <button
              onClick={clearAllFilters}
              className="w-full min-h-11 text-sm text-center text-sidebar-primary hover:underline font-medium"
            >
              {t('clearAllFilters')}
            </button>
          </div>
        )}
    </div>
  )
}
