"use client"

import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Truck, Lightning, Airplane, Check } from "@phosphor-icons/react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ShippingMethod } from "./checkout-types"

interface DesktopShippingSectionProps {
  shippingMethod: ShippingMethod
  setShippingMethod: (method: ShippingMethod) => void
  formatPrice: (price: number) => string
}

export function DesktopShippingSection({
  shippingMethod,
  setShippingMethod,
  formatPrice,
}: DesktopShippingSectionProps) {
  const t = useTranslations("CheckoutPage")
  const options = [
    { 
      id: "standard" as const, 
      label: t("standardShipping"), 
      days: t("standardDays"), 
      price: 0, 
      icon: Truck,
      description: t("standardDescription") || "Reliable delivery within 5-7 business days"
    },
    { 
      id: "express" as const, 
      label: t("expressShipping"), 
      days: t("expressDays"), 
      price: 9.99, 
      icon: Lightning,
      description: t("expressDescription") || "Fast delivery within 2-3 business days"
    },
    { 
      id: "overnight" as const, 
      label: t("overnightShipping"), 
      days: t("overnightDays"), 
      price: 19.99, 
      icon: Airplane,
      description: t("overnightDescription") || "Next business day delivery"
    },
  ]

  return (
    <RadioGroup 
      value={shippingMethod} 
      onValueChange={(v) => setShippingMethod(v as ShippingMethod)} 
      className="space-y-3"
    >
      {options.map((opt) => {
        const Icon = opt.icon
        const isSelected = shippingMethod === opt.id
        
        return (
          <label
            key={opt.id}
            htmlFor={`shipping-${opt.id}`}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
              isSelected
                ? "border-selected-border bg-selected"
                : "border-border hover:border-hover-border"
            )}
          >
            <RadioGroupItem value={opt.id} id={`shipping-${opt.id}`} className="shrink-0" />
            
            <div className={cn(
              "size-10 rounded-full flex items-center justify-center shrink-0",
              isSelected ? "bg-selected" : "bg-muted"
            )}>
              <Icon 
                className={cn("size-5", isSelected ? "text-primary" : "text-muted-foreground")} 
                weight={isSelected ? "fill" : "regular"} 
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{opt.label}</span>
                {opt.price === 0 && (
                  <span className="text-xs font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
                    {t("free")}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{opt.days}</p>
            </div>
            
            <div className="text-right shrink-0">
              <span className={cn(
                "text-base font-semibold",
                opt.price === 0 ? "text-success" : "text-foreground"
              )}>
                {opt.price === 0 ? t("free") : formatPrice(opt.price)}
              </span>
            </div>
            
            {isSelected && (
              <Check className="size-5 text-primary shrink-0" weight="bold" />
            )}
          </label>
        )
      })}
    </RadioGroup>
  )
}
