"use client"

import { User, Storefront, Check } from "@/lib/icons/phosphor"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type AccountType = "personal" | "business"

interface AccountTypeCardProps {
  type: AccountType
  selected: boolean
  onSelect: (type: AccountType) => void
  title: string
  description: string
}

export function AccountTypeCard({
  type,
  selected,
  onSelect,
  title,
  description,
}: AccountTypeCardProps) {
  const Icon = type === "personal" ? User : Storefront

  return (
    <Card
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={() => onSelect(type)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(type)
        }
      }}
      className={cn(
        "relative cursor-pointer transition-all duration-200",
        "hover:border-hover-border",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected && "border-primary bg-selected shadow-sm"
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              "flex-shrink-0 size-12 rounded-xl flex items-center justify-center transition-colors",
              selected 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-foreground"
            )}
          >
            <Icon className="size-6" weight={selected ? "fill" : "duotone"} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>

          {/* Selection Indicator */}
          <div
            className={cn(
              "flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all",
              selected
                ? "border-primary bg-primary"
                : "border-input bg-background"
            )}
          >
            {selected && <Check className="size-3.5 text-primary-foreground" weight="bold" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
