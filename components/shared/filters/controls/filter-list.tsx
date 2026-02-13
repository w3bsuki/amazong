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
              "bg-surface-subtle border border-border-subtle",
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
                  "w-full flex items-center gap-3 px-4 h-10 transition-colors text-left outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                  isActive
                    ? "bg-selected text-foreground font-medium"
                    : "text-foreground active:bg-active"
                )}
                aria-pressed={isActive}
              >
                <div
                  className={cn(
                    "size-5 rounded border flex items-center justify-center transition-colors shrink-0",
                    isActive ? "bg-primary border-primary" : "border-input"
                  )}
                >
                  {isActive && <Check size={12} weight="bold" className="text-primary-foreground" />}
                </div>
                <span className="text-sm">{option}</span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
