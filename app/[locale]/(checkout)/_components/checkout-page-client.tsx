"use client"

import { useEffect, useState, useCallback } from "react"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { LoaderCircle as SpinnerGap, ShoppingCart } from "lucide-react"

import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import type { CheckoutFeeQuoteResult, CreateCheckoutSessionResult } from "../_actions/checkout"
import {
  SHIPPING_COSTS,
  type SavedAddress,
  type ShippingMethod,
} from "./checkout-types"
import {
  DesktopCheckoutLayout,
  MobileCheckoutLayout,
} from "./checkout-page-layout"
import { buildCheckoutNotice, getCheckoutErrorKind, type CheckoutErrorKind } from "./checkout-page-notice"
import { useCheckoutAddressForm } from "./use-checkout-address-form"
import { useCheckoutStep } from "./checkout-step-context"

type CreateCheckoutSessionAction = (
  items: CartItem[],
  locale?: "en" | "bg"
) => Promise<CreateCheckoutSessionResult>

type GetCheckoutFeeQuoteAction = (items: CartItem[]) => Promise<CheckoutFeeQuoteResult>

export default function CheckoutPageClient({
  createCheckoutSessionAction,
  getCheckoutFeeQuoteAction,
}: {
  createCheckoutSessionAction: CreateCheckoutSessionAction
  getCheckoutFeeQuoteAction: GetCheckoutFeeQuoteAction
}) {
  const { setCurrentStep } = useCheckoutStep()
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
    setCurrentStep(1)
    fetchSavedAddresses()
  }, [fetchSavedAddresses, setCurrentStep])

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
  }, [getCheckoutFeeQuoteAction, items])

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
  const { newAddress, errors, touched, updateNewAddress, handleBlur, isAddressValid } =
    useCheckoutAddressForm({
      t,
      useNewAddress,
      selectedAddressId,
    })

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

  const checkoutNotice = buildCheckoutNotice({
    checkoutError,
    isAuthGateActive,
    authLoginHref,
    t,
    tAuth,
  })

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
      <div className="min-h-96 flex items-center justify-center px-inset">
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

  const canCheckout = isAddressValid()
  const checkoutLayoutProps: Parameters<typeof MobileCheckoutLayout>[0] = {
    t,
    tAuth,
    checkoutNotice,
    authLoginHref,
    isAuthGateActive,
    isAuthenticated,
    isLoadingAddresses,
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
    shippingMethod,
    setShippingMethod,
    formatPrice,
    items,
    totalItems,
    subtotal,
    shippingCost,
    tax,
    buyerProtectionFee,
    total,
    isProcessing,
    canCheckout,
    onCheckout: handleCheckout,
  }

  return (
    <div>
      <MobileCheckoutLayout {...checkoutLayoutProps} />

      <DesktopCheckoutLayout {...checkoutLayoutProps} />
    </div>
  )
}
