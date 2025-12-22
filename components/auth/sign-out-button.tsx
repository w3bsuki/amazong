"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SignOut, SpinnerGap } from "@phosphor-icons/react"
import { createClient } from "@/lib/supabase/client"

interface SignOutButtonProps {
    variant?: "default" | "ghost" | "outline" | "destructive" | "secondary" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
    showLabel?: boolean
    labelClassName?: string
    locale?: string
}

/**
 * Clears all session-related data from browser storage
 * This ensures a clean slate after logout
 */
function clearAllSessionData() {
    // Clear localStorage items related to auth/session
    const keysToRemove = [
        'cart',
        'wishlist',
        'supabase.auth.token',
        'sb-',
        'user-preferences',
        'recent-searches',
    ]
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key) {
            // Remove any Supabase auth tokens or app-specific user data
            if (keysToRemove.some(k => key.includes(k) || key.startsWith(k))) {
                localStorage.removeItem(key)
            }
        }
    }
    
    // Clear sessionStorage completely
    sessionStorage.clear()
    
    // Clear any cookies that might be set by the app (not HttpOnly ones - those are cleared by Supabase)
    document.cookie.split(";").forEach((c) => {
        const cookie = c.trim()
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie
        // Only clear non-essential cookies (not HTTP-only auth cookies)
        if (name && !name.startsWith('sb-')) {
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
        }
    })
}

export function SignOutButton({ 
    variant = "ghost", 
    size = "sm", 
    className = "",
    showLabel = true,
    labelClassName = "",
    locale = "en"
}: SignOutButtonProps) {
    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true)
            const supabase = createClient()
            
            // Sign out from Supabase (clears auth cookies)
            await supabase.auth.signOut({ scope: 'global' })
            
            // Clear all browser session data
            clearAllSessionData()
            
            // Force hard navigation to clear all React state
            window.location.href = '/'
        } catch (error) {
            console.error('Sign out error:', error)
            setIsSigningOut(false)
        }
    }

    const label = locale === 'bg' ? 'Изход' : 'Sign Out'
    const loadingLabel = locale === 'bg' ? 'Излизане...' : 'Signing out...'

    return (
        <Button 
            variant={variant}
            size={size}
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={`${className} disabled:opacity-70`}
        >
            {isSigningOut ? (
                <SpinnerGap className="size-4 animate-spin" />
            ) : (
                <SignOut className="size-4" />
            )}
            {showLabel && (
                <span className={labelClassName}>
                    {isSigningOut ? loadingLabel : label}
                </span>
            )}
        </Button>
    )
}
