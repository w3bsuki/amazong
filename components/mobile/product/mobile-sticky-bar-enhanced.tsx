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
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 lg:hidden">
      <div className="flex items-center gap-2 px-4 py-2">
        {/* Wishlist Button - 42px touch target */}
        <button
          type="button"
          onClick={handleWishlist}
          className="shrink-0 w-[42px] h-[42px] flex items-center justify-center rounded border border-gray-300 bg-white active:bg-gray-50"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            weight={inWishlist ? "fill" : "regular"} 
            className={`size-5 ${inWishlist ? "text-red-500" : "text-gray-600"}`} 
          />
        </button>

        {/* Add to Cart - Secondary CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 h-[42px] flex items-center justify-center gap-2 rounded border border-gray-300 bg-white text-gray-900 font-bold text-[14px] active:bg-gray-50 disabled:opacity-50"
        >
          <ShoppingCart className="w-4.5 h-4.5 stroke-[1.5]" weight="bold" />
          <span>{t("addToCart")}</span>
        </button>

        {/* Buy Now - Primary CTA (Treido black) */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 h-[42px] flex items-center justify-center rounded bg-gray-900 text-white font-bold text-[14px] active:opacity-90 disabled:opacity-50"
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
