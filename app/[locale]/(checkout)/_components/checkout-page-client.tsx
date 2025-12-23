"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/components/providers/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { createCheckoutSession } from "../_actions/checkout"
import { createClient } from "@/lib/supabase/client"
import {
  ShoppingCart,
  CreditCard,
  Truck,
  ShieldCheck,
  SpinnerGap,
  Lock,
  Plus,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "@phosphor-icons/react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"

interface SavedAddress {
  id: string
  label: string
  full_name: string
  phone: string | null
  address_line1: string
  address_line2: string | null
  city: string
  state: string | null
  postal_code: string
  country: string
  is_default: boolean | null
}

export default function CheckoutPageClient() {
  const { items, totalItems, subtotal } = useCart()
  const locale = useLocale()
  const t = useTranslations("CheckoutPage")

  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [mounted, setMounted] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  useEffect(() => {
    setMounted(true)
    fetchSavedAddresses()
  }, [])

  const fetchSavedAddresses = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsLoadingAddresses(false)
      setUseNewAddress(true)
      return
    }

    setIsAuthenticated(true)

    const { data: addresses } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    if (addresses && addresses.length > 0) {
      setSavedAddresses(addresses)
      const defaultAddress = addresses.find((a) => a.is_default) || addresses[0]
      setSelectedAddressId(defaultAddress.id)
    } else {
      setUseNewAddress(true)
    }

    setIsLoadingAddresses(false)
  }

  const shippingCosts = {
    standard: 0,
    express: 9.99,
    overnight: 19.99,
  }

  const shippingCost = shippingCosts[shippingMethod as keyof typeof shippingCosts]
  const tax = subtotal * 0.1
  const total = subtotal + shippingCost + tax

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsProcessing(true)
    try {
      const { url, error } = await createCheckoutSession(items)
      if (error) {
        alert(error)
        return
      }
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("An error occurred during checkout. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <SpinnerGap className="size-8 animate-spin text-brand" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="size-20 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="size-10 text-brand" weight="duotone" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">{t("emptyCart")}</h1>
            <p className="text-muted-foreground mb-6">{t("emptyCartDescription")}</p>
            <Button
              asChild
              size="lg"
              className="bg-brand hover:bg-brand/90 text-white rounded-full"
            >
              <Link href="/">{t("continueShopping")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 lg:pb-8">
      <div className="container py-4 lg:py-6 max-w-5xl">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="size-4" />
          {locale === "bg" ? "Обратно към количката" : "Back to cart"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <Card className="hidden lg:block border-0 shadow-sm">
              <CardContent className="p-5 space-y-5">
                <section className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-base flex items-center gap-2">
                      <Truck className="size-4 text-brand" />
                      {t("shippingAddress")}
                    </h2>
                    {isAuthenticated && (
                      <Link
                        href="/account/addresses"
                        className="text-xs text-brand hover:underline"
                      >
                        {t("manageAddresses")}
                      </Link>
                    )}
                  </div>
                  {renderAddressSection()}
                </section>

                <section className="rounded-lg border border-border p-4">
                  <h2 className="font-semibold text-base flex items-center gap-2 mb-4">
                    <Truck className="size-4 text-brand" />
                    {t("shippingMethod")}
                  </h2>
                  {renderShippingMethodSection()}
                </section>

                <section className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-base flex items-center gap-2">
                      <ShoppingCart className="size-4 text-brand" />
                      {t("orderItems")} ({totalItems})
                    </h2>
                    <Link href="/cart" className="text-xs text-brand hover:underline">
                      {t("edit")}
                    </Link>
                  </div>
                  {renderOrderItemsSection()}
                </section>
              </CardContent>
            </Card>

            <div className="lg:hidden space-y-6">
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Truck className="size-4 text-brand" />
                    {t("shippingAddress")}
                  </h2>
                  {isAuthenticated && (
                    <Link
                      href="/account/addresses"
                      className="text-xs text-brand hover:underline"
                    >
                      {t("manageAddresses")}
                    </Link>
                  )}
                </div>
                {renderAddressSection()}
              </section>

              <Separator />

              <section>
                <h2 className="font-semibold flex items-center gap-2 mb-3">
                  <Truck className="size-4 text-brand" />
                  {t("shippingMethod")}
                </h2>
                {renderShippingMethodSection()}
              </section>

              <Separator />

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <ShoppingCart className="size-4 text-brand" />
                    {t("orderItems")} ({totalItems})
                  </h2>
                  <Link href="/cart" className="text-xs text-brand hover:underline">
                    {t("edit")}
                  </Link>
                </div>
                {renderOrderItemsSection()}
              </section>

              <Separator />

              <section className="pb-4">
                <h2 className="font-semibold mb-3">{t("orderSummary")}</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("subtotal")} ({totalItems})
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("shipping")}</span>
                    <span
                      className={shippingCost === 0 ? "text-brand-success font-medium" : ""}
                    >
                      {shippingCost === 0 ? t("free") : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("tax", { percent: 10 })}</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="hidden lg:block">
            <Card className="border-0 shadow-sm sticky top-20">
              <CardContent className="p-5">
                <h2 className="font-semibold text-lg mb-4">{t("orderSummary")}</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("subtotal")} ({totalItems})
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("shipping")}</span>
                    <span
                      className={shippingCost === 0 ? "text-brand-success font-medium" : ""}
                    >
                      {shippingCost === 0 ? t("free") : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("tax", { percent: 10 })}</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-5">
                  <span className="font-semibold text-lg">{t("total")}</span>
                  <span className="text-xl font-bold text-deal">{formatPrice(total)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full bg-brand hover:bg-brand/90 text-white rounded-full h-12 font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <SpinnerGap className="size-4 animate-spin mr-2" />
                      {t("processing")}
                    </>
                  ) : (
                    <>
                      <Lock className="size-4 mr-2" weight="fill" />
                      {t("proceedToPayment")}
                    </>
                  )}
                </Button>

                <div className="mt-5 pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="size-4 text-brand-success" />
                    <span>{t("securePayment")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="size-4 text-brand" />
                    <span>{t("acceptCards")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="size-4 text-brand" />
                    <span>{t("returnPolicy")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-40 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="container py-3 px-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t("total")}</p>
              <p className="text-xl font-bold text-deal">{formatPrice(total)}</p>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              size="lg"
              className="h-12 px-6 font-semibold rounded-full bg-brand hover:bg-brand/90 text-white shadow-lg"
            >
              {isProcessing ? (
                <SpinnerGap className="size-5 animate-spin" />
              ) : (
                <>
                  <Lock className="size-4 mr-1.5" weight="fill" />
                  {locale === "bg" ? "Плащане" : "Pay Now"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  function renderAddressSection() {
    if (isLoadingAddresses) {
      return (
        <div className="flex items-center justify-center py-8">
          <SpinnerGap className="size-6 animate-spin text-brand" />
        </div>
      )
    }

    if (savedAddresses.length > 0 && !useNewAddress) {
      return (
        <div className="space-y-3">
          <RadioGroup
            value={selectedAddressId || ""}
            onValueChange={(value) => {
              setSelectedAddressId(value)
              setUseNewAddress(false)
            }}
            className="space-y-2"
          >
            {savedAddresses.map((address) => (
              <label
                key={address.id}
                htmlFor={address.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  selectedAddressId === address.id
                    ? "border-brand bg-brand/5 ring-1 ring-brand/20"
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <RadioGroupItem value={address.id} id={address.id} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{address.label}</span>
                    {address.is_default && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-brand/10 text-brand border-0"
                      >
                        {t("default")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{address.full_name}</p>
                  <p className="text-sm text-muted-foreground">{address.address_line1}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.postal_code}
                  </p>
                </div>
                {selectedAddressId === address.id && (
                  <CheckCircle className="size-5 text-brand shrink-0" weight="fill" />
                )}
              </label>
            ))}
          </RadioGroup>

          <button
            onClick={() => setUseNewAddress(true)}
            className="flex items-center gap-2 w-full p-3 rounded-lg border border-dashed border-border hover:border-brand hover:bg-brand/5 text-sm text-muted-foreground hover:text-brand transition-colors"
          >
            <Plus className="size-4" />
            {t("useNewAddress")}
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {savedAddresses.length > 0 && (
          <button
            onClick={() => setUseNewAddress(false)}
            className="flex items-center gap-1.5 text-sm text-brand hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            {t("backToSaved")}
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-xs">
              {t("firstName")}
            </Label>
            <Input
              id="firstName"
              placeholder={t("firstNamePlaceholder")}
              value={newAddress.firstName}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-xs">
              {t("lastName")}
            </Label>
            <Input
              id="lastName"
              placeholder={t("lastNamePlaceholder")}
              value={newAddress.lastName}
              onChange={(e) => setNewAddress((prev) => ({ ...prev, lastName: e.target.value }))}
              className="h-10"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address" className="text-xs">
            {t("address")}
          </Label>
          <Input
            id="address"
            placeholder={t("addressPlaceholder")}
            value={newAddress.address}
            onChange={(e) => setNewAddress((prev) => ({ ...prev, address: e.target.value }))}
            className="h-10"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-xs">
              {t("city")}
            </Label>
            <Input
              id="city"
              placeholder={t("cityPlaceholder")}
              value={newAddress.city}
              onChange={(e) => setNewAddress((prev) => ({ ...prev, city: e.target.value }))}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state" className="text-xs">
              {t("state")}
            </Label>
            <Input
              id="state"
              placeholder={t("statePlaceholder")}
              value={newAddress.state}
              onChange={(e) => setNewAddress((prev) => ({ ...prev, state: e.target.value }))}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="zip" className="text-xs">
              {t("zipCode")}
            </Label>
            <Input
              id="zip"
              placeholder="10001"
              value={newAddress.zip}
              onChange={(e) => setNewAddress((prev) => ({ ...prev, zip: e.target.value }))}
              className="h-10"
            />
          </div>
        </div>
      </div>
    )
  }

  function renderShippingMethodSection() {
    return (
      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-2">
        <label
          htmlFor="standard"
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
            shippingMethod === "standard"
              ? "border-brand bg-brand/5 ring-1 ring-brand/20"
              : "border-border hover:border-muted-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="standard" id="standard" />
            <Truck className="size-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{t("standardShipping")}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                {t("standardDays")}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-brand-success/10 text-brand-success border-0 font-semibold"
          >
            {t("free")}
          </Badge>
        </label>

        <label
          htmlFor="express"
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
            shippingMethod === "express"
              ? "border-brand bg-brand/5 ring-1 ring-brand/20"
              : "border-border hover:border-muted-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="express" id="express" />
            <Truck className="size-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{t("expressShipping")}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                {t("expressDays")}
              </p>
            </div>
          </div>
          <span className="font-semibold text-sm">{formatPrice(9.99)}</span>
        </label>

        <label
          htmlFor="overnight"
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
            shippingMethod === "overnight"
              ? "border-brand bg-brand/5 ring-1 ring-brand/20"
              : "border-border hover:border-muted-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="overnight" id="overnight" />
            <Truck className="size-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{t("overnightShipping")}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                {t("overnightDays")}
              </p>
            </div>
          </div>
          <span className="font-semibold text-sm">{formatPrice(19.99)}</span>
        </label>
      </RadioGroup>
    )
  }

  function renderOrderItemsSection() {
    return (
      <div className="space-y-3">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="size-14 lg:size-16 bg-white rounded-lg overflow-hidden shrink-0 border border-border">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={64}
                height={64}
                className="size-full object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-2">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("qty")}: {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-sm shrink-0">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-xs text-center text-muted-foreground pt-2">
            {t("moreItems", { count: items.length - 3 })}
          </p>
        )}
      </div>
    )
  }
}
