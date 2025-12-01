import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { AddressesContent } from "./addresses-content"

export default async function AddressesPage() {
    const locale = await getLocale()
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
