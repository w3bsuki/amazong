import { getTranslations } from "next-intl/server"

import { PaymentsContent } from "./payments-content"
import { withAccountPageShell } from "../_lib/account-page-shell"
import {
  createPaymentMethodSetupSession,
  deletePaymentMethod,
  setDefaultPaymentMethod,
} from "../../../../actions/payments"

const PAYMENT_METHODS_SELECT =
  "id,stripe_payment_method_id,card_brand,card_last4,card_exp_month,card_exp_year,is_default"

export const metadata = {
  title: "Payments | Treido",
  description: "Manage your payment settings and history.",
}

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return withAccountPageShell(params, async ({ locale, supabase, user }) => {
    const t = await getTranslations({ locale, namespace: "Account" })

    const { data: paymentMethodsData } = await supabase
      .from("user_payment_methods")
      .select(PAYMENT_METHODS_SELECT)
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    const paymentMethods = (paymentMethodsData ?? []).map((paymentMethod) => ({
      ...paymentMethod,
      is_default: paymentMethod.is_default ?? false,
    }))

    return {
      title: t("header.payments"),
      content: (
        <PaymentsContent
          locale={locale}
          initialPaymentMethods={paymentMethods}
          actions={{
            createPaymentMethodSetupSession,
            deletePaymentMethod,
            setDefaultPaymentMethod,
          }}
        />
      ),
    }
  })
}
