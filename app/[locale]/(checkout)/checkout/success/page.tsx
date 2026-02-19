import CheckoutSuccessPageClient from "../../_components/checkout-success-page-client"
import { verifyAndCreateOrder } from "../../_actions/checkout"

export const metadata = {
  title: "Checkout Success | Treido",
  description: "Your Treido order is confirmed.",
}

export default function Page() {
  return <CheckoutSuccessPageClient verifyAndCreateOrderAction={verifyAndCreateOrder} />
}
