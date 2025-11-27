"use client"

import { useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart when the success page loads
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-lg border border-border max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-20 w-20 text-accent-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-foreground">Order Placed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been successfully processed and will be shipped soon.
        </p>
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
