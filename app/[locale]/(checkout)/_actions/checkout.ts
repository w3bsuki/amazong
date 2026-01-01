"use server"

import { stripe } from "@/lib/stripe"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import type { CartItem } from "@/components/providers/cart-context"
import type Stripe from "stripe"

export async function createCheckoutSession(items: CartItem[]) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing")
    return { error: "Stripe configuration is missing. Please check your server logs." }
  }

  try {
    const supabase = await createClient()
    let userId: string | undefined

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userId = user?.id

      if (userId && items.length > 0) {
        const productIds = items.map((item) => item.id).filter(Boolean)

        if (productIds.length > 0) {
          const { data: products } = await supabase
            .from("products")
            .select("id, seller_id, title")
            .in("id", productIds)
            .eq("seller_id", userId)

          if (products && products.length > 0) {
            const ownProductTitles = products.map((p) => p.title).join(", ")
            return { error: `You cannot purchase your own products: ${ownProductTitles}` }
          }
        }
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            images: [
              item.image.startsWith("http")
                ? item.image
                : `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}${item.image}`,
            ],
            metadata: {
              product_id: item.id,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      ...(userId ? { client_reference_id: userId } : {}),
      metadata: {
        user_id: userId || "guest",
        items_json: JSON.stringify(items.map((i) => ({ id: i.id, qty: i.quantity, price: i.price }))),
      },
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/cart`,
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return { url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { error: "Failed to create checkout session. Please try again." }
  }
}

export async function verifyAndCreateOrder(sessionId: string) {
  if (!sessionId) {
    return { error: "No session ID provided" }
  }

  try {
    const supabase = await createClient()
    if (!supabase) {
      console.error("Supabase client creation failed")
      return { error: "Failed to connect to database" }
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("Auth error:", authError)
      return { error: "Authentication error" }
    }

    if (!user) {
      console.error("No user found in session")
      return { error: "User not authenticated" }
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    })

    if (session.payment_status !== "paid") {
      return { error: "Payment not completed" }
    }

    const adminClient = createAdminClient()
    if (!adminClient) {
      console.error("Admin client creation failed - check SUPABASE_SERVICE_ROLE_KEY")
      return { error: "Database configuration error" }
    }

    const { data: existingOrder } = await adminClient
      .from("orders")
      .select("id")
      .eq("stripe_payment_intent_id", session.payment_intent as string)
      .single()

    if (existingOrder) {
      return { success: true, orderId: existingOrder.id, message: "Order already exists" }
    }

    let itemsData: { id: string; qty: number; price: number }[] = []
    try {
      if (session.metadata?.items_json) {
        itemsData = JSON.parse(session.metadata.items_json)
      }
    } catch (e) {
      console.warn("Could not parse items_json from metadata:", e)
    }

    const shippingAddress = session.customer_details?.address
      ? {
          name: session.customer_details.name || null,
          email: session.customer_details.email || null,
          address: {
            city: session.customer_details.address.city || null,
            country: session.customer_details.address.country || null,
            line1: session.customer_details.address.line1 || null,
            line2: session.customer_details.address.line2 || null,
            postal_code: session.customer_details.address.postal_code || null,
            state: session.customer_details.address.state || null,
          },
        }
      : null

    const orderData = {
      user_id: user.id,
      total_amount: (session.amount_total || 0) / 100,
      status: "paid",
      shipping_address: shippingAddress as import("@/lib/supabase/database.types").Json,
      stripe_payment_intent_id: session.payment_intent as string,
    }

    const {
      data: order,
      error: orderError,
    } = await adminClient.from("orders").insert(orderData).select().single()

    if (orderError) {
      return { error: `Failed to create order: ${orderError.message}` }
    }

    const productIds = itemsData.map((item) => item.id).filter(Boolean)
    if (productIds.length > 0) {
      const { data: products } = await adminClient
        .from("products")
        .select("id, seller_id")
        .in("id", productIds)

      const productSellerMap = new Map(products?.map((p) => [p.id, p.seller_id]) || [])

      const validItems = itemsData
        .filter((item) => item.id && productSellerMap.get(item.id))
        .map((item) => ({
          order_id: order.id,
          product_id: item.id,
          seller_id: productSellerMap.get(item.id)!,
          quantity: item.qty || 1,
          price_at_purchase: item.price,
        }))

      if (validItems.length > 0) {
        await adminClient.from("order_items").insert(validItems)

        for (const item of validItems) {
          const { data: currentProduct } = await adminClient
            .from("products")
            .select("stock, track_inventory")
            .eq("id", item.product_id)
            .single()

          if (currentProduct && currentProduct.track_inventory !== false) {
            const newStock = Math.max(0, (currentProduct.stock || 0) - item.quantity)
            await adminClient.from("products").update({ stock: newStock }).eq("id", item.product_id)
          }
        }
      }
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Error verifying checkout session:", error)
    return {
      error: `Failed to verify checkout session: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
