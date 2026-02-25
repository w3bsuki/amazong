import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import { stripe } from "@/lib/stripe"
import { STRIPE_CUSTOMER_ID_SELECT } from "@/lib/supabase/selects/billing"
import {
  CreateBoostCheckoutInputSchema,
  getBoostActionContext,
  getOwnedBoostProduct,
  type CreateBoostCheckoutArgs,
  type CreateBoostCheckoutResult,
} from "./boosts-shared"

import { logger } from "@/lib/logger"
export async function createBoostCheckoutSessionImpl(
  args: CreateBoostCheckoutArgs
): Promise<CreateBoostCheckoutResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    logger.error("STRIPE_SECRET_KEY is missing")
    return errorEnvelope({ error: "Payment configuration is missing" })
  }

  const parsedArgs = CreateBoostCheckoutInputSchema.safeParse(args)
  if (!parsedArgs.success) {
    return errorEnvelope({ error: "Invalid input" })
  }

  const { productId, durationDays, locale = "en" } = parsedArgs.data

  const context = await getBoostActionContext(productId)
  if (!context.success) {
    return errorEnvelope({ error: context.error })
  }

  const { userId, userEmail, supabase } = context

  const ownedProductResult = await getOwnedBoostProduct(supabase, productId, userId)
  if (!ownedProductResult.success) {
    return errorEnvelope({ error: ownedProductResult.error })
  }

  const product = ownedProductResult.product
  if (product.is_boosted) {
    return errorEnvelope({ error: "Product is already boosted" })
  }

  const { data: boostPrice, error: priceError } = await supabase
    .from("boost_prices")
    .select("price")
    .eq("duration_days", durationDays)
    .eq("is_active", true)
    .single()

  if (priceError || !boostPrice) {
    return errorEnvelope({ error: "Boost price not found" })
  }

  try {
    const { data: privateProfile } = await supabase
      .from("private_profiles")
      .select(STRIPE_CUSTOMER_ID_SELECT)
      .eq("id", userId)
      .single()

    let customerId = privateProfile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        ...(userEmail ? { email: userEmail } : {}),
        metadata: {
          profile_id: userId,
        },
      })
      customerId = customer.id

      await supabase
        .from("private_profiles")
        .upsert({ id: userId, stripe_customer_id: customerId }, { onConflict: "id" })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const returnUrl = `${appUrl}/${locale}/account/listings`

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${durationDays}-Day Boost`,
              description: `Boost for "${product.title}"`,
            },
            unit_amount: Math.round(Number(boostPrice.price) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "listing_boost",
        product_id: productId,
        seller_id: userId,
        duration_days: durationDays.toString(),
      },
      success_url: `${returnUrl}?boost=success&product=${productId}`,
      cancel_url: `${returnUrl}?boost=cancelled`,
    })

    return session.url
      ? successEnvelope({ url: session.url })
      : errorEnvelope({ error: "Failed to create checkout" })
  } catch (error) {
    logger.error("Boost checkout error:", error)
    return errorEnvelope({ error: "Failed to create payment session" })
  }
}
