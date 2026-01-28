"use client"

/**
 * Checkout Page Client - Orchestrator Component
 * 
 * This component handles all shared state and logic for checkout,
 * then renders BOTH mobile and desktop components.
 * CSS controls which one is visible (lg:hidden / hidden lg:block).
 * 
 * Pattern matches: components/shared/product/product-page-layout.tsx
 */

import { useEffect, useState, useCallback } from "react"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import { createClient } from "@/lib/supabase/client"
import { ShoppingCart, SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import type { CheckoutFeeQuoteResult, CreateCheckoutSessionResult } from "../_actions/checkout"

// Desktop and Mobile checkout components
import { DesktopCheckout } from "@/components/desktop/checkout"
import { MobileCheckout } from "@/components/mobile/checkout"
import type { SavedAddress, NewAddressForm } from "@/components/desktop/checkout/checkout-types"

type CreateCheckoutSessionAction = (items: CartItem[], locale?: "en" | "bg") => Promise<CreateCheckoutSessionResult>
type GetCheckoutFeeQuoteAction = (items: CartItem[]) => Promise<CheckoutFeeQuoteResult>

export default function CheckoutPageClient({
  createCheckoutSessionAction,
  getCheckoutFeeQuoteAction,
}: {
  createCheckoutSessionAction: CreateCheckoutSessionAction
  getCheckoutFeeQuoteAction: GetCheckoutFeeQuoteAction
}) {
  const { items, totalItems, subtotal } = useCart()
  const locale = useLocale()
  const t = useTranslations("CheckoutPage")

  // ==========================================================================
  // Shared State
  // ==========================================================================
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [buyerProtectionFee, setBuyerProtectionFee] = useState(0)
  
  // Address state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // New address form
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

  // ==========================================================================
  // Data Fetching
  // ==========================================================================
  
  const fetchSavedAddresses = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setIsLoadingAddresses(false)
      setUseNewAddress(true)
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

  // Mount effect
  useEffect(() => {
    setMounted(true)
    fetchSavedAddresses()
  }, [fetchSavedAddresses])

  // Fetch buyer protection fee when items change
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
  }, [items, getCheckoutFeeQuoteAction])

  // ==========================================================================
  // Form Handlers
  // ==========================================================================
  
  const updateNewAddress = useCallback(
    (field: keyof NewAddressForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewAddress((prev) => ({ ...prev, [field]: e.target.value }))
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

  // ==========================================================================
  // Checkout Handler
  // ==========================================================================
  
  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsProcessing(true)
    try {
      const result = await createCheckoutSessionAction(items, locale === "bg" ? "bg" : "en")
      if (!result.ok) {
        alert(result.error)
        return
      }
      window.location.href = result.url
    } catch (error) {
      console.error("Checkout error:", error)
      alert(t("checkoutError"))
    } finally {
      setIsProcessing(false)
    }
  }

  // ==========================================================================
  // Loading States
  // ==========================================================================
  
  if (!mounted) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <SpinnerGap className="size-5 animate-spin text-muted-foreground" />
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

  // ==========================================================================
  // Shared Props for Desktop/Mobile
  // ==========================================================================
  
  const sharedProps = {
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
    onCheckout: handleCheckout,
  }

  // ==========================================================================
  // Render Both Mobile & Desktop (CSS controls visibility)
  // ==========================================================================
  
  return (
    <>
      {/* Mobile Checkout (hidden on lg+) */}
      <MobileCheckout {...sharedProps} />
      
      {/* Desktop Checkout (hidden below lg) */}
      <DesktopCheckout {...sharedProps} />
    </>
  )
}
