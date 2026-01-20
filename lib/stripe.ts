import "server-only"

import Stripe from "stripe"
import { getStripeSecretKey } from "@/lib/env"

/**
 * Server-side Stripe instance.
 * Uses validated environment variables - throws early if STRIPE_SECRET_KEY is missing.
 */
export const stripe = new Stripe(getStripeSecretKey(), {
  // stripe@20.2.0 requires this specific API version
  apiVersion: "2025-12-15.clover",
})
