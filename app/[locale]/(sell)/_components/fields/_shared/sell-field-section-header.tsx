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
    return (
      <div className="hidden">
        <FieldLabel
          className={cn(
            "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block",
            compactLabelClassName
          )}
        >
          {label}
        </FieldLabel>
      </div>
    )
  }

  return (
    <div className={sectionClassName}>
      <div className={cn("flex items-center gap-3.5", rowClassName)}>
        {icon ? (
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs",
              iconWrapClassName
            )}
          >
            {icon}
          </div>
        ) : null}
        <div>
          <FieldLabel className={cn("text-sm font-bold tracking-tight text-foreground", labelClassName)}>
            {label}
          </FieldLabel>
          {description ? (
            <FieldDescription className={cn("text-xs font-medium text-muted-foreground mt-0.5", descriptionClassName)}>
              {description}
            </FieldDescription>
          ) : null}
        </div>
      </div>
    </div>
  )
}
