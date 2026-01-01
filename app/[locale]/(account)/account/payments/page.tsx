import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { PaymentsContent } from "./payments-content"

export default async function PaymentsPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const supabase = await createClient()
    
    if (!supabase) {
        redirect("/auth/login")
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        redirect("/auth/login")
    }

    // Fetch user payment methods
    const { data: paymentMethodsData } = await supabase
        .from('user_payment_methods')
        .select('*')
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
            <h1 className="sr-only">{locale === 'bg' ? 'Начини на плащане' : 'Payment Methods'}</h1>
            <PaymentsContent 
                locale={locale}
                initialPaymentMethods={paymentMethods}
            />
        </div>
    )
}
