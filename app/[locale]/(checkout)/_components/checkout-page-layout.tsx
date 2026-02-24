import { useEffect, useRef, type ChangeEvent, type ReactNode } from "react"
import type { CartItem } from "@/components/providers/cart-context"
import type { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle as SpinnerGap,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react"

import { AddressSection } from "./address-section"
import { OrderItemsSection, OrderItemsSectionDesktop } from "./order-items-section"
import { ShippingMethodSection } from "./shipping-method-section"
import { useCheckoutStep } from "./checkout-step-context"
import type { NewAddressForm, SavedAddress, ShippingMethod } from "./checkout-types"

type TranslationFn = ReturnType<typeof useTranslations>

type CheckoutNotice = {
  title: string
  description: string
  primaryAction: {
    label: string
    href: string
  }
  showSecondaryCartAction: boolean
}

type UpdateAddressHandler = (
  field: keyof NewAddressForm
) => (event: ChangeEvent<HTMLInputElement>) => void

type BlurFieldHandler = (field: keyof NewAddressForm) => () => void

type CheckoutLayoutBaseProps = {
  t: TranslationFn
  tAuth: TranslationFn
  checkoutNotice: CheckoutNotice | null
  authLoginHref: string
  isAuthGateActive: boolean
  isAuthenticated: boolean
  isLoadingAddresses: boolean
  savedAddresses: SavedAddress[]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string | null) => void
  useNewAddress: boolean
  setUseNewAddress: (value: boolean) => void
  newAddress: NewAddressForm
  updateNewAddress: UpdateAddressHandler
  handleBlur: BlurFieldHandler
  errors: Partial<Record<keyof NewAddressForm, string>>
  touched: Partial<Record<keyof NewAddressForm, boolean>>
  shippingMethod: ShippingMethod
  setShippingMethod: (method: ShippingMethod) => void
  formatPrice: (price: number) => string
  items: CartItem[]
  totalItems: number
  subtotal: number
  shippingCost: number
  tax: number
  buyerProtectionFee: number
  total: number
  isProcessing: boolean
  canCheckout: boolean
  onCheckout: () => void
}

