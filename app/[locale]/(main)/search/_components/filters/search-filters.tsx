"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { useCallback, useEffect, useState } from "react"
import { Accordion } from "@/components/ui/accordion"
import {
  CategoryNavigation,
  type BreadcrumbCategory,
  type Category,
  type CategoryWithSubcategories,
} from "./sections/category-navigation"
import { ReviewsFilterSection } from "./sections/reviews-filter-section"
import { PriceFilterSection } from "./sections/price-filter-section"
import { LocationFilterSection } from "./sections/location-filter-section"
import { AvailabilityFilterSection } from "./sections/availability-filter-section"

interface SearchFiltersProps {
  categories: Category[]
  subcategories: Category[]
  currentCategory: Category | null
  parentCategory?: Category | null
  allCategoriesWithSubs?: CategoryWithSubcategories[]
  brands?: string[]
  basePath?: string
  ancestry?: BreadcrumbCategory[]
}

export function SearchFilters({
  categories,
  subcategories,
  currentCategory,
  parentCategory,
  allCategoriesWithSubs = [],
  brands,
  basePath,
  ancestry = [],
}: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations("SearchFilters")

  // Keep backward compatibility with existing callers that pass brands.
  void brands

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")
  const currentBrand = searchParams.get("brand")
  const currentAvailability = searchParams.get("availability")
  const currentCity = searchParams.get("city")
  const currentNearby = searchParams.get("nearby") === "true"

  const [priceMin, setPriceMin] = useState(currentMinPrice ?? "")
  const [priceMax, setPriceMax] = useState(currentMaxPrice ?? "")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [showAllCategories, setShowAllCategories] = useState(false)

  useEffect(() => {
    setPriceMin(currentMinPrice ?? "")
    setPriceMax(currentMaxPrice ?? "")
  }, [currentMinPrice, currentMaxPrice])

  useEffect(() => {
    if (!currentCategory) {
      return
    }

    setExpandedCategories((previous) => {
      if (currentCategory.parent_id) {
        const parentSlug = categories.find((category) => category.id === currentCategory.parent_id)?.slug
        if (parentSlug && !previous.includes(parentSlug)) {
          return [...previous, parentSlug]
        }
        return previous
      }

      if (!previous.includes(currentCategory.slug)) {
        return [...previous, currentCategory.slug]
      }

      return previous
    })
  }, [currentCategory, categories])

  const pushWithParams = useCallback(
    (params: URLSearchParams) => {
      if (basePath) {
        const query = params.toString()
        router.push(query ? `${basePath}?${query}` : basePath)
      } else {
        router.push(`/search?${params.toString()}`)
      }
    },
    [basePath, router],
  )

  const getCategoryHref = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("page")

      if (slug) {
        params.set("category", slug)
      } else {
        params.delete("category")
      }

      const query = params.toString()
      const path = basePath ?? "/search"
      return query ? `${path}?${query}` : path
    },
    [basePath, searchParams],
  )

  const toggleCategory = useCallback((slug: string) => {
    setExpandedCategories((previous) =>
      previous.includes(slug)
        ? previous.filter((value) => value !== slug)
        : [...previous, slug],
    )
  }, [])

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      pushWithParams(params)
    },
    [searchParams, pushWithParams],
  )

  const handlePriceClick = useCallback(
    (min: string | null, max: string | null) => {
      const params = new URLSearchParams(searchParams.toString())

      if (min) {
        params.set("minPrice", min)
      } else {
        params.delete("minPrice")
      }

      if (max) {
        params.set("maxPrice", max)
      } else {
        params.delete("maxPrice")
      }

      pushWithParams(params)
    },
    [searchParams, pushWithParams],
  )

  const applyPriceInputs = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (priceMin && priceMin !== "0") {
      params.set("minPrice", priceMin)
    } else {
      params.delete("minPrice")
    }

    if (priceMax && priceMax !== "0") {
      params.set("maxPrice", priceMax)
    } else {
      params.delete("maxPrice")
    }

    pushWithParams(params)
  }, [priceMin, priceMax, searchParams, pushWithParams])

  const handleCityChange = useCallback(
    (city: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (city && city !== "all") {
        params.set("city", city)
      } else {
        params.delete("city")
      }
      pushWithParams(params)
    },
    [searchParams, pushWithParams],
  )

  const toggleNearby = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (currentNearby) {
      params.delete("nearby")
    } else {
      params.set("nearby", "true")
    }
    pushWithParams(params)
  }, [currentNearby, searchParams, pushWithParams])

  const clearAllFilters = useCallback(() => {
    if (basePath) {
      router.push(basePath)
      return
    }

    const params = new URLSearchParams()
    const category = searchParams.get("category")
    const query = searchParams.get("q")
    if (category) {
      params.set("category", category)
    }
    if (query) {
      params.set("q", query)
    }

    router.push(`/search?${params.toString()}`)
  }, [basePath, router, searchParams])

  const hasActiveFilters = Boolean(
    currentMinPrice || currentMaxPrice || currentRating || currentBrand || currentAvailability || currentCity || currentNearby,
  )

  return (
    <div className="text-sidebar-foreground">
      <CategoryNavigation
        categories={categories}
        subcategories={subcategories}
        currentCategory={currentCategory}
        parentCategory={parentCategory}
        allCategoriesWithSubs={allCategoriesWithSubs}
        ancestry={ancestry}
        locale={locale}
        expandedCategories={expandedCategories}
        showAllCategories={showAllCategories}
        getCategoryHref={getCategoryHref}
        onToggleShowAllCategories={() => setShowAllCategories((previous) => !previous)}
        onToggleCategory={toggleCategory}
      />

      <Accordion type="multiple" defaultValue={["reviews", "price", "location", "availability"]} className="w-full mt-4">
        <ReviewsFilterSection
          currentRating={currentRating}
          onRatingChange={(value) => updateParams("minRating", value)}
        />
        <PriceFilterSection
          locale={locale}
          currentMinPrice={currentMinPrice}
          currentMaxPrice={currentMaxPrice}
          priceMin={priceMin}
          priceMax={priceMax}
          onPriceMinChange={setPriceMin}
          onPriceMaxChange={setPriceMax}
          onApplyPriceInputs={applyPriceInputs}
          onPricePresetClick={handlePriceClick}
        />
        <LocationFilterSection
          locale={locale}
          currentCity={currentCity}
          currentNearby={currentNearby}
          onCityChange={handleCityChange}
          onToggleNearby={toggleNearby}
        />
        <AvailabilityFilterSection
          currentAvailability={currentAvailability}
          onAvailabilityChange={(value) => updateParams("availability", value)}
        />
      </Accordion>

      {hasActiveFilters && (
        <div className="pt-4 mt-2">
          <button
            type="button"
            onClick={clearAllFilters}
            className="w-full min-h-11 text-sm text-center text-sidebar-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {t("clearAllFilters")}
          </button>
        </div>
      )}
    </div>
  )
}
