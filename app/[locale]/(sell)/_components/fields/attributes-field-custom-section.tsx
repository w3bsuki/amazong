import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import type { ProductAttribute } from "@/lib/sell/schema"

interface AttributesCustomSectionProps {
  customAttrs: ProductAttribute[]
  newAttrName: string
  newAttrValue: string
  onNameChange: (value: string) => void
  onValueChange: (value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

export function AttributesCustomSection({
  customAttrs,
  newAttrName,
  newAttrValue,
  onNameChange,
  onValueChange,
  onAdd,
  onRemove,
}: AttributesCustomSectionProps) {
  const tSell = useTranslations("Sell")

  return (
    <div className="space-y-4 pt-4 border-t border-border-subtle">
      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {tSell("fields.attributes.custom.title")}
      </Label>

      {customAttrs.length > 0 && (
        <div className="grid gap-2">
          {customAttrs.map((attr, index) => (
            <div key={`${attr.name}-${index}`} className="flex items-center gap-3 rounded-md border border-border bg-surface-subtle p-3">
              <div className="min-w-0 flex-1 flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0">{attr.name}:</span>
                <span className="truncate text-sm font-bold text-foreground">{attr.value}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-destructive-subtle text-muted-foreground hover:text-destructive transition-colors"
                aria-label={tSell("fields.attributes.custom.removeAriaLabel")}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 p-4 rounded-md bg-surface-subtle border border-dashed border-border">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
              {tSell("fields.attributes.custom.nameLabel")}
            </Label>
            <Input
              value={newAttrName}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={tSell("fields.attributes.custom.namePlaceholder")}
              className="h-10 rounded-lg border-border font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
              {tSell("fields.attributes.custom.valueLabel")}
            </Label>
            <Input
              value={newAttrValue}
              onChange={(event) => onValueChange(event.target.value)}
              placeholder={tSell("fields.attributes.custom.valuePlaceholder")}
              className="h-10 rounded-lg border-border font-medium text-sm"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          disabled={!newAttrName.trim() || !newAttrValue.trim()}
          className="h-10 rounded-md border-selected-border text-primary font-bold text-xs uppercase tracking-widest hover:bg-hover active:bg-active"
        >
          <Plus className="size-3.5 mr-2" />
          {tSell("fields.attributes.custom.addButton")}
        </Button>
      </div>
    </div>
  )
}
