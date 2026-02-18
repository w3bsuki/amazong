import type { CategoryAttribute } from "@/lib/data/categories"
import { ColorSwatches } from "@/components/shared/filters/controls/color-swatches"
import { FilterCheckboxItem, FilterCheckboxList } from "@/components/shared/filters/controls/filter-checkbox-item"
import { FilterList } from "../controls/filter-list"
import {
  isColorFilterAttribute,
  isSearchableFilterAttribute,
  isSizeFilterAttribute,
} from "../config/filter-attribute-config"
import { SizeTiles } from "../controls/size-tiles"

interface FilterAttributeSectionContentProps {
  attribute: CategoryAttribute
  attrKey: string
  options: string[]
  selectedValues: string[]
  onSelectedValuesChange: (values: string[]) => void
  shouldForceMultiSelect: (attribute: CategoryAttribute) => boolean
  yesLabel: string
  checkboxListClassName?: string
  checkboxItemsFullBleed?: boolean
  booleanFullBleed?: boolean
}

export function FilterAttributeSectionContent({
  attribute,
  attrKey,
  options,
  selectedValues,
  onSelectedValuesChange,
  shouldForceMultiSelect,
  yesLabel,
  checkboxListClassName,
  checkboxItemsFullBleed = false,
  booleanFullBleed = false,
}: FilterAttributeSectionContentProps) {
  if (attribute.attribute_type === "boolean") {
    const isChecked = selectedValues.includes("true")
    return (
      <FilterCheckboxItem
        checked={isChecked}
        onCheckedChange={(checked) => onSelectedValuesChange(checked ? ["true"] : [])}
        fullBleed={booleanFullBleed}
      >
        {yesLabel}
      </FilterCheckboxItem>
    )
  }

  if (isColorFilterAttribute(attrKey) && options.length > 0) {
    return (
      <ColorSwatches
        options={options}
        selected={selectedValues}
        onSelect={onSelectedValuesChange}
      />
    )
  }

  if (isSizeFilterAttribute(attrKey) && options.length > 0) {
    return (
      <SizeTiles
        options={options}
        selected={selectedValues}
        onSelect={onSelectedValuesChange}
      />
    )
  }

  if (isSearchableFilterAttribute(attrKey) && options.length > 0) {
    const allowMulti =
      attribute.attribute_type === "multiselect" || shouldForceMultiSelect(attribute)
    return (
      <FilterList
        options={options}
        selected={selectedValues}
        onSelect={onSelectedValuesChange}
        multiSelect={allowMulti}
        searchThreshold={8}
      />
    )
  }

  if (
    (attribute.attribute_type === "select" ||
      attribute.attribute_type === "multiselect") &&
    options.length > 0
  ) {
    const allowMulti =
      attribute.attribute_type === "multiselect" || shouldForceMultiSelect(attribute)

    const checkboxListProps = checkboxListClassName
      ? { className: checkboxListClassName }
      : {}

    return (
      <FilterCheckboxList {...checkboxListProps}>
        {options.map((option) => {
          const isActive = selectedValues.includes(option)

          return (
            <FilterCheckboxItem
              key={option}
              checked={isActive}
              onCheckedChange={(checked) => {
                if (!allowMulti) {
                  onSelectedValuesChange(checked ? [option] : [])
                  return
                }
                const nextValues = checked
                  ? [...selectedValues, option]
                  : selectedValues.filter((value) => value !== option)
                onSelectedValuesChange(nextValues)
              }}
              fullBleed={checkboxItemsFullBleed}
            >
              {option}
            </FilterCheckboxItem>
          )
        })}
      </FilterCheckboxList>
    )
  }

  return null
}
