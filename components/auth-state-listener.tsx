"use client"

import { useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

export function AuthStateListener() {
    const router = useRouter()
    const pathname = usePathname()

    // Memoized refresh handler that's more aggressive on mobile
    const handleAuthChange = useCallback((event: AuthChangeEvent, _session: Session | null) => {
        // Skip refresh on auth pages to avoid conflicts with their own redirect logic
        const isAuthPage = pathname?.includes('/auth/')
        
        if (event === "SIGNED_IN" && !isAuthPage) {
            // For sign-in events outside of auth pages, do a soft refresh
            // This helps with mobile where the router refresh can be flaky
            router.refresh()
            
            // If we're still on a protected page after refresh, force a hard reload
            // This is a fallback for mobile browsers
            setTimeout(() => {
                // Check if we need to update the UI by fetching fresh auth state
                const supabase = createClient()
                supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
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
        }
    }, [router, pathname])

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
