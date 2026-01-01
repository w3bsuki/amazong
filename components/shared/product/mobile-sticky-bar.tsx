"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/common/wishlist/wishlist-button";
import { useCart } from "@/components/providers/cart-context";
import { toast } from "sonner";

interface MobileStickyBarProps {
  product: {
    id: string;
    title: string;
    image: string;
    slug?: string;
    username?: string;
  };
  price: number;
  currency?: string;
  isFreeShipping?: boolean;
}

export function MobileStickyBar({ product, price, currency = "USD", isFreeShipping = false }: MobileStickyBarProps) {
  const locale = useLocale();
  const t = useTranslations("Product");
  const { addToCart } = useCart();
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: Number(price ?? 0),
      image: product.image,
      quantity: 1,
      ...(product.slug ? { slug: product.slug } : {}),
      ...(product.username ? { username: product.username, storeSlug: product.username } : {}),
    });
    toast.success(t("addedToCart"));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="flex gap-3 items-center w-full">
        <WishlistButton
          product={{
            id: product.id,
            title: product.title,
            price: Number(price ?? 0),
            image: product.image,
          }}
          variant="icon"
          className="shrink-0 border border-border h-10 w-10 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        />

        <div className="flex flex-1 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddToCart}
            className="flex-1 h-10 rounded-md font-semibold text-sm border-border bg-background hover:bg-muted text-foreground"
          >
            {t("addToCart")}
          </Button>
          
          <Button
            type="button"
            className="flex-1 h-10 rounded-md font-bold text-sm bg-[var(--color-cta-trust-blue)] hover:bg-[var(--color-cta-trust-blue-hover)] text-[var(--color-cta-trust-blue-text)] border-none"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
