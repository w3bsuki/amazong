import type { ReactNode } from "react"
import {
  ArrowRight,
  LoaderCircle as SpinnerGap,
  Lock,
  ShieldCheck,
} from "lucide-react"
import { Link } from "@/i18n/routing"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderItemsSectionDesktop } from "./order-items-section"
import { useCheckoutStep } from "./checkout-step-context"
import type { CheckoutLayoutBaseProps, CheckoutLayoutVariant, TranslationFn } from "./checkout-layout-types"

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

export function MobileCheckoutOrderSummaryCard(props: CheckoutLayoutBaseProps) {
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

export function MobileCheckoutPaymentCard({ t }: { t: TranslationFn }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lock className="size-4 text-primary" />
          {t("steps.payment")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 py-4">
        <p className="text-sm text-muted-foreground">{t("paymentStepDescription")}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" />
          <span>{t("buyerProtectionDescription")}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function MobileCheckoutStepFooter(props: CheckoutLayoutBaseProps) {
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

export function DesktopCheckoutSummaryCard(props: CheckoutLayoutBaseProps) {
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
