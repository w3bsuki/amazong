"use client"

/**
 * Desktop Checkout - Two-Column Layout
 * 
 * Left column (fluid): Address, Shipping, Order Items
 * Right column (fixed 400px): Order Summary sidebar
 * 
 * Matches the product page pattern with dedicated desktop component
 * that's shown via CSS (hidden lg:block in parent).
 */

import { useState, useCallback } from "react"
import { useTranslations, useLocale } from "next-intl"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  MapPin,
  Truck,
  Lightning,
  Airplane,
  Package,
  Lock,
  ShieldCheck,
  Check,
} from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { SpinnerGap } from "@phosphor-icons/react"
import type { CartItem } from "@/components/providers/cart-context"
import type { SavedAddress, NewAddressForm, ShippingMethod } from "./checkout-types"
import { DesktopAddressSection } from "./desktop-address-section"
import { DesktopShippingSection } from "./desktop-shipping-section"
import { DesktopOrderItems } from "./desktop-order-items"
import { DesktopOrderSummary } from "./desktop-order-summary"

const SHIPPING_COSTS = {
  standard: 0,
  express: 9.99,
  overnight: 19.99,
} as const

interface DesktopCheckoutProps {
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

export function DesktopCheckout({
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
}: DesktopCheckoutProps) {
  const t = useTranslations("CheckoutPage")
  const locale = useLocale()
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard")

  const shippingCost = SHIPPING_COSTS[shippingMethod]
  const tax = subtotal * 0.1
  const total = subtotal + shippingCost + tax + buyerProtectionFee

  const formatPrice = useCallback(
    (price: number) => {
      return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
        style: "currency",
        currency: "EUR",
      }).format(price)
    },
    [locale]
  )

  return (
    <div className="hidden lg:block py-8">
      <div className="container max-w-6xl px-6">
        {/* Header with back link */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/cart" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t("backToCart")}
          </Link>
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <div className="w-24" aria-hidden="true" />
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left column - Main checkout form */}
          <div className="space-y-5">
            {/* Shipping Address Card */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2.5 text-base">
                    <MapPin className="size-5 text-primary" weight="fill" />
                    {t("shippingAddress")}
                  </CardTitle>
                  {isAuthenticated && (
                    <Link 
                      href="/account/addresses" 
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      {t("manageAddresses")}
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <DesktopAddressSection
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
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2.5 text-base">
                  <Truck className="size-5 text-primary" weight="fill" />
                  {t("shippingMethod")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <DesktopShippingSection
                  shippingMethod={shippingMethod}
                  setShippingMethod={setShippingMethod}
                  formatPrice={formatPrice}
                />
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2.5 text-base">
                    <Package className="size-5 text-primary" weight="fill" />
                    {t("orderItems")}
                    <Badge variant="secondary" className="ml-1.5">{totalItems}</Badge>
                  </CardTitle>
                  <Link 
                    href="/cart" 
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    {t("edit")}
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <DesktopOrderItems 
                  items={items} 
                  formatPrice={formatPrice}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right column - Order Summary Sidebar */}
          <div>
            <DesktopOrderSummary
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={tax}
              buyerProtectionFee={buyerProtectionFee}
              total={total}
              formatPrice={formatPrice}
              isProcessing={isProcessing}
              isFormValid={isFormValid}
              onCheckout={onCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
