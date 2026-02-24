import { useTranslations } from "next-intl";
import { Plane as Airplane, Zap as Lightning, Truck } from "lucide-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { isShippingMethod, SHIPPING_COSTS, type ShippingMethod } from "./checkout-types";

interface ShippingMethodSectionProps {
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;
  formatPrice: (price: number) => string;
  compact?: boolean;
}

export function ShippingMethodSection({
  shippingMethod,
  setShippingMethod,
  formatPrice,
  compact,
}: ShippingMethodSectionProps) {
  const t = useTranslations("CheckoutPage");

  const options = [
    {
      id: "standard" as const,
      label: t("standardShipping"),
      days: t("standardDays"),
      price: SHIPPING_COSTS.standard,
      icon: Truck,
    },
    {
      id: "express" as const,
      label: t("expressShipping"),
      days: t("expressDays"),
      price: SHIPPING_COSTS.express,
      icon: Lightning,
    },
    {
      id: "overnight" as const,
      label: t("overnightShipping"),
      days: t("overnightDays"),
      price: SHIPPING_COSTS.overnight,
      icon: Airplane,
    },
  ];

  if (compact) {
    return (
      <RadioGroup
        value={shippingMethod}
        onValueChange={(value) => {
          if (isShippingMethod(value)) {
            setShippingMethod(value)
          }
        }}
        className="space-y-2"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = shippingMethod === opt.id;
          return (
            <label
              key={opt.id}
              htmlFor={`shipping-${opt.id}`}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background",
                isSelected ? "border-selected-border bg-selected" : "border-border hover:border-hover-border"
              )}
            >
              <RadioGroupItem value={opt.id} id={`shipping-${opt.id}`} className="shrink-0" />
              <Icon
                className={cn("size-5", isSelected ? "text-primary" : "text-muted-foreground")}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.days}</p>
              </div>
              <span className={cn("text-sm font-semibold", opt.price === 0 ? "text-success" : "")}>
                {opt.price === 0 ? t("free") : formatPrice(opt.price)}
              </span>
            </label>
          );
        })}
      </RadioGroup>
    );
  }

  return (
    <RadioGroup
      value={shippingMethod}
      onValueChange={(value) => {
        if (isShippingMethod(value)) {
          setShippingMethod(value)
        }
      }}
      className="space-y-2"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        return (
          <label
            key={opt.id}
            htmlFor={opt.id}
            className={cn(
              "flex items-center justify-between p-2.5 border rounded-md cursor-pointer transition-colors",
              shippingMethod === opt.id ? "border-selected-border bg-selected" : "border-border hover:border-hover-border"
            )}
          >
            <div className="flex items-center gap-2.5">
              <RadioGroupItem value={opt.id} id={opt.id} />
              <Icon className={cn("size-4", shippingMethod === opt.id ? "text-primary" : "text-muted-foreground")} />
              <div>
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.days}</div>
              </div>
            </div>
            <span className={cn("text-sm font-medium", opt.price === 0 ? "text-success" : "")}>
              {opt.price === 0 ? t("free") : formatPrice(opt.price)}
            </span>
          </label>
        );
      })}
    </RadioGroup>
  );
}

export type { ShippingMethodSectionProps };