function CheckoutNoticeCard({
  checkoutNotice,
  t,
  mobile,
}: {
  checkoutNotice: CheckoutNotice
  t: TranslationFn
  mobile?: boolean
}) {
  if (mobile) {
    return (
      <div role="alert" className="rounded-lg border border-border bg-surface-subtle p-3">
        <div className="flex gap-3">
          <div className="mt-0.5 shrink-0">
            <Lock className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{checkoutNotice.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{checkoutNotice.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <Button asChild size="default" className="flex-1">
                <Link href={checkoutNotice.primaryAction.href}>{checkoutNotice.primaryAction.label}</Link>
              </Button>
              {checkoutNotice.showSecondaryCartAction && (
                <Button asChild size="default" variant="secondary" className="flex-1">
                  <Link href="/cart">{t("backToCart")}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div role="alert" className="mb-5 rounded-lg border border-border bg-surface-subtle p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 size-5 text-primary" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{checkoutNotice.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{checkoutNotice.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild size="default">
            <Link href={checkoutNotice.primaryAction.href}>{checkoutNotice.primaryAction.label}</Link>
          </Button>
          {checkoutNotice.showSecondaryCartAction && (
            <Button asChild size="default" variant="secondary">
              <Link href="/cart">{t("backToCart")}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

type CheckoutLayoutVariant = "mobile" | "desktop"

function CheckoutActionButton({
  t,
  tAuth,
  authLoginHref,
  isAuthGateActive,
  isProcessing,
  canCheckout,
  onCheckout,
  nonProcessingLabel,
}: {
  t: TranslationFn
  tAuth: TranslationFn
  authLoginHref: string
  isAuthGateActive: boolean
  isProcessing: boolean
  canCheckout: boolean
  onCheckout: () => void
  nonProcessingLabel: ReactNode
}) {
  return isAuthGateActive ? (
    <Button asChild size="lg" className="w-full font-semibold">
      <Link href={authLoginHref}>
        <Lock className="mr-2 size-4" />
        {tAuth("signIn")}
      </Link>
    </Button>
  ) : (
    <Button onClick={onCheckout} disabled={isProcessing || !canCheckout} size="lg" className="w-full font-semibold">
      {isProcessing ? (
        <>
          <SpinnerGap className="mr-2 size-5 animate-spin" />
          {t("processing")}
        </>
      ) : (
        <>
          <Lock className="mr-2 size-4" />
          {nonProcessingLabel}
        </>
      )}
    </Button>
  )
}

function CheckoutAddressCard({
  variant,
  t,
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
}: CheckoutLayoutBaseProps & { variant: CheckoutLayoutVariant }) {
  if (isAuthGateActive) return null

  const headerClassName = variant === "desktop" ? "border-b px-5" : "border-b"
  const titleClassName =
    variant === "desktop"
      ? "flex items-center gap-2.5 text-base"
      : "flex items-center gap-2 text-sm"
  const iconClassName = variant === "desktop" ? "size-5 text-primary" : "size-4 text-primary"
  const contentClassName = variant === "desktop" ? "p-5 pt-4" : undefined

  return (
    <Card>
      <CardHeader className={headerClassName}>
        <div className="flex items-center justify-between">
          <CardTitle className={titleClassName}>
            <MapPin className={iconClassName} />
            {t("shippingAddress")}
          </CardTitle>
          {isAuthenticated && (
            <Link href="/account/addresses" className="text-xs font-medium text-primary">
              {t("manageAddresses")}
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>
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
        />
      </CardContent>
    </Card>
  )
}

function CheckoutShippingMethodCard({
  variant,
  t,
  isAuthGateActive,
  shippingMethod,
  setShippingMethod,
  formatPrice,
}: CheckoutLayoutBaseProps & { variant: CheckoutLayoutVariant }) {
  if (isAuthGateActive) return null

  const headerClassName = variant === "desktop" ? "border-b px-5" : "border-b"
  const titleClassName =
    variant === "desktop"
      ? "flex items-center gap-2.5 text-base"
      : "flex items-center gap-2 text-sm"
  const iconClassName = variant === "desktop" ? "size-5 text-primary" : "size-4 text-primary"
  const contentClassName = variant === "desktop" ? "p-5 pt-4" : undefined

  return (
    <Card>
      <CardHeader className={headerClassName}>
        <CardTitle className={titleClassName}>
          <Truck className={iconClassName} />
          {t("shippingMethod")}
        </CardTitle>
      </CardHeader>
      <CardContent className={contentClassName}>
        <ShippingMethodSection
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          formatPrice={formatPrice}
          {...(variant === "mobile" ? { compact: true } : {})}
        />
      </CardContent>
    </Card>
  )
}

function CheckoutOrderItemsCard({
  variant,
  t,
  items,
  totalItems,
  formatPrice,
}: CheckoutLayoutBaseProps & { variant: CheckoutLayoutVariant }) {
  const headerClassName = variant === "desktop" ? "border-b px-5" : "border-b"
  const titleClassName =
    variant === "desktop"
      ? "flex items-center gap-2.5 text-base"
      : "flex items-center gap-2 text-sm"
  const iconClassName = variant === "desktop" ? "size-5 text-primary" : "size-4 text-primary"
  const contentClassName = variant === "desktop" ? "p-5 pt-4" : undefined

  return (
    <Card>
      <CardHeader className={headerClassName}>
        <div className="flex items-center justify-between">
          <CardTitle className={titleClassName}>
            <Package className={iconClassName} />
            {t("orderItems")}
            <Badge variant="secondary" className="ml-1">
              {totalItems}
            </Badge>
          </CardTitle>
          <Link href="/cart" className="text-xs font-medium text-primary">
            {t("edit")}
          </Link>
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>
        {variant === "desktop" ? (
          <OrderItemsSectionDesktop items={items} formatPrice={formatPrice} />
        ) : (
          <OrderItemsSection items={items} formatPrice={formatPrice} />
        )}
      </CardContent>
    </Card>
  )
}

function CheckoutSummaryRows({
  variant,
  t,
  formatPrice,
  subtotal,
  buyerProtectionFee,
}: CheckoutLayoutBaseProps & { variant: CheckoutLayoutVariant }) {
  const rowClassName =
    variant === "desktop" ? "flex justify-between" : "flex justify-between text-sm"
  const valueClassName = variant === "desktop" ? "font-medium" : undefined

  return (
    <>
      <div className={rowClassName}>
        <span className="text-muted-foreground">{t("subtotal")}</span>
        <span className={valueClassName}>{formatPrice(subtotal)}</span>
      </div>
      <div className={rowClassName}>
        <span className="text-muted-foreground">{t("buyerProtection")}</span>
        <span className={valueClassName}>{formatPrice(buyerProtectionFee)}</span>
      </div>
      <p className="text-xs text-muted-foreground">{t("totalFormula")}</p>
    </>
  )
}

function MobileCheckoutOrderSummaryCard(props: CheckoutLayoutBaseProps) {
  const { t, items, total, formatPrice } = props

  return (
    <Card>
      <Accordion type="single" collapsible defaultValue="summary">
        <AccordionItem value="summary" className="border-none">
          <AccordionTrigger className="border-border flex items-center border-b px-4 py-3 hover:no-underline">
            <div className="flex flex-1 items-center justify-between">
              <span className="text-sm font-semibold">{t("orderSummary")}</span>
              <span className="text-sm font-semibold tabular-nums">{formatPrice(total)}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="space-y-4">
              <OrderItemsSectionDesktop items={items} formatPrice={formatPrice} />

              <div className="space-y-2 border-t border-border pt-3 text-sm">
                <CheckoutSummaryRows variant="mobile" {...props} />
              </div>

              <div className="flex items-baseline justify-between border-t border-border pt-3">
                <span className="text-sm font-semibold">{t("total")}</span>
                <span className="text-price font-semibold tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

function MobileCheckoutPaymentCard({ t }: { t: TranslationFn }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lock className="size-4 text-primary" />
          {t("steps.payment")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 py-4">
        {/* TODO: requires payment logic review */}
        <p className="text-sm text-muted-foreground">{t("paymentStepDescription")}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" />
          <span>{t("buyerProtectionDescription")}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function MobileCheckoutStepFooter(props: CheckoutLayoutBaseProps) {
  const {
    t,
    tAuth,
    authLoginHref,
    isAuthGateActive,
    isProcessing,
    canCheckout,
    total,
    formatPrice,
    onCheckout,
  } = props

  const { currentStep, setCurrentStep } = useCheckoutStep()

  const buttonLabel =
    currentStep === 1
      ? t("continueToShipping")
      : currentStep === 2
        ? t("continueToPayment")
        : t("completeOrder")

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background lg:hidden">
      <div className="px-inset py-3 pb-safe">
        <div className="mb-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-success" />
          <span>{t("secureCheckout")}</span>
          <span>•</span>
          <ShieldCheck className="size-3.5 text-success" />
          <span>{t("buyerProtection")}</span>
        </div>

        {isAuthGateActive ? (
          <Button asChild size="lg" className="w-full font-semibold">
            <Link href={authLoginHref}>
              <Lock className="mr-2 size-4" />
              {tAuth("signIn")} · {formatPrice(total)}
            </Link>
          </Button>
        ) : currentStep === 3 ? (
          <CheckoutActionButton
            t={t}
            tAuth={tAuth}
            authLoginHref={authLoginHref}
            isAuthGateActive={false}
            isProcessing={isProcessing}
            canCheckout={canCheckout}
            onCheckout={onCheckout}
            nonProcessingLabel={
              <>
                {t("completeOrder")} · {formatPrice(total)}
              </>
            }
          />
        ) : (
          <Button
            type="button"
            size="lg"
            className="w-full font-semibold"
            disabled={currentStep === 1 && !canCheckout}
            onClick={() => setCurrentStep(currentStep === 1 ? 2 : 3)}
          >
            {buttonLabel} · {formatPrice(total)}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function DesktopCheckoutSummaryCard(props: CheckoutLayoutBaseProps) {
  const {
    t,
    tAuth,
    authLoginHref,
    isAuthGateActive,
    formatPrice,
    total,
    isProcessing,
    canCheckout,
    onCheckout,
  } = props

  return (
    <Card className="sticky top-20">
      <CardHeader className="border-b px-5">
        <CardTitle className="text-base">{t("orderSummary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-4">
        <div className="space-y-3 text-sm">
          <CheckoutSummaryRows variant="desktop" {...props} />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-semibold">{t("total")}</span>
            <span className="text-xl font-bold">{formatPrice(total)}</span>
          </div>
        </div>

        <CheckoutActionButton
          t={t}
          tAuth={tAuth}
          authLoginHref={authLoginHref}
          isAuthGateActive={isAuthGateActive}
          isProcessing={isProcessing}
          canCheckout={canCheckout}
          onCheckout={onCheckout}
          nonProcessingLabel={t("proceedToPayment")}
        />

        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
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
  )
}

export function MobileCheckoutLayout(props: CheckoutLayoutBaseProps) {
  const { t, checkoutNotice, isAuthGateActive } = props
  const { currentStep, setCurrentStep } = useCheckoutStep()
  const hasSteppedOnce = useRef(false)

  useEffect(() => {
    if (isAuthGateActive) setCurrentStep(1)
  }, [isAuthGateActive, setCurrentStep])

  useEffect(() => {
    if (!hasSteppedOnce.current) {
      hasSteppedOnce.current = true
      return
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  const stepContent =
    currentStep === 1 ? (
      <CheckoutAddressCard variant="mobile" {...props} />
    ) : currentStep === 2 ? (
      <CheckoutShippingMethodCard variant="mobile" {...props} />
    ) : (
      <MobileCheckoutPaymentCard t={t} />
    )

  return (
    <div className="lg:hidden pb-safe">
      <h1 className="sr-only">{t("title")}</h1>

      <div className="space-y-3 px-inset pt-4">
        {checkoutNotice && <CheckoutNoticeCard checkoutNotice={checkoutNotice} t={t} mobile />}

        {stepContent}
        <MobileCheckoutOrderSummaryCard {...props} />

        <div className="h-28" aria-hidden="true" />
      </div>

      <MobileCheckoutStepFooter {...props} />
    </div>
  )
}

export function DesktopCheckoutLayout(props: CheckoutLayoutBaseProps) {
  const { t, checkoutNotice } = props

  return (
    <div className="hidden py-6 lg:block">
      <div className="container max-w-5xl">
        {checkoutNotice && <CheckoutNoticeCard checkoutNotice={checkoutNotice} t={t} />}

        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("backToCart")}
          </Link>
          <h1 className="text-lg font-semibold">{t("title")}</h1>
          <div className="w-20" aria-hidden="true" />
        </div>

        <div className="flex items-start gap-6 lg:gap-8">
          <div className="flex-1 space-y-4">
            <CheckoutAddressCard variant="desktop" {...props} />
            <CheckoutShippingMethodCard variant="desktop" {...props} />
            <CheckoutOrderItemsCard variant="desktop" {...props} />
          </div>

          <div className="w-96 shrink-0">
            <DesktopCheckoutSummaryCard {...props} />
          </div>
        </div>
      </div>
    </div>
  )
}

