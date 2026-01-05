"use client";

import { ArrowLeft, Search, Share2, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/**
 * Demo Header
 * 
 * IMPROVEMENT: Back button uses router.back() instead of always going to "/"
 * - Better UX for users coming from search/category pages
 * - Preserves scroll position and filters
 */
export function DemoHeader() {
  const locale = useLocale();
  const router = useRouter();

  const labels = {
    back: locale === "bg" ? "Назад" : "Go back",
    search: locale === "bg" ? "Търсене" : "Search",
    share: locale === "bg" ? "Сподели" : "Share",
    cart: locale === "bg" ? "Количка" : "Cart",
    wishlist: locale === "bg" ? "Любими" : "Wishlist",
  };

  const handleBack = () => {
    // Use history.back() if there's history, otherwise go home
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-60 h-12 bg-brand flex items-center justify-between px-2 lg:hidden">
      {/* Back button - uses router.back() */}
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center justify-center size-10 rounded-full text-header-text hover:bg-header-hover active:bg-header-active transition-colors"
        aria-label={labels.back}
        title={labels.back}
      >
        <ArrowLeft className="size-6" aria-hidden="true" />
      </button>

      {/* Demo badge */}
      <Badge variant="secondary" className="bg-white/20 text-white border-none text-xs">
        DEMO
      </Badge>

      {/* Action buttons */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-10 rounded-full text-header-text hover:bg-header-hover"
          aria-label={labels.share}
          title={labels.share}
          onClick={handleShare}
        >
          <Share2 className="size-5" aria-hidden="true" />
        </Button>
        <Link
          href="/cart"
          className="relative flex items-center justify-center size-10 rounded-full text-header-text hover:bg-header-hover active:bg-header-active transition-colors"
          aria-label={labels.cart}
          title={labels.cart}
        >
          <ShoppingCart className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
