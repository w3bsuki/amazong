"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Link, useRouter } from "@/i18n/routing"
import { useCart } from "@/components/providers/cart-context"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
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
import { AppBreadcrumb, breadcrumbPresets } from "@/components/shared/navigation/app-breadcrumb"
import { useTranslations, useLocale } from "next-intl"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import { ProductCard } from "@/components/shared/product/product-card"
import { PageShell } from "@/components/shared/page-shell"
import { useHeaderOptional } from "@/components/providers/header-context"

/** Timeout to show cart content even if auth hasn't finished (ms) */
const CART_READY_TIMEOUT = 3000

export default function CartPageClient() {
  const { items, isReady, removeFromCart, updateQuantity, subtotal, totalItems } = useCart()
  const router = useRouter()
  const t = useTranslations("CartPage")
  const tCartDropdown = useTranslations("CartDropdown")
  const tBreadcrumbs = useTranslations("Breadcrumbs")
  const locale = useLocale()
  const { products: recentlyViewed, isLoaded: recentlyViewedLoaded } = useRecentlyViewed()
  const header = useHeaderOptional()
  
  // Timeout fallback: show cart after 3s even if auth hasn't settled
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    if (isReady) return // Already ready, no timeout needed
    const timer = setTimeout(() => setTimedOut(true), CART_READY_TIMEOUT)
    return () => clearTimeout(timer)
  }, [isReady])

  useEffect(() => {
    if (!header) return
    header.setHomepageHeader(null)
    header.setContextualHeader(null)
    header.setProductHeader(null)
  }, [header])
  
  // Cart is "effectively ready" if either fully ready or timed out
  const effectivelyReady = isReady || timedOut

  const handleCheckout = () => {
    if (items.length === 0) return
    router.push("/checkout")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const getProductUrl = (item: (typeof items)[0]) => {
    const sellerSlug = item.username ?? item.storeSlug
    if (!sellerSlug) return "#"
    return `/${sellerSlug}/${item.slug ?? item.id}`
  }

  // Show loading spinner only while waiting (max 3s)
  if (!effectivelyReady) {
    return (
      <div className="bg-secondary/30 min-h-(--page-section-min-h-lg) pt-14 lg:pt-0">
        <div className="container py-6 flex items-center justify-center">
          <SpinnerGap className="size-5 animate-spin text-muted-foreground" />
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
        <div className="container py-6">
          <AppBreadcrumb
            items={breadcrumbPresets(tBreadcrumbs).cart}
            ariaLabel={tBreadcrumbs("ariaLabel")}
            homeLabel={tBreadcrumbs("homeLabel")}
            className="hidden lg:flex"
          />

          <div className="mt-8 lg:mt-12 max-w-md mx-auto text-center">
            <div className="size-24 bg-surface-subtle rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="size-10 text-muted-foreground" weight="duotone" />
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
    <PageShell variant="muted" className="pb-32 pt-14 lg:pb-12 lg:pt-0">
      <div className="container py-4 lg:py-6">
        <AppBreadcrumb
          items={breadcrumbPresets(tBreadcrumbs).cart}
          ariaLabel={tBreadcrumbs("ariaLabel")}
          homeLabel={tBreadcrumbs("homeLabel")}
          className="hidden lg:flex"
        />

        <div className="mt-4 mb-6 flex items-baseline justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold">{t("title")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {totalItems} {tCartDropdown(totalItems === 1 ? "item" : "items")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, index) => (
              <div 
                key={`${item.id}:${item.variantId ?? ""}`} 
                className="bg-card rounded-lg border border-border/50 p-2.5"
              >
                <div className="flex gap-3">
                  {/* Image */}
                  <Link
                    href={getProductUrl(item)}
                    className="relative shrink-0 size-20 bg-background rounded-md overflow-hidden border border-border/50"
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
                      className="font-medium hover:text-primary transition-colors line-clamp-2 text-sm leading-snug pr-6"
                    >
                      {item.title}
                    </Link>
                    
                    {/* Stock badge */}
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="size-3 text-success" weight="fill" />
                      <span className="text-2xs text-success">{t("inStock")}</span>
                    </div>

                    {/* Price */}
                    <p className="text-base font-bold mt-auto pt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Right side: Delete + Quantity + Wishlist */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    {/* Delete */}
                    <IconButton
                      onClick={() => removeFromCart(item.id, item.variantId)}
                      size="icon-lg"
                      variant="ghost"
                      className="hover:bg-destructive-subtle text-muted-foreground hover:text-destructive"
                      aria-label={t("delete")}
                    >
                      <Trash className="size-4" />
                    </IconButton>

                    {/* Quantity selector */}
                    <div className="flex items-center h-touch-lg rounded-xl border border-border bg-surface-subtle overflow-hidden">
                      <IconButton
                        size="icon-lg"
                        variant="ghost"
                        onClick={() =>
                          item.quantity > 1 && updateQuantity(item.id, item.quantity - 1, item.variantId)
                        }
                        disabled={item.quantity <= 1}
                        className="rounded-none border-r border-border hover:bg-muted disabled:opacity-30"
                        aria-label={tCartDropdown("decreaseQuantity")}
                      >
                        <Minus className="size-3.5" weight="bold" />
                      </IconButton>
                      <span className="min-w-touch text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                      <IconButton
                        size="icon-lg"
                        variant="ghost"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                        disabled={item.quantity >= 10}
                        className="rounded-none border-l border-border hover:bg-muted disabled:opacity-30"
                        aria-label={tCartDropdown("increaseQuantity")}
                      >
                        <Plus className="size-3.5" weight="bold" />
                      </IconButton>
                    </div>

                    {/* Wishlist */}
                    <IconButton
                      size="icon-lg"
                      variant="ghost"
                      className="hover:bg-muted text-muted-foreground hover:text-primary"
                      aria-label={t("saveForLater")}
                    >
                      <Heart className="size-4" />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <Card className="border-border-subtle">
                <CardContent className="p-5">
                  <h2 className="font-semibold text-lg mb-4">
                    {t("orderSummaryTitle")}
                  </h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("subtotalCount", { count: totalItems })}
                      </span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("shippingLabel")}</span>
                      <span className="text-success font-medium">
                        {t("freeLabel")}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between mb-6">
                    <span className="font-semibold">{t("totalLabel")}</span>
                    <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    variant="cta"
                    size="lg"
                    className="w-full rounded-full h-12 font-semibold shadow-sm"
                  >
                    {t("proceedToCheckout")}
                    <ArrowRight className="size-4 ml-2" />
                  </Button>

                  <div className="mt-6 pt-4 border-t border-border space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="size-4 text-success" weight="fill" />
                      <span>{t("secureCheckout")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="size-4 text-primary" weight="fill" />
                      <span>{t("returns30Day")}</span>
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
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">
              {t("totalLabel")}
            </p>
            <p className="text-lg font-bold leading-none">{formatPrice(subtotal)}</p>
          </div>
          <Button
            onClick={handleCheckout}
            variant="cta"
            size="lg"
            className="rounded-full px-8 font-semibold shadow-sm"
          >
            {t("checkout")}
            <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
