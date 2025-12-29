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
      color: "text-[var(--color-verified)]",
      bgColor: "bg-[var(--color-verified)]/10",
    },
    {
      icon: RotateCcw,
      label: t.returns,
      desc: freeReturns ? (locale === "bg" ? "Безплатно" : "Free") : t.returnsDesc,
      color: "text-[var(--color-success)]",
      bgColor: "bg-[var(--color-success)]/10",
    },
    {
      icon: Truck,
      label: t.shipping,
      desc: freeShipping ? t.shippingDescFree : t.shippingDescStd,
      color: freeShipping ? "text-[var(--color-shipping-free)]" : "text-muted-foreground",
      bgColor: freeShipping ? "bg-[var(--color-shipping-free)]/10" : "bg-muted",
    },
    {
      icon: Lock,
      label: t.securePayment,
      desc: t.securePaymentDesc,
      color: "text-[var(--color-info)]",
      bgColor: "bg-[var(--color-info)]/10",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 py-4 px-3 bg-gradient-to-b from-muted/50 to-muted/20 rounded-xl mx-4 my-3 border border-border/40">
      {trustItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center gap-1.5"
        >
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bgColor)}>
            <item.icon className={cn("w-5 h-5", item.color)} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-foreground leading-tight">
              {item.label}
            </span>
            <span className="text-[9px] text-muted-foreground leading-tight font-medium">
              {item.desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
