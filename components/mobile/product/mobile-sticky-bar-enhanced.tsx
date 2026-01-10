"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
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
  currency = "EUR",
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
    <footer className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/60 pb-safe z-50 lg:hidden">
      <div className="flex items-center gap-2 px-4 py-2">
        {/* Wishlist Button - 42px touch target */}
        <button
          type="button"
          onClick={handleWishlist}
          className="shrink-0 w-11 h-11 flex items-center justify-center rounded border border-input bg-background active:bg-muted"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            weight={inWishlist ? "fill" : "regular"} 
            className={`size-5 ${inWishlist ? "text-product-wishlist-active" : "text-muted-foreground"}`} 
          />
        </button>

        {/* Add to Cart - Secondary CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded border border-input bg-background text-foreground font-bold text-sm active:bg-muted disabled:opacity-50"
        >
          <ShoppingCart className="size-4" weight="bold" />
          <span>{t("addToCart")}</span>
        </button>

        {/* Buy Now - Primary CTA (Treido black) */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 h-11 flex items-center justify-center rounded bg-foreground text-background font-bold text-sm active:opacity-90 disabled:opacity-50"
        >
          {isOutOfStock
            ? locale === "bg"
              ? "Изчерпано"
              : "Sold Out"
            : t("buyNow")}
        </button>
      </div>
    </footer>
  );
}
