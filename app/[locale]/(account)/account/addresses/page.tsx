import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { AddressesContent } from "./addresses-content"
import { USER_ADDRESSES_SELECT } from "./_lib/selects"

export default async function AddressesPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: "SidebarMenu" })
    const supabase = await createClient()
    
    if (!supabase) {
        return redirect({ href: "/auth/login", locale })
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return redirect({ href: "/auth/login", locale })
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
            <h1 className="sr-only">{t("addresses")}</h1>
            <AddressesContent 
                locale={locale}
                initialAddresses={addresses}
            />
        </div>
    )
}
