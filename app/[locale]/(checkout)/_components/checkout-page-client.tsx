"use client"

import { useEffect, useState, useCallback } from "react"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import {
  ShoppingCart,
  SpinnerGap,
  Lock,
  ArrowLeft,
  Check,
  Truck,
  Lightning,
  Airplane,
  Package,
  MapPin,
  ShieldCheck,
  WarningCircle,
  Pencil,
} from "@phosphor-icons/react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import type { CheckoutFeeQuoteResult, CreateCheckoutSessionResult } from "../_actions/checkout"

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

interface NewAddressForm {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
}

const SHIPPING_COSTS = {
  standard: 0,
  express: 9.99,
  overnight: 19.99,
} as const

type ShippingMethod = keyof typeof SHIPPING_COSTS

type CreateCheckoutSessionAction = (items: CartItem[], locale?: "en" | "bg") => Promise<CreateCheckoutSessionResult>

type GetCheckoutFeeQuoteAction = (items: CartItem[]) => Promise<CheckoutFeeQuoteResult>

export default function CheckoutPageClient({
  createCheckoutSessionAction,
  getCheckoutFeeQuoteAction,
}: {
  createCheckoutSessionAction: CreateCheckoutSessionAction
  getCheckoutFeeQuoteAction: GetCheckoutFeeQuoteAction
}) {
  const { items, isReady, totalItems, subtotal } = useCart()
  const locale = useLocale()
  const t = useTranslations("CheckoutPage")

  const [isProcessing, setIsProcessing] = useState(false)
  const [buyerProtectionFee, setBuyerProtectionFee] = useState(0)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard")
  const [mounted, setMounted] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
      return fields.every((field) => {
        const value = newAddress[field]
        return value && value.trim() && !validateField(field)
      })
    }
    return false
  }, [useNewAddress, selectedAddressId, newAddress, validateField])

  // Loading state
  if (!mounted || !isReady) {
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

  return (
    <div className="bg-muted/30 min-h-screen">
      {/* Mobile */}
      <div className="lg:hidden pb-24">
        {/* Accessible page title - sr-only on mobile since header shows step progress */}
        <h1 className="sr-only">{t("title")}</h1>
        {/* Delivery */}
        <div className="bg-card px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-brand" weight="fill" />
              <span className="text-sm font-semibold">{t("shippingAddress")}</span>
            </div>
            {isAuthenticated && (
              <Link href="/account/addresses" className="text-xs text-brand font-medium">{t("manageAddresses")}</Link>
            )}
          </div>
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
            t={t}
          />
        </div>

        <div className="h-2 bg-muted" />

        {/* Shipping */}
        <div className="bg-card px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="size-4 text-brand" weight="fill" />
            <span className="text-sm font-semibold">{t("shippingMethod")}</span>
          </div>
          <ShippingMethodSection
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            formatPrice={formatPrice}
            t={t}
            compact
          />
        </div>

        <div className="h-2 bg-muted" />

        {/* Items */}
        <div className="bg-card px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-brand" weight="fill" />
              <span className="text-sm font-semibold">{t("orderItems")}</span>
              <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium">{totalItems}</span>
            </div>
            <Link href="/cart" className="text-xs text-brand font-medium">{t("edit")}</Link>
          </div>
          <OrderItemsSection items={items} formatPrice={formatPrice} t={t} />
        </div>

        <div className="h-2 bg-muted" />

        {/* Summary */}
        <div className="bg-card px-4 py-3 space-y-2">
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
          <div className="flex justify-between pt-1.5 border-t border-border mt-1.5">
            <span className="font-semibold">{t("total")}</span>
            <span className="font-bold text-base">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Trust */}
        <div className="px-3 py-2.5 flex items-center justify-center gap-4 text-2xs text-muted-foreground">
          <span className="flex items-center gap-1"><Lock className="size-3" weight="fill" />{t("securePayment")}</span>
          <span className="flex items-center gap-1"><ShieldCheck className="size-3" weight="fill" />{t("buyerProtection")}</span>
        </div>
      </div>

      {/* Mobile sticky footer - hide when scrolled to bottom */}
      <div className={cn(
        "lg:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border pb-safe z-40 transition-transform duration-300",
        isAtBottom ? "translate-y-full" : "translate-y-0"
      )}>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground justify-center">
            <Lock className="size-3.5 text-success" weight="fill" />
            <span>{t("secureCheckout")}</span>
            <span>•</span>
            <ShieldCheck className="size-3.5 text-success" weight="fill" />
            <span>{t("buyerProtection")}</span>
          </div>
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
                <Lock className="size-4 mr-2" weight="fill" />
                {t("completeOrder")} · {formatPrice(total)}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block py-6">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-5">
            <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" />{t("backToCart")}
            </Link>
            <h1 className="text-lg font-semibold">{t("title")}</h1>
            <div className="w-20" aria-hidden="true" />{/* Spacer for centering */}
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Main */}
            <div className="col-span-7 space-y-4">
              {/* Address */}
              <section className="bg-card border border-border/60 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="size-5 text-brand" weight="fill" />
                    <h2 className="text-base font-semibold">{t("shippingAddress")}</h2>
                  </div>
                  {isAuthenticated && <Link href="/account/addresses" className="text-xs text-brand font-medium">{t("manageAddresses")}</Link>}
                </div>
                <div className="p-5">
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
                    t={t}
                  />
                </div>
              </section>

              {/* Shipping */}
              <section className="bg-card border border-border/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/50">
                  <Truck className="size-5 text-brand" weight="fill" />
                  <h2 className="text-base font-semibold">{t("shippingMethod")}</h2>
                </div>
                <div className="p-5">
                  <ShippingMethodSection
                    shippingMethod={shippingMethod}
                    setShippingMethod={setShippingMethod}
                    formatPrice={formatPrice}
                    t={t}
                  />
                </div>
              </section>

              {/* Items */}
              <section className="bg-card border border-border/60 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                  <div className="flex items-center gap-2.5">
                    <Package className="size-5 text-brand" weight="fill" />
                    <h2 className="text-base font-semibold">{t("orderItems")}</h2>
                    <Badge variant="secondary" className="ml-1">{totalItems}</Badge>
                  </div>
                  <Link href="/cart" className="text-xs text-brand font-medium">{t("edit")}</Link>
                </div>
                <div className="p-5">
                  <OrderItemsSectionDesktop items={items} formatPrice={formatPrice} t={t} />
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="col-span-5">
              <div className="sticky top-20 bg-card border border-border/60 rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50">
                  <h2 className="text-base font-semibold">{t("orderSummary") || "Order Summary"}</h2>
                </div>
                <div className="p-5 space-y-4">
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

                  <Separator />

                  <div className="rounded-lg bg-muted/30 p-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-semibold">{t("total")}</span>
                      <span className="text-2xl font-bold text-brand">{formatPrice(total)}</span>
                    </div>
                  </div>

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
                        <Lock className="size-4 mr-2" weight="fill" />
                        {t("proceedToPayment")}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5">
                      <Lock className="size-3.5 text-success" weight="fill" />
                      <span>{t("secureCheckout")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-success" weight="fill" />
                      <span>{t("buyerProtection")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
 * Sub-components
 * ============================================================================ */

interface AddressSectionProps {
  isLoadingAddresses: boolean
  savedAddresses: SavedAddress[]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string) => void
  useNewAddress: boolean
  setUseNewAddress: (value: boolean) => void
  newAddress: NewAddressForm
  updateNewAddress: (
    field: keyof NewAddressForm
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (field: keyof NewAddressForm) => () => void
  errors: Partial<Record<keyof NewAddressForm, string>>
  touched: Partial<Record<keyof NewAddressForm, boolean>>
  showAddressSelector: boolean
  setShowAddressSelector: (value: boolean) => void
  t: ReturnType<typeof useTranslations<"CheckoutPage">>
}

function AddressSection({
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
  showAddressSelector,
  setShowAddressSelector,
  t,
}: AddressSectionProps) {
  if (isLoadingAddresses) {
    return <div className="py-3 text-center"><SpinnerGap className="size-4 animate-spin text-muted-foreground mx-auto" /></div>
  }

  if (savedAddresses.length > 0 && !useNewAddress) {
    const selected = savedAddresses.find(a => a.id === selectedAddressId)
    return (
      <>
        {/* Selected address card */}
        {selected && (
          <div className="rounded-lg border-2 border-brand bg-brand/5 p-4">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <MapPin className="size-5 text-brand" weight="fill" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{selected.label}</span>
                  {selected.is_default && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {t("default") || "Default"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium">{selected.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {selected.address_line1}
                  {selected.address_line2 && `, ${selected.address_line2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selected.city}, {selected.state} {selected.postal_code}
                </p>
              </div>
              <Check className="size-5 text-brand shrink-0" weight="bold" />
            </div>
            {savedAddresses.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddressSelector(true)}
                className="w-full mt-3"
              >
                {t("changeAddress") || "Change address"}
              </Button>
            )}
          </div>
        )}

        {/* Address selector modal */}
        <Sheet open={showAddressSelector} onOpenChange={setShowAddressSelector}>
          <SheetContent side="bottom" className="h-5/6">
            <SheetHeader>
              <SheetTitle>{t("selectShippingAddress") || "Select shipping address"}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex h-full flex-col gap-3 overflow-hidden pb-4">
              <RadioGroup
                value={selectedAddressId || ""}
                onValueChange={(v) => {
                  setSelectedAddressId(v)
                  setShowAddressSelector(false)
                }}
                className="flex-1 space-y-3 overflow-auto"
              >
                {savedAddresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId
                  return (
                    <label
                      key={addr.id}
                      htmlFor={`addr-${addr.id}`}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-md border-2 cursor-pointer transition-all",
                        isSelected
                          ? "border-brand bg-brand/5 shadow-sm"
                          : "border-border hover:border-brand/30"
                      )}
                    >
                      <RadioGroupItem value={addr.id} id={`addr-${addr.id}`} className="shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{addr.label}</span>
                          {addr.is_default && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {t("default") || "Default"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{addr.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {addr.address_line1}
                          {addr.address_line2 && `, ${addr.address_line2}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {addr.city}, {addr.state} {addr.postal_code}
                        </p>
                      </div>
                      {isSelected && <Check className="size-5 text-brand shrink-0" weight="bold" />}
                    </label>
                  )
                })}
              </RadioGroup>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddressSelector(false)
                  setUseNewAddress(true)
                }}
                className="w-full"
              >
                <MapPin className="size-4 mr-2" weight="regular" />
                {t("addNewAddress") || "+ Add new address"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Add new address option */}
        <button
          type="button"
          onClick={() => setUseNewAddress(true)}
          className="text-xs text-brand mt-3 block font-medium"
        >
          + {t("useNewAddress")}
        </button>
      </>
    )
  }

  return (
    <div className="space-y-3">
      {savedAddresses.length > 0 && (
        <button type="button" onClick={() => setUseNewAddress(false)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5">
          <ArrowLeft className="size-4" />{t("backToSaved")}
        </button>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-sm font-medium">
            {t("firstName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder={t("firstName")}
            value={newAddress.firstName}
            onChange={updateNewAddress("firstName")}
            onBlur={handleBlur("firstName")}
            className={cn(
              touched.firstName && errors.firstName && "border-destructive"
            )}
            aria-invalid={!!(touched.firstName && errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
          />
          {touched.firstName && errors.firstName && (
            <p id="firstName-error" className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3.5 shrink-0" weight="fill" />
              <span>{errors.firstName}</span>
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-sm font-medium">
            {t("lastName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder={t("lastName")}
            value={newAddress.lastName}
            onChange={updateNewAddress("lastName")}
            onBlur={handleBlur("lastName")}
            className={cn(
              touched.lastName && errors.lastName && "border-destructive"
            )}
            aria-invalid={!!(touched.lastName && errors.lastName)}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
          />
          {touched.lastName && errors.lastName && (
            <p id="lastName-error" className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3.5 shrink-0" weight="fill" />
              <span>{errors.lastName}</span>
            </p>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-sm font-medium">
          {t("address")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address"
          placeholder={t("address")}
          value={newAddress.address}
          onChange={updateNewAddress("address")}
          onBlur={handleBlur("address")}
          className={cn(
            touched.address && errors.address && "border-destructive"
          )}
          aria-invalid={!!(touched.address && errors.address)}
          aria-describedby={errors.address ? "address-error" : undefined}
        />
        {touched.address && errors.address && (
          <p id="address-error" className="text-xs text-destructive flex items-center gap-1">
            <WarningCircle className="size-3.5 shrink-0" weight="fill" />
            <span>{errors.address}</span>
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-sm font-medium">
            {t("city")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            placeholder={t("city")}
            value={newAddress.city}
            onChange={updateNewAddress("city")}
            onBlur={handleBlur("city")}
            className={cn(
              touched.city && errors.city && "border-destructive"
            )}
            aria-invalid={!!(touched.city && errors.city)}
            aria-describedby={errors.city ? "city-error" : undefined}
          />
          {touched.city && errors.city && (
            <p id="city-error" className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3.5 shrink-0" weight="fill" />
              <span>{errors.city}</span>
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="state" className="text-sm font-medium">
            {t("state")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="state"
            placeholder={t("state")}
            value={newAddress.state}
            onChange={updateNewAddress("state")}
            onBlur={handleBlur("state")}
            className={cn(
              touched.state && errors.state && "border-destructive"
            )}
            aria-invalid={!!(touched.state && errors.state)}
            aria-describedby={errors.state ? "state-error" : undefined}
          />
          {touched.state && errors.state && (
            <p id="state-error" className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3.5 shrink-0" weight="fill" />
              <span>{errors.state}</span>
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="zip" className="text-sm font-medium">
            {t("zipCode")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="zip"
            placeholder="10001"
            value={newAddress.zip}
            onChange={updateNewAddress("zip")}
            onBlur={handleBlur("zip")}
            className={cn(
              touched.zip && errors.zip && "border-destructive"
            )}
            aria-invalid={!!(touched.zip && errors.zip)}
            aria-describedby={errors.zip ? "zip-error" : undefined}
          />
          {touched.zip && errors.zip && (
            <p id="zip-error" className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3.5 shrink-0" weight="fill" />
              <span>{errors.zip}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

interface ShippingMethodSectionProps {
  shippingMethod: ShippingMethod
  setShippingMethod: (method: ShippingMethod) => void
  formatPrice: (price: number) => string
  t: ReturnType<typeof useTranslations<"CheckoutPage">>
  compact?: boolean
}

function ShippingMethodSection({ shippingMethod, setShippingMethod, formatPrice, t, compact }: ShippingMethodSectionProps) {
  const options = [
    { id: "standard" as const, label: t("standardShipping"), short: t("free"), days: t("standardDays"), price: 0, icon: Truck },
    { id: "express" as const, label: t("expressShipping"), short: formatPrice(9.99), days: t("expressDays"), price: 9.99, icon: Lightning },
    { id: "overnight" as const, label: t("overnightShipping"), short: formatPrice(19.99), days: t("overnightDays"), price: 19.99, icon: Airplane },
  ]

  // Full-width vertical cards for mobile (better tap targets)
  if (compact) {
    return (
      <RadioGroup value={shippingMethod} onValueChange={(v) => setShippingMethod(v as ShippingMethod)} className="space-y-2">
        {options.map((opt) => {
          const Icon = opt.icon
          const isSelected = shippingMethod === opt.id
          return (
            <label
              key={opt.id}
              htmlFor={`shipping-${opt.id}`}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                isSelected
                  ? "border-brand bg-brand/5"
                  : "border-border hover:border-brand/30"
              )}
            >
              <RadioGroupItem value={opt.id} id={`shipping-${opt.id}`} className="shrink-0" />
              <Icon className={cn("size-5", isSelected ? "text-brand" : "text-muted-foreground")} weight={isSelected ? "fill" : "regular"} />
              <div className="flex-1">
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.days}</p>
              </div>
              <span className={cn("text-sm font-semibold", opt.price === 0 ? "text-success" : "")}>
                {opt.price === 0 ? t("free") : formatPrice(opt.price)}
              </span>
            </label>
          )
        })}
      </RadioGroup>
    )
  }

  // Full cards for desktop
  return (
    <RadioGroup value={shippingMethod} onValueChange={(v) => setShippingMethod(v as ShippingMethod)} className="space-y-2">
      {options.map((opt) => {
        const Icon = opt.icon
        return (
          <label key={opt.id} htmlFor={opt.id} className={cn(
            "flex items-center justify-between p-2.5 border rounded-md cursor-pointer transition-colors",
            shippingMethod === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
          )}>
            <div className="flex items-center gap-2.5">
              <RadioGroupItem value={opt.id} id={opt.id} />
              <Icon className={cn("size-4", shippingMethod === opt.id ? "text-primary" : "text-muted-foreground")} />
              <div>
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.days}</div>
              </div>
            </div>
            <span className={cn("text-sm font-medium", opt.price === 0 ? "text-success" : "")}>{opt.price === 0 ? t("free") : formatPrice(opt.price)}</span>
          </label>
        )
      })}
    </RadioGroup>
  )
}

interface OrderItemsSectionProps {
  items: ReturnType<typeof useCart>["items"]
  formatPrice: (price: number) => string
  t: ReturnType<typeof useTranslations<"CheckoutPage">>
}

function OrderItemsSection({ items, formatPrice, t }: OrderItemsSectionProps) {
  // Mobile: compact stacked thumbnails
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex -space-x-1.5">
        {items.slice(0, 4).map((item, i) => (
          <div key={item.id} className="size-9 rounded border-2 border-card bg-muted overflow-hidden shrink-0" style={{ zIndex: 4 - i }}>
            <Image src={item.image || "/placeholder.svg"} alt={item.title} width={36} height={36} className="size-full object-contain" />
          </div>
        ))}
        {items.length > 4 && (
          <div className="size-9 rounded border-2 border-card bg-muted flex items-center justify-center text-2xs font-medium text-muted-foreground">
            +{items.length - 4}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {items.length === 1 && items[0] ? (
          <p className="text-sm line-clamp-1">{items[0].title}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{items.length} {t("items") || "items"}</p>
        )}
      </div>
      <p className="text-sm font-semibold">{formatPrice(items.reduce((sum, i) => sum + i.price * i.quantity, 0))}</p>
    </div>
  )
}

function OrderItemsSectionDesktop({ items, formatPrice, t }: OrderItemsSectionProps) {
  // Desktop: show actual items list
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex gap-3">
          <div className="size-14 rounded border border-border bg-muted overflow-hidden shrink-0">
            <Image src={item.image || "/placeholder.svg"} alt={item.title} width={56} height={56} className="size-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm line-clamp-1 font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{t("qty")}: {item.quantity}</p>
          </div>
          <p className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
        </div>
      ))}
    </div>
  )
}
