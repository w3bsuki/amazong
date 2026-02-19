import CheckoutPageClient from "../_components/checkout-page-client"
import { createCheckoutSession, getCheckoutFeeQuote } from "../_actions/checkout"

export const metadata = {
  title: "Checkout | Treido",
  description: "Complete your purchase securely on Treido.",
}

export default function Page() {
  return (
    <CheckoutPageClient
      createCheckoutSessionAction={createCheckoutSession}
      getCheckoutFeeQuoteAction={getCheckoutFeeQuote}
    />
  )
}
