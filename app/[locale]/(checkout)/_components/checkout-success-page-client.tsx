"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import type { VerifyAndCreateOrderResult } from "../_actions/checkout"
import { ArrowRight, CircleCheck as CheckCircle, Mail as Envelope, Package, LoaderCircle as SpinnerGap, CircleX as XCircle } from "lucide-react";


type SuccessState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; orderId: string | null }
  | { status: "error"; message: string }

type VerifyAndCreateOrderAction = (sessionId: string) => Promise<VerifyAndCreateOrderResult>

export default function CheckoutSuccessPageClient({
  verifyAndCreateOrderAction,
}: {
  verifyAndCreateOrderAction: VerifyAndCreateOrderAction
}) {
  const searchParams = useSearchParams()
  const t = useTranslations("CheckoutSuccessPage")

  const [state, setState] = useState<SuccessState>({ status: "idle" })

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (!sessionId) {
      setState({ status: "error", message: t("missingSession") })
      return
    }

    let cancelled = false

    ;(async () => {
      setState({ status: "loading" })
      try {
        const result = await verifyAndCreateOrderAction(sessionId)
        if (cancelled) return

        if (!result.ok) {
          setState({ status: "error", message: result.error })
          return
        }

        setState({ status: "success", orderId: result.orderId })
      } catch (err) {
        console.error(err)
        if (!cancelled) setState({ status: "error", message: t("unknownError") })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [searchParams, t])

  // Loading
  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="min-h-(--page-section-min-h) flex items-center justify-center px-3">
        <div className="text-center">
          <SpinnerGap className="size-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">{t("verifying")}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("verifyingDescription")}</p>
        </div>
      </div>
    )
  }

  // Error
  if (state.status === "error") {
    return (
      <div className="min-h-(--page-section-min-h) flex items-center justify-center px-3">
        <div className="text-center max-w-sm">
          <div className="size-14 bg-destructive-subtle rounded-full flex items-center justify-center mx-auto mb-3">
            <XCircle className="size-7 text-destructive" />
          </div>
          <p className="text-sm font-semibold mb-1">{t("paymentFailed")}</p>
          <p className="text-xs text-muted-foreground mb-4">{state.message}</p>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href="/cart">{t("backToCart")}</Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link href="/">{t("continueShopping")}</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Success
  return (
    <div className="min-h-(--page-section-min-h) flex items-center justify-center px-3">
      <div className="text-center max-w-sm w-full">
        {/* Success icon */}
        <div className="size-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="size-8 text-success" />
        </div>
        
        <h1 className="text-lg font-semibold mb-1">{t("paymentSuccessful")}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t("thankYou")}</p>

        {/* Order info */}
        {state.orderId && (
          <div className="bg-surface-subtle rounded-md px-3 py-2 mb-4 text-sm">
            <span className="text-muted-foreground">{t("orderId", { id: "" })}</span>
            <span className="font-mono font-medium ml-1">{state.orderId}</span>
          </div>
        )}

        {/* Quick info */}
        <div className="space-y-2 mb-6 text-left">
          <div className="flex items-center gap-2 text-sm">
            <Package className="size-4 text-primary shrink-0" />
            <span className="text-muted-foreground">{t("orderCreatedDescription")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Envelope className="size-4 text-primary shrink-0" />
            <span className="text-muted-foreground">{t("confirmationEmail")}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href="/orders">{t("viewOrders")}</Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link href="/">
              {t("continueShopping")}
              <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
