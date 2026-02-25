import type { ReactNode } from "react"
import { FieldDescription, FieldLabel } from "@/components/shared/field"
import { cn } from "@/lib/utils"

interface SellFieldSectionHeaderProps {
  compact: boolean
  label: string
  description?: string
  icon?: ReactNode
  sectionClassName?: string
  rowClassName?: string
  iconWrapClassName?: string
  labelClassName?: string
  descriptionClassName?: string
  compactLabelClassName?: string
}

export function SellFieldSectionHeader({
  compact,
  label,
  description,
  icon,
  sectionClassName,
  rowClassName,
  iconWrapClassName,
  labelClassName,
  descriptionClassName,
  compactLabelClassName,
}: SellFieldSectionHeaderProps) {
  if (compact) {
    return null
  }

  return (
    <div className={sectionClassName}>
      <div className={cn("flex items-center gap-3", rowClassName)}>
        {icon ? (
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg bg-surface-subtle",
              iconWrapClassName
            )}
          >
            {icon}
          </div>
        ) : null}
        <div>
          <FieldLabel className={cn("text-sm font-semibold text-foreground", labelClassName)}>
            {label}
          </FieldLabel>
          {description ? (
            <FieldDescription className={cn("text-xs text-muted-foreground mt-0.5", descriptionClassName)}>
              {description}
            </FieldDescription>
          ) : null}
        </div>
      </div>
    </div>
  )
}
