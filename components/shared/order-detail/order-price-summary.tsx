import type { ReactNode } from "react"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface OrderPriceSummaryRowsProps {
  subtotalLabel: string
  subtotalValue: string
  shippingLabel: string
  shippingValue: string
  totalLabel: string
  totalValue: string
  className?: string | undefined
  rowClassName?: string | undefined
  subtotalSlot?: ReactNode | undefined
  shippingSlot?: ReactNode | undefined
  totalSlot?: ReactNode | undefined
}

export function OrderPriceSummaryRows({
  subtotalLabel,
  subtotalValue,
  shippingLabel,
  shippingValue,
  totalLabel,
  totalValue,
  className,
  rowClassName,
  subtotalSlot,
  shippingSlot,
  totalSlot,
}: OrderPriceSummaryRowsProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn("flex justify-between text-sm", rowClassName)}>
        <span className="text-muted-foreground">{subtotalLabel}</span>
        {subtotalSlot || <span>{subtotalValue}</span>}
      </div>
      <div className={cn("flex justify-between text-sm", rowClassName)}>
        <span className="text-muted-foreground">{shippingLabel}</span>
        {shippingSlot || <span>{shippingValue}</span>}
      </div>
      <Separator />
      <div className={cn("flex justify-between font-medium", rowClassName)}>
        <span>{totalLabel}</span>
        {totalSlot || <span>{totalValue}</span>}
      </div>
    </div>
  )
}
