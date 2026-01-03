"use client"

import { useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { useAuth } from "./auth-state-manager"

/**
 * AuthStateListener is a component that handles route refreshes on auth state changes.
 * It now relies on the centralized AuthStateManager for auth state rather than
 * maintaining its own onAuthStateChange listener.
 * 
 * NOTE: This component is kept for backward compatibility but may be removed
 * in a future refactor as the AuthStateManager handles most of its responsibilities.
 */
export function AuthStateListener() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { user, isAuthenticated } = useAuth()

    const lastRefreshAtRef = useRef(0)
    const prevAuthenticatedRef = useRef<boolean | null>(null)

    const safeRefresh = useCallback((reason: string) => {
        // Avoid refresh storms and common transient failures (tab hidden/offline)
        if (typeof window === "undefined") return
        if (document.visibilityState === "hidden") return
        if (typeof navigator !== "undefined" && "onLine" in navigator && !navigator.onLine) return

        const now = Date.now()
        if (now - lastRefreshAtRef.current < 800) return
        lastRefreshAtRef.current = now

        try {
            router.refresh()
        } catch (err) {
            // In Next dev/runtime, router.refresh can throw if the underlying RSC fetch fails.
            // Don't crash the app; best-effort refresh is enough here.
            console.warn(`[AuthStateListener] router.refresh failed (${reason})`, err)
        }
    }, [router])

    // Trigger refresh when auth state changes
    useEffect(() => {
        // Skip on first render
        if (prevAuthenticatedRef.current === null) {
            prevAuthenticatedRef.current = isAuthenticated
            return
        }

        // Skip if auth state hasn't changed
        if (prevAuthenticatedRef.current === isAuthenticated) return
        prevAuthenticatedRef.current = isAuthenticated

        // Skip refresh on auth pages to avoid conflicts with their own redirect logic
        const isAuthPage = pathname?.includes('/auth/')
        if (isAuthPage) return

        if (isAuthenticated) {
            safeRefresh("SIGNED_IN")
        }
        // Note: We don't redirect on sign out - the component that called signOut handles it
    }, [isAuthenticated, pathname, safeRefresh])

    return null
}
