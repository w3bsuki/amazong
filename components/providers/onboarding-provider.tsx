"use client"

import { createContext, useContext, useEffect, useState, Suspense, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { PostSignupOnboardingModal } from "@/components/auth/post-signup-onboarding-modal"
import { useParams, useSearchParams } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface OnboardingContextValue {
  showOnboarding: () => void
  hideOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    // Return a no-op implementation when used outside provider (e.g., in non-main layouts)
    return {
      showOnboarding: () => {},
      hideOnboarding: () => {},
    }
  }
  return context
}

interface OnboardingProviderProps {
  children: ReactNode
  locale?: string | undefined
}

interface ProfileData {
  username: string | null
  display_name: string | null
  onboarding_completed: boolean | null
}

// Type for raw profile data from Supabase (may not have full type info)
interface RawProfileData {
  username?: string | null
  display_name?: string | null
  onboarding_completed?: boolean | null
}

// Inner component that uses useSearchParams (requires Suspense)
function OnboardingProviderInner({ children, locale: propLocale }: OnboardingProviderProps) {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = propLocale ?? (typeof params?.locale === "string" ? params.locale : "en")
  
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [_isChecking, setIsChecking] = useState(true)

  // Check if we should show onboarding on initial load
  useEffect(() => {
    const checkOnboarding = async () => {
      const supabase = createClient()
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      if (!currentUser) {
        setIsChecking(false)
        return
      }

      // Get profile - cast to unknown first for type safety
      const { data: rawProfile } = await supabase
        .from("profiles")
        .select("username, display_name, onboarding_completed")
        .eq("id", currentUser.id)
        .single()

      const profileData = rawProfile as RawProfileData | null
      
      if (profileData) {
        setProfile({
          username: profileData.username ?? null,
          display_name: profileData.display_name ?? null,
          onboarding_completed: profileData.onboarding_completed ?? null,
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

    // Listen for auth state changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        
        // Re-fetch profile
        const { data: rawProfile } = await supabase
          .from("profiles")
          .select("username, display_name, onboarding_completed")
          .eq("id", session.user.id)
          .single()

        const profileData = rawProfile as RawProfileData | null

        if (profileData) {
          setProfile({
            username: profileData.username ?? null,
            display_name: profileData.display_name ?? null,
            onboarding_completed: profileData.onboarding_completed ?? null,
          })

          // Check if new sign-in needs onboarding
          if (!profileData.onboarding_completed && profileData.username) {
            setTimeout(() => setIsModalOpen(true), 500)
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        setIsModalOpen(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [searchParams])

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
