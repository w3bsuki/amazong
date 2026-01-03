import { ShieldCheck, RotateCcw, Truck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileTrustBlockProps {
  locale?: string;
  verifiedSeller?: boolean;
  freeShipping?: boolean;
  freeReturns?: boolean;
}

/**
 * MobileTrustBlock - Trust signals row
 * 
 * Uses neutral backgrounds with colored icons for proper contrast
 * per WCAG 2.2 AA (avoiding blue-on-blue, green-on-green patterns)
 */
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
      iconColor: "text-verified",
    },
    {
      icon: RotateCcw,
      label: t.returns,
      desc: freeReturns ? (locale === "bg" ? "Безплатно" : "Free") : t.returnsDesc,
      iconColor: "text-success",
    },
    {
      icon: Truck,
      label: t.shipping,
      desc: freeShipping ? t.shippingDescFree : t.shippingDescStd,
      iconColor: freeShipping ? "text-shipping-free" : "text-muted-foreground",
    },
    {
      icon: Lock,
      label: t.securePayment,
      desc: t.securePaymentDesc,
      iconColor: "text-info",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 py-2.5 px-3 bg-muted/30 rounded-md border border-border/50">
      {trustItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center gap-1"
        >
          {/* Icon container: neutral bg with colored icon for proper contrast */}
          <div className="size-8 rounded-md bg-muted flex items-center justify-center">
            <item.icon className={cn("size-4", item.iconColor)} />
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
