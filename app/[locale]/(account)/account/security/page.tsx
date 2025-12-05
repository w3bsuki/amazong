import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { getLocale } from "next-intl/server"
import { SecurityContent } from "./security-content"

export default async function SecurityPage() {
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

    return (
        <div className="p-4 lg:p-6">
            <SecurityContent 
                locale={locale}
                userEmail={user.email || ''}
            />
        </div>
    )
}
