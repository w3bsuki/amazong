import { cn } from "@/lib/utils"

interface ItemSpecificsProps {
  attributes: Record<string, any> | any[] | null
  condition?: string
  categoryName?: string
  parentCategoryName?: string
  className?: string
}

export function ItemSpecifics({ attributes, condition, categoryName, parentCategoryName, className }: ItemSpecificsProps) {
  
  let dynamicSpecs: { label: string; value: string }[] = [];

  if (Array.isArray(attributes)) {
    dynamicSpecs = attributes.map((attr: any) => ({
      label: attr.name || "Unknown",
      value: String(attr.value || "")
    }));
  } else if (attributes && typeof attributes === 'object') {
    dynamicSpecs = Object.entries(attributes).map(([key, value]) => ({
      label: key.replaceAll('_', " ").replaceAll(/\b\w/g, l => l.toUpperCase()),
      value: String(value)
    }));
  }

  // Combine standard fields with dynamic attributes - avoid duplicate "Condition"
  const hasConditionInAttributes = dynamicSpecs.some(spec => 
    spec.label.toLowerCase() === "condition"
  );

  const allSpecs = [
    // Only add Condition if not already in attributes
    ...(!hasConditionInAttributes && condition ? [{ label: "Condition", value: condition }] : []),
    ...(parentCategoryName ? [{ label: "Department", value: parentCategoryName }] : []),
    ...(categoryName ? [{ label: "Category", value: categoryName }] : []),
    ...dynamicSpecs
  ]

  if (allSpecs.length === 0) return null

  return (
    <div className={cn("", className)}>
      {/* Single column layout for better readability in buy box */}
      <div className="flex flex-col gap-y-2 text-sm">
        {allSpecs.map((spec, idx) => (
          <div key={`${spec.label}-${idx}`} className="flex items-baseline gap-2">
            <span className="text-muted-foreground w-28 shrink-0">{spec.label}</span>
            <span className="font-medium text-foreground">: {spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
