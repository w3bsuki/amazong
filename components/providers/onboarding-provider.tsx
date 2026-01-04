"use client"

import { createContext, useEffect, useState, Suspense, useRef, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { PostSignupOnboardingModal } from "@/components/auth/post-signup-onboarding-modal"
import { useParams, useSearchParams } from "next/navigation"
import { useAuthOptional } from "./auth-state-manager"

interface OnboardingContextValue {
  showOnboarding: () => void
  hideOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

interface OnboardingProviderProps {
  children: ReactNode
  locale?: string | undefined
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

// Inner component that uses useSearchParams (requires Suspense)
function OnboardingProviderInner({ children, locale: propLocale }: OnboardingProviderProps) {
  const params = useParams()
  const searchParams = useSearchParams()
  const auth = useAuthOptional()
  const locale = propLocale ?? (typeof params?.locale === "string" ? params.locale : "en")
  
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [_isChecking, setIsChecking] = useState(true)
  const hasCheckedRef = useRef<string | null>(null)

  // Get user from auth context
  const user = auth?.user ?? null
  const authLoading = auth?.isLoading ?? true

  // Check if we should show onboarding when user changes
  useEffect(() => {
    if (authLoading) return // Wait for auth to settle

    const checkOnboarding = async () => {
      if (!user) {
        setProfile(null)
        setIsModalOpen(false)
        hasCheckedRef.current = null
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
        const forceOnboarding = searchParams?.get("onboarding") === "true"
        const needsOnboarding = !profileData.onboarding_completed && profileData.username

        if (forceOnboarding || needsOnboarding) {
          // Small delay to let the page render first
          setTimeout(() => setIsModalOpen(true), 300)
        }
      }

      setIsChecking(false)
    }

    checkOnboarding()
  }, [user, authLoading, searchParams])

  const showOnboarding = () => setIsModalOpen(true)
  const hideOnboarding = () => setIsModalOpen(false)

  const handleClose = () => {
    setIsModalOpen(false)
    // Remove the query param if present
    if (typeof window !== "undefined" && searchParams?.get("onboarding")) {
      const url = new URL(window.location.href)
      url.searchParams.delete("onboarding")
      window.history.replaceState({}, "", url.toString())
    }
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
        />
      )}
    </OnboardingContext.Provider>
  )
}

// Main export wraps inner component with Suspense
export function OnboardingProvider({ children, locale }: OnboardingProviderProps) {
  return (
    <Suspense fallback={null}>
      <OnboardingProviderInner locale={locale}>{children}</OnboardingProviderInner>
    </Suspense>
  )
}
