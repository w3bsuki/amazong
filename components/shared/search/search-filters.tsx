"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, CaretDown, CaretRight, Check, Package } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CategoryBreadcrumbTrail } from "@/components/category/category-breadcrumb-trail"

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

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")
  const currentBrand = searchParams.get("brand")
  const currentAvailability = searchParams.get("availability")
  
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

  const hasActiveFilters = currentMinPrice || currentMaxPrice || currentRating || currentBrand || currentAvailability

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
                  className="text-sm text-muted-foreground hover:text-primary hover:underline min-h-8 flex items-center gap-1 mb-2"
                >
                  <CaretRight size={14} weight="bold" className="rotate-180" />
                  {getCategoryName(parentCategory)}
                </Link>
              ) : (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="text-sm text-muted-foreground hover:text-primary min-h-8 flex items-center gap-1 w-full mb-2"
                >
                  <CaretRight size={14} weight="bold" className={showAllCategories ? "rotate-90" : "rotate-180"} />
                  <span className="hover:underline">
                    {locale === 'bg' ? 'Всички категории' : 'All Categories'}
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
                    className={`text-sm cursor-pointer min-h-8 flex items-center px-2 -mx-2 rounded-md transition-colors ${
                      cat.id === currentCategory.id 
                        ? 'font-semibold text-sidebar-foreground bg-sidebar-accent' 
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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
                <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide mb-2 mt-4">
                  {locale === 'bg' ? 'Подкатегории' : 'Subcategories'}
                </h3>
                <nav className="space-y-0.5">
                  {validSubcategories.map((subcat) => (
                    <Link
                      key={subcat.id}
                      href={`/categories/${subcat.slug}`}
                      className="text-sm cursor-pointer text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent min-h-9 flex items-center px-2 -mx-2 rounded-md transition-colors"
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
                        className="text-sm cursor-pointer hover:text-sidebar-accent-foreground flex-1 min-h-8 flex items-center text-sidebar-foreground"
                      >
                        {getCategoryName(cat)}
                      </Link>
                      {hasSubs && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleCategory(cat.slug)
                          }}
                          className="min-h-8 min-w-8 flex items-center justify-center hover:bg-sidebar-accent rounded-md transition-colors"
                          aria-label={isExpanded ? `Collapse ${getCategoryName(cat)} subcategories` : `Expand ${getCategoryName(cat)} subcategories`}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <CaretDown size={16} weight="regular" className="text-sidebar-foreground/60" aria-hidden="true" />
                          ) : (
                            <CaretRight size={16} weight="regular" className="text-sidebar-foreground/60" aria-hidden="true" />
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
                            className="text-sm cursor-pointer min-h-8 flex items-center px-2 -mx-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
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
      <Accordion type="multiple" defaultValue={["reviews", "price", "availability"]} className="w-full mt-4">
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
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
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

        {/* Price */}
        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-semibold text-sidebar-foreground hover:no-underline hover:text-sidebar-accent-foreground">
            {t('price')}
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-0.5">
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
                    className={cn(
                      "w-full flex items-center justify-between py-2 px-2 -mx-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                    )}
                    onClick={() => handlePriceClick(min, max)}
                  >
                    {label}
                    {isActive && <Check size={16} weight="regular" className="text-primary" />}
                  </button>
                )
              })}
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
                "flex items-center gap-3 py-2 px-2 -mx-2 rounded-md cursor-pointer transition-colors",
                currentAvailability === "instock"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
              )}
            >
              <Checkbox
                id="instock"
                checked={currentAvailability === "instock"}
                onCheckedChange={() => updateParams("availability", currentAvailability === "instock" ? null : "instock")}
                className="size-4 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
            className="w-full text-sm text-center text-sidebar-primary hover:underline font-medium py-2"
          >
            {t('clearAllFilters')}
          </button>
        </div>
      )}
    </div>
  )
}
