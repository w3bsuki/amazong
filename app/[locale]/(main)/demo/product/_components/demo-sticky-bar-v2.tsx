"use client";

import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface DemoStickyBarV2Props {
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
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (qty: number) => void;
}

/**
 * Demo Sticky Bar V2
 * 
 * IMPROVEMENT: Replaced dual CTAs with quantity stepper + single "Buy Now" CTA
 * - More intuitive for users who want multiple items
 * - Cleaner UI with single primary action
 * - Quantity visible without opening cart
 */
export function DemoStickyBarV2({
  product,
  variantId,
  variantName,
  price,
  currency = "BGN",
  isOutOfStock = false,
  quantity,
  maxQuantity,
  onQuantityChange,
}: DemoStickyBarV2Props) {
  const locale = useLocale();

  const t = {
    buyNow: locale === "bg" ? "Купи сега" : "Buy Now",
    addToCart: locale === "bg" ? "Добави" : "Add to Cart",
    soldOut: locale === "bg" ? "Изчерпано" : "Sold Out",
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(p);

  const handleDecrease = () => {
    if (quantity > 1) onQuantityChange(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) onQuantityChange(quantity + 1);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    toast.success(
      locale === "bg"
        ? `${quantity}x ${product.title.slice(0, 30)}... добавени в количката`
        : `${quantity}x ${product.title.slice(0, 30)}... added to cart`
    );
  };

  const handleWishlist = () => {
    toast.success(locale === "bg" ? "Добавено в любими" : "Added to wishlist");
  };

  const totalPrice = price * quantity;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background lg:hidden">
      <div className="flex items-center gap-2 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {/* Wishlist button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleWishlist}
          className="shrink-0 size-10 rounded-full border border-border"
          aria-label="Add to wishlist"
        >
          <Heart className="size-5 text-muted-foreground" />
        </Button>

        {/* Quantity stepper (NEW) */}
        <div className="flex items-center border border-border rounded-full h-10 bg-muted/30">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDecrease}
            disabled={quantity <= 1 || isOutOfStock}
            className="size-10 rounded-full hover:bg-muted disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-8 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleIncrease}
            disabled={quantity >= maxQuantity || isOutOfStock}
            className="size-10 rounded-full hover:bg-muted disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {/* Buy Now CTA with total price */}
        <Button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 h-10 px-4 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full gap-2"
        >
          {isOutOfStock ? (
            t.soldOut
          ) : (
            <>
              <span>{t.buyNow}</span>
              <span className="opacity-90">·</span>
              <span>{formatPrice(totalPrice)}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
