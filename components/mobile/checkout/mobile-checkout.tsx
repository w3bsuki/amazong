"use client"

/**
 * Mobile Checkout - Card-based stacked layout
 * 
 * Full-width cards with sticky bottom bar CTA.
 * Matches the mobile product page pattern with dedicated mobile component
 * that's shown via CSS (lg:hidden in parent).
 */

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  MapPin,
  Truck,
  Package,
  Lock,
  ShieldCheck,
  SpinnerGap,
} from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CartItem } from "@/components/providers/cart-context"
import type { SavedAddress, NewAddressForm, ShippingMethod } from "@/components/desktop/checkout/checkout-types"
import { MobileAddressSection } from "./mobile-address-section"
import { MobileShippingSection } from "./mobile-shipping-section"
import { MobileOrderItems } from "./mobile-order-items"

const SHIPPING_COSTS = {
  standard: 0,
  express: 9.99,
  overnight: 19.99,
} as const

interface MobileCheckoutProps {
  items: CartItem[]
  totalItems: number
  subtotal: number
  buyerProtectionFee: number
  savedAddresses: SavedAddress[]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string) => void
  useNewAddress: boolean
  setUseNewAddress: (value: boolean) => void
  newAddress: NewAddressForm
  updateNewAddress: (field: keyof NewAddressForm) => (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (field: keyof NewAddressForm) => () => void
  errors: Partial<Record<keyof NewAddressForm, string>>
  touched: Partial<Record<keyof NewAddressForm, boolean>>
  isLoadingAddresses: boolean
  isAuthenticated: boolean
  isProcessing: boolean
  isFormValid: () => boolean
  onCheckout: () => void
}

export function MobileCheckout({
  items,
  totalItems,
  subtotal,
  buyerProtectionFee,
  savedAddresses,
  selectedAddressId,
  setSelectedAddressId,
  useNewAddress,
  setUseNewAddress,
  newAddress,
  updateNewAddress,
  handleBlur,
  errors,
  touched,
  isLoadingAddresses,
  isAuthenticated,
  isProcessing,
  isFormValid,
  onCheckout,
}: MobileCheckoutProps) {
  const t = useTranslations("CheckoutPage")
  const locale = useLocale()
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard")
  const [isAtBottom, setIsAtBottom] = useState(false)

  // Hide sticky footer when scrolled to bottom (so user can see final summary)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const scrolledToBottom = scrollTop + windowHeight >= docHeight - 100
      setIsAtBottom(scrolledToBottom)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const shippingCost = SHIPPING_COSTS[shippingMethod]
  const tax = subtotal * 0.1
  const total = subtotal + shippingCost + tax + buyerProtectionFee

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  return (
    <div className="lg:hidden">
      {/* Accessible page title */}
      <h1 className="sr-only">{t("title")}</h1>

      {/* Content area with bottom padding for sticky footer */}
      <div className="pb-[calc(5rem+env(safe-area-inset-bottom))] space-y-3 p-4">
        {/* Shipping Address Card */}
        <Card>
          <CardHeader className="border-b py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 text-primary" weight="fill" />
                {t("shippingAddress")}
              </CardTitle>
              {isAuthenticated && (
                <Link 
                  href="/account/addresses" 
                  className="text-xs text-primary font-medium"
                >
                  {t("manageAddresses")}
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <MobileAddressSection
              isLoadingAddresses={isLoadingAddresses}
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              useNewAddress={useNewAddress}
              setUseNewAddress={setUseNewAddress}
              newAddress={newAddress}
              updateNewAddress={updateNewAddress}
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
            />
          </CardContent>
        </Card>

        {/* Shipping Method Card */}
        <Card>
          <CardHeader className="border-b py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Truck className="size-4 text-primary" weight="fill" />
              {t("shippingMethod")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <MobileShippingSection
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
              formatPrice={formatPrice}
            />
          </CardContent>
        </Card>

        {/* Order Items Card */}
        <Card>
          <CardHeader className="border-b py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="size-4 text-primary" weight="fill" />
                {t("orderItems")}
                <Badge variant="secondary" className="ml-1 text-xs">{totalItems}</Badge>
              </CardTitle>
              <Link href="/cart" className="text-xs text-primary font-medium">
                {t("edit")}
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <MobileOrderItems items={items} formatPrice={formatPrice} />
          </CardContent>
        </Card>

        {/* Order Summary Card */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("shipping")}</span>
              <span className={cn("font-medium", shippingCost === 0 && "text-success")}>
                {shippingCost === 0 ? t("free") : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("tax", { percent: 10 })}</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="size-3 text-success" weight="fill" />
                {t("buyerProtection")}
              </span>
              <span className="font-medium">{formatPrice(buyerProtectionFee)}</span>
            </div>
            
            <div className="flex justify-between pt-3 border-t">
              <span className="font-semibold">{t("total")}</span>
              <span className="text-xl font-bold">{formatPrice(total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 py-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="size-3" weight="fill" />
            {t("securePayment")}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3" weight="fill" />
            {t("buyerProtection")}
          </span>
        </div>
      </div>

      {/* Sticky bottom bar - hide when scrolled to bottom */}
      <div className={cn(
        "fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur-md border-t transition-transform duration-300",
        isAtBottom ? "translate-y-full" : "translate-y-0"
      )}>
        <div className="px-4 py-3 pb-safe">
          {/* Trust indicators */}
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground justify-center">
            <Lock className="size-3.5 text-success" weight="fill" />
            <span>{t("secureCheckout")}</span>
            <span className="text-border">•</span>
            <ShieldCheck className="size-3.5 text-success" weight="fill" />
            <span>{t("buyerProtection")}</span>
          </div>
          
          {/* CTA Button */}
          <Button 
            onClick={onCheckout} 
            disabled={isProcessing || !isFormValid()} 
            size="lg"
            className="w-full h-12 font-semibold"
          >
            {isProcessing ? (
              <>
                <SpinnerGap className="size-5 animate-spin mr-2" />
                {t("processing")}
              </>
            ) : (
              <>
                <Lock className="size-4 mr-2" weight="fill" />
                {t("completeOrder")} · {formatPrice(total)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
