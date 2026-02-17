"use client"

import { useEffect, useState, useCallback } from "react"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Lock, MapPin, Package, ShieldCheck, ShoppingCart, LoaderCircle as SpinnerGap, Truck } from "lucide-react";

import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import type { CheckoutFeeQuoteResult, CreateCheckoutSessionResult } from "../_actions/checkout"
import { SHIPPING_COSTS, type SavedAddress, type NewAddressForm, type ShippingMethod } from "./checkout-types"
import { AddressSection } from "./address-section"
import { ShippingMethodSection } from "./shipping-method-section"
import { OrderItemsSection, OrderItemsSectionDesktop } from "./order-items-section"
type CreateCheckoutSessionAction = (items: CartItem[], locale?: "en" | "bg") => Promise<CreateCheckoutSessionResult>

type GetCheckoutFeeQuoteAction = (items: CartItem[]) => Promise<CheckoutFeeQuoteResult>

type CheckoutErrorKind = "authRequired" | "ownProducts" | "generic" | null

export default function CheckoutPageClient({
  createCheckoutSessionAction,
  getCheckoutFeeQuoteAction,
}: {
  createCheckoutSessionAction: CreateCheckoutSessionAction
  getCheckoutFeeQuoteAction: GetCheckoutFeeQuoteAction
}) {
  const { items, totalItems, subtotal, isReady: isCartReady } = useCart()
  const locale = useLocale()
  const t = useTranslations("CheckoutPage")
  const tAuth = useTranslations("Auth")

  const [isProcessing, setIsProcessing] = useState(false)
  const [buyerProtectionFee, setBuyerProtectionFee] = useState(0)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard")
  const [mounted, setMounted] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkoutError, setCheckoutError] = useState<CheckoutErrorKind>(null)

  const [newAddress, setNewAddress] = useState<NewAddressForm>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof NewAddressForm, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof NewAddressForm, boolean>>>({})
  const [showAddressSelector, setShowAddressSelector] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)

  const fetchSavedAddresses = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsLoadingAddresses(false)
      setIsAuthenticated(false)
      return
    }

    setIsAuthenticated(true)

    const { data: addresses } = await supabase
      .from("user_addresses")
      .select(
        "id,label,full_name,phone,address_line1,address_line2,city,state,postal_code,country,is_default,created_at"
      )
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    if (addresses && addresses.length > 0) {
      setSavedAddresses(addresses)
      const defaultAddress = addresses.find((a) => a.is_default) ?? addresses.at(0)
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id)
      }
    } else {
      setUseNewAddress(true)
    }

    setIsLoadingAddresses(false)
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchSavedAddresses()
  }, [fetchSavedAddresses])

  useEffect(() => {
    let cancelled = false

    if (items.length === 0) {
      setBuyerProtectionFee(0)
      return
    }

    ;(async () => {
      const quote = await getCheckoutFeeQuoteAction(items)
      if (cancelled) return
      setBuyerProtectionFee(quote.ok ? quote.buyerProtectionFee : 0)
    })()

    return () => {
      cancelled = true
    }
  }, [items])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const scrolledToBottom = scrollTop + windowHeight >= docHeight - 100
      setIsAtBottom(scrolledToBottom)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const authLoginHref = "/auth/login?next=/checkout"
  const isAuthGateActive = !isAuthenticated && !isLoadingAddresses

  const getCheckoutErrorKind = useCallback(
    (errorMessage: string): CheckoutErrorKind => {
      const normalized = errorMessage.trim()
      if (normalized === "Please sign in to checkout.") return "authRequired"
      if (normalized.startsWith("You cannot purchase your own products:")) return "ownProducts"
      return "generic"
    },
    []
  )

  const handleCheckout = async () => {
    if (items.length === 0) return

    setCheckoutError(null)

    if (!isAuthenticated) {
      setCheckoutError("authRequired")
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setIsProcessing(true)
    try {
      const result = await createCheckoutSessionAction(items, locale === "bg" ? "bg" : "en")
      if (!result.ok) {
        setCheckoutError(getCheckoutErrorKind(result.error))
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }
      window.location.href = result.url
    } catch {
      setCheckoutError("generic")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setIsProcessing(false)
    }
  }

  const updateNewAddress = useCallback(
    (field: keyof NewAddressForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewAddress((prev) => ({ ...prev, [field]: e.target.value }))
      // Clear error when user types
      if (touched[field] && errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    },
    [touched, errors]
  )

  const validateField = useCallback(
    (field: keyof NewAddressForm) => {
      const value = newAddress[field]
      let error = ""

      if (!value || !value.trim()) {
        error = t(`validation.${field}Required`)
      } else if (field === "zip" && !/^\d{4,5}$/.test(value)) {
        error = t("validation.zipInvalid")
      } else if ((field === "firstName" || field === "lastName") && value.length < 2) {
        error = t("validation.tooShort", { min: 2 })
      } else if (field === "address" && value.length < 5) {
        error = t("validation.tooShort", { min: 5 })
      }

      setErrors((prev) => ({ ...prev, [field]: error }))
      return error
    },
    [newAddress, t]
  )

  const handleBlur = useCallback(
    (field: keyof NewAddressForm) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }))
      validateField(field)
    },
    [validateField]
  )

  const isFormValid = useCallback(() => {
    if (!useNewAddress && selectedAddressId) return true
    if (useNewAddress) {
      const fields: Array<keyof NewAddressForm> = ["firstName", "lastName", "address", "city", "state", "zip"]
      // Check validity without setting errors state - just validate the values directly
      return fields.every((field) => {
        const value = newAddress[field]
        if (!value || !value.trim()) return false
        if (field === "zip" && !/^\d{4,5}$/.test(value)) return false
        if ((field === "firstName" || field === "lastName") && value.length < 2) return false
        if (field === "address" && value.length < 5) return false
        return true
      })
    }
    return false
  }, [useNewAddress, selectedAddressId, newAddress])

  const checkoutNotice = (() => {
    if (isAuthGateActive) {
      return {
        title: t("authRequiredTitle"),
        description: t("authRequiredDescription"),
        primaryAction: {
          label: tAuth("signIn"),
          href: authLoginHref,
        },
        showSecondaryCartAction: true,
      }
    }

    if (!checkoutError) return null

    if (checkoutError === "authRequired") {
      return {
        title: t("authRequiredTitle"),
        description: t("authRequiredDescription"),
        primaryAction: {
          label: tAuth("signIn"),
          href: authLoginHref,
        },
        showSecondaryCartAction: true,
      }
    }

    if (checkoutError === "ownProducts") {
      return {
        title: t("ownProductsTitle"),
        description: t("ownProductsDescription"),
        primaryAction: {
          label: t("backToCart"),
          href: "/cart",
        },
        showSecondaryCartAction: false,
      }
    }

    return {
      title: t("checkoutErrorTitle"),
      description: t("checkoutError"),
      primaryAction: {
        label: t("backToCart"),
        href: "/cart",
      },
      showSecondaryCartAction: false,
    }
  })()

  // Loading state - only wait for mounted (hydration safety)
  // Cart items are loaded from localStorage immediately, so we can show checkout
  // content right away. Server sync happens in background.
  if (!mounted) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <SpinnerGap className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Loading cart state - prevents false "empty cart" UI when cart is still hydrating/syncing.
  if (items.length === 0 && !isCartReady) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SpinnerGap className="size-5 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-96 flex items-center justify-center px-3">
        <div className="text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <ShoppingCart className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium mb-1">{t("emptyCart")}</p>
          <p className="text-xs text-muted-foreground mb-3">{t("emptyCartDescription")}</p>
          <Button asChild size="sm">
            <Link href="/">{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Mobile */}
      <div className="lg:hidden pb-safe">
        {/* Accessible page title - sr-only on mobile since header shows step progress */}
        <h1 className="sr-only">{t("title")}</h1>
        
        <div className="space-y-3 p-4">
          {checkoutNotice && (
            <div
              role="alert"
              className="rounded-lg border border-border bg-surface-subtle p-3"
            >
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0">
                  <Lock className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {checkoutNotice.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {checkoutNotice.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={checkoutNotice.primaryAction.href}>
                        {checkoutNotice.primaryAction.label}
                      </Link>
                    </Button>
                    {checkoutNotice.showSecondaryCartAction && (
                      <Button asChild size="sm" variant="secondary" className="flex-1">
                        <Link href="/cart">{t("backToCart")}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isAuthGateActive && (
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <MapPin className="size-4 text-primary" />
                    {t("shippingAddress")}
                  </CardTitle>
                  {isAuthenticated && (
                    <Link href="/account/addresses" className="text-xs text-primary font-medium">{t("manageAddresses")}</Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <AddressSection
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
                  showAddressSelector={showAddressSelector}
                  setShowAddressSelector={setShowAddressSelector}
                />
              </CardContent>
            </Card>
          )}

          {!isAuthGateActive && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Truck className="size-4 text-primary" />
                  {t("shippingMethod")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ShippingMethodSection
                  shippingMethod={shippingMethod}
                  setShippingMethod={setShippingMethod}
                  formatPrice={formatPrice}
                  compact
                />
              </CardContent>
            </Card>
          )}

          {/* Items */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Package className="size-4 text-primary" />
                  {t("orderItems")}
                  <Badge variant="secondary" className="ml-1">{totalItems}</Badge>
                </CardTitle>
                <Link href="/cart" className="text-xs text-primary font-medium">{t("edit")}</Link>
              </div>
            </CardHeader>
            <CardContent>
              <OrderItemsSection items={items} formatPrice={formatPrice} />
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardContent className="py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("shipping")}</span>
                <span className={shippingCost === 0 ? "text-success font-medium" : ""}>{shippingCost === 0 ? t("free") : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("tax", { percent: 10 })}</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("buyerProtection")}</span>
                <span>{formatPrice(buyerProtectionFee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="font-semibold">{t("total")}</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 py-1 text-2xs text-muted-foreground">
            <span className="flex items-center gap-1"><Lock className="size-3" />{t("securePayment")}</span>
            <span className="flex items-center gap-1"><ShieldCheck className="size-3" />{t("buyerProtection")}</span>
          </div>

          <div className="h-20" aria-hidden="true" />
        </div>
      </div>

      {/* Mobile sticky footer - hide when scrolled to bottom */}
      <div className={cn(
        "lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border motion-safe:transition-transform motion-safe:duration-300 motion-reduce:transition-none",
        isAtBottom ? "translate-y-full" : "translate-y-0"
      )}>
        <div className="px-4 py-3 pb-safe">
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground justify-center">
            <Lock className="size-3.5 text-success" />
            <span>{t("secureCheckout")}</span>
            <span>•</span>
            <ShieldCheck className="size-3.5 text-success" />
            <span>{t("buyerProtection")}</span>
          </div>
          {isAuthGateActive ? (
            <Button asChild size="lg" className="w-full font-semibold">
              <Link href={authLoginHref}>
                <Lock className="size-4 mr-2" />
                {tAuth("signIn")}
              </Link>
            </Button>
          ) : (
            <Button 
              onClick={handleCheckout} 
              disabled={isProcessing || !isFormValid()} 
              size="lg"
              className="w-full font-semibold"
            >
              {isProcessing ? (
                <>
                  <SpinnerGap className="size-5 animate-spin mr-2" />
                  {t("processing")}
                </>
              ) : (
                <>
                  <Lock className="size-4 mr-2" />
                  {t("completeOrder")} · {formatPrice(total)}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block py-6">
        <div className="container max-w-5xl">
          {checkoutNotice && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-border bg-surface-subtle p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 size-5 text-primary" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {checkoutNotice.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {checkoutNotice.description}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button asChild size="sm">
                    <Link href={checkoutNotice.primaryAction.href}>
                      {checkoutNotice.primaryAction.label}
                    </Link>
                  </Button>
                  {checkoutNotice.showSecondaryCartAction && (
                    <Button asChild size="sm" variant="secondary">
                      <Link href="/cart">{t("backToCart")}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-5">
            <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" />{t("backToCart")}
            </Link>
            <h1 className="text-lg font-semibold">{t("title")}</h1>
            <div className="w-20" aria-hidden="true" />{/* Spacer for centering */}
          </div>

          <div className="flex items-start gap-6 lg:gap-8">
            {/* Main */}
            <div className="flex-1 space-y-4">
              {!isAuthGateActive && (
                <Card>
                  <CardHeader className="border-b px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2.5 text-base">
                        <MapPin className="size-5 text-primary" />
                        {t("shippingAddress")}
                      </CardTitle>
                      {isAuthenticated && <Link href="/account/addresses" className="text-xs text-primary font-medium">{t("manageAddresses")}</Link>}
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-4">
                    <AddressSection
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
                      showAddressSelector={showAddressSelector}
                      setShowAddressSelector={setShowAddressSelector}
                    />
                  </CardContent>
                </Card>
              )}

              {!isAuthGateActive && (
                <Card>
                  <CardHeader className="border-b px-5">
                    <CardTitle className="flex items-center gap-2.5 text-base">
                      <Truck className="size-5 text-primary" />
                      {t("shippingMethod")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-4">
                    <ShippingMethodSection
                      shippingMethod={shippingMethod}
                      setShippingMethod={setShippingMethod}
                      formatPrice={formatPrice}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Items */}
              <Card>
                <CardHeader className="border-b px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-base">
                      <Package className="size-5 text-primary" />
                      {t("orderItems")}
                      <Badge variant="secondary" className="ml-1">{totalItems}</Badge>
                    </CardTitle>
                    <Link href="/cart" className="text-xs text-primary font-medium">{t("edit")}</Link>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-4">
                  <OrderItemsSectionDesktop items={items} formatPrice={formatPrice} />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="w-96 shrink-0">
              <Card className="sticky top-20">
                <CardHeader className="border-b px-5">
                  <CardTitle className="text-base">{t("orderSummary")}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-4 space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("subtotal")}</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("shipping")}</span>
                      <span className={cn("font-medium", shippingCost === 0 && "text-success")}>{shippingCost === 0 ? t("free") : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("tax", { percent: 10 })}</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("buyerProtection")}</span>
                      <span className="font-medium">{formatPrice(buyerProtectionFee)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-semibold">{t("total")}</span>
                      <span className="text-xl font-bold">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {isAuthGateActive ? (
                    <Button asChild size="lg" className="w-full font-semibold">
                      <Link href={authLoginHref}>
                        <Lock className="size-4 mr-2" />
                        {tAuth("signIn")}
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleCheckout} 
                      disabled={isProcessing || !isFormValid()} 
                      size="lg"
                      className="w-full font-semibold"
                    >
                      {isProcessing ? (
                        <>
                          <SpinnerGap className="size-5 animate-spin mr-2" />
                          {t("processing")}
                        </>
                      ) : (
                        <>
                          <Lock className="size-4 mr-2" />
                          {t("proceedToPayment")}
                        </>
                      )}
                    </Button>
                  )}

                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5">
                      <Lock className="size-3.5 text-success" />
                      <span>{t("secureCheckout")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-success" />
                      <span>{t("buyerProtection")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
