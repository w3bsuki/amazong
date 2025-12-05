'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible'
import { CaretDown, Check } from '@phosphor-icons/react'
import type { CategoryAttribute } from '@/lib/data/categories'

// =============================================================================
// Types
// =============================================================================

interface AttributeFiltersProps {
  attributes: CategoryAttribute[]
  searchParams?: Record<string, string | string[]>
  locale: string
  className?: string
}

interface FilterSectionProps {
  attribute: CategoryAttribute
  currentValue: string[]
  onChange: (value: string | string[]) => void
  locale: string
}

// =============================================================================
// Helper Functions
// =============================================================================

function getAttributeName(attr: CategoryAttribute, locale: string): string {
  return locale === 'bg' && attr.name_bg ? attr.name_bg : attr.name
}

function getAttributeOptions(attr: CategoryAttribute, locale: string): string[] {
  const options = locale === 'bg' && attr.options_bg ? attr.options_bg : attr.options
  return options || []
}

// =============================================================================
// Filter Section Components
// =============================================================================

function SelectFilter({ 
  attribute, 
  currentValue, 
  onChange, 
  locale 
}: FilterSectionProps) {
  const options = getAttributeOptions(attribute, locale)
  const selected = currentValue[0] || ''

  return (
    <RadioGroup
      value={selected}
      onValueChange={onChange}
      className="space-y-1"
    >
      {options.map((opt, i) => (
        <div 
          key={i} 
          className={cn(
            'flex items-center gap-2.5 rounded-sm px-1 py-1.5 -mx-1',
            'hover:bg-sidebar-accent/50 transition-colors duration-150',
            'cursor-pointer'
          )}
        >
          <RadioGroupItem 
            value={opt} 
            id={`${attribute.id}-${i}`}
            className="size-4 border-muted-foreground data-[state=checked]:border-sidebar-primary data-[state=checked]:text-sidebar-primary"
          />
          <Label 
            htmlFor={`${attribute.id}-${i}`}
            className="flex-1 cursor-pointer text-sm leading-none"
          >
            {opt}
          </Label>
          {selected === opt && (
            <Check size={14} weight="bold" className="text-sidebar-primary shrink-0" />
          )}
        </div>
      ))}
    </RadioGroup>
  )
}

