import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { setRequestLocale } from "next-intl/server"
import { SecurityContent } from "./security-content"

export default async function SecurityPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
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

    return (
        <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="sr-only">{locale === "bg" ? "Сигурност" : "Security"}</h1>
            <SecurityContent 
                locale={locale}
                userEmail={user.email || ''}
            />
        </div>
    )
}
