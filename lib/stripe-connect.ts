import "server-only"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

// =============================================================================
// FEE STRUCTURE (Hybrid Buyer-Protection Model)
// =============================================================================
//
// Personal accounts: 0% seller fee, buyer pays protection (3-4% + fixed)
// Business accounts: Small seller fee (0.5-1.5%), lower buyer protection
//
// This matches the Vinted model which is proven successful in Europe.
// See: PLAN-monetization-strategy.md for full details.
// =============================================================================

/**
 * Fee structure for a transaction based on seller's plan.
 */
export interface TransactionFees {
  sellerFeePercent: number
  buyerProtectionPercent: number
  buyerProtectionFixed: number
  buyerProtectionCap: number
}


/**
 * Get fee structure for a seller based on their subscription tier.
 * Fetches from database for accurate, up-to-date rates.
 */
export async function getFeesForSeller(sellerId: string): Promise<TransactionFees> {
  const supabase = await createClient()
  
  // Get seller's tier and account type from profiles
  const { data: seller } = await supabase
    .from("profiles")
    .select("tier, account_type")
    .eq("id", sellerId)
    .single()
  
  const accountType = seller?.account_type === "business" ? "business" : "personal"
  const tier = seller?.tier || "free"
  
  const PLAN_SELECT = "seller_fee_percent, buyer_protection_percent, buyer_protection_fixed, buyer_protection_cap" as const

  const readPlanFees = async (params: { tier: string; accountType: "personal" | "business" }) => {
    const { data: plan } = await supabase
      .from("subscription_plans")
      .select(PLAN_SELECT)
      .eq("tier", params.tier)
      .eq("account_type", params.accountType)
      .eq("is_active", true)
      .single()

    if (!plan) return null

    return {
      sellerFeePercent: Number(plan.seller_fee_percent ?? 0),
      buyerProtectionPercent: Number(plan.buyer_protection_percent ?? 0),
      buyerProtectionFixed: Number(plan.buyer_protection_fixed ?? 0),
      buyerProtectionCap: Number(plan.buyer_protection_cap ?? 0),
    } satisfies TransactionFees
  }

  // Primary: seller's current tier + account type.
  const primary = await readPlanFees({ tier, accountType })
  if (primary) return primary

  // Fallback: free tier for the seller's account type.
  const fallback = await readPlanFees({ tier: "free", accountType })
  if (fallback) return fallback

  // Last resort: personal free tier must exist in DB.
  const lastResort = await readPlanFees({ tier: "free", accountType: "personal" })
  if (lastResort) return lastResort

  throw new Error("No fee configuration found for subscription_plans")
}

/**
 * Calculate all fees for a transaction.
 * 
 * @param itemPriceEur - Item price in EUR
 * @param fees - Fee structure from seller's plan
 * @returns Breakdown of all fees and final amounts
 */
export function calculateTransactionFees(
  itemPriceEur: number,
  fees: TransactionFees
): {
  sellerFee: number
  buyerProtectionFee: number
  sellerReceives: number
  buyerPays: number
  platformRevenue: number
} {
  // Calculate seller fee (0% for personal, small % for business)
  const sellerFee = itemPriceEur * (fees.sellerFeePercent / 100)
  
  // Calculate buyer protection (percentage + fixed, capped)
  const buyerProtectionRaw = (itemPriceEur * (fees.buyerProtectionPercent / 100)) + fees.buyerProtectionFixed
  const buyerProtectionFee = Math.min(buyerProtectionRaw, fees.buyerProtectionCap)
  
  return {
    sellerFee: Math.round(sellerFee * 100) / 100,
    buyerProtectionFee: Math.round(buyerProtectionFee * 100) / 100,
    sellerReceives: Math.round((itemPriceEur - sellerFee) * 100) / 100,
    buyerPays: Math.round((itemPriceEur + buyerProtectionFee) * 100) / 100,
    platformRevenue: Math.round((sellerFee + buyerProtectionFee) * 100) / 100,
  }
}

/**
 * Create a new Express connected account for a seller.
 * Express accounts handle onboarding UI and compliance automatically.
 */
export async function createConnectAccount(params: {
  email: string
  sellerId: string
  country?: string
  accountType?: "personal" | "business"
}): Promise<Stripe.Account> {
  const { email, sellerId, country = "BG", accountType = "personal" } = params

  const account = await stripe.accounts.create({
    type: "express",
    country,
    email,
    business_type: accountType === "business" ? "company" : "individual",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    metadata: {
      seller_id: sellerId,
    },
  })

  return account
}

/**
 * Create an account link for onboarding.
 * This URL redirects the seller to Stripe's hosted onboarding flow.
 */
export async function createAccountLink(params: {
  accountId: string
  refreshUrl: string
  returnUrl: string
}): Promise<Stripe.AccountLink> {
  const { accountId, refreshUrl, returnUrl } = params

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  })

  return accountLink
}

/**
 * Create a login link for sellers to access their Express Dashboard.
 * Only works for accounts that have completed onboarding.
 */
export async function createLoginLink(accountId: string): Promise<Stripe.LoginLink> {
  return stripe.accounts.createLoginLink(accountId)
}

/**
 * Retrieve a connected account to check its status.
 */
export async function getConnectAccount(accountId: string): Promise<Stripe.Account> {
  return stripe.accounts.retrieve(accountId)
}

/**
 * Check if an account is ready to receive payments.
 */
export function isAccountReady(account: Stripe.Account): boolean {
  return (
    account.details_submitted === true &&
    account.charges_enabled === true &&
    account.payouts_enabled === true
  )
}
