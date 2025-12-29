"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/common/wishlist/wishlist-button";
import { useCart } from "@/components/providers/cart-context";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MobileStickyBarEnhancedProps {
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
  isOutOfStock?: boolean;
}

export function MobileStickyBarEnhanced({
  product,
  price,
  currency = "BGN",
  isFreeShipping = false,
  isOutOfStock = false,
}: MobileStickyBarEnhancedProps) {
  const locale = useLocale();
  const t = useTranslations("Product");
  const { addToCart } = useCart();
  const router = useRouter();

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    addToCart({
      id: product.id,
      title: product.title,
      price: Number(price ?? 0),
      image: product.image,
      quantity: 1,
      slug: product.slug,
      username: product.username,
      storeSlug: product.username,
    });
    toast.success(t("addedToCart"));
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    
    addToCart({
      id: product.id,
      title: product.title,
      price: Number(price ?? 0),
      image: product.image,
      quantity: 1,
      slug: product.slug,
      username: product.username,
      storeSlug: product.username,
    });
    router.push("/cart");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:hidden">
      <div className="flex items-center gap-2 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {/* Wishlist Button */}
        <WishlistButton
          product={{
            id: product.id,
            title: product.title,
            price: Number(price ?? 0),
            image: product.image,
          }}
          variant="icon"
          className="shrink-0 border-2 border-border h-12 w-12 rounded-xl text-muted-foreground hover:bg-muted active:bg-muted/80 transition-all active:scale-95"
        />

        {/* Price + CTA Buttons */}
        <div className="flex flex-col flex-1 gap-1.5">
          {/* Price Row - Show price in sticky bar for easy reference */}
          <div className="flex items-center justify-between px-1">
            <span className="text-lg font-extrabold text-foreground">
              {formattedPrice}
            </span>
            {isFreeShipping && (
              <span className="text-[10px] font-bold text-[var(--color-shipping-free)] uppercase tracking-wide">
                {locale === "bg" ? "Безплатна доставка" : "Free Shipping"}
              </span>
            )}
          </div>

          {/* Buttons Row */}
          <div className="flex gap-2">
            {/* Add to Cart - Secondary */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={cn(
                "flex-1 h-12 rounded-xl font-bold text-sm border-2 border-border bg-background",
                "hover:bg-muted active:bg-muted/80 text-foreground transition-all active:scale-[0.98]",
                isOutOfStock && "opacity-50 cursor-not-allowed"
              )}
            >
              {t("addToCart")}
            </Button>

            {/* Buy Now - Primary with gradient */}
            <Button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={cn(
                "flex-1 h-12 rounded-xl font-bold text-sm",
                "bg-gradient-to-r from-[var(--color-cta-trust-blue)] to-[var(--color-brand)]",
                "hover:from-[var(--color-cta-trust-blue-hover)] hover:to-[var(--color-brand-dark)]",
                "text-white border-none transition-all shadow-lg shadow-[var(--color-brand)]/25",
                "active:scale-[0.98]",
                isOutOfStock && "opacity-50 cursor-not-allowed from-muted to-muted shadow-none"
              )}
            >
              {isOutOfStock ? (locale === "bg" ? "Изчерпано" : "Out of Stock") : t("buyNow")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
