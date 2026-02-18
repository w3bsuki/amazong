import { useMemo, useState } from "react"
import { ChevronRight as CaretRight } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { SelectDrawer } from "../ui/select-drawer"
import type { CategoryAttribute } from "./attributes-field.types"

interface AttributeFieldInputProps {
  attr: CategoryAttribute
  value: string
  compact: boolean
  locale: string
  isBg: boolean
  required: boolean
  onChange: (value: string) => void
}

export function AttributeFieldInput({
  attr,
  value,
  compact,
  locale,
  isBg,
  required,
  onChange,
}: AttributeFieldInputProps) {
  const tSell = useTranslations("Sell")
  const [isOpen, setIsOpen] = useState(false)

  const label = isBg && attr.name_bg ? attr.name_bg : attr.name
  const placeholder = (isBg && attr.placeholder_bg ? attr.placeholder_bg : attr.placeholder) ||
    tSell("fields.attributes.placeholders.enterWithLabel", { label })
  const isSelect = attr.attribute_type === "select" && !!attr.options?.length
  const normalizedOptions = useMemo(() => {
    if (!attr.options?.length) return []
    return attr.options.map((opt, index) => ({
      value: opt,
      label: (isBg && attr.options_bg?.[index]) ? attr.options_bg[index] : opt,
    }))
  }, [attr.options, attr.options_bg, isBg])
  const displayValue = value
    ? normalizedOptions.find((option) => option.value === value)?.label || value
    : null

  if (isSelect && attr.options) {
    if (compact) {
      return (
        <>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative w-full flex items-center h-12 px-4 rounded-md border border-border bg-background hover:border-hover-border transition-colors text-left shadow-xs"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                {label}:
              </span>
              <span className={cn(
                "text-sm font-semibold truncate",
                displayValue ? "text-foreground" : "text-muted-foreground"
              )}>
                {displayValue || tSell("fields.attributes.placeholders.selectEllipsis")}
              </span>
            </div>
            <CaretRight className="size-4 text-muted-foreground shrink-0 ml-2" />
          </button>
          <SelectDrawer
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={label}
            options={attr.options}
            {...(attr.options_bg ? { optionsBg: attr.options_bg } : {})}
            value={value}
            onChange={onChange}
            locale={locale}
          />
        </>
      )
    }

    return (
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger className="w-full h-(--control-primary) rounded-md border-border font-medium">
          <SelectValue placeholder={tSell("fields.attributes.placeholders.selectEllipsis")} />
        </SelectTrigger>
        <SelectContent>
          {normalizedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="font-medium">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className={cn(
      "relative flex items-center h-12 px-4 rounded-md border transition-colors",
      "bg-background border-border shadow-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring"
    )}>
      <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2">
        {label}:
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={attr.attribute_type === "number" ? "number" : "text"}
        className="h-auto p-0 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-semibold flex-1 min-w-0"
      />
    </div>
  )
}

interface AttributeFieldItemProps extends AttributeFieldInputProps {
  showLabel: boolean
}

export function AttributeFieldItem({
  attr,
  showLabel,
  required,
  ...inputProps
}: AttributeFieldItemProps) {
  const label = inputProps.isBg && attr.name_bg ? attr.name_bg : attr.name

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <AttributeFieldInput
        attr={attr}
        required={required}
        {...inputProps}
      />
    </div>
  )
}
