import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { PaymentsContent } from "./payments-content"
import {
    createPaymentMethodSetupSession,
    deletePaymentMethod,
    setDefaultPaymentMethod,
} from "../../../../actions/payments"

const PAYMENT_METHODS_SELECT =
    'id,stripe_payment_method_id,card_brand,card_last4,card_exp_month,card_exp_year,is_default'

export const metadata = {
  title: "Payments | Treido",
  description: "Manage your payment settings and history.",
}

export default async function PaymentsPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: "Account" })
    const supabase = await createClient()
    
    if (!supabase) {
        return redirect({ href: "/auth/login", locale })
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return redirect({ href: "/auth/login", locale })
    }

    // Fetch user payment methods
    const { data: paymentMethodsData } = await supabase
        .from('user_payment_methods')
        .select(PAYMENT_METHODS_SELECT)
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    // Transform to handle is_default: boolean | null -> boolean
    const paymentMethods = (paymentMethodsData || []).map((pm) => ({
        ...pm,
        is_default: pm.is_default ?? false,
    }))

    return (
        <div className="flex flex-col gap-4 md:gap-4">
            <h1 className="sr-only">{t("header.payments")}</h1>
            <PaymentsContent
                locale={locale}
                initialPaymentMethods={paymentMethods}
                actions={{
                    createPaymentMethodSetupSession,
                    deletePaymentMethod,
                    setDefaultPaymentMethod,
                }}
            />
        </div>
    )
}
