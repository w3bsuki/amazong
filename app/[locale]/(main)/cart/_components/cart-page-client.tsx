"use client"

import Image from "next/image"
import { Link, useRouter } from "@/i18n/routing"
import { useCart } from "@/components/providers/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  ShoppingCart,
  Trash,
  Heart,
  SpinnerGap,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ArrowRight,
  Package,
} from "@phosphor-icons/react"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { useTranslations, useLocale } from "next-intl"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { MobileCartHeader } from "./mobile-cart-header"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import { ProductCard } from "@/components/shared/product/product-card"

/**
 * Hook to hide the parent SiteHeader on mobile for this page.
 * Cart page uses its own MobileCartHeader, similar to product pages.
 */
function useHideParentHeaderOnMobile() {
  useEffect(() => {
    // Find the parent header element (SiteHeader is first header in layout)
    const header = document.querySelector('header[data-hydrated]') as HTMLElement | null
    if (!header) return

    // Add class to hide on mobile
    header.classList.add('lg:flex', 'hidden')
    
    return () => {
      // Restore visibility when leaving the page
      header.classList.remove('hidden')
    }
  }, [])
}

export default function CartPageClient() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart()
  const router = useRouter()
  const t = useTranslations("CartPage")
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)
  const { products: recentlyViewed, isLoaded: recentlyViewedLoaded } = useRecentlyViewed()

  // Hide the parent SiteHeader on mobile (cart has its own MobileCartHeader)
  useHideParentHeaderOnMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCheckout = () => {
    if (items.length === 0) return
    router.push("/checkout")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const getProductUrl = (item: (typeof items)[0]) => {
    if (!item.username) return "#"
    return `/${item.username}/${item.slug || item.id}`
  }

  if (!mounted) {
    return (
      <div className="min-h-(--page-section-min-h) flex items-center justify-center">
        <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
          <SpinnerGap className="size-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">
            {locale === "bg" ? "Зареждане на количката..." : "Loading cart..."}
          </p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    const recentItems = recentlyViewed
      .filter((product) => product.username || product.storeSlug)
      .slice(0, 4)

    return (
      <div className="bg-secondary/30 min-h-(--page-section-min-h-lg) pt-14 lg:pt-0">
        {/* Mobile Header - only visible on mobile */}
        <MobileCartHeader />
        
        <div className="container py-6">
          <AppBreadcrumb items={breadcrumbPresets(locale).cart} className="hidden lg:flex" />

          <div className="mt-8 lg:mt-12 max-w-md mx-auto text-center">
            <div className="size-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="size-10 text-muted-foreground/60" weight="duotone" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">{t("emptyTitle")}</h1>
            <p className="text-muted-foreground mb-8">{t("emptyDescription")}</p>
            <div className="flex flex-col gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full h-12 font-medium"
              >
                <Link href="/">
                  {t("continueShopping")}
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full h-12">
                <Link href="/todays-deals">{t("viewDeals")}</Link>
              </Button>
            </div>
          </div>

          {recentlyViewedLoaded && recentItems.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                {t("recentlyViewedTitle")}
              </h2>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {recentItems.map((product) => (
                  <ProductCard
                    key={`recent-${product.id}`}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    image={product.image || "/placeholder.svg"}
                    slug={product.slug}
                    username={product.username ?? product.storeSlug ?? null}
                    showQuickAdd={false}
                    showSeller={false}
                    showWishlist={false}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-secondary/30 min-h-screen pb-32 pt-14 lg:pb-12 lg:pt-0">
      {/* Mobile Header - only visible on mobile */}
      <MobileCartHeader />
      
      <div className="container py-4 lg:py-6">
        <AppBreadcrumb items={breadcrumbPresets(locale).cart} className="hidden lg:flex" />

        <div className="mt-4 mb-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold">{t("title")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {totalItems}{" "}
              {totalItems === 1
                ? locale === "bg"
                  ? "артикул"
                  : "item"
                : locale === "bg"
                  ? "артикула"
                  : "items"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, index) => (
              <div 
                key={`${item.id}:${item.variantId ?? ""}`} 
                className="bg-card rounded-lg border border-border/50 p-3"
              >
                <div className="flex gap-3">
                  {/* Image */}
                  <Link
                    href={getProductUrl(item)}
                    className="relative shrink-0 size-20 bg-white rounded-md overflow-hidden border border-border/50"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-1.5"
                        sizes="80px"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-muted-foreground">
                        <Package size={28} weight="duotone" />
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    {/* Title */}
                    <Link
                      href={getProductUrl(item)}
                      className="font-medium hover:text-brand transition-colors line-clamp-2 text-sm leading-snug pr-6"
                    >
                      {item.title}
                    </Link>
                    
                    {/* Stock badge */}
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="size-3 text-brand-success" weight="fill" />
                      <span className="text-2xs text-brand-success">{t("inStock")}</span>
                    </div>

                    {/* Price */}
                    <p className="text-base font-bold mt-auto pt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Right side: Delete + Quantity + Wishlist */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item.id, item.variantId)}
                      className="size-7 flex items-center justify-center rounded text-muted-foreground/50 hover:text-destructive transition-colors"
                      aria-label={t("delete")}
                    >
                      <Trash className="size-4" />
                    </button>

                    {/* Quantity selector */}
                    <div className="flex items-center h-8 rounded-md border border-border bg-muted/30">
                      <button
                        onClick={() =>
                          item.quantity > 1 && updateQuantity(item.id, item.quantity - 1, item.variantId)
                        }
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-colors rounded-l-md"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" weight="bold" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                        disabled={item.quantity >= 10}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-colors rounded-r-md"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" weight="bold" />
                      </button>
                    </div>

                    {/* Wishlist */}
                    <button
                      className="size-7 flex items-center justify-center rounded text-muted-foreground/50 hover:text-brand transition-colors"
                      aria-label={t("saveForLater")}
                    >
                      <Heart className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-lg mb-4">
                    {locale === "bg" ? "Обобщение" : "Order Summary"}
                  </h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("subtotalCount", { count: totalItems })}
                      </span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{locale === "bg" ? "Доставка" : "Shipping"}</span>
                      <span className="text-brand-success font-medium">
                        {locale === "bg" ? "Безплатно" : "FREE"}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between mb-6">
                    <span className="font-semibold">{locale === "bg" ? "Общо" : "Total"}</span>
                    <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    size="lg"
                    className="w-full rounded-full h-12 font-semibold shadow-sm"
                  >
                    {t("proceedToCheckout")}
                    <ArrowRight className="size-4 ml-2" />
                  </Button>

                  <div className="mt-6 pt-4 border-t border-border space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="size-4 text-brand-success" weight="fill" />
                      <span>{locale === "bg" ? "Сигурно плащане" : "Secure checkout"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="size-4 text-brand" weight="fill" />
                      <span>{locale === "bg" ? "30-дневно връщане" : "30-day returns"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t border-border z-40 lg:hidden pb-safe">
        <div className="px-4 py-3 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">
              {locale === "bg" ? "Общо" : "Total"}
            </p>
            <p className="text-lg font-bold leading-none">{formatPrice(subtotal)}</p>
          </div>
          <Button
            onClick={handleCheckout}
            size="lg"
            className="rounded-full px-8 font-semibold shadow-sm h-11"
          >
            {locale === "bg" ? "Плащане" : "Checkout"}
            <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
