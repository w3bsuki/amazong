"use server"

import { stripe } from "@/lib/stripe"
import { createClient, createAdminClient } from "@/lib/supabase/server"
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

      // Check if user is trying to buy their own products
      if (userId && items.length > 0) {
        const productIds = items.map(item => item.id).filter(Boolean)
        
        if (productIds.length > 0) {
          const { data: products } = await supabase
            .from('products')
            .select('id, seller_id, title')
            .in('id', productIds)
            .eq('seller_id', userId)

          if (products && products.length > 0) {
            const ownProductTitles = products.map(p => p.title).join(', ')
            return { error: `You cannot purchase your own products: ${ownProductTitles}` }
          }
        }
      }
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

// Verify checkout session and create order if not already created (fallback for when webhooks don't work)
export async function verifyAndCreateOrder(sessionId: string) {
  if (!sessionId) {
    return { error: "No session ID provided" }
  }

  try {
    // Use regular client to verify user authentication
    const supabase = await createClient()
    if (!supabase) {
      console.error('Supabase client creation failed')
      return { error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('Auth error:', authError)
      return { error: "Authentication error" }
    }
    if (!user) {
      console.error('No user found in session')
      return { error: "User not authenticated" }
    }

    console.log('Processing order for user:', user.id)

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    })

    console.log('Stripe session status:', session.payment_status)

    // Only process completed payments
    if (session.payment_status !== 'paid') {
      return { error: "Payment not completed" }
    }

    // Use admin client for database operations to bypass RLS
    const adminClient = createAdminClient()
    if (!adminClient) {
      console.error('Admin client creation failed - check SUPABASE_SERVICE_ROLE_KEY')
      return { error: "Database configuration error" }
    }

    // Check if order already exists (created by webhook)
    const { data: existingOrder } = await adminClient
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', session.payment_intent as string)
      .single()

    if (existingOrder) {
      console.log('Order already exists:', existingOrder.id)
      return { success: true, orderId: existingOrder.id, message: "Order already exists" }
    }

    // Parse items from metadata
    let itemsData: { id: string; qty: number; price: number }[] = []
    try {
      if (session.metadata?.items_json) {
        itemsData = JSON.parse(session.metadata.items_json)
        console.log('Parsed items:', itemsData.length)
      }
    } catch (e) {
      console.warn('Could not parse items_json from metadata:', e)
    }

    // Create the order using admin client
    const shippingAddress = session.customer_details?.address ? {
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
    } : null

    const orderData = {
      user_id: user.id,
      total_amount: (session.amount_total || 0) / 100,
      status: 'paid',
      shipping_address: shippingAddress as import("@/lib/supabase/database.types").Json,
      stripe_payment_intent_id: session.payment_intent as string,
    }
    
    console.log('Creating order:', orderData)

    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return { error: `Failed to create order: ${orderError.message}` }
    }

    console.log('Order created:', order.id)

    // Get product details including seller_id for each item
    const productIds = itemsData.map(item => item.id).filter(Boolean)
    
    if (productIds.length > 0) {
      const { data: products, error: productsError } = await adminClient
        .from('products')
        .select('id, seller_id')
        .in('id', productIds)

      if (productsError) {
        console.error('Error fetching products:', productsError)
      }

      // Create a map of product_id to seller_id
      const productSellerMap = new Map(
        products?.map(p => [p.id, p.seller_id]) || []
      )

      // Build valid order items with required seller_id
      const validItems = itemsData
        .filter(item => item.id && productSellerMap.get(item.id))
        .map((item) => ({
          order_id: order.id,
          product_id: item.id,
          seller_id: productSellerMap.get(item.id)!,
          quantity: item.qty || 1,
          price_at_purchase: item.price,
        }))

      console.log('Creating order items:', validItems.length)

      if (validItems.length > 0) {
        const { error: itemsError } = await adminClient
          .from('order_items')
          .insert(validItems)

        if (itemsError) {
          console.error('Error creating order items:', itemsError)
        }

        // Decrement stock for each purchased product
        for (const item of validItems) {
          const { data: currentProduct } = await adminClient
            .from('products')
            .select('stock, track_inventory')
            .eq('id', item.product_id)
            .single()

          if (currentProduct && currentProduct.track_inventory !== false) {
            const newStock = Math.max(0, (currentProduct.stock || 0) - item.quantity)
            const { error: updateError } = await adminClient
              .from('products')
              .update({ stock: newStock })
              .eq('id', item.product_id)

            if (updateError) {
              console.error('Error decrementing stock for product:', item.product_id, updateError)
            } else {
              console.log('Stock decremented for product:', item.product_id, 'to', newStock)
            }
          }
        }
      }
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Error verifying checkout session:", error)
    return { error: `Failed to verify checkout session: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}
