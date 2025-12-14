"use client"

import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns"
import { DateRange } from "react-day-picker"
import {
  IconCalendar,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  className?: string
  defaultPreset?: string
  onDateRangeChange?: (range: { from: Date; to: Date } | undefined) => void
}

type PresetKey = "today" | "yesterday" | "7days" | "30days" | "90days" | "thisMonth" | "lastMonth" | "thisWeek" | "custom"

interface DatePreset {
  label: string
  value: PresetKey
  getRange: () => DateRange
}

const presets: DatePreset[] = [
  {
    label: "Today",
    value: "today",
    getRange: () => ({ from: new Date(), to: new Date() }),
  },
  {
    label: "Yesterday",
    value: "yesterday",
    getRange: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }),
  },
  {
    label: "Last 7 days",
    value: "7days",
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() }),
  },
  {
    label: "Last 30 days",
    value: "30days",
    getRange: () => ({ from: subDays(new Date(), 29), to: new Date() }),
  },
  {
    label: "Last 90 days",
    value: "90days",
    getRange: () => ({ from: subDays(new Date(), 89), to: new Date() }),
  },
  {
    label: "This week",
    value: "thisWeek",
    getRange: () => ({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) }),
  },
  {
    label: "This month",
    value: "thisMonth",
    getRange: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
  },
  {
    label: "Last month",
    value: "lastMonth",
    getRange: () => {
      const lastMonth = subDays(startOfMonth(new Date()), 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    },
  },
]

export function BusinessDateRangePicker({
  className,
  defaultPreset = "30days",
  onDateRangeChange,
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = React.useState<PresetKey>(defaultPreset as PresetKey)
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const preset = presets.find(p => p.value === defaultPreset)
    return preset?.getRange()
  })
  const [isCustom, setIsCustom] = React.useState(false)

  const handlePresetChange = (value: string) => {
    const preset = presets.find(p => p.value === value)
    if (preset) {
      setSelectedPreset(value as PresetKey)
      setIsCustom(false)
      const range = preset.getRange()
      setDate(range)
      onDateRangeChange?.(range as { from: Date; to: Date })
    }
  }

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    setIsCustom(true)
    setSelectedPreset("custom")
    if (newDate?.from && newDate?.to) {
      onDateRangeChange?.(newDate as { from: Date; to: Date })
    }
  }

  const getDisplayText = () => {
    if (isCustom && date?.from) {
      if (date.to) {
        return `${format(date.from, "MMM d")} - ${format(date.to, "MMM d, yyyy")}`
      }
      return format(date.from, "MMM d, yyyy")
    }
    const preset = presets.find(p => p.value === selectedPreset)
    return preset?.label || "Select period"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Preset Quick Select */}
      <Select value={selectedPreset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value} className="text-xs">
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Custom Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 justify-start text-left font-normal text-xs",
              !date && "text-muted-foreground"
            )}
          >
            <IconCalendar className="mr-1.5 size-3.5" />
            {getDisplayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
