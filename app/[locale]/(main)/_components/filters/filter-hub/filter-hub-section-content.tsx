import type { Dispatch, SetStateAction } from "react"

import type { CategoryAttribute } from "@/lib/data/categories"
import { FilterCheckboxItem } from "@/components/shared/filters/controls/filter-checkbox-item"
import { FilterRatingSection } from "@/components/shared/filters/filter-rating-section"
import { getCategoryAttributeKey, getCategoryAttributeOptions } from "@/lib/filters/category-attribute"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import { FilterAttributeSectionContent } from "../shared/sections/filter-attribute-section-content"
import { FilterCategorySection } from "../shared/sections/filter-category-section"
import { PriceSlider } from "../shared/controls/price-slider"
import { FilterRadioGroup, FilterRadioItem } from "../shared/controls/filter-radio-group"
import type { PendingFilters } from "../shared/state/use-pending-filters"
import type { AttrFilterSection, FilterHubSubcategory, FilterSection } from "./types"

interface FilterHubSectionContentProps {
  activeSection: string | null
  locale: string
  pending: PendingFilters
  setPending: Dispatch<SetStateAction<PendingFilters>>
  pendingCategorySlug: string | null
  onChangePendingCategorySlug: (slug: string | null) => void
  filterSections: FilterSection[]
  categoryName?: string
  subcategories: FilterHubSubcategory[]
  shouldForceMultiSelect: (attr: CategoryAttribute) => boolean
  getPendingAttrValues: (attrName: string) => string[]
  setPendingAttrValues: (attrName: string, values: string[]) => void
  tSearchFilters: (key: string, values?: Record<string, string | number>) => string
  tCommon: (key: string, values?: Record<string, string | number>) => string
  onCloseHub: () => void
}

export function FilterHubSectionContent({
  activeSection,
  locale,
  pending,
  setPending,
  pendingCategorySlug,
  onChangePendingCategorySlug,
  filterSections,
  categoryName,
  subcategories,
  shouldForceMultiSelect,
  getPendingAttrValues,
  setPendingAttrValues,
  tSearchFilters,
  tCommon,
  onCloseHub,
}: FilterHubSectionContentProps) {
  return (
    <div className="px-inset py-4 space-y-2">
      {activeSection === "rating" && (
        <FilterRatingSection
          minRating={pending.minRating}
          onChange={(minRating) => setPending((prev) => ({ ...prev, minRating }))}
        />
      )}

      {activeSection === "price" && (
        <PriceSlider
          value={{ min: pending.minPrice, max: pending.maxPrice }}
          onChange={({ min, max }) => setPending((prev) => ({ ...prev, minPrice: min, maxPrice: max }))}
        />
      )}

      {activeSection === "availability" && (
        <div className="-mx-inset">
          <FilterCheckboxItem
            checked={pending.availability === "instock"}
            onCheckedChange={(checked) =>
              setPending((prev) => ({ ...prev, availability: checked ? "instock" : null }))
            }
            fullBleed
          >
            {tSearchFilters("inStock")}
          </FilterCheckboxItem>
        </div>
      )}

      {activeSection === "location" && (
        <div className="space-y-4">
          <div className="-mx-inset">
            <FilterRadioGroup
              value={pending.city ?? ""}
              onValueChange={(value) => setPending((prev) => ({ ...prev, city: value || null }))}
            >
              <FilterRadioItem value="" fullBleed>
                {tSearchFilters("anyLocation")}
              </FilterRadioItem>
              {BULGARIAN_CITIES.filter((city) => city.value !== "other")
                .slice(0, 15)
                .map((city) => (
                  <FilterRadioItem key={city.value} value={city.value} fullBleed>
                    {locale === "bg" ? city.labelBg : city.label}
                  </FilterRadioItem>
                ))}
            </FilterRadioGroup>
          </div>
          <div className="-mx-inset">
            <FilterCheckboxItem
              checked={pending.nearby === "true"}
              onCheckedChange={(checked) =>
                setPending((prev) => ({
                  ...prev,
                  nearby: checked ? "true" : null,
                }))
              }
              fullBleed
            >
              {tSearchFilters("nearMe")}
            </FilterCheckboxItem>
          </div>
        </div>
      )}

      {activeSection === "category" && subcategories.length > 0 && (
        <FilterCategorySection
          locale={locale}
          categoryName={categoryName ?? ""}
          pendingCategorySlug={pendingCategorySlug}
          onChangePendingCategorySlug={onChangePendingCategorySlug}
          subcategories={subcategories}
          onCloseHub={onCloseHub}
        />
      )}

      {(() => {
        const section = filterSections.find((item) => item.id === activeSection) as
          | AttrFilterSection
          | undefined
        if (!section?.attribute) return null

        const attr = section.attribute
        const attrKey = getCategoryAttributeKey(attr)
        const options = getCategoryAttributeOptions(attr, locale) ?? []

        return (
          <FilterAttributeSectionContent
            attribute={attr}
            attrKey={attrKey}
            options={options}
            selectedValues={getPendingAttrValues(attrKey)}
            onSelectedValuesChange={(values) => setPendingAttrValues(attrKey, values)}
            shouldForceMultiSelect={shouldForceMultiSelect}
            yesLabel={tCommon("yes")}
            checkboxListClassName="-mx-inset"
            checkboxItemsFullBleed
            booleanFullBleed
          />
        )
      })()}
    </div>
  )
}
