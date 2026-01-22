import CheckoutSuccessPageClient from "../../_components/checkout-success-page-client"
import { verifyAndCreateOrder } from "../../_actions/checkout"

export default function Page() {
  return <CheckoutSuccessPageClient verifyAndCreateOrderAction={verifyAndCreateOrder} />
}
