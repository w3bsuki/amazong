"use client"

import { createContext, useEffect, useState, useRef, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  PostSignupOnboardingModal,
  type CompletePostSignupOnboardingAction,
} from "../_components/post-signup-onboarding-modal"
import { useAuthOptional } from "@/components/providers/auth-state-manager"

interface OnboardingContextValue {
  showOnboarding: () => void
  hideOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

interface OnboardingProviderProps {
  children: ReactNode
  locale: string
  completePostSignupOnboarding: CompletePostSignupOnboardingAction
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

export function OnboardingProvider({
  children,
  locale,
  completePostSignupOnboarding,
}: OnboardingProviderProps) {
  const auth = useAuthOptional()
  
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [_isChecking, setIsChecking] = useState(true)
  const hasCheckedRef = useRef<string | null>(null)
  const pendingOpenRef = useRef(false)
  const [isDialogSafe, setIsDialogSafe] = useState(false)

  // Get user from auth context
  const user = auth?.user ?? null
  const authLoading = auth?.isLoading ?? true

  // Avoid Radix Dialog opening before the header boundary hydrates.
  useEffect(() => {
    let cancelled = false
    const deadline = Date.now() + 2_000

    const poll = () => {
      if (cancelled) return
      const headerHydrated = document.querySelector('header[data-hydrated="true"]')
      if (headerHydrated || Date.now() > deadline) {
        setIsDialogSafe(true)
        return
      }
      setTimeout(poll, 50)
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [])

  // Check if we should show onboarding when user changes
  useEffect(() => {
    if (authLoading) return // Wait for auth to settle

    const checkOnboarding = async () => {
      if (!user) {
        setProfile(null)
        setIsModalOpen(false)
        hasCheckedRef.current = null
        pendingOpenRef.current = false
        setIsChecking(false)
        return
      }

      // Already checked for this user
      if (hasCheckedRef.current === user.id) return
      hasCheckedRef.current = user.id

      const supabase = createClient()

      // Get profile - cast to unknown first for type safety
      const { data: rawProfile } = await supabase
        .from("profiles")
        .select("username, display_name, onboarding_completed, account_type")
        .eq("id", user.id)
        .single()

      const profileData = rawProfile as RawProfileData | null
      
      if (profileData) {
        setProfile({
          username: profileData.username ?? null,
          display_name: profileData.display_name ?? null,
          onboarding_completed: profileData.onboarding_completed ?? null,
          account_type: (profileData.account_type as "personal" | "business") ?? "personal",
        })

        // Check if onboarding is needed
        // Show modal if onboarding not completed AND user has a username (meaning they've signed up)
        // OR if there's an onboarding query param
        let forceOnboarding = false
        try {
          forceOnboarding = new URLSearchParams(window.location.search).get("onboarding") === "true"
        } catch {
          forceOnboarding = false
        }
        const needsOnboarding = !profileData.onboarding_completed && profileData.username

        if (forceOnboarding || needsOnboarding) {
          pendingOpenRef.current = true
        }
      }

      setIsChecking(false)
    }

    checkOnboarding()
  }, [user, authLoading])

  // Open onboarding after the app is safe to open dialogs.
  useEffect(() => {
    if (!user) return
    if (!isDialogSafe) return
    if (!pendingOpenRef.current) return

    pendingOpenRef.current = false
    const timer = window.setTimeout(() => setIsModalOpen(true), 300)
    return () => window.clearTimeout(timer)
  }, [user, isDialogSafe])

  const showOnboarding = () => setIsModalOpen(true)
  const hideOnboarding = () => setIsModalOpen(false)

  const handleClose = () => {
    setIsModalOpen(false)
    // Remove the query param if present
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    if (!url.searchParams.has("onboarding")) return

    url.searchParams.delete("onboarding")
    window.history.replaceState({}, "", url.toString())
  }

  return (
    <OnboardingContext.Provider value={{ showOnboarding, hideOnboarding }}>
      {children}
      {user && profile?.username && (
        <PostSignupOnboardingModal
          isOpen={isModalOpen}
          onClose={handleClose}
          userId={user.id}
          username={profile.username}
          displayName={profile.display_name}
          accountType={profile.account_type}
          locale={locale}
          completePostSignupOnboarding={completePostSignupOnboarding}
        />
      )}
    </OnboardingContext.Provider>
  )
}
