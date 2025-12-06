import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { AddressesContent } from "./addresses-content"
import { connection } from "next/server"

export default async function AddressesPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    // Make this route dynamic since it uses user authentication
    await connection()
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

    // Fetch user addresses
    const { data: addresses } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    return (
        <div className="p-4 lg:p-6">
            <AddressesContent 
                locale={locale}
                initialAddresses={addresses || []}
            />
        </div>
    )
}
