"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, ChevronLeft } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

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
}

export function SearchFilters({ categories, subcategories, currentCategory }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations('SearchFilters')

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")

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

  const handlePriceClick = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min) params.set("minPrice", min)
    else params.delete("minPrice")

    if (max) params.set("maxPrice", max)
    else params.delete("maxPrice")

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-6 text-[#0F1111]">
      {/* Prime Filter */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="prime" className="border-[#888] data-[state=checked]:bg-[#007185] data-[state=checked]:border-[#007185]" />
          <Label htmlFor="prime" className="text-sm font-medium flex items-center gap-1 cursor-pointer">
            <img src="https://m.media-amazon.com/images/G/01/prime/marketing/slashPrime/amazon-prime-delivery-checkmark._CB611051915_.png" alt="Prime" className="h-[14px]" />
          </Label>
        </div>
      </div>

      {/* Department/Category Navigation */}
      <div>
        <h3 className="font-bold text-sm mb-2">{t('department')}</h3>
        
        {/* Show "Back to All" when in a category */}
        {currentCategory && (
          <div className="mb-2">
            <Link 
              href="/search"
              className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="h-3 w-3" />
              {t('allDepartments')}
            </Link>
            <div className="mt-2 font-bold text-sm text-[#0F1111]">
              {getCategoryName(currentCategory)}
            </div>
          </div>
        )}

        <div className="space-y-1">
          {/* If we're in a category, show its subcategories */}
          {currentCategory && subcategories.length > 0 ? (
            subcategories.map((subcat) => (
              <div key={subcat.id} className="flex items-center space-x-2 pl-2">
                <Link
                  href={`/search?category=${subcat.slug}`}
                  className="text-sm cursor-pointer hover:text-[#c7511f] text-[#0F1111]"
                >
                  {getCategoryName(subcat)}
                </Link>
              </div>
            ))
          ) : !currentCategory && categories.length > 0 ? (
            // Show all top-level categories
            categories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <Link
                  href={`/search?category=${cat.slug}`}
                  className="text-sm cursor-pointer hover:text-[#c7511f] text-[#0F1111]"
                >
                  {getCategoryName(cat)}
                </Link>
              </div>
            ))
          ) : (
            // Fallback if no categories loaded
            <div className="text-sm text-gray-500">{t('loadingCategories')}</div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-2">{t('customerReviews')}</h3>
        {[4, 3, 2, 1].map((stars) => (
          <div
            key={stars}
            className={`flex items-center gap-1 mb-1 cursor-pointer hover:opacity-80 group ${
              currentRating === stars.toString() ? 'font-bold' : ''
            }`}
            onClick={() => updateParams("minRating", currentRating === stars.toString() ? null : stars.toString())}
          >
            <div className="flex text-[#f08804]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < stars ? "fill-current" : "text-transparent stroke-current stroke-1 text-[#f08804]"}`}
                />
              ))}
            </div>
            <span className="text-sm text-[#007185] group-hover:text-[#c7511f] group-hover:underline">{t('andUp')}</span>
          </div>
        ))}
        {currentRating && (
          <div
            className="pt-1 text-[#007185] cursor-pointer text-xs hover:underline"
            onClick={() => updateParams("minRating", null)}
          >
            {t('clearRating')}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-bold text-sm mb-2">{t('price')}</h3>
        <div className="space-y-1 text-sm text-[#0F1111]">
          <div className="cursor-pointer hover:text-[#c7511f] hover:underline" onClick={() => handlePriceClick(null, "25")}>
            {t('under25')}
          </div>
          <div className="cursor-pointer hover:text-[#c7511f] hover:underline" onClick={() => handlePriceClick("25", "50")}>
            {t('range2550')}
          </div>
          <div className="cursor-pointer hover:text-[#c7511f] hover:underline" onClick={() => handlePriceClick("50", "100")}>
            {t('range50100')}
          </div>
          <div className="cursor-pointer hover:text-[#c7511f] hover:underline" onClick={() => handlePriceClick("100", "200")}>
            {t('range100200')}
          </div>
          <div className="cursor-pointer hover:text-[#c7511f] hover:underline" onClick={() => handlePriceClick("200", null)}>
            {t('above200')}
          </div>
          {(currentMinPrice || currentMaxPrice) && (
            <div
              className="pt-2 text-[#007185] cursor-pointer text-xs hover:underline"
              onClick={() => handlePriceClick(null, null)}
            >
              {t('clearPrice')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
