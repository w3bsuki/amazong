"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "@phosphor-icons/react";
import { useCart } from "@/components/providers/cart-context";
import { useWishlist } from "@/components/providers/wishlist-context";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

interface MobileStickyBarEnhancedProps {
  product: {
    id: string;
    title: string;
    image: string;
    slug?: string;
    username?: string;
  };
  variantId?: string;
  variantName?: string;
  price: number;
  originalPrice?: number | null;
  currency?: string;
  isOutOfStock?: boolean;
}

/**
 * MobileStickyBarEnhanced - Bottom sticky buy bar
 * 
 * Layout: [♡] [Price] [Add to Cart] [Buy Now]
 * Per DESIGN.md: 40px max CTA height, safe area padding
 */
export function MobileStickyBarEnhanced({
  product,
  variantId,
  variantName,
  price,
  originalPrice,
  currency = "BGN",
  isOutOfStock = false,
}: MobileStickyBarEnhancedProps) {
  const locale = useLocale();
  const t = useTranslations("Product");
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const router = useRouter();

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = originalPrice && originalPrice > price;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(p);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      id: product.id,
      ...(variantId ? { variantId } : {}),
      ...(variantName ? { variantName } : {}),
      title: product.title,
      price: Number(price ?? 0),
      image: product.image,
      quantity: 1,
      ...(product.slug ? { slug: product.slug } : {}),
      ...(product.username ? { username: product.username, storeSlug: product.username } : {}),
    });
    toast.success(t("addedToCart"));
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart({
      id: product.id,
      ...(variantId ? { variantId } : {}),
      ...(variantName ? { variantName } : {}),
      title: product.title,
      price: Number(price ?? 0),
      image: product.image,
      quantity: 1,
      ...(product.slug ? { slug: product.slug } : {}),
      ...(product.username ? { username: product.username, storeSlug: product.username } : {}),
    });
    router.push("/cart");
  };

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      title: product.title,
      price: Number(price ?? 0),
      image: product.image,
    });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background shadow-[0_-2px_10px_rgba(0,0,0,0.08)] lg:hidden">
      <div className="flex items-center gap-2 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {/* Wishlist Button - 40px touch target */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleWishlist}
          className="shrink-0 size-10 rounded-full border border-border"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            weight={inWishlist ? "fill" : "regular"} 
            className={`size-6 ${inWishlist ? "text-red-500" : "text-muted-foreground"}`} 
          />
        </Button>

        {/* Add to Cart - Secondary CTA */}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 h-10 px-3 text-sm font-semibold gap-2 border border-primary text-primary hover:bg-primary/5 rounded-full"
        >
          <ShoppingCart className="size-5" weight="bold" />
          <span>{t("addToCart")}</span>
        </Button>

        {/* Buy Now - Primary CTA */}
        <Button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 h-10 px-3 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
        >
          {isOutOfStock
            ? locale === "bg"
              ? "Изчерпано"
              : "Sold Out"
            : t("buyNow")}
        </Button>
      </div>
    </div>
  );
}
