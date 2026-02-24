"use client"

import { createContext, useEffect, useMemo, useState, useRef, type ReactNode } from "react"
import { usePathname, useRouter } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/client"
import { useAuthOptional } from "@/components/providers/auth-state-manager"

interface OnboardingContextValue {
  showOnboarding: () => void
  hideOnboarding: () => void
  isOnboardingComplete: boolean
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

interface OnboardingProviderProps {
  children: ReactNode
  locale: string
}

interface ProfileData {
  username: string | null
  display_name: string | null
  onboarding_completed: boolean | null
  account_type: "personal" | "business"
}

// Type for raw profile data from Supabase (may not have full type info)
interface RawProfileData {
  username?: string | null
  display_name?: string | null
  onboarding_completed?: boolean | null
  account_type?: string | null
}

const ONBOARDING_ROUTE = "/onboarding"

// Routes that should always be accessible without onboarding
const BYPASS_PREFIXES = [ONBOARDING_ROUTE, "/auth", "/api", "/terms", "/privacy", "/customer-service", "/search", "/cart", "/categories"]

function hideOnboarding() {}

function stripLocale(pathname: string) {
  return pathname.replace(/^\/(en|bg)(?=\/|$)/, "") || "/"
}

function hasPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export function OnboardingProvider({
  children,
  locale,
}: OnboardingProviderProps) {
  const auth = useAuthOptional()
  const router = useRouter()
  const pathname = usePathname()
  
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [, setIsChecking] = useState(true)
  const hasCheckedRef = useRef<string | null>(null)
  const hasRedirectedRef = useRef(false)
  const previousPathnameRef = useRef<string | null>(null)

  // Get user from auth context
  const user = auth?.user ?? null
  const authLoading = auth?.isLoading ?? true

  // Check if current route should bypass onboarding check
  const pathWithoutLocale = useMemo(() => stripLocale(pathname), [pathname])
  const shouldBypass = useMemo(
    () => BYPASS_PREFIXES.some((prefix) => hasPrefix(pathWithoutLocale, prefix)),
    [pathWithoutLocale],
  )

  // When leaving onboarding routes, force a re-check. This ensures that once the
  // user completes onboarding (DB row updated), we don't keep stale client state.
  useEffect(() => {
    const previous = previousPathnameRef.current
    previousPathnameRef.current = pathWithoutLocale

    const wasOnboarding = previous ? hasPrefix(previous, ONBOARDING_ROUTE) : false
    const isOnboarding = hasPrefix(pathWithoutLocale, ONBOARDING_ROUTE)

    if (wasOnboarding && !isOnboarding) {
      hasCheckedRef.current = null
      hasRedirectedRef.current = false
      setIsChecking(true)
    }
  }, [pathWithoutLocale])

  // Check if we should redirect to onboarding when user changes
  useEffect(() => {
    if (authLoading) return // Wait for auth to settle
    if (shouldBypass) {
      setIsChecking(false)
      return // Don't check onboarding on bypass routes
    }

    const checkOnboarding = async () => {
      if (!user) {
        setProfile(null)
        hasCheckedRef.current = null
        hasRedirectedRef.current = false
        setIsChecking(false)
        return
      }

      // Already checked for this user
      if (hasCheckedRef.current === user.id) {
        setIsChecking(false)
        return
      }
      hasCheckedRef.current = user.id

      const supabase = createClient()

      // Get profile - check onboarding_completed flag
      const { data: rawProfile, error } = await supabase
        .from("profiles")
        .select("username, display_name, onboarding_completed, account_type")
        .eq("id", user.id)
        .single()

      const profileData = rawProfile as RawProfileData | null
      
      if (!error && profileData) {
        setProfile({
          username: profileData.username ?? null,
          display_name: profileData.display_name ?? null,
          onboarding_completed: profileData.onboarding_completed ?? null,
          account_type: (profileData.account_type as "personal" | "business") ?? "personal",
        })

        // Check if onboarding is needed based on onboarding_completed flag (NOT username)
        const needsOnboarding = profileData.onboarding_completed !== true

        // Redirect to onboarding if needed and haven't already
        if (needsOnboarding && !hasRedirectedRef.current && !shouldBypass) {
          hasRedirectedRef.current = true
          router.push(ONBOARDING_ROUTE, { locale })
        }
      } else {
        setProfile(null)
      }

      setIsChecking(false)
    }

    checkOnboarding()
  }, [user, authLoading, locale, router, shouldBypass])

  // Reset redirect flag when pathname changes to allow re-checking
  useEffect(() => {
    if (shouldBypass) {
      hasRedirectedRef.current = false
    }
  }, [pathWithoutLocale, shouldBypass])

  const showOnboarding = () => router.push(ONBOARDING_ROUTE, { locale })

  const isOnboardingComplete = profile?.onboarding_completed === true

  return (
    <OnboardingContext.Provider value={{ showOnboarding, hideOnboarding, isOnboardingComplete }}>
      {children}
    </OnboardingContext.Provider>
  )
}
