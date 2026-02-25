import { getTranslations } from "next-intl/server"
import { BillingContent } from "./billing-content"
import { createBillingPortalSession } from "../../../../actions/subscriptions-reads"
import { withAccountPageShell } from "../_lib/account-page-shell"

interface BillingPageProps {
  params: Promise<{
    locale: string
  }>
}

export const metadata = {
  title: "Billing | Treido",
  description: "View your billing details and history.",
}

export default async function BillingPage({ params }: BillingPageProps) {
  return withAccountPageShell(params, async ({ locale, supabase, user }) => {
    const t = await getTranslations({ locale, namespace: "Account" })

    const [
      { data: profile },
      { data: privateProfile },
      { data: subscription },
      { data: boostsRaw },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, tier")
        .eq("id", user.id)
        .single(),
      supabase
        .from("private_profiles")
        .select("id, commission_rate, stripe_customer_id")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("subscriptions")
        .select(
          "id, seller_id, plan_type, status, price_paid, billing_period, starts_at, expires_at, stripe_subscription_id"
        )
        .eq("seller_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("listing_boosts")
        .select(
          "id, product_id, price_paid, duration_days, starts_at, expires_at, is_active, created_at"
        )
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ])

    const productIds = [...new Set((boostsRaw ?? []).map((boost) => boost.product_id))]
    const { data: boostProducts } =
      productIds.length > 0
        ? await supabase
            .from("products")
            .select("id, title, images")
            .in("id", productIds)
        : { data: [] }

    const productsMap = new Map((boostProducts ?? []).map((product) => [product.id, product]))

    const boosts = (boostsRaw ?? []).map((boost) => {
      const product = productsMap.get(boost.product_id)
      return {
        ...boost,
        products: product
          ? { id: product.id, title: product.title, images: product.images || [] }
          : undefined,
      }
    })

    const hasStripeCustomer = Boolean(privateProfile?.stripe_customer_id)

    const commissionRate =
      privateProfile?.commission_rate == null ? 0 : Number(privateProfile.commission_rate)
    const seller = profile
      ? {
          id: profile.id,
          tier: profile.tier || "free",
          commission_rate: commissionRate,
          stripe_customer_id: privateProfile?.stripe_customer_id ?? null,
        }
      : null

    return {
      title: t("header.billing"),
      content: (
        <BillingContent
          locale={locale}
          seller={seller}
          subscription={
            subscription as Parameters<typeof BillingContent>[0]["subscription"]
          }
          boosts={(boosts ?? []) as Parameters<typeof BillingContent>[0]["boosts"]}
          hasStripeCustomer={hasStripeCustomer}
          userEmail={user.email || ""}
          actions={{ createBillingPortalSession }}
        />
      ),
    }
  })
}
