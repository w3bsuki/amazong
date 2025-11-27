"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"
import { createCheckoutSession } from "@/app/actions/checkout"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/app-breadcrumb"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart()

  const handleCheckout = async () => {
    if (items.length === 0) return

    // In a real app, this would call a server action to create a Stripe session
    // For this demo, we'll simulate the checkout redirection
    const formData = new FormData()
    formData.append("items", JSON.stringify(items))

    // Call the server action
    const { url, error } = await createCheckoutSession(items)
    if (error) {
      alert(error) // Simple alert for now, or use toast if available
      return
    }
    if (url) {
      window.location.href = url
    }
  }

  if (items.length === 0) {
    return (
      <div className="container py-4 bg-background min-h-screen">
        <AppBreadcrumb items={breadcrumbPresets.cart} />
        
        <div className="bg-card p-8 rounded border border-border mt-4">
          <h1 className="text-2xl font-bold mb-4">Your Amazon Cart is empty.</h1>
          <p className="mb-6">
            Your Shopping Cart lives to serve. Give it purpose — fill it with groceries, clothing, household supplies,
            electronics, and more. Continue shopping on the{" "}
            <Link href="/" className="text-link hover:underline">
              Amazon.com homepage
            </Link>
            .
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4 bg-muted min-h-screen">
      <AppBreadcrumb items={breadcrumbPresets.cart} />
      
      <div className="flex flex-col lg:flex-row gap-6 mt-4">
        {/* Cart Items */}
        <div className="flex-1 bg-card p-6 rounded border border-border">
          <div className="flex justify-between items-end mb-2">
            <h1 className="text-3xl font-normal">Shopping Cart</h1>
            <span className="text-sm text-muted-foreground">Price</span>
          </div>
          <Separator className="mb-4" />

          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 md:w-48 h-32 sm:h-32 md:h-48 relative flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${item.id}`}
                        className="text-base sm:text-lg font-medium hover:text-link-hover hover:underline line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <div className="text-accent-foreground text-xs my-1">In Stock</div>
                      <div className="text-xs text-muted-foreground mb-2">Eligible for FREE Shipping & FREE Returns</div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center border rounded bg-muted hover:bg-muted/80">
                          <span className="px-2 py-1 bg-secondary border-r border-border">Qty:</span>
                          <select
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                            className="bg-transparent border-none py-1 pl-1 pr-2 text-sm focus:ring-0 cursor-pointer"
                          >
                            {[...Array(10)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Separator orientation="vertical" className="h-3 hidden sm:block" />
                        <button onClick={() => removeFromCart(item.id)} className="text-link hover:underline">
                          Delete
                        </button>
                        <Separator orientation="vertical" className="h-3 hidden sm:block" />
                        <button className="text-link hover:underline">Save for later</button>
                      </div>
                    </div>
                    <div className="text-left sm:text-right font-bold text-lg mt-2 sm:mt-0">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />
          <div className="text-right text-lg">
            Subtotal ({totalItems} items): <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Sidebar */}
        <div className="w-full lg:w-80 h-fit bg-card p-4 rounded shadow-sm">
          <div className="flex items-start gap-1 mb-4 text-accent-foreground">
            <CheckCircle2 className="h-5 w-5 mt-0.5" />
            <span className="text-sm">
              Your order qualifies for FREE Shipping. Choose this option at checkout.{" "}
              <Link href="#" className="text-link hover:underline">
                See details
              </Link>
            </span>
          </div>
          <div className="text-lg mb-4">
            Subtotal ({totalItems} items): <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="gift" className="rounded-sm" />
            <label htmlFor="gift" className="text-sm">
              This order contains a gift
            </label>
          </div>
          <Button
            onClick={handleCheckout}
            className="w-full bg-brand hover:bg-brand/90 text-foreground border-none rounded-full shadow-sm"
          >
            Proceed to checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
