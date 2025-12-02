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
            await supabase.auth.signOut()
            // Force hard navigation to clear all state
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
