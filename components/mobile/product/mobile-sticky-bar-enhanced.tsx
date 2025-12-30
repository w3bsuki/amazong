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
  price: number;
  isOutOfStock?: boolean;
}

export function MobileStickyBarEnhanced({
  product,
  price,
  isOutOfStock = false,
}: MobileStickyBarEnhancedProps) {
  const locale = useLocale();
  const t = useTranslations("Product");
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const router = useRouter();

  const inWishlist = isInWishlist(product.id);

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

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      title: product.title,
      price: Number(price ?? 0),
      image: product.image,
    });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background lg:hidden">
      <div className="flex items-center gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* Wishlist - 32px (h-8) compact touch target */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleWishlist}
          className="shrink-0 h-8 w-8"
        >
          <Heart weight={inWishlist ? "fill" : "regular"} className={`size-4 ${inWishlist ? "text-red-500" : ""}`} />
        </Button>

        {/* Add to Cart - 40px (h-10) primary CTA max */}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 h-10 text-sm font-medium gap-1.5"
        >
          <ShoppingCart className="size-4" />
          <span className="truncate">{t("addToCart")}</span>
        </Button>

        {/* Buy Now - 40px (h-10) primary CTA max */}
        <Button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 h-10 text-sm font-semibold bg-primary text-primary-foreground"
        >
          {isOutOfStock
            ? locale === "bg"
              ? "Изчерпано"
              : "Out of Stock"
            : t("buyNow")}
        </Button>
      </div>
    </div>
  );
}
