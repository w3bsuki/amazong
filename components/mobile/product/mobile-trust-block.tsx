import { ShieldCheck, RotateCcw, Truck, Lock } from "lucide-react";

interface MobileTrustBlockProps {
  locale?: string;
  verifiedSeller?: boolean;
  freeShipping?: boolean;
  freeReturns?: boolean;
}

/**
 * MobileTrustBlock - Clean inline trust indicators
 * 
 * Design principles:
 * - Single consistent icon color (muted-foreground)
 * - No colored icon circus
 * - Horizontal strip instead of cramped grid
 * - Larger text for readability
 */
export function MobileTrustBlock({
  locale = "en",
  freeShipping,
  freeReturns,
}: MobileTrustBlockProps) {
  const t = {
    protection: locale === "bg" ? "Защита на купувача" : "Buyer Protection",
    returns: locale === "bg" ? "30 дни връщане" : "30-day Returns",
    shipping: freeShipping 
      ? (locale === "bg" ? "Безплатна доставка" : "Free Shipping")
      : (locale === "bg" ? "Проследяване" : "Tracked Shipping"),
    payment: locale === "bg" ? "Сигурно плащане" : "Secure Payment",
  };

  const trustItems = [
    { icon: ShieldCheck, label: t.protection },
    { icon: RotateCcw, label: t.returns },
    { icon: Truck, label: t.shipping },
    { icon: Lock, label: t.payment },
  ];

  return (
    <div className="flex items-center justify-between py-3 px-3 gap-2">
      {trustItems.map((item, index) => (
        <div key={index} className="flex flex-col items-center text-center gap-1 flex-1">
          <div className="size-9 rounded-lg bg-muted/50 flex items-center justify-center">
            <item.icon className="size-4 text-muted-foreground" />
          </div>
          <span className="text-2xs font-medium text-foreground leading-tight">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
