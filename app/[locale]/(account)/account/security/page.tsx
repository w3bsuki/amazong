import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import { SecurityContent } from "./security-content"

export default async function SecurityPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const supabase = await createClient()
    
    if (!supabase) {
        return redirect({ href: "/auth/login", locale })
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return redirect({ href: "/auth/login", locale })
    }

    return (
        <div className="flex flex-col gap-4 md:gap-4">
            <h1 className="sr-only">{locale === "bg" ? "Сигурност" : "Security"}</h1>
            <SecurityContent 
                locale={locale}
                userEmail={user.email || ''}
            />
        </div>
    )
}
