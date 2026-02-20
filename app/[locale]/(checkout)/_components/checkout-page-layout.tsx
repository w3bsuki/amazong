import type { ChangeEvent, ReactNode } from "react"
import type { CartItem } from "@/components/providers/cart-context"
import type { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
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
  showAddressSelector: boolean
  setShowAddressSelector: (value: boolean) => void
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
              <Button asChild size="sm" className="flex-1">
                <Link href={checkoutNotice.primaryAction.href}>{checkoutNotice.primaryAction.label}</Link>
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
          <Button asChild size="sm">
            <Link href={checkoutNotice.primaryAction.href}>{checkoutNotice.primaryAction.label}</Link>
          </Button>
          {checkoutNotice.showSecondaryCartAction && (
            <Button asChild size="sm" variant="secondary">
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
  showAddressSelector,
  setShowAddressSelector,
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
          showAddressSelector={showAddressSelector}
          setShowAddressSelector={setShowAddressSelector}
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
  shippingCost,
  tax,
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
        <span className="text-muted-foreground">{t("shipping")}</span>
        <span
          className={
            variant === "desktop"
              ? cn("font-medium", shippingCost === 0 && "text-success")
              : shippingCost === 0
                ? "font-medium text-success"
                : ""
          }
        >
          {shippingCost === 0 ? t("free") : formatPrice(shippingCost)}
        </span>
      </div>
      <div className={rowClassName}>
        <span className="text-muted-foreground">{t("tax", { percent: 10 })}</span>
        <span className={valueClassName}>{formatPrice(tax)}</span>
      </div>
      <div className={rowClassName}>
        <span className="text-muted-foreground">{t("buyerProtection")}</span>
        <span className={valueClassName}>{formatPrice(buyerProtectionFee)}</span>
      </div>
    </>
  )
}

function MobileCheckoutSummaryCard(props: CheckoutLayoutBaseProps) {
  const { t, formatPrice, total } = props

  return (
    <Card>
      <CardContent className="space-y-2 py-4">
        <CheckoutSummaryRows variant="mobile" {...props} />
        <div className="mt-2 flex justify-between border-t pt-2">
          <span className="font-semibold">{t("total")}</span>
          <span className="text-lg font-bold">{formatPrice(total)}</span>
        </div>
      </CardContent>
    </Card>
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
  const { t, checkoutNotice } = props

  return (
    <div className="lg:hidden pb-safe">
      <h1 className="sr-only">{t("title")}</h1>

      <div className="space-y-3 p-4">
        {checkoutNotice && <CheckoutNoticeCard checkoutNotice={checkoutNotice} t={t} mobile />}

        <CheckoutAddressCard variant="mobile" {...props} />
        <CheckoutShippingMethodCard variant="mobile" {...props} />
        <CheckoutOrderItemsCard variant="mobile" {...props} />
        <MobileCheckoutSummaryCard {...props} />

        <div className="flex items-center justify-center gap-4 py-1 text-2xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="size-3" />
            {t("securePayment")}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3" />
            {t("buyerProtection")}
          </span>
        </div>

        <div className="h-20" aria-hidden="true" />
      </div>
    </div>
  )
}

export function MobileStickyCheckoutFooter({
  t,
  tAuth,
  authLoginHref,
  isAuthGateActive,
  isProcessing,
  canCheckout,
  total,
  formatPrice,
  onCheckout,
  isAtBottom,
}: {
  t: TranslationFn
  tAuth: TranslationFn
  authLoginHref: string
  isAuthGateActive: boolean
  isProcessing: boolean
  canCheckout: boolean
  total: number
  formatPrice: (price: number) => string
  onCheckout: () => void
  isAtBottom: boolean
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background motion-safe:transition-transform motion-safe:duration-300 motion-reduce:transition-none lg:hidden",
        isAtBottom ? "translate-y-full" : "translate-y-0"
      )}
    >
      <div className="px-4 py-3 pb-safe">
        <div className="mb-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-success" />
          <span>{t("secureCheckout")}</span>
          <span>•</span>
          <ShieldCheck className="size-3.5 text-success" />
          <span>{t("buyerProtection")}</span>
        </div>

        <CheckoutActionButton
          t={t}
          tAuth={tAuth}
          authLoginHref={authLoginHref}
          isAuthGateActive={isAuthGateActive}
          isProcessing={isProcessing}
          canCheckout={canCheckout}
          onCheckout={onCheckout}
          nonProcessingLabel={
            <>
              {t("completeOrder")} · {formatPrice(total)}
            </>
          }
        />
      </div>
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