function MultiselectFilter({ 
  attribute, 
  currentValue, 
  onChange, 
  locale 
}: FilterSectionProps) {
  const options = getAttributeOptions(attribute, locale)

  const handleChange = (opt: string, checked: boolean) => {
    const newValue = checked
      ? [...currentValue, opt]
      : currentValue.filter((v) => v !== opt)
    onChange(newValue)
  }

  return (
    <div className="space-y-1">
      {options.map((opt, i) => {
        const isChecked = currentValue.includes(opt)
        return (
          <div 
            key={i}
            className={cn(
              'flex items-center gap-2.5 rounded-sm px-1 py-1.5 -mx-1',
              'hover:bg-sidebar-accent/50 transition-colors duration-150',
              'cursor-pointer'
            )}
          >
            <Checkbox
              id={`${attribute.id}-${i}`}
              checked={isChecked}
              onCheckedChange={(checked) => handleChange(opt, !!checked)}
              className="size-4 border-muted-foreground data-[state=checked]:bg-sidebar-primary data-[state=checked]:border-sidebar-primary"
            />
            <Label 
              htmlFor={`${attribute.id}-${i}`}
              className="flex-1 cursor-pointer text-sm leading-none"
            >
              {opt}
            </Label>
            {isChecked && (
              <Check size={14} weight="bold" className="text-sidebar-primary shrink-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}

function BooleanFilter({ 
  attribute, 
  currentValue, 
  onChange, 
  locale 
}: FilterSectionProps) {
  const name = getAttributeName(attribute, locale)
  const isChecked = currentValue[0] === 'true'

  return (
    <div className={cn(
      'flex items-center justify-between rounded-sm px-1 py-2 -mx-1',
      'hover:bg-sidebar-accent/50 transition-colors duration-150'
    )}>
      <Label 
        htmlFor={`${attribute.id}-toggle`}
        className="cursor-pointer text-sm"
      >
        {name}
      </Label>
      <Switch
        id={`${attribute.id}-toggle`}
        checked={isChecked}
        onCheckedChange={(checked) => onChange(checked ? 'true' : '')}
        className="data-[state=checked]:bg-sidebar-primary"
      />
    </div>
  )
}

function NumberFilter({ 
  attribute, 
  currentValue, 
  onChange, 
  locale: _locale 
}: FilterSectionProps) {
  const min = attribute.min_value ?? 0
  const max = attribute.max_value ?? 100
  const value = parseInt(currentValue[0]) || min

  const [localValue, setLocalValue] = React.useState(value)

  // Debounce URL updates
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue.toString())
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [localValue, value, onChange])

  return (
    <div className="space-y-3 px-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{min}</span>
        <span className="font-medium tabular-nums">{localValue}</span>
        <span className="text-muted-foreground">{max}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[localValue]}
        onValueChange={([v]) => setLocalValue(v)}
        className="**:data-[slot=slider-thumb]:border-sidebar-primary **:data-[slot=slider-range]:bg-sidebar-primary"
      />
    </div>
  )
}

// =============================================================================
// Collapsible Filter Section
// =============================================================================

function FilterSection({ 
  attribute, 
  currentValue, 
  onChange, 
  locale 
}: FilterSectionProps) {
  const name = getAttributeName(attribute, locale)
  const [isOpen, setIsOpen] = React.useState(true)
  const hasActiveFilter = currentValue.length > 0

  // Render the appropriate filter type
  const renderFilter = () => {
    switch (attribute.attribute_type) {
      case 'select':
        return (
          <SelectFilter
            attribute={attribute}
            currentValue={currentValue}
            onChange={onChange}
            locale={locale}
          />
        )
      case 'multiselect':
        return (
          <MultiselectFilter
            attribute={attribute}
            currentValue={currentValue}
            onChange={onChange}
            locale={locale}
          />
        )
      case 'boolean':
        return (
          <BooleanFilter
            attribute={attribute}
            currentValue={currentValue}
            onChange={onChange}
            locale={locale}
          />
        )
      case 'number':
        return (
          <NumberFilter
            attribute={attribute}
            currentValue={currentValue}
            onChange={onChange}
            locale={locale}
          />
        )
      default:
        return null
    }
  }

  // Boolean type doesn't need collapsible wrapper
  if (attribute.attribute_type === 'boolean') {
    return renderFilter()
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className={cn(
        'flex w-full items-center justify-between',
        'rounded-sm px-1 py-1.5 -mx-1',
        'text-sm font-medium',
        'hover:bg-sidebar-accent/50 transition-colors duration-150',
        hasActiveFilter && 'text-sidebar-primary'
      )}>
        <span className="flex items-center gap-1.5">
          {name}
          {hasActiveFilter && (
            <span className={cn(
              'inline-flex size-4 items-center justify-center',
              'rounded-full bg-sidebar-primary text-[10px] font-semibold',
              'text-sidebar-primary-foreground'
            )}>
              {currentValue.length}
            </span>
          )}
        </span>
        <CaretDown 
          size={14} 
          weight="bold" 
          className={cn(
            'text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1">
        {renderFilter()}
      </CollapsibleContent>
    </Collapsible>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function AttributeFilters({
  attributes,
  searchParams = {},
  locale,
  className,
}: AttributeFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Get current filter values from URL params
  const getFilterValues = React.useCallback((attrName: string): string[] => {
    const paramKey = `attr_${attrName}`
    const value = searchParams[paramKey]
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }, [searchParams])

  // Update URL with new filter value
  const updateFilter = React.useCallback((attrName: string, value: string | string[]) => {
    const params = new URLSearchParams()
    
    // Copy existing non-attribute params
    Object.entries(searchParams).forEach(([key, val]) => {
      if (!key.startsWith('attr_')) {
        if (Array.isArray(val)) {
          val.forEach((v) => params.append(key, v))
        } else {
          params.set(key, val)
        }
      }
    })

    // Set new attribute value
    const paramKey = `attr_${attrName}`
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) params.append(paramKey, v)
      })
    } else if (value) {
      params.set(paramKey, value)
    }

    // Copy other attribute params
    Object.entries(searchParams).forEach(([key, val]) => {
      if (key.startsWith('attr_') && key !== paramKey) {
        if (Array.isArray(val)) {
          val.forEach((v) => params.append(key, v))
        } else {
          params.set(key, val)
        }
      }
    })

    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
  }, [router, pathname, searchParams])

  if (attributes.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      {attributes.map((attr) => (
        <FilterSection
          key={attr.id}
          attribute={attr}
          currentValue={getFilterValues(attr.name)}
          onChange={(value) => updateFilter(attr.name, value)}
          locale={locale}
        />
      ))}
    </div>
  )
}
