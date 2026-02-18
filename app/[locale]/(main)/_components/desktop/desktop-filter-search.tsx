import * as React from "react"
import { Check, ChevronDown as CaretDown, Search as MagnifyingGlass } from "lucide-react";

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface DesktopFilterSearchProps {
  options: string[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder: string
  isSingleSelect: boolean
}

export function DesktopFilterSearch({
  options,
  selectedValues,
  onChange,
  placeholder,
  isSingleSelect,
}: DesktopFilterSearchProps) {
  const t = useTranslations("SearchFilters")
  const [search, setSearch] = React.useState("")
  const [isExpanded, setIsExpanded] = React.useState(false)

  const filteredOptions = search
    ? options.filter((option) => option.toLowerCase().includes(search.toLowerCase()))
    : options

  const visibleOptions = isExpanded ? filteredOptions : filteredOptions.slice(0, 5)
  const hasMore = filteredOptions.length > 5

  return (
    <div className="space-y-2.5">
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9 h-9 text-sm bg-surface-subtle border-input"
        />
      </div>
      <div className="space-y-1 max-h-(--spacing-scroll-sm) overflow-y-auto">
        {visibleOptions.map((option) => {
          const isChecked = selectedValues.includes(option)
          const optionRowClass = cn(
            "flex items-center gap-2.5 py-2 px-2.5 rounded-lg cursor-pointer transition-colors",
            "hover:bg-muted",
            isChecked && "bg-selected hover:bg-hover"
          )

          if (isSingleSelect) {
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange(isChecked ? [] : [option])}
                aria-pressed={isChecked}
                className={cn(
                  optionRowClass,
                  "w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                <span
                  className={cn(
                    "size-4 rounded-full border-2 flex items-center justify-center transition-colors",
                    isChecked ? "border-primary bg-primary" : "border-border"
                  )}
                  aria-hidden="true"
                >
                  {isChecked && <span className="size-1.5 rounded-full bg-primary-foreground" />}
                </span>
                <span className="text-sm flex-1 truncate">{option}</span>
                {isChecked && <Check size={14} className="text-primary shrink-0" aria-hidden="true" />}
              </button>
            )
          }

          return (
            <label
              key={option}
              className={optionRowClass}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...selectedValues, option])
                  } else {
                    onChange(selectedValues.filter((value) => value !== option))
                  }
                }}
                className="size-4"
              />
              <span className="text-sm flex-1 truncate">{option}</span>
              {isChecked && <Check size={14} className="text-primary shrink-0" aria-hidden="true" />}
            </label>
          )
        })}
        {visibleOptions.length === 0 && (
          <p className="text-sm text-muted-foreground py-3 text-center">{t("noMatchesFound")}</p>
        )}
      </div>
      {hasMore && !search && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-link hover:text-link-hover font-medium w-full text-center py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isExpanded ? t("showLess") : t("showAllCount", { count: filteredOptions.length })}
          <CaretDown size={14} className={cn("transition-transform", isExpanded && "rotate-180")} />
        </button>
      )}
    </div>
  )
}
