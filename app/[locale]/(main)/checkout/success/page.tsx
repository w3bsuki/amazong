"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { useCart } from "@/lib/cart-context"
import { useSearchParams } from "next/navigation"
import { CheckCircle, SpinnerGap, WarningCircle } from "@phosphor-icons/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { verifyAndCreateOrder } from "@/app/actions/checkout"

function CheckoutSuccessContent() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const hasClearedCart = useRef(false)
  const hasVerifiedOrder = useRef(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [orderStatus, setOrderStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    // Clear the cart when the success page loads (only once)
    if (!hasClearedCart.current) {
      clearCart()
      hasClearedCart.current = true
    }

    // Verify and create order if needed
    const verifyOrder = async () => {
      if (hasVerifiedOrder.current) return
      hasVerifiedOrder.current = true

      const sessionId = searchParams.get('session_id')
      if (!sessionId) {
        setOrderStatus('success') // Assume success if no session ID (maybe direct navigation)
        setIsVerifying(false)
        return
      }

      try {
        const result = await verifyAndCreateOrder(sessionId)
        if (result.success || result.orderId) {
          setOrderStatus('success')
          setOrderId(result.orderId || null)
        } else {
          console.error('Order verification failed:', result.error)
          setOrderStatus('error')
        }
      } catch (error) {
        console.error('Order verification error:', error)
        setOrderStatus('error')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyOrder()
  }, [clearCart, searchParams])

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-lg border border-border max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <SpinnerGap className="h-20 w-20 text-brand animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-foreground">Processing Your Order...</h1>
          <p className="text-muted-foreground">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    )
  }

  if (orderStatus === 'error') {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-lg border border-border max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <WarningCircle className="h-20 w-20 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-foreground">Order Processing Issue</h1>
          <p className="text-muted-foreground mb-8">
            Your payment was successful, but we had trouble recording your order. 
            Please contact support with your payment confirmation email.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/">
              <Button className="w-full bg-brand hover:bg-brand/90 text-foreground border-none">
                Return Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-lg border border-border max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-20 w-20 text-accent-foreground" weight="fill" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-foreground">Order Placed!</h1>
        <p className="text-muted-foreground mb-2">
          Thank you for your purchase. Your order has been successfully processed and will be shipped soon.
        </p>
        {orderId && (
          <p className="text-sm text-muted-foreground mb-8">
            Order ID: <span className="font-mono text-foreground">{orderId.slice(0, 8)}</span>
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full bg-brand hover:bg-brand/90 text-foreground border-none">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="outline" className="w-full">
              View Your Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-lg border border-border max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <SpinnerGap className="h-20 w-20 text-brand animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-foreground">Loading...</h1>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
