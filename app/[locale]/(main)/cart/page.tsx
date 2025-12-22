"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/routing"
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
  ArrowRight
} from "@phosphor-icons/react"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { useTranslations, useLocale } from "next-intl"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart()
  const router = useRouter()
  const t = useTranslations("CartPage")
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCheckout = () => {
    if (items.length === 0) return
    router.push("/checkout")
  }

  const formatPrice = (price: number) => {
    // EUR is the base currency (Bulgaria joined Eurozone Jan 1, 2025)
    return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  // Generate SEO-friendly product URL: /{username}/{slug} or fallback to /product/{id}
  const getProductUrl = (item: typeof items[0]) => {
    if (item.username && item.slug) {
      return `/${item.username}/${item.slug}`
    }
    // Fallback for older items without username/slug
    return `/product/${item.id}`
  }

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <SpinnerGap className="size-8 animate-spin text-brand" />
      </div>
    )
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="bg-secondary min-h-[80vh]">
        <div className="container py-6">
          <AppBreadcrumb items={breadcrumbPresets.cart} />
          
          <Card className="mt-6 max-w-lg mx-auto border-0 shadow-md">
            <CardContent className="p-8 text-center">
              <div className="size-24 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="size-12 text-brand" weight="duotone" />
              </div>
              <h1 className="text-2xl font-semibold mb-2">{t("emptyTitle")}</h1>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                {t("emptyDescription")}
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  asChild
                  size="lg"
                  className="bg-brand hover:bg-brand/90 text-white rounded-full h-12"
                >
                  <Link href="/">
                    {t("continueShopping")}
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="rounded-full h-12"
                >
                  <Link href="/todays-deals">
                    {t("viewDeals")}
                  </Link>
                </Button>
              </div>
              <Separator className="my-8" />
              <p className="text-sm text-muted-foreground mb-2">
                {t("signInPrompt")}
              </p>
              <Link href="/auth/login" className="text-sm font-medium text-brand hover:underline">
                {t("signInLink")}
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-secondary min-h-screen pb-32 lg:pb-8">
      <div className="container py-4 lg:py-6">
        <AppBreadcrumb items={breadcrumbPresets.cart} />
        
        {/* Page Header */}
        <div className="mt-4 mb-6">
          <h1 className="text-2xl lg:text-3xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">
            {totalItems} {totalItems === 1 ? (locale === 'bg' ? 'артикул' : 'item') : (locale === 'bg' ? 'артикула' : 'items')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Card key={item.id} className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    {/* Product Image */}
                    <Link 
                      href={getProductUrl(item)}
                      className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg overflow-hidden group"
                    >
                      <Image 
                        src={item.image || "/placeholder.svg"} 
                        alt={item.title} 
                        fill 
                        className="object-contain p-2 group-hover:scale-105 transition-transform" 
                        sizes="(max-width: 640px) 96px, 128px"
                        priority={index === 0}
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            href={getProductUrl(item)}
                            className="font-medium hover:text-brand transition-colors line-clamp-2 text-sm sm:text-base"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="secondary" className="bg-brand-success/10 text-brand-success border-0 text-xs">
                              <CheckCircle className="size-3 mr-1" weight="fill" />
                              {t("inStock")}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Truck className="size-3" />
                            {t("freeShippingEligible")}
                          </p>
                        </div>

                        {/* Price - Desktop */}
                        <div className="hidden sm:block text-right shrink-0">
                          <p className="text-lg font-semibold">{formatPrice(item.price * item.quantity)}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(item.price)} {locale === 'bg' ? 'всяка' : 'each'}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions Row */}
                      <div className="flex items-center justify-between mt-auto pt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                          <button
                            onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="size-8 flex items-center justify-center rounded-full hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            className="size-8 flex items-center justify-center rounded-full hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button 
                            className="size-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={t("saveForLater")}
                          >
                            <Heart className="size-4" />
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="size-9 flex items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={t("delete")}
                          >
                            <Trash className="size-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price - Mobile */}
                      <div className="sm:hidden mt-2">
                        <p className="text-lg font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary - Desktop Sidebar */}
          <div className="hidden lg:block">
            <Card className="border-0 shadow-sm sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">{locale === 'bg' ? 'Обобщение' : 'Order Summary'}</h2>
                
                {/* Free Shipping Badge */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-brand-success/5 border border-brand-success/20 mb-4">
                  <CheckCircle className="size-5 text-brand-success shrink-0 mt-0.5" weight="fill" />
                  <div className="text-sm">
                    <p className="font-medium text-brand-success">{t("qualifiesForFreeShipping")}</p>
                    <Link href="#" className="text-xs text-brand hover:underline">
                      {t("seeDetails")}
                    </Link>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("subtotalCount", { count: totalItems })}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{locale === 'bg' ? 'Доставка' : 'Shipping'}</span>
                    <span className="text-brand-success font-medium">{locale === 'bg' ? 'Безплатно' : 'FREE'}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="font-semibold">{locale === 'bg' ? 'Общо' : 'Total'}</span>
                  <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full bg-brand hover:bg-brand/90 text-white rounded-full h-12 font-semibold"
                >
                  {t("proceedToCheckout")}
                  <ArrowRight className="size-4 ml-2" />
                </Button>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="size-4 text-brand-success" />
                    <span>{locale === 'bg' ? 'Сигурно плащане' : 'Secure checkout'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="size-4 text-brand" />
                    <span>{locale === 'bg' ? '30-дневно връщане' : '30-day returns'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky Checkout Bar - Mobile */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-40",
          "lg:hidden"
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="container py-3 px-4">
          {/* Free shipping badge */}
          <div className="flex items-center gap-2 text-xs text-brand-success mb-2">
            <CheckCircle className="size-3.5" weight="fill" />
            <span className="font-medium">{locale === 'bg' ? 'Безплатна доставка' : 'Free shipping'}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Order summary */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                {locale === 'bg' ? 'Общо' : 'Total'} ({totalItems})
              </p>
              <p className="text-xl font-bold">
                {formatPrice(subtotal)}
              </p>
            </div>
            
            {/* Checkout button */}
            <Button 
              onClick={handleCheckout}
              size="lg"
              className="h-12 px-8 font-semibold rounded-full bg-brand hover:bg-brand/90 text-white shadow-lg"
            >
              {locale === 'bg' ? 'Плащане' : 'Checkout'}
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
