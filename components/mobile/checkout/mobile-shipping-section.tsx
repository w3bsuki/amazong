"use client"

import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Truck, Lightning, Airplane, Check } from "@phosphor-icons/react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ShippingMethod } from "@/components/desktop/checkout/checkout-types"

interface MobileShippingSectionProps {
  shippingMethod: ShippingMethod
  setShippingMethod: (method: ShippingMethod) => void
  formatPrice: (price: number) => string
}

export function MobileShippingSection({
  shippingMethod,
  setShippingMethod,
  formatPrice,
}: MobileShippingSectionProps) {
  const t = useTranslations("CheckoutPage")
  const options = [
    { 
      id: "standard" as const, 
      label: t("standardShipping"), 
      days: t("standardDays"), 
      price: 0, 
      icon: Truck 
    },
    { 
      id: "express" as const, 
      label: t("expressShipping"), 
      days: t("expressDays"), 
      price: 9.99, 
      icon: Lightning 
    },
    { 
      id: "overnight" as const, 
      label: t("overnightShipping"), 
      days: t("overnightDays"), 
      price: 19.99, 
      icon: Airplane 
    },
  ]

  return (
    <RadioGroup 
      value={shippingMethod} 
      onValueChange={(v) => setShippingMethod(v as ShippingMethod)} 
      className="space-y-2"
    >
      {options.map((opt) => {
        const Icon = opt.icon
        const isSelected = shippingMethod === opt.id
        
        return (
          <label
            key={opt.id}
            htmlFor={`m-shipping-${opt.id}`}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            <RadioGroupItem value={opt.id} id={`m-shipping-${opt.id}`} className="shrink-0" />
            
            <Icon 
              className={cn("size-5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} 
              weight={isSelected ? "fill" : "regular"} 
            />
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.days}</p>
            </div>
            
            <span className={cn(
              "text-sm font-semibold shrink-0",
              opt.price === 0 ? "text-success" : ""
            )}>
              {opt.price === 0 ? t("free") : formatPrice(opt.price)}
            </span>
            
            {isSelected && (
              <Check className="size-4 text-primary shrink-0" weight="bold" />
            )}
          </label>
        )
      })}
    </RadioGroup>
  )
}
