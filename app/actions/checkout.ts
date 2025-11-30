"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type { CartItem } from "@/lib/cart-context"

export async function createCheckoutSession(items: CartItem[]) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing")
    return { error: "Stripe configuration is missing. Please check your server logs." }
  }

  try {
    // Get current user for order tracking
    const supabase = await createClient();
    let userId: string | undefined;
    
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.image.startsWith("http") ? item.image : `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}${item.image}`],
            metadata: {
              product_id: item.id,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      // Pass user ID for order creation in webhook
      client_reference_id: userId,
      metadata: {
        user_id: userId || 'guest',
        items_json: JSON.stringify(items.map(i => ({ id: i.id, qty: i.quantity, price: i.price }))),
      },
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/cart`,
    })

    return { url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { error: "Failed to create checkout session. Please try again." }
  }
}
