type StripeLocale = "bg" | "en"

function toStripeLocale(locale: string): StripeLocale {
  return locale === "bg" ? "bg" : "en"
}

type BillingPortalSessionResult = {
  url?: string | null
  error?: string | null
}

type CreateBillingPortalSession = (args: { locale: StripeLocale }) => Promise<BillingPortalSessionResult>

export async function redirectToBillingPortal(
  createBillingPortalSession: CreateBillingPortalSession,
  locale: string
) {
  const { url, error } = await createBillingPortalSession({ locale: toStripeLocale(locale) })

  if (error) {
    throw new Error(error)
  }

  if (url) {
    window.location.href = url
  }
}

type CheckoutSessionResult = {
  url?: string | null
  error?: string | null
}

type CreateSubscriptionCheckoutSession = (args: {
  planId: string
  billingPeriod: "monthly" | "yearly"
  locale: StripeLocale
}) => Promise<CheckoutSessionResult>

export async function getSubscriptionCheckoutUrl(
  createSubscriptionCheckoutSession: CreateSubscriptionCheckoutSession,
  options: {
    planId: string
    billingPeriod: "monthly" | "yearly"
    locale: string
  }
): Promise<string | null> {
  const { url, error } = await createSubscriptionCheckoutSession({
    planId: options.planId,
    billingPeriod: options.billingPeriod,
    locale: toStripeLocale(options.locale),
  })

  if (error) {
    throw new Error(error)
  }

  return url ?? null
}
