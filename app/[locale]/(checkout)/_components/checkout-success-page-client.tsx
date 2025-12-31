"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { verifyAndCreateOrder } from "../_actions/checkout"
import {
  CheckCircle,
  XCircle,
  SpinnerGap,
  Package,
  ChatCircleText,
  ArrowRight,
} from "@phosphor-icons/react"

type SuccessState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; orderId: string | null }
  | { status: "error"; message: string }

export default function CheckoutSuccessPageClient() {
  const searchParams = useSearchParams()
  const locale = useLocale()
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
        const result = await verifyAndCreateOrder(sessionId)
        if (cancelled) return

        if (result?.error) {
          setState({ status: "error", message: result.error })
          return
        }

        setState({ status: "success", orderId: result?.orderId ?? null })
      } catch (err) {
        console.error(err)
        if (!cancelled) setState({ status: "error", message: t("unknownError") })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [searchParams, t])

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-0 shadow-sm">
        <CardContent className="p-8">
          {state.status === "loading" && (
            <div className="text-center">
              <div className="size-20 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <SpinnerGap className="size-10 text-brand animate-spin" />
              </div>
              <h1 className="text-2xl font-semibold mb-2">{t("verifying")}</h1>
              <p className="text-muted-foreground">{t("verifyingDescription")}</p>
            </div>
          )}

          {state.status === "error" && (
            <div className="text-center">
              <div className="size-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="size-10 text-destructive" weight="fill" />
              </div>
              <h1 className="text-2xl font-semibold mb-2">{t("paymentFailed")}</h1>
              <p className="text-muted-foreground mb-6">{state.message}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/cart">{t("backToCart")}</Link>
                </Button>
                <Button asChild className="rounded-full bg-brand hover:bg-brand/90 text-white">
                  <Link href="/">{t("continueShopping")}</Link>
                </Button>
              </div>
            </div>
          )}

          {state.status === "success" && (
            <div>
              <div className="text-center">
                <div className="size-20 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="size-10 text-brand-success" weight="fill" />
                </div>
                <h1 className="text-2xl font-semibold mb-2">{t("paymentSuccessful")}</h1>
                <p className="text-muted-foreground">{t("thankYou")}</p>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="size-5 text-brand" />
                  <div>
                    <p className="font-medium">{t("orderCreated")}</p>
                    <p className="text-sm text-muted-foreground">{t("orderCreatedDescription")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ChatCircleText className="size-5 text-brand" />
                  <div>
                    <p className="font-medium">{t("sellerChat")}</p>
                    <p className="text-sm text-muted-foreground">{t("sellerChatDescription")}</p>
                  </div>
                </div>

                {state.orderId && (
                  <div className="pt-1">
                    <Badge variant="secondary" className="bg-brand/10 text-brand border-0">
                      {t("orderId", { id: state.orderId })}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" className="rounded-full flex-1">
                  <Link href="/orders">{t("viewOrders")}</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-brand hover:bg-brand/90 text-white flex-1"
                >
                  <Link href="/">
                    {t("continueShopping")} <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-5">
                {locale === "bg"
                  ? "Ще получите имейл с потвърждение, ако е наличен."
                  : "You’ll receive a confirmation email if available."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
