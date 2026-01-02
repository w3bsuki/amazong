import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { AddressesContent } from "./addresses-content"

const USER_ADDRESSES_SELECT =
    'id,label,full_name,phone,address_line1,address_line2,city,state,postal_code,country,is_default,created_at'

export default async function AddressesPage({
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

    // Fetch user addresses
    const { data: addressesData } = await supabase
        .from('user_addresses')
        .select(USER_ADDRESSES_SELECT)
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    // Transform to handle is_default: boolean | null -> boolean
    const addresses = (addressesData || []).map((addr) => ({
        ...addr,
        is_default: addr.is_default ?? false,
    }))

    return (
        <div className="flex flex-col gap-4 md:gap-4">
            <h1 className="sr-only">{locale === "bg" ? "Адреси" : "Addresses"}</h1>
            <AddressesContent 
                locale={locale}
                initialAddresses={addresses}
            />
        </div>
    )
}
