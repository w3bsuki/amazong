import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { getLocale } from "next-intl/server"
import { PaymentsContent } from "./payments-content"

export default async function PaymentsPage() {
    await connection()
    const locale = await getLocale()
    const supabase = await createClient()
    
    if (!supabase) {
        redirect("/auth/login")
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        redirect("/auth/login")
    }

    // Fetch user payment methods
    const { data: paymentMethods } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    return (
        <div className="p-4 lg:p-6">
            <PaymentsContent 
                locale={locale}
                initialPaymentMethods={paymentMethods || []}
            />
        </div>
    )
}
