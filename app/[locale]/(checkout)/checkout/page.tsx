import CheckoutPageClient from "../_components/checkout-page-client"
import { createCheckoutSession, getCheckoutFeeQuote } from "../_actions/checkout"

export default function Page() {
  return (
    <CheckoutPageClient
      createCheckoutSessionAction={createCheckoutSession}
      getCheckoutFeeQuoteAction={getCheckoutFeeQuote}
    />
  )
}
