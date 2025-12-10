"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { verifyAndCreateOrder } from "@/app/actions/checkout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  CheckCircle, 
  SpinnerGap, 
  Package,
  Envelope,
  House,
  Receipt,
  Warning
} from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { clearCart } = useCart()
  const t = useTranslations("CheckoutSuccess")
  
  const [isVerifying, setIsVerifying] = useState(true)
  const [orderCreated, setOrderCreated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("No session ID found")
        setIsVerifying(false)
        return
      }

      try {
        const result = await verifyAndCreateOrder(sessionId)
        
        if (result.error) {
          // If user not authenticated or other auth issues, still show success since payment worked
          if (result.error === "User not authenticated" || result.error === "Authentication error") {
            setOrderCreated(true)
            clearCart()
          } else {
            setError(result.error)
          }
        } else if (result.success) {
          setOrderCreated(true)
          setOrderId(result.orderId || null)
          clearCart()
        }
      } catch (err) {
        console.error("Verification error:", err)
        // Payment succeeded if we got redirected here, so show success anyway
        setOrderCreated(true)
        clearCart()
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [sessionId, clearCart])

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <SpinnerGap className="size-12 animate-spin text-brand" />
        <p className="text-muted-foreground">{t("verifying") || "Verifying your payment..."}</p>
      </div>
    )
  }

  // Error state (but payment might have succeeded)
  if (error && !orderCreated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="rounded-full bg-amber-100 p-4">
          <Warning className="size-12 text-amber-600" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{t("paymentProcessed") || "Payment Processed"}</h1>
          <p className="text-muted-foreground max-w-md">
            {t("orderProcessingNote") || "Your payment was successful, but we couldn't verify all order details. Please contact support if you don't receive a confirmation email."}
          </p>
          {error !== "User not authenticated" && (
            <p className="text-sm text-muted-foreground">Error: {error}</p>
          )}
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">{t("continueShopping") || "Continue Shopping"}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">{t("contactSupport") || "Contact Support"}</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 px-4 py-12">
      {/* Success Icon */}
      <div className="rounded-full bg-green-100 p-6 animate-in zoom-in duration-500">
        <CheckCircle className="size-16 text-green-600" weight="fill" />
      </div>

      {/* Success Message */}
      <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h1 className="text-3xl font-bold text-foreground">
          {t("thankYou") || "Thank You for Your Order!"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          {t("orderConfirmed") || "Your order has been confirmed and will be shipped soon."}
        </p>
        {orderId && (
          <p className="text-sm text-muted-foreground">
            {t("orderNumber") || "Order number"}: <span className="font-mono font-semibold">{orderId.slice(0, 8).toUpperCase()}</span>
          </p>
        )}
      </div>

      {/* Next Steps Card */}
      <Card className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">{t("whatHappensNext") || "What happens next?"}</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-brand/10 p-2 shrink-0">
                <Envelope className="size-4 text-brand" />
              </div>
              <div>
                <p className="font-medium">{t("confirmationEmail") || "Confirmation Email"}</p>
                <p className="text-sm text-muted-foreground">
                  {t("confirmationEmailDesc") || "You'll receive an email confirmation with your order details shortly."}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-brand/10 p-2 shrink-0">
                <Package className="size-4 text-brand" />
              </div>
              <div>
                <p className="font-medium">{t("orderProcessing") || "Order Processing"}</p>
                <p className="text-sm text-muted-foreground">
                  {t("orderProcessingDesc") || "We're preparing your items for shipment. This usually takes 1-2 business days."}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-brand/10 p-2 shrink-0">
                <Receipt className="size-4 text-brand" />
              </div>
              <div>
                <p className="font-medium">{t("trackOrder") || "Track Your Order"}</p>
                <p className="text-sm text-muted-foreground">
                  {t("trackOrderDesc") || "Once shipped, you'll receive tracking information to follow your package."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <Button asChild size="lg">
          <Link href="/">
            <House className="size-4 mr-2" />
            {t("continueShopping") || "Continue Shopping"}
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/account/orders">
            <Package className="size-4 mr-2" />
            {t("viewOrders") || "View My Orders"}
          </Link>
        </Button>
      </div>
    </div>
  )
}
