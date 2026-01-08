"use client"

import { useState, useMemo } from "react"
import { Check, MagnifyingGlass } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

// =============================================================================
// FILTER LIST — Searchable list selector for long option lists (Brand, Condition)
//
// Per UI_UX_CODEX.md:
// - Brand/Condition: list with search input if options > 8
// - Touch targets >= 44x44
// =============================================================================

interface FilterListProps {
  options: string[]
  selected: string[]
  onSelect: (values: string[]) => void
  multiSelect?: boolean
  /** Show search input when options exceed this threshold */
  searchThreshold?: number
  /** Placeholder for search input */
  searchPlaceholder?: string
}

export function FilterList({
  options,
  selected,
  onSelect,
  multiSelect = true,
  searchThreshold = 8,
  searchPlaceholder,
}: FilterListProps) {
  const tHub = useTranslations("FilterHub")
  const [searchQuery, setSearchQuery] = useState("")

  const showSearch = options.length > searchThreshold

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options
    const query = searchQuery.toLowerCase().trim()
    return options.filter((opt) => opt.toLowerCase().includes(query))
  }, [options, searchQuery])

  const handleSelect = (option: string) => {
    if (!multiSelect) {
      onSelect(selected.includes(option) ? [] : [option])
      return
    }
    const newValues = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option]
    onSelect(newValues)
  }

  return (
    <div className="space-y-2">
      {/* Search input */}
      {showSearch && (
        <div className="relative">
          <MagnifyingGlass
            size={16}
            weight="regular"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder || tHub("searchPlaceholder", { filterName: "" })}
            className={cn(
              "w-full h-10 pl-9 pr-3 rounded-lg",
              "bg-muted/50 border border-border/50",
              "text-sm placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            )}
          />
        </div>
      )}

      {/* Options list */}
      <div className="-mx-4 max-h-(--spacing-scroll-md) overflow-y-auto divide-y divide-border/30">
        {filteredOptions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {tHub("noResults")}
          </p>
        ) : (
          filteredOptions.map((option) => {
            const isActive = selected.includes(option)

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  "w-full flex items-center justify-between px-4 h-12 transition-colors text-left",
                  isActive
                    ? "bg-muted/40 text-foreground font-medium"
                    : "text-foreground active:bg-muted/30"
                )}
                aria-pressed={isActive}
              >
                <span className="text-base font-normal">{option}</span>
                {isActive && <Check size={16} weight="bold" />}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
