import { useEffect, useRef } from "react"
import { ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useCheckoutStep } from "./checkout-step-context"
import {
  CheckoutAddressCard,
  CheckoutOrderItemsCard,
  CheckoutShippingMethodCard,
} from "./checkout-layout-main-cards"
import {
  DesktopCheckoutSummaryCard,
  MobileCheckoutOrderSummaryCard,
  MobileCheckoutPaymentCard,
  MobileCheckoutStepFooter,
} from "./checkout-layout-summary-sections"
import { CheckoutNoticeCard } from "./checkout-notice-card"
import type { CheckoutLayoutBaseProps } from "./checkout-layout-types"

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
