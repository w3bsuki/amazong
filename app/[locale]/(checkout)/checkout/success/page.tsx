"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useSearchParams, useParams } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { verifyAndCreateOrder } from "@/app/actions/checkout"
import { getOrderConversation } from "@/app/actions/orders"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  CheckCircle, 
  SpinnerGap, 
  Package,
  House,
  Warning,
  ChatCircle,
  Truck,
  UserCircle
} from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = (params?.locale as string) || "en"
  const sessionId = searchParams.get("session_id")
  const { clearCart } = useCart()
  const t = useTranslations("CheckoutSuccess")
  
  const [isVerifying, setIsVerifying] = useState(true)
  const [orderCreated, setOrderCreated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  
  // Refs to prevent duplicate API calls
  const hasVerified = useRef(false)
  const hasCartCleared = useRef(false)

  // Memoized verify function
  const verifyPayment = useCallback(async () => {
    // Prevent duplicate calls
    if (hasVerified.current || !sessionId) {
      if (!sessionId) {
        setError("No session ID found")
        setIsVerifying(false)
      }
      return
    }
    
    hasVerified.current = true

    try {
      const result = await verifyAndCreateOrder(sessionId)
      
      if (result.error) {
        // If user not authenticated or other auth issues, still show success since payment worked
        if (result.error === "User not authenticated" || result.error === "Authentication error") {
          setOrderCreated(true)
          if (!hasCartCleared.current) {
            hasCartCleared.current = true
            clearCart()
          }
        } else {
          setError(result.error)
        }
      } else if (result.success) {
        setOrderCreated(true)
        setOrderId(result.orderId || null)
        if (!hasCartCleared.current) {
          hasCartCleared.current = true
          clearCart()
        }
      }
    } catch (err) {
      console.error("Verification error:", err)
      // Payment succeeded if we got redirected here, so show success anyway
      setOrderCreated(true)
      if (!hasCartCleared.current) {
        hasCartCleared.current = true
        clearCart()
      }
    } finally {
      setIsVerifying(false)
    }
  }, [sessionId, clearCart])

  // Run verification once on mount
  useEffect(() => {
    verifyPayment()
  }, [verifyPayment])

  // Fetch conversation after order is created (non-blocking)
  useEffect(() => {
    if (!orderId || conversationId) return
    
    // Small delay to ensure trigger has time to run
    const timeoutId = setTimeout(() => {
      getOrderConversation(orderId, '').then(result => {
        if (result.conversationId) {
          setConversationId(result.conversationId)
        }
      }).catch(() => {
        // Ignore - conversation might not exist yet
      })
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [orderId, conversationId])

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

      {/* Order Flow Timeline Card */}
      <Card className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">{t("whatHappensNext") || "What happens next?"}</h2>
          
          {/* Order Flow Steps */}
          <div className="relative space-y-0">
            {/* Step 1: Order Placed - Completed */}
            <div className="flex items-start gap-3 pb-4">
              <div className="relative flex flex-col items-center">
                <div className="rounded-full bg-green-500 p-2 shrink-0">
                  <CheckCircle className="size-4 text-white" weight="fill" />
                </div>
                <div className="w-0.5 h-full bg-green-500 absolute top-8 left-1/2 -translate-x-1/2" />
              </div>
              <div className="pt-0.5">
                <p className="font-medium text-green-700">{locale === "bg" ? "Поръчката е направена" : "Order Placed"}</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "bg" ? "Продавачът е уведомен за вашата поръчка" : "Seller has been notified of your order"}
                </p>
              </div>
            </div>

            {/* Step 2: Seller Confirms - Pending */}
            <div className="flex items-start gap-3 pb-4">
              <div className="relative flex flex-col items-center">
                <div className="rounded-full bg-yellow-100 border-2 border-yellow-400 p-2 shrink-0 animate-pulse">
                  <UserCircle className="size-4 text-yellow-600" weight="fill" />
                </div>
                <div className="w-0.5 h-full bg-border absolute top-8 left-1/2 -translate-x-1/2" />
              </div>
              <div className="pt-0.5">
                <p className="font-medium text-yellow-700">{locale === "bg" ? "Изчакване потвърждение" : "Awaiting Seller Confirmation"}</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "bg" ? "Продавачът ще потвърди и подготви поръчката" : "Seller will confirm and prepare your order"}
                </p>
              </div>
            </div>

            {/* Step 3: Shipped - Future */}
            <div className="flex items-start gap-3 pb-4">
              <div className="relative flex flex-col items-center">
                <div className="rounded-full bg-muted p-2 shrink-0">
                  <Truck className="size-4 text-muted-foreground" weight="fill" />
                </div>
                <div className="w-0.5 h-full bg-border absolute top-8 left-1/2 -translate-x-1/2" />
              </div>
              <div className="pt-0.5">
                <p className="font-medium text-muted-foreground">{locale === "bg" ? "Изпращане" : "Shipped"}</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "bg" ? "Ще получите номер за проследяване" : "You'll receive a tracking number"}
                </p>
              </div>
            </div>

            {/* Step 4: Delivered - Future */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-muted p-2 shrink-0">
                  <Package className="size-4 text-muted-foreground" weight="fill" />
                </div>
              </div>
              <div className="pt-0.5">
                <p className="font-medium text-muted-foreground">{locale === "bg" ? "Доставено" : "Delivered"}</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "bg" ? "Радвайте се на покупката!" : "Enjoy your purchase!"}
                </p>
              </div>
            </div>
          </div>

          {/* Chat with Seller - Action Card */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2 shrink-0">
                  <ChatCircle className="size-5 text-blue-600 dark:text-blue-400" weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    {locale === "bg" ? "Чат с продавача" : "Chat with Seller"}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-0.5">
                    {locale === "bg" 
                      ? "Всички актуализации на поръчката ще се появяват тук"
                      : "All order updates will appear here"
                    }
                  </p>
                </div>
              </div>
              {/* Primary Chat Button */}
              <Button asChild size="default" className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={conversationId ? `/chat?conversation=${conversationId}` : `/chat`}>
                  <ChatCircle className="size-4 mr-2" weight="fill" />
                  {locale === "bg" ? "Отвори чат" : "Open Chat"}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <Button variant="outline" size="lg" asChild className="flex-1">
          <Link href="/account/orders">
            <Package className="size-4 mr-2" />
            {locale === "bg" ? "Виж поръчките ми" : "View My Orders"}
          </Link>
        </Button>
        <Button variant="ghost" size="lg" asChild className="flex-1">
          <Link href="/">
            <House className="size-4 mr-2" />
            {locale === "bg" ? "Продължи пазаруването" : "Continue Shopping"}
          </Link>
        </Button>
      </div>
    </div>
  )
}
