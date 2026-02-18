"use client"

import { useEffect, useState } from "react"
import { LoaderCircle as SpinnerGap } from "lucide-react";

import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { useCart } from "@/components/providers/cart-context"
import { PageShell } from "../../../_components/page-shell"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import { useHeaderOptional } from "@/components/providers/header-context"
import { AppBreadcrumb, breadcrumbPresets } from "../../../_components/navigation/app-breadcrumb"
import {
  CartEmptyState,
  CartItemsList,
  CartSummarySidebar,
  CartMobileFooter,
} from "./cart-page-sections"

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

  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    if (isReady) return
    const timer = setTimeout(() => setTimedOut(true), CART_READY_TIMEOUT)
    return () => clearTimeout(timer)
  }, [isReady])

  useEffect(() => {
    if (!header) return
    header.setHeaderState(null)
  }, [header])

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

  const getProductUrl = (item: {
    id: string
    slug?: string | null
    username?: string | null
    storeSlug?: string | null
  }) => {
    const sellerSlug = item.username ?? item.storeSlug
    if (!sellerSlug) return "#"
    return `/${sellerSlug}/${item.slug ?? item.id}`
  }

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
      <CartEmptyState
        t={t}
        tBreadcrumbs={tBreadcrumbs}
        locale={locale}
        recentItems={recentItems}
        recentlyViewedLoaded={recentlyViewedLoaded}
      />
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
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {totalItems} {tCartDropdown(totalItems === 1 ? "item" : "items")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-6">
          <CartItemsList
            items={items}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            formatPrice={formatPrice}
            getProductUrl={getProductUrl}
            t={t}
            tCartDropdown={tCartDropdown}
          />

          <CartSummarySidebar
            totalItems={totalItems}
            subtotal={subtotal}
            formatPrice={formatPrice}
            handleCheckout={handleCheckout}
            t={t}
          />
        </div>
      </div>

      <CartMobileFooter
        subtotal={subtotal}
        formatPrice={formatPrice}
        handleCheckout={handleCheckout}
        t={t}
      />
    </PageShell>
  )
}
