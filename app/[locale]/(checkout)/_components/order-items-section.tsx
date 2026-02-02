"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { CartItem } from "@/components/providers/cart-context";

interface OrderItemsSectionProps {
  items: CartItem[];
  formatPrice: (price: number) => string;
}

export function OrderItemsSection({ items, formatPrice }: OrderItemsSectionProps) {
  const t = useTranslations("CheckoutPage");

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex -space-x-1.5">
        {items.slice(0, 4).map((item, i) => (
          <div
            key={item.id}
            className="size-9 rounded border-2 border-card bg-muted overflow-hidden shrink-0"
            style={{ zIndex: 4 - i }}
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              width={36}
              height={36}
              className="size-full object-contain"
            />
          </div>
        ))}
        {items.length > 4 && (
          <div className="size-9 rounded border-2 border-card bg-muted flex items-center justify-center text-2xs font-medium text-muted-foreground">
            +{items.length - 4}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {items.length === 1 && items[0] ? (
          <p className="text-sm line-clamp-1">{items[0].title}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {items.length} {t("items")}
          </p>
        )}
      </div>
      <p className="text-sm font-semibold">
        {formatPrice(items.reduce((sum, i) => sum + i.price * i.quantity, 0))}
      </p>
    </div>
  );
}

export function OrderItemsSectionDesktop({ items, formatPrice }: OrderItemsSectionProps) {
  const t = useTranslations("CheckoutPage");

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex gap-3">
          <div className="size-14 rounded border border-border bg-muted overflow-hidden shrink-0">
            <Image src={item.image || "/placeholder.svg"} alt={item.title} width={56} height={56} className="size-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm line-clamp-1 font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">
              {t("qty")}: {item.quantity}
            </p>
          </div>
          <p className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
        </div>
      ))}
    </div>
  );
}

export type { OrderItemsSectionProps };

