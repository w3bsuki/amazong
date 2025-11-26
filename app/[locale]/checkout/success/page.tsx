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
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg border border-border max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Order Placed!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Thank you for your purchase. Your order has been successfully processed and will be shipped soon.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full bg-[#f7ca00] hover:bg-[#f2bd00] text-black border-none">
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
