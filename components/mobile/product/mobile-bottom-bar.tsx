"use client";

import { MessageCircle } from "lucide-react";
import { useCart } from "@/components/providers/cart-context";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface MobileBottomBarProps {
  /**
   * Product data for add-to-cart functionality
   */
  product: {
    id: string;
    title: string;
    image: string;
    slug?: string;
    username?: string;
  };
  /**
   * Variant ID if a specific variant is selected
   */
  variantId?: string;
  /**
   * Variant name for display/cart purposes
   */
  variantName?: string;
  /**
   * Display price (after variant adjustments)
   */
  price: number;
  /**
   * Whether the item is out of stock
   */
  isOutOfStock?: boolean;
  /**
   * Seller username for chat navigation
   */
  sellerUsername?: string;
}

/**
 * MobileBottomBar - OLX/Treido-style two-button bottom bar
 * 
 * Design reference:
 * ```
 * ┌────────────────────────────────────────────────┐
 * │  [○ Чат]              [████ Купи сега ████]    │
 * └────────────────────────────────────────────────┘
 * ```
 * 
 * Layout:
 * - Two buttons only: Chat (outline) + Buy Now (solid amber)
 * - Compact height (~44px buttons)
 * - Safe area padding at bottom for iOS notch devices
 * 
 * Behavior:
 * - Chat: Opens chat with seller (future: direct message)
 * - Buy Now: Adds to cart + navigates to cart for checkout
 */
export function MobileBottomBar({
  product,
  variantId,
  variantName,
  price,
  isOutOfStock = false,
  sellerUsername,
}: MobileBottomBarProps) {
  const t = useTranslations("Product");
  const { addToCart } = useCart();
  const router = useRouter();

  const chatText = t("chat");
  const buyNowText = t("buyNow");
  const soldOutText = t("outOfStock");
  const addedToCartText = t("addedToCart");

  /**
   * Handle chat button click
   * - For now: navigate to seller profile or show toast
   * - Future: open direct messaging
   */
  const handleChat = () => {
    if (sellerUsername) {
      // Navigate to seller profile for now
      // TODO: Implement direct chat when messaging is ready
      router.push(`/${sellerUsername}`);
    }
  };

  /**
   * Handle Buy Now - add to cart and navigate to cart
   */
  const handleBuyNow = () => {
    if (isOutOfStock) return;

    // Add item to cart
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

    // Show confirmation toast
    toast.success(addedToCartText);

    // Navigate to cart for checkout
    router.push("/cart");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background lg:hidden">
      <div className="flex items-center gap-2 px-4 py-2 pb-safe-max-xs">
        {/* Chat Button - treido-mock: border-gray-300 */}
        <button
          type="button"
          onClick={handleChat}
          className="flex-1 h-[42px] flex items-center justify-center gap-2 rounded border border-input bg-background text-foreground font-bold text-sm active:bg-muted transition-colors"
        >
          <MessageCircle className="size-4" strokeWidth={1.5} />
          {chatText}
        </button>

        {/* Buy Now Button - treido-mock: bg-gray-900 text-white */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 h-[42px] flex items-center justify-center rounded bg-foreground text-background font-bold text-sm active:opacity-90 transition-opacity disabled:bg-muted disabled:text-muted-foreground"
        >
          {isOutOfStock ? soldOutText : buyNowText}
        </button>
      </div>
    </div>
  );
}
