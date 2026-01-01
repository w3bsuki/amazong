import "server-only"

import Stripe from "stripe"
import { getStripeSecretKey } from "@/lib/env"

/**
 * Server-side Stripe instance.
 * Uses validated environment variables - throws early if STRIPE_SECRET_KEY is missing.
 */
export const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: "2025-11-17.clover",
})
