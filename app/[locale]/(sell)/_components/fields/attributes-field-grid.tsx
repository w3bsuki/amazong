import type { ProductAttribute } from "@/lib/sell/schema"
import { AttributeFieldItem } from "./attributes-field-input"
import type { CategoryAttribute } from "./attributes-field.types"

interface AttributesFieldGridProps {
  attrs: CategoryAttribute[]
  attributes: ProductAttribute[]
  compact: boolean
  locale: string
  isBg: boolean
  defaultRequired: boolean
  onAttributeChange: (attr: CategoryAttribute, value: string) => void
}

export function AttributesFieldGrid({
  attrs,
  attributes,
  compact,
  locale,
  isBg,
  defaultRequired,
  onAttributeChange,
}: AttributesFieldGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {attrs.map((attr) => {
        const currentValue = attributes.find((entry) => entry.attributeId === attr.id)?.value || ""
        const required = defaultRequired || attr.is_required
        return (
          <AttributeFieldItem
            key={attr.id}
            attr={attr}
            value={currentValue}
            compact={compact}
            locale={locale}
            isBg={isBg}
            required={required}
            showLabel={!compact}
            onChange={(value) => onAttributeChange(attr, value)}
          />
        )
      })}
    </div>
  )
}
