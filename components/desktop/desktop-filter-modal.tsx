'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter, usePathname } from '@/i18n/routing'
import { 
  Sliders, 
  X, 
  Star, 
  Check, 
  MagnifyingGlass, 
  Tag,
  CaretDown
} from '@phosphor-icons/react'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import type { CategoryAttribute } from '@/lib/data/categories'

interface DesktopFilterModalProps {
  attributes?: CategoryAttribute[]
  categorySlug?: string
  className?: string
}

// =============================================================================
// Helper Functions
// =============================================================================

function getAttrName(attr: CategoryAttribute, locale: string): string {
  return locale === 'bg' && attr.name_bg ? attr.name_bg : attr.name
}

function getAttrOptions(attr: CategoryAttribute, locale: string): string[] {
  const options = locale === 'bg' && attr.options_bg ? attr.options_bg : attr.options
  return options || []
}

// =============================================================================
// Main Component
// =============================================================================

export function DesktopFilterModal({ 
  attributes = [], 
  categorySlug,
  className 
}: DesktopFilterModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')
  const locale = useLocale()
  
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Pending filter states
  const [pendingFilters, setPendingFilters] = React.useState<Record<string, string[]>>({})
  const [pendingPrice, setPendingPrice] = React.useState<{ min: string; max: string }>({ min: '', max: '' })
  const [pendingRating, setPendingRating] = React.useState<number | null>(null)
  
  // Filter only filterable attributes
  const filterableAttributes = attributes.filter(attr => attr.is_filterable)
  
  // Build the base path
  const basePath = categorySlug ? pathname : '/search'

  // Current URL values
  const currentMinPrice = searchParams.get('minPrice')
  const currentMaxPrice = searchParams.get('maxPrice')
  const currentRating = searchParams.get('minRating')

  // Get current filter values from URL
  const getCurrentAttrValues = (attrName: string): string[] => {
    return searchParams.getAll(`attr_${attrName}`)
  }

  // Initialize pending state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const initial: Record<string, string[]> = {}
      filterableAttributes.forEach(attr => {
        const values = getCurrentAttrValues(attr.name)
        if (values.length > 0) {
          initial[attr.name] = values
        }
      })
      setPendingFilters(initial)
      setPendingPrice({ min: currentMinPrice || '', max: currentMaxPrice || '' })
      setPendingRating(currentRating ? Number.parseInt(currentRating) : null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    filterableAttributes.forEach(attr => {
      if (getCurrentAttrValues(attr.name).length > 0) count++
    })
    if (currentMinPrice || currentMaxPrice) count++
    if (currentRating) count++
    return count
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filterableAttributes])

  // Handlers
  const handleAttrChange = (attrName: string, values: string[]) => {
    setPendingFilters(prev => ({ ...prev, [attrName]: values }))
  }

  const handleBooleanAttr = (attrName: string, checked: boolean) => {
    setPendingFilters(prev => ({ ...prev, [attrName]: checked ? ['true'] : [] }))
  }

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()
    
    searchParams.forEach((value, key) => {
      if (!key.startsWith('attr_') && !['minPrice', 'maxPrice', 'minRating'].includes(key)) {
        params.append(key, value)
      }
    })
    
    Object.entries(pendingFilters).forEach(([name, values]) => {
      values.forEach(v => params.append(`attr_${name}`, v))
    })
    
    if (pendingPrice.min) params.set('minPrice', pendingPrice.min)
    if (pendingPrice.max) params.set('maxPrice', pendingPrice.max)
    if (pendingRating) params.set('minRating', pendingRating.toString())
    
    const query = params.toString()
    router.push(`${basePath}${query ? `?${query}` : ''}`)
    setIsOpen(false)
  }

  // Clear all
  const clearAll = () => {
    setPendingFilters({})
    setPendingPrice({ min: '', max: '' })
    setPendingRating(null)
  }

  const hasPendingFilters = 
    Object.values(pendingFilters).some(v => v.length > 0) ||
    pendingPrice.min || pendingPrice.max ||
    pendingRating !== null

  const priceRanges = [
    { label: t('under25'), min: '', max: '25' },
    { label: t('range2550'), min: '25', max: '50' },
    { label: t('range50100'), min: '50', max: '100' },
    { label: t('range100200'), min: '100', max: '200' },
    { label: t('above200'), min: '200', max: '' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'h-9 px-4 rounded-full gap-2 bg-secondary/50 hover:bg-secondary',
            activeFilterCount > 0 && 'bg-primary/10 text-primary hover:bg-primary/20',
            className
          )}
        >
          <Sliders size={16} weight="regular" />
          <span>{t('filters')}</span>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="h-5 min-w-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent 
        className="sm:max-w-[900px] h-[85vh] max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden"
        showCloseButton={false}
      >
        <DialogDescription className="sr-only">Filter products by attributes</DialogDescription>
        
        {/* Header - fixed at top with subtle shadow */}
        <div className="flex shrink-0 items-center justify-between px-6 py-5 border-b bg-background">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-primary/10">
              <Sliders size={22} className="text-primary" weight="duotone" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight">{t('filters')}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {locale === 'bg' ? 'Персонализирайте вашето търсене' : 'Customize your search results'}
              </p>
            </div>
          </div>
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-muted"
              aria-label={locale === 'bg' ? 'Затвори филтрите' : 'Close filters'}
            >
              <X size={20} weight="bold" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        {/* Content - scrollable with scroll shadow indicator */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="p-4 space-y-4">
            
            {/* Row 1: Price & Rating - 2 columns 50/50 */}
            <div className="grid grid-cols-2 gap-4">
              {/* Price Card - Compact */}
              <div className="p-4 rounded-md border border-border/50 bg-secondary/20">
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Tag size={15} className="text-primary" weight="duotone" />
                  {t('price')}
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {priceRanges.map(({ label, min, max }) => {
                    const isActive = pendingPrice.min === min && pendingPrice.max === max
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setPendingPrice(isActive ? { min: '', max: '' } : { min, max })}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-background hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                    <Input
                      type="number"
                      placeholder={t('min')}
                      value={pendingPrice.min}
                      onChange={(e) => setPendingPrice(p => ({ ...p, min: e.target.value }))}
                      className="pl-6 h-8 text-sm bg-background border-border/50"
                    />
                  </div>
                  <span className="text-muted-foreground text-sm">–</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                    <Input
                      type="number"
                      placeholder={t('max')}
                      value={pendingPrice.max}
                      onChange={(e) => setPendingPrice(p => ({ ...p, max: e.target.value }))}
                      className="pl-6 h-8 text-sm bg-background border-border/50"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Card - Compact */}
              <div className="p-4 rounded-md border border-border/50 bg-secondary/20">
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Star size={15} className="text-rating" weight="fill" />
                  {t('customerReviews')}
                </h4>
                <div className="grid grid-cols-4 gap-1.5">
                  {[4, 3, 2, 1].map((stars) => {
                    const isActive = pendingRating === stars
                    return (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => setPendingRating(isActive ? null : stars)}
                        className={cn(
                          "flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg transition-all",
                          isActive 
                            ? "bg-accent" 
                            : "bg-background hover:bg-muted text-muted-foreground"
                        )}
                      >
                        <div className="flex">
                          {[...Array(stars)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={10} 
                              weight="fill" 
                              className="text-rating"
                            />
                          ))}
                        </div>
                        <span className="text-2xs font-medium text-muted-foreground">& Up</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Row 3+: Category Attributes - 3 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filterableAttributes.map((attr) => {
                const attrName = getAttrName(attr, locale)
                const options = getAttrOptions(attr, locale)
                const currentValues = pendingFilters[attr.name] || []
                const selectedCount = currentValues.length

                // Boolean filter
                if (attr.attribute_type === 'boolean') {
                  const isChecked = currentValues.includes('true')
                  return (
                    <div key={attr.id} className="p-4 rounded-md border border-border/50 bg-secondary/20">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-semibold">{attrName}</h5>
                        <Switch
                          checked={isChecked}
                          onCheckedChange={(c) => handleBooleanAttr(attr.name, c)}
                        />
                      </div>
                    </div>
                  )
                }

                // Number filter
                if (attr.attribute_type === 'number') {
                  const min = attr.min_value ?? 0
                  const max = attr.max_value ?? 100
                  const value = currentValues[0] ? Number.parseInt(currentValues[0]) : min
                  return (
                    <div key={attr.id} className="p-4 rounded-md border border-border/50 bg-secondary/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-semibold">{attrName}</h5>
                        <span className="text-sm font-bold text-primary">{value}</span>
                      </div>
                      <Slider
                        min={min}
                        max={max}
                        value={[value]}
                        onValueChange={(values) => {
                          const v = values[0]
                          if (v === undefined) return
                          handleAttrChange(attr.name, [v.toString()])
                        }}
                      />
                      <div className="flex justify-between text-2xs text-muted-foreground">
                        <span>{min}</span>
                        <span>{max}</span>
                      </div>
                    </div>
                  )
                }

                // Select/Multiselect - ALL get search now for consistency
                if ((attr.attribute_type === 'select' || attr.attribute_type === 'multiselect') && options.length > 0) {
                  const isSingleSelect = attr.attribute_type === 'select'

                  return (
                    <div key={attr.id} className="p-4 rounded-md border border-border/50 bg-secondary/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-semibold">{attrName}</h5>
                        {selectedCount > 0 && (
                          <Badge className="h-5 min-w-5 px-1.5 text-xs bg-primary">{selectedCount}</Badge>
                        )}
                      </div>
                      
                      {/* Always show search input for consistency */}
                      <FilterSearch
                        options={options}
                        selectedValues={currentValues}
                        onChange={(vals) => handleAttrChange(attr.name, isSingleSelect ? vals.slice(-1) : vals)}
                        placeholder={`${locale === 'bg' ? 'Търси' : 'Search'} ${attrName.toLowerCase()}...`}
                        isSingleSelect={isSingleSelect}
                      />
                    </div>
                  )
                }

                return null
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t bg-background flex items-center justify-between">
          <button
            type="button"
            onClick={clearAll}
            disabled={!hasPendingFilters}
            className={cn(
              "text-sm font-medium transition-colors px-4 py-2 rounded-lg",
              hasPendingFilters 
                ? "text-destructive hover:bg-destructive/10"
                : "text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            {t('clearAllFilters')}
          </button>
          <Button 
            onClick={applyFilters} 
            size="lg"
            className="px-8 rounded-full transition-colors"
          >
            {t('showResults')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}// =============================================================================
// Filter Search Component (for long option lists)
// =============================================================================

function FilterSearch({
  options,
  selectedValues,
  onChange,
  placeholder,
  isSingleSelect
}: {
  options: string[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder: string
  isSingleSelect: boolean
}) {
  const [search, setSearch] = React.useState('')
  const [isExpanded, setIsExpanded] = React.useState(false)

  const filteredOptions = search
    ? options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()))
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
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm bg-muted/50 border-input"
        />
      </div>
      <div className="space-y-1 max-h-[180px] overflow-y-auto">
        {visibleOptions.map((option) => {
          const isChecked = selectedValues.includes(option)
          return (
            <label
              key={option}
              className={cn(
                "flex items-center gap-2.5 py-2 px-2.5 rounded-lg cursor-pointer transition-colors",
                "hover:bg-muted",
                isChecked && "bg-primary/10 hover:bg-primary/15"
              )}
            >
              {isSingleSelect ? (
                <div
                  onClick={() => onChange(isChecked ? [] : [option])}
                  className={cn(
                    "size-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors",
                    isChecked ? "border-primary bg-primary" : "border-border"
                  )}
                >
                  {isChecked && <div className="size-1.5 rounded-full bg-primary-foreground" />}
                </div>
              ) : (
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedValues, option])
                    } else {
                      onChange(selectedValues.filter(v => v !== option))
                    }
                  }}
                  className="size-4"
                />
              )}
              <span className="text-sm flex-1 truncate">{option}</span>
              {isChecked && <Check size={14} className="text-primary shrink-0" />}
            </label>
          )
        })}
        {visibleOptions.length === 0 && (
          <p className="text-sm text-muted-foreground py-3 text-center">No matches found</p>
        )}
      </div>
      {hasMore && !search && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary hover:text-primary/80 font-medium w-full text-center py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-primary/5 transition-colors"
        >
          {isExpanded ? 'Show less' : `Show all ${filteredOptions.length}`}
          <CaretDown size={14} className={cn("transition-transform", isExpanded && "rotate-180")} />
        </button>
      )}
    </div>
  )
}
