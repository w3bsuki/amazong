"use client";

import { ShieldCheck, RotateCcw, Truck, CreditCard, BadgeCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileTrustBlockProps {
  locale?: string;
  verifiedSeller?: boolean;
  freeShipping?: boolean;
  freeReturns?: boolean;
}

export function MobileTrustBlock({
  locale = "en",
  verifiedSeller,
  freeShipping,
  freeReturns,
}: MobileTrustBlockProps) {
  const t = {
    buyerProtection: locale === "bg" ? "Защита" : "Protected",
    buyerProtectionDesc: locale === "bg" ? "Пари назад" : "Money back",
    returns: locale === "bg" ? "Връщане" : "Returns",
    returnsDesc: locale === "bg" ? "30 дни" : "30 days",
    shipping: locale === "bg" ? "Доставка" : "Shipping",
    shippingDescFree: locale === "bg" ? "Безплатна" : "Free",
    shippingDescStd: locale === "bg" ? "Проследяване" : "Tracked",
    securePayment: locale === "bg" ? "Плащане" : "Payment",
    securePaymentDesc: locale === "bg" ? "Сигурно" : "Secure",
  };

  const trustItems = [
    {
      icon: ShieldCheck,
      label: t.buyerProtection,
      desc: t.buyerProtectionDesc,
      color: "text-verified",
      bgColor: "bg-verified/10",
    },
    {
      icon: RotateCcw,
      label: t.returns,
      desc: freeReturns ? (locale === "bg" ? "Безплатно" : "Free") : t.returnsDesc,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Truck,
      label: t.shipping,
      desc: freeShipping ? t.shippingDescFree : t.shippingDescStd,
      color: freeShipping ? "text-shipping-free" : "text-muted-foreground",
      bgColor: freeShipping ? "bg-shipping-free/10" : "bg-muted",
    },
    {
      icon: Lock,
      label: t.securePayment,
      desc: t.securePaymentDesc,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 py-3 px-3 bg-muted/30 rounded-lg mx-4 my-2 border border-border/50">
      {trustItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center gap-1"
        >
          {/* Icon container: 32px (h-8) secondary touch target */}
          <div className={cn("size-8 rounded-lg flex items-center justify-center", item.bgColor)}>
            <item.icon className={cn("size-4", item.color)} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xs font-semibold text-foreground leading-tight">
              {item.label}
            </span>
            <span className="text-2xs text-muted-foreground leading-tight">
              {item.desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
