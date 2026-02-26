"use client"


import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { CartItem } from "@/components/providers/cart-context";
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url";

interface OrderItemsSectionProps {
  items: CartItem[];
  formatPrice: (price: number) => string;
}

function OrderItemThumb({
  src,
  alt,
  size,
}: {
  src?: string | null;
  alt: string;
  size: number;
}) {
  const [resolvedSrc, setResolvedSrc] = useState(() => normalizeImageUrl(src));

  useEffect(() => {
    setResolvedSrc(normalizeImageUrl(src));
  }, [src]);

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      className="size-full object-contain"
      onError={() => {
        if (resolvedSrc !== PLACEHOLDER_IMAGE_PATH) {
          setResolvedSrc(PLACEHOLDER_IMAGE_PATH);
        }
      }}
    />
  );
}

export function OrderItemsSection({ items, formatPrice }: OrderItemsSectionProps) {
  const t = useTranslations("CheckoutPage");

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex -space-x-1.5">
        {items.slice(0, 4).map((item, i) => (
          <div
            key={`${item.id}-${item.variantId ?? "base"}-${i}`}
            className="size-9 rounded border-2 border-card bg-muted overflow-hidden shrink-0"
            style={{ zIndex: 4 - i }}
          >
            <OrderItemThumb src={item.image} alt={item.title} size={36} />
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
      {items.map((item, index) => (
        <div key={`${item.id}-${item.variantId ?? "base"}-${index}`} className="flex gap-3">
          <div className="size-14 rounded border border-border bg-muted overflow-hidden shrink-0">
            <OrderItemThumb src={item.image} alt={item.title} size={56} />
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
