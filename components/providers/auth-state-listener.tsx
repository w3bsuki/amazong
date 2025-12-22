"use client"

import { useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

export function AuthStateListener() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Memoized refresh handler that's more aggressive on mobile
    const handleAuthChange = useCallback((event: AuthChangeEvent, session: Session | null) => {
        // Skip refresh on auth pages to avoid conflicts with their own redirect logic
        const isAuthPage = pathname?.includes('/auth/')
        
        if (event === "SIGNED_IN" && !isAuthPage) {
            // For sign-in events outside of auth pages, do a soft refresh
            // This helps with mobile where the router refresh can be flaky
            router.refresh()
            
            // Check if this is after email verification (welcome=true in URL)
            const isWelcome = searchParams?.get('welcome') === 'true'
            if (isWelcome && session?.user?.email_confirmed_at) {
                // User just verified their email - they're now fully authenticated
            }
            
            // If we're still on a protected page after refresh, force a hard reload
            // This is a fallback for mobile browsers
            setTimeout(() => {
                // Check if we need to update the UI by fetching fresh auth state
                const supabase = createClient()
                supabase.auth.getSession().then(({ data: { session: currentSession } }: { data: { session: Session | null } }) => {
                    if (currentSession && !document.hidden) {
                        // Session exists but page might not have updated - trigger another refresh
                        router.refresh()
                    }
                })
            }, 500)
        } else if (event === "SIGNED_OUT") {
            // For sign-out, always do a hard redirect to ensure clean state
            if (!isAuthPage) {
                window.location.href = '/'
            }
        } else if (event === "TOKEN_REFRESHED") {
            // Silently handle token refresh
            router.refresh()
        } else if (event === "USER_UPDATED") {
            // User was updated (e.g., email verified, profile updated)
            // This fires when email is confirmed via the link
            router.refresh()
            
            // If user just confirmed their email, the session will now have email_confirmed_at
            if (session?.user?.email_confirmed_at) {
                // Email confirmed - session updated
            }
        }
    }, [router, pathname, searchParams])

    useEffect(() => {
        const supabase = createClient()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(handleAuthChange)

        return () => {
            subscription.unsubscribe()
        }
    }, [handleAuthChange])

    return null
}
