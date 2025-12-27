"use client";

import { Heart } from "lucide-react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

interface MobileStickyBarProps {
  price: number;
  currency?: string;
  isFreeShipping?: boolean;
}

export function MobileStickyBar({ price, currency = "USD", isFreeShipping = false }: MobileStickyBarProps) {
  const locale = useLocale();
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="flex gap-3 items-center max-w-md mx-auto">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 border-border h-11 w-11 rounded-full text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
        >
          <Heart className="h-5 w-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-foreground truncate">{formattedPrice}</div>
          {isFreeShipping ? (
            <div className="text-[10px] font-bold uppercase tracking-wide text-success">
              Free shipping
            </div>
          ) : null}
        </div>

        <Button className="h-11 px-5 rounded-full font-bold text-sm uppercase tracking-wide">
          Add to cart
        </Button>
      </div>
    </div>
  );
}
