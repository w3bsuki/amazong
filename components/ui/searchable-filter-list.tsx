'use client'

import * as React from 'react'
import { MagnifyingGlass, Check } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

// =============================================================================
// Types
// =============================================================================

interface SearchableFilterListProps {
  /** All available options */
  options: string[]
  /** Currently selected values */
  selectedValues: string[]
  /** Callback when selection changes */
  onChange: (values: string[]) => void
  /** Placeholder text for search input */
  searchPlaceholder?: string
  /** Whether to allow multiple selections */
  multiSelect?: boolean
  /** Maximum height of the list */
  maxHeight?: number
  /** Optional class name */
  className?: string
  /** Show search input (auto-enabled if > 6 options) */
  showSearch?: boolean
  /** Empty state message */
  emptyMessage?: string
}

// =============================================================================
// Component
// =============================================================================

export function SearchableFilterList({
  options,
  selectedValues,
  onChange,
  searchPlaceholder = 'Search...',
  multiSelect = true,
  maxHeight = 240,
  className,
  showSearch,
  emptyMessage = 'No results found',
}: SearchableFilterListProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  
  // Auto-show search if more than 6 options
  const shouldShowSearch = showSearch ?? options.length > 6
  
  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options
    const query = searchQuery.toLowerCase()
    return options.filter(option => 
      option.toLowerCase().includes(query)
    )
  }, [options, searchQuery])

  const handleToggle = (option: string) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(option)
        ? selectedValues.filter(v => v !== option)
        : [...selectedValues, option]
      onChange(newValues)
    } else {
      // Single select - toggle or clear
      onChange(selectedValues.includes(option) ? [] : [option])
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Search Input */}
      {shouldShowSearch && (
        <div className="relative">
          <MagnifyingGlass 
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" 
          />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
      )}

      {/* Options List */}
      <ScrollArea 
        className="pr-3"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <div className="space-y-0.5">
          {filteredOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {emptyMessage}
            </p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option)
              return (
                <label
                  key={option}
                  className={cn(
                    'flex items-center gap-2.5 px-2 py-2 rounded-md cursor-pointer transition-colors',
                    isSelected 
                      ? 'bg-primary/10' 
                      : 'hover:bg-muted'
                  )}
                >
                  {multiSelect ? (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(option)}
                      className="size-4"
                    />
                  ) : (
                    <div 
                      className={cn(
                        'size-4 rounded-full border-2 flex items-center justify-center transition-colors',
                        isSelected 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      )}
                    >
                      {isSelected && (
                        <div className="size-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  )}
                  <span className="text-sm flex-1">{option}</span>
                  {isSelected && (
                    <Check 
                      size={14} 
                      weight="bold" 
                      className="text-primary shrink-0" 
                    />
                  )}
                </label>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// =============================================================================
// Range Filter Component (for Year, Mileage, etc.)
// =============================================================================

interface RangeFilterProps {
  minValue?: number
  maxValue?: number
  currentMin?: string
  currentMax?: string
  onChange: (min: string | null, max: string | null) => void
  step?: number
  formatValue?: (value: number) => string
  minPlaceholder?: string
  maxPlaceholder?: string
  className?: string
}

export function RangeFilter({
  minValue = 0,
  maxValue = 100,
  currentMin,
  currentMax,
  onChange,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
  className,
}: RangeFilterProps) {
  const [localMin, setLocalMin] = React.useState(currentMin || '')
  const [localMax, setLocalMax] = React.useState(currentMax || '')

  const handleApply = () => {
    onChange(
      localMin ? localMin : null,
      localMax ? localMax : null
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder={minPlaceholder}
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          min={minValue}
          max={maxValue}
          className="h-9 text-sm"
        />
        <span className="text-muted-foreground text-sm">to</span>
        <Input
          type="number"
          placeholder={maxPlaceholder}
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          min={minValue}
          max={maxValue}
          className="h-9 text-sm"
        />
      </div>
      <button
        onClick={handleApply}
        className="w-full h-8 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Apply
      </button>
    </div>
  )
}
